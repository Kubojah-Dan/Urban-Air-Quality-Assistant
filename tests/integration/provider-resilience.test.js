import { describe, it, expect } from 'vitest';
import { OpenMeteoAdapter } from '../../apps/api/src/infrastructure/data-sources/openMeteo/openMeteo.adapter.js';
import { mapOpenMeteoToRecords } from '../../apps/api/src/infrastructure/data-sources/openMeteo/openMeteo.mapper.js';
import { mapAirNowToRecord, mapAirNowToRecords } from '../../apps/api/src/infrastructure/data-sources/airNow/airNow.mapper.js';
import { mapCpcbToRecord, mapCpcbToRecords } from '../../apps/api/src/infrastructure/data-sources/cpcb/cpcb.mapper.js';
import { MalformedPayloadError } from '../../apps/api/src/infrastructure/data-sources/errors.js';
import { EvidenceAssembler } from '../../apps/api/src/application/services/evidenceAssembler.js';

describe('Phase 2: Provider Resilience & Provenance', () => {
  describe('Malformed Upstream Payloads', () => {
    it('throws MalformedPayloadError on null or primitive Open-Meteo payload', () => {
      expect(() => mapOpenMeteoToRecords(null)).toThrow(MalformedPayloadError);
      expect(() => mapOpenMeteoToRecords('bad string')).toThrow(MalformedPayloadError);
    });

    it('throws MalformedPayloadError on invalid AirNow array payload', () => {
      expect(() => mapAirNowToRecords({ notAnArray: true })).toThrow(MalformedPayloadError);
      expect(() => mapAirNowToRecord(null)).toThrow(MalformedPayloadError);
    });

    it('throws MalformedPayloadError on invalid CPCB payload', () => {
      expect(() => mapCpcbToRecords(null)).toThrow(MalformedPayloadError);
      expect(() => mapCpcbToRecord(null)).toThrow(MalformedPayloadError);
    });
  });

  describe('Missing Pollutants & Incomplete Data', () => {
    it('safely extracts only available pollutants when some keys are absent in Open-Meteo', () => {
      const partialData = {
        current: {
          time: '2026-11-20T10:00:00Z',
          pm2_5: 35.5
          // pm10, no2, co, so2, ozone are absent
        }
      };

      const records = mapOpenMeteoToRecords(partialData, false);
      expect(records.length).toBe(1);
      expect(records[0].pollutant).toBe('PM2.5');
      expect(records[0].value).toBe(35.5);
    });

    it('handles CPCB record with missing pollutant_avg by defaulting to 0', () => {
      const record = mapCpcbToRecord({
        station: 'Anand Vihar',
        city: 'Delhi',
        pollutant_id: 'PM2.5'
        // pollutant_avg missing
      });

      expect(record.value).toBe(0);
      expect(record.stationId).toBe('Anand Vihar');
    });
  });

  describe('Grid Resolution & Regional Distinction', () => {
    it('labels India CAMS forecast strictly as ~45 km global grid, never European 11 km grid', async () => {
      const mockClient = {
        fetchAirQuality: async () => ({
          current: { time: '2026-11-20T10:00:00Z', pm2_5: 120 }
        })
      };

      const adapter = new OpenMeteoAdapter(mockClient);
      const records = await adapter.getAirQualityRecords({
        countryCode: 'IN',
        latitude: 28.6139,
        longitude: 77.2090
      });

      const pmRecord = records.find((r) => r.pollutant === 'PM2.5');
      expect(pmRecord.modelId).toBe('cams_global');
      expect(pmRecord.coverage).toContain('45 km');
      expect(pmRecord.coverage).not.toContain('11 km');
    });

    it('labels European location CAMS forecast as ~11 km regional grid', async () => {
      const mockClient = {
        fetchAirQuality: async () => ({
          current: { time: '2026-11-20T10:00:00Z', pm2_5: 15 }
        })
      };

      const adapter = new OpenMeteoAdapter(mockClient);
      const records = await adapter.getAirQualityRecords({
        countryCode: 'EU',
        latitude: 48.8566,
        longitude: 2.3522
      });

      const pmRecord = records.find((r) => r.pollutant === 'PM2.5');
      expect(pmRecord.modelId).toBe('cams_europe');
      expect(pmRecord.coverage).toContain('11 km');
    });
  });

  describe('AirNow Preliminary Observation Attribution', () => {
    it('AirNow observations are flagged as preliminary and cite EPA AirNow', () => {
      const raw = {
        ReportingArea: 'San Francisco',
        StateCode: 'CA',
        ParameterName: 'PM2.5',
        AQI: 55,
        Category: { Name: 'Moderate' },
        DateObserved: '2026-11-20',
        HourObserved: 9
      };

      const record = mapAirNowToRecord(raw);
      expect(record.recordKind).toBe('observation');
      expect(record.qualityFlags).toContain('preliminary');
      expect(record.attribution).toContain('Preliminary observation');
      expect(record.attribution).toContain('AirNow');
    });
  });

  describe('Evidence Assembler Honest Caveats', () => {
    it('discloses when India has no active CPCB ground station and falls back to CAMS forecast', async () => {
      const mockOpenMeteo = {
        getAirQualityRecords: async () => [
          {
            id: 'om_1',
            provider: 'open-meteo',
            recordKind: 'forecast',
            pollutant: 'PM2.5',
            value: 95,
            unit: 'µg/m³',
            validAt: new Date().toISOString(),
            retrievedAt: new Date().toISOString(),
            coverage: 'Regional CAMS global (~45km)',
            qualityFlags: ['valid'],
            attribution: 'CAMS / Open-Meteo'
          }
        ]
      };

      // Empty CPCB provider (simulating missing key or no active station)
      const mockCpcb = {
        getAirQualityRecords: async () => []
      };

      const assembler = new EvidenceAssembler({
        airQualityProviders: [mockOpenMeteo, mockCpcb]
      });

      const bundle = await assembler.assembleEvidence({
        countryCode: 'IN',
        cityId: 'delhi',
        latitude: 28.6139,
        longitude: 77.2090
      });

      expect(bundle.hasStationObservation).toBe(false);
      expect(bundle.limitations.some((lim) => lim.includes('No active CPCB ground monitoring station'))).toBe(true);
      expect(bundle.limitations.some((lim) => lim.includes('~45 km resolution'))).toBe(true);
    });
  });
});
