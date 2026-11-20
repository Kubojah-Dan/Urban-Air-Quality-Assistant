import { evaluateFreshness } from '@dayshift/domain';

export class EvidenceAssembler {
  constructor({ airQualityProviders = [] }) {
    this.providers = airQualityProviders;
  }

  async assembleEvidence(locationContext) {
    const allRecords = [];
    for (const provider of this.providers) {
      try {
        const records = await provider.getAirQualityRecords(locationContext);
        allRecords.push(...records);
      } catch {
        // Continue assembling from other providers
      }
    }

    const firstRecord = allRecords[0];
    const freshnessState = firstRecord
      ? evaluateFreshness(firstRecord.validAt, firstRecord.retrievedAt)
      : 'expired';

    return {
      id: `bundle_${Date.now()}`,
      locationContextId: locationContext.cityId,
      records: allRecords,
      limitations: [
        'Forecast models (CAMS) show regional grid averages (~45km) and not roadside or street-level microclimates.'
      ],
      createdAt: new Date().toISOString(),
      freshnessState
    };
  }
}
