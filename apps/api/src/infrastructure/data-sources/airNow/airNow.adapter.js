import { AirQualityProvider } from '../../../ports/AirQualityProvider.js';
import { AirNowClient } from './airNow.client.js';
import { mapAirNowToRecords } from './airNow.mapper.js';
import { logger } from '../../../observability/logger.js';

export class AirNowAdapter extends AirQualityProvider {
  constructor(client = new AirNowClient()) {
    super();
    this.client = client;
  }

  async getAirQualityRecords(locationContext) {
    // AirNow is strictly for U.S. reporting areas
    if (locationContext.countryCode !== 'US') {
      return [];
    }

    if (!this.client.apiKey) {
      logger.info('AirNow skipped: API key not configured');
      return [];
    }

    try {
      const records = await this.client.fetchObservationByCoords(
        locationContext.latitude,
        locationContext.longitude
      );

      return mapAirNowToRecords(records);
    } catch (err) {
      logger.warn('AirNow provider call failed', { message: err.message });
      return [];
    }
  }
}
