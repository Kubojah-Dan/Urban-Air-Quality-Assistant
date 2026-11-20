import { evaluateFreshness } from '@dayshift/domain';

export class EvidenceAssembler {
  constructor({ airQualityProviders = [] }) {
    this.providers = airQualityProviders;
  }

  async assembleEvidence(locationContext) {
    const allRecords = [];
    let hasStationObservation = false;

    for (const provider of this.providers) {
      try {
        const records = await provider.getAirQualityRecords(locationContext);
        if (Array.isArray(records)) {
          allRecords.push(...records);
          if (records.some((r) => r.recordKind === 'observation')) {
            hasStationObservation = true;
          }
        }
      } catch {
        // Individual provider failures are handled gracefully without aborting overall assembly
      }
    }

    const limitations = [];

    // Country-specific provenance and coverage disclosures
    if (locationContext.countryCode === 'IN') {
      if (!hasStationObservation) {
        limitations.push(
          'No active CPCB ground monitoring station is reporting for this city. Displaying CAMS global forecast model (~45 km grid, 3-hourly) as a separate numerical prediction.'
        );
      } else {
        limitations.push(
          'CPCB ground monitoring observations represent hyper-local sensor points and are not averaged with regional CAMS forecast predictions.'
        );
      }
      limitations.push(
        'India air quality forecast uses CAMS global numerical model (~45 km resolution, 3-hourly), not the European 11 km grid.'
      );
    } else if (locationContext.countryCode === 'US') {
      if (hasStationObservation) {
        limitations.push(
          'AirNow reporting-area observations are preliminary and subject to change by issuing environmental agencies. They are not regulatory-certified EPA AQS data.'
        );
      } else {
        limitations.push(
          'AirNow reporting-area observation unavailable for this coordinate/zip; displaying CAMS regional numerical forecast.'
        );
      }
    } else if (locationContext.countryCode === 'EU') {
      limitations.push(
        'European regional air quality uses CAMS regional ensemble model (~11 km resolution).'
      );
    }

    limitations.push(
      'Ambient air quality data (whether sensor observation or numerical forecast) cannot be converted to individual inhaled dose without personal exposure monitors.'
    );

    // Compute freshness state: use latest observation or forecast
    const primaryRecord = allRecords.find((r) => r.pollutant === 'PM2.5') || allRecords[0];
    const freshnessState = primaryRecord
      ? evaluateFreshness(primaryRecord.validAt, primaryRecord.retrievedAt)
      : 'expired';

    return {
      id: `bundle_${locationContext.cityId || 'loc'}_${Date.now()}`,
      locationContextId: locationContext.cityId || 'unknown',
      locationContext,
      records: allRecords,
      hasStationObservation,
      limitations,
      createdAt: new Date().toISOString(),
      freshnessState
    };
  }
}
