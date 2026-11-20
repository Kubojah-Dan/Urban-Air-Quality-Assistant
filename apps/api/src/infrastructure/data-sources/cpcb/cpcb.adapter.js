import { AirQualityProvider } from '../../../ports/AirQualityProvider.js';
import { CpcbClient } from './cpcb.client.js';
import { mapCpcbToRecord } from './cpcb.mapper.js';

export class CpcbAdapter extends AirQualityProvider {
  constructor(client = new CpcbClient()) {
    super();
    this.client = client;
  }

  async getAirQualityRecords(locationContext) {
    if (locationContext.countryCode !== 'IN') {
      return [];
    }
    try {
      const data = await this.client.fetchStationData(locationContext.cityId || 'Delhi');
      const records = data.records || [];
      return records.map(mapCpcbToRecord);
    } catch {
      return [];
    }
  }
}
