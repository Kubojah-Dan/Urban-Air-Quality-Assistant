export class RecommendationController {
  constructor({ createRecommendationUseCase, reviseRecommendationUseCase }) {
    this.createRecommendationUseCase = createRecommendationUseCase;
    this.reviseRecommendationUseCase = reviseRecommendationUseCase;
  }

  async createRecommendation(req, res, next) {
    try {
      const { baseline, locationContext } = req.body;
      const result = await this.createRecommendationUseCase.execute(baseline, locationContext);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async reviseRecommendation(req, res, next) {
    try {
      const { baseline, modifiedConstraint, currentCandidates, locationContext } = req.body;
      const result = await this.reviseRecommendationUseCase.execute(
        baseline,
        modifiedConstraint,
        currentCandidates,
        locationContext
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
