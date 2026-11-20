import { RequestCoalescer } from '../../infrastructure/cache/requestCoalescer.js';

export class GetAirEvidenceUseCase {
  constructor({ evidenceAssembler, cacheStore, requestCoalescer = new RequestCoalescer() }) {
    this.evidenceAssembler = evidenceAssembler;
    this.cacheStore = cacheStore;
    this.requestCoalescer = requestCoalescer;
  }

  async execute(locationContext) {
    const cacheKey = `evidence_${locationContext.countryCode || 'global'}_${locationContext.cityId || locationContext.regionId || 'loc'}`;
    const cached = await this.cacheStore.get(cacheKey);
    if (cached) {
      return cached;
    }

    return this.requestCoalescer.coalesce(cacheKey, async () => {
      const existing = await this.cacheStore.get(cacheKey);
      if (existing) return existing;

      const bundle = await this.evidenceAssembler.assembleEvidence(locationContext);
      // Source-aware TTL: 1 hour (3600 seconds)
      await this.cacheStore.set(cacheKey, bundle, 3600);
      return bundle;
    });
  }
}
