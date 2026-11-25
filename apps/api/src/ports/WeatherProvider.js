/**
 * @interface WeatherProvider
 */
export class WeatherProvider {
  /**
   * @param {Object} _locationContext
   * @returns {Promise<Object>}
   */
  async getWeatherContext(_locationContext) {
    throw new Error('Method not implemented: getWeatherContext');
  }
}
