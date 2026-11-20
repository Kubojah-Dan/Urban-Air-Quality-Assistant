import { AirQualityProvider } from '../../../ports/AirQualityProvider.js';
import { AirNowClient } from './airNow.client.js';
import { mapAirNowToRecord } from './airNow.mapper.js';

export class AirNowAdapter extends AirQualityProvider {
  constructor(client = new AirNowClient()) {
    super();
    this.client = client;
  }

  async getAirQualityRecords(locationContext) {
    if (locationContext.countryCode !== 'US') {
      return [];
    }
    try {
      const records = await this.client.fetchObservationByZip(locationContext.zipCode || '94103');
      return Array.isArray(records) ? records.map(mapAirNowToRecord) : [];
    } catch {
      return [];
    }
  }
}
