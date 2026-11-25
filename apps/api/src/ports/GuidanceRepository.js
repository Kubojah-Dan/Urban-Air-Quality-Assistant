/**
 * @interface GuidanceRepository
 */
export class GuidanceRepository {
  /**
   * @param {string} _scenario
   * @returns {Promise<Array<Object>>}
   */
  async getGuidanceForScenario(_scenario) {
    throw new Error('Method not implemented: getGuidanceForScenario');
  }
}
