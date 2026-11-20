/**
 * @interface ModelProvider
 */
export class ModelProvider {
  /**
   * @param {Object} promptInput
   * @returns {Promise<Object>}
   */
  async generateRankedRecommendation(_promptInput) {
    throw new Error('Method not implemented: generateRankedRecommendation');
  }
}
