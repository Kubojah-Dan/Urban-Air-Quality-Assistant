/**
 * @interface AirQualityProvider
 */
export class AirQualityProvider {
  /**
   * @param {Object} _locationContext
   * @returns {Promise<Array<Object>>}
   */
  async getAirQualityRecords(_locationContext) {
    throw new Error('Method not implemented: getAirQualityRecords');
  }
}
