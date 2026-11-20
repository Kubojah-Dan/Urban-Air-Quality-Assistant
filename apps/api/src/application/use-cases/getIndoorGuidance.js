import { getAllIndoorActions, getIndoorActionsByScenario } from '@dayshift/guidance';

export class GetIndoorGuidanceUseCase {
  async execute(scenario) {
    if (scenario) {
      return getIndoorActionsByScenario(scenario);
    }
    return getAllIndoorActions();
  }
}
