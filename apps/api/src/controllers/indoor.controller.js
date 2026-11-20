export class IndoorController {
  constructor({ getIndoorGuidanceUseCase }) {
    this.getIndoorGuidanceUseCase = getIndoorGuidanceUseCase;
  }

  async getGuidance(req, res, next) {
    try {
      const { scenario } = req.query;
      const actions = await this.getIndoorGuidanceUseCase.execute(scenario);
      res.json({ guidance: actions });
    } catch (err) {
      next(err);
    }
  }
}
