/**
 * @interface AirQualityProvider
 */
export class AirQualityProvider {
  /**
   * @param {Object} locationContext
   * @returns {Promise<Array<Object>>}
   */
  async getAirQualityRecords(_locationContext) {
    throw new Error('Method not implemented: getAirQualityRecords');
  }
}
