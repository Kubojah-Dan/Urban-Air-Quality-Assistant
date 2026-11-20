export class GetAirEvidenceUseCase {
  constructor({ evidenceAssembler, cacheStore }) {
    this.evidenceAssembler = evidenceAssembler;
    this.cacheStore = cacheStore;
  }

  async execute(locationContext) {
    const cacheKey = `evidence_${locationContext.cityId || locationContext.regionId}`;
    const cached = await this.cacheStore.get(cacheKey);
    if (cached) {
      return cached;
    }

    const bundle = await this.evidenceAssembler.assembleEvidence(locationContext);
    await this.cacheStore.set(cacheKey, bundle, 1800); // 30 min cache
    return bundle;
  }
}
