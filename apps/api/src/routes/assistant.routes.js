import { Router } from 'express';
import { AssistantChatRequestSchema } from '@dayshift/contracts';
import { validateRequest } from '../middleware/validateRequest.js';
import { logger } from '../observability/logger.js';

export function createAssistantRoutes({ getAirEvidenceUseCase, geminiProvider, groqProvider }) {
  const router = Router();

  router.post('/assistant/chat', validateRequest(AssistantChatRequestSchema), async (req, res, next) => {
    try {
      const { query, city, context } = req.body;
      const targetQuery = query.trim();

      // 1. Fetch REAL-TIME air quality telemetry for the user's selected city
      const targetCity = city || {
        displayName: 'Delhi (NCR), Delhi',
        cityId: 'delhi',
        latitude: 28.6139,
        longitude: 77.2090,
        countryCode: 'IN'
      };

      let evidenceBundle = null;
      try {
        evidenceBundle = await getAirEvidenceUseCase.execute(targetCity);
      } catch (err) {
        logger.warn('Failed to fetch live evidence for assistant, using fallback bundle', { error: err.message });
      }

      const records = evidenceBundle?.records || [];
      const pm25Record = records.find((r) => r.pollutant === 'PM2.5');
      const pm10Record = records.find((r) => r.pollutant === 'PM10');
      const no2Record = records.find((r) => r.pollutant === 'NO2');
      const o3Record = records.find((r) => r.pollutant === 'O3');

      // Honest telemetry: never fabricate readings; use null when unmeasured or offline
      const pm25 = pm25Record && Number.isFinite(pm25Record.value) ? Math.round(pm25Record.value) : null;
      const pm10 = pm10Record && Number.isFinite(pm10Record.value) ? Math.round(pm10Record.value) : null;
      const no2 = no2Record && Number.isFinite(no2Record.value) ? Math.round(no2Record.value) : null;
      const o3 = o3Record && Number.isFinite(o3Record.value) ? Math.round(o3Record.value) : null;

      const aqiCategory =
        pm25 !== null
          ? pm25 <= 30
            ? 'Good'
            : pm25 <= 60
              ? 'Satisfactory'
              : pm25 <= 120
                ? 'Moderate'
                : pm25 <= 250
                  ? 'Poor'
                  : 'Severe'
          : 'Station Unmonitored / Offline';

      // 2. Build system instruction with real telemetry disclosure & ARAI 2024 emissions factors
      const systemPrompt = `You are DayShift's Environmental AI Assistant — an expert in urban air quality, low-emission commute shifting, and indoor source-control in India.
You have access to atmospheric telemetry and ARAI 2024 emissions factors.

CURRENT LOCAL ENVIRONMENTAL OBSERVATION FOR ${targetCity.displayName}:
- Fine Particulate Matter (PM2.5): ${pm25 !== null ? `${pm25} µg/m³ (${aqiCategory})` : 'Sensor unavailable / station unmonitored at this hour'}
- Coarse Particulate Matter (PM10): ${pm10 !== null ? `${pm10} µg/m³` : 'Not recorded'}
- Nitrogen Dioxide (NO2): ${no2 !== null ? `${no2} ppb` : 'Not recorded'}
- Ozone (O3): ${o3 !== null ? `${o3} ppb` : 'Not recorded'}
- Data Ingestion Window: Copernicus CAMS model + CPCB ground stations (${evidenceBundle?.provenance || 'Regional atmospheric ingestion'}).

USER DAILY COMMUTE & HOUSEHOLD CONTEXT:
- City: ${targetCity.displayName}
- Commute Mode: ${context?.initialContext?.commuteMode || 'car'}
- Planned Departure: ${context?.initialContext?.departureTime || '08:00 AM'}
- Arrival Deadline: ${context?.initialContext?.deadlineTime || '09:00 AM'}
- Vented Kitchen Hood: ${context?.initialContext?.hasVentedHood ? 'Present' : 'Not installed'}
- Air Purifier: ${context?.initialContext?.hasAirPurifier ? 'Active' : 'None'}

KNOWLEDGE INVARIANTS:
1. Transport Emissions (ARAI 2024 registry): Solo petrol car (~180g CO2/km), diesel car (~210g CO2/km), two-wheeler (~65g CO2/km), electric bus/metro rail (~15g CO2/passenger-km).
2. Curbside vs In-Cabin: In heavy traffic, vehicle AC on recirculation reduces in-cabin PM2.5 infiltration by 50-70% compared to windows down.
3. Inversion Dynamics: Morning surface temperature inversions peak between 07:30 and 09:30 AM in Indian metros. Leaving 30-45 minutes earlier or shifting to rail avoids dense curbside plumes.
4. Indoor Protocol: When outdoor PM2.5 is elevated, rely on source control and mechanical HEPA filtration rather than open window cross-ventilation.
5. Honesty & Safety: NEVER promise medical cures or fabricate personal inhaled dose numbers. If a pollutant is unrecorded, acknowledge the sensor data gap.

INSTRUCTIONS:
Answer the user's specific query clearly, citing the authentic telemetry or noting unrecorded metrics for ${targetCity.displayName}. Keep your answer practical, concise, and structured (under 180 words).`;

      // 3. Dual-Provider AI Gateway (Gemini 2.5 Flash -> Groq Failover -> Deterministic fallback)
      let reply = '';
      let usedProvider = 'google';
      let usedModel = geminiProvider?.model || 'gemini-2.5-flash';

      try {
        if (geminiProvider) {
          const res = await geminiProvider.generateChatResponse({
            systemPrompt,
            userPrompt: targetQuery
          });
          reply = res.text;
          usedProvider = res.provider;
          usedModel = res.model;
        }
      } catch (geminiErr) {
        logger.warn('Gemini chat failed, falling back to Groq', { error: geminiErr.message });

        if (groqProvider) {
          try {
            const res = await groqProvider.generateChatResponse({
              systemPrompt,
              userPrompt: targetQuery
            });
            reply = res.text;
            usedProvider = res.provider;
            usedModel = res.model;
          } catch (groqErr) {
            logger.warn('Groq chat failed, falling back to deterministic synthesis', { error: groqErr.message });
          }
        }
      }

      // If both AI providers are offline/quota-exhausted, synthesize an evidence-grounded response using the real fetched values
      if (!reply) {
        usedProvider = 'deterministic_engine';
        usedModel = 'cams-arai-synthesis-v1';
        const metricSummary =
          pm25 !== null
            ? `indicates PM2.5 at ${pm25} µg/m³ (${aqiCategory})`
            : 'has limited localized sensor telemetry at this hour';

        reply = `Current atmospheric telemetry for ${targetCity.displayName} ${metricSummary}. Based on regional Copernicus CAMS forecasts, switching your commute to electric metro rail avoids ~380g CO2 per 10km (ARAI 2024 registry) while bypassing street-level combustion corridors. In vehicles, keep windows closed with AC on cabin recirculation to reduce particulate infiltration.`;
      }

      return res.json({
        reply,
        provider: usedProvider,
        model: usedModel,
        evidence: {
          city: targetCity.displayName,
          pm25,
          pm10,
          no2,
          o3,
          category: aqiCategory,
          source: 'Copernicus CAMS & CPCB Real-time Ingestion'
        }
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
