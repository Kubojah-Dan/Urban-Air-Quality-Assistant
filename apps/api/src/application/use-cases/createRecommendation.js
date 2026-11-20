export class CreateRecommendationUseCase {
  constructor({ getAirEvidenceUseCase, recommendationOrchestrator }) {
    this.getAirEvidenceUseCase = getAirEvidenceUseCase;
    this.recommendationOrchestrator = recommendationOrchestrator;
  }

  async execute(baseline, locationContext, options = {}) {
    const evidence = await this.getAirEvidenceUseCase.execute(locationContext);
    return this.recommendationOrchestrator.orchestrate(baseline, evidence, options);
  }
}
