/**
 * @interface ModelProvider
 */
export class ModelProvider {
  /**
   * @param {Object} _promptInput
   * @returns {Promise<Object>}
   */
  async generateRankedRecommendation(_promptInput) {
    throw new Error('Method not implemented: generateRankedRecommendation');
  }
}
