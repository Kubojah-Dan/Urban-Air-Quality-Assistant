import { AirQualityProvider } from '../../../ports/AirQualityProvider.js';
import { CpcbClient } from './cpcb.client.js';
import { mapCpcbToRecords } from './cpcb.mapper.js';
import { logger } from '../../../observability/logger.js';

export class CpcbAdapter extends AirQualityProvider {
  constructor(client = new CpcbClient()) {
    super();
    this.client = client;
  }

  async getAirQualityRecords(locationContext) {
    if (locationContext.countryCode !== 'IN') {
      return [];
    }

    if (!this.client.apiKey) {
      logger.info('CPCB skipped: API key not configured yet');
      return [];
    }

    try {
      const data = await this.client.fetchStationData(locationContext.cityId || 'Delhi');
      return mapCpcbToRecords(data);
    } catch (err) {
      logger.warn('CPCB provider call failed', { message: err.message });
      return [];
    }
  }
}
