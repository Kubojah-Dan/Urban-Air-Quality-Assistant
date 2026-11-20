import { AirQualityProvider } from '../../../ports/AirQualityProvider.js';
import { OpenMeteoClient } from './openMeteo.client.js';
import { mapOpenMeteoToRecord } from './openMeteo.mapper.js';

export class OpenMeteoAdapter extends AirQualityProvider {
  constructor(client = new OpenMeteoClient()) {
    super();
    this.client = client;
  }

  async getAirQualityRecords(locationContext) {
    try {
      const data = await this.client.fetchAirQuality(
        locationContext.latitude,
        locationContext.longitude
      );
      return [mapOpenMeteoToRecord(data)];
    } catch (err) {
      return [
        {
          id: `om_fallback_${Date.now()}`,
          provider: 'open-meteo',
          recordKind: 'forecast',
          pollutant: 'PM2.5',
          value: 0,
          unit: 'µg/m³',
          validAt: new Date().toISOString(),
          retrievedAt: new Date().toISOString(),
          coverage: 'Regional grid (~45km)',
          qualityFlags: ['unsupported'],
          attribution: 'Open-Meteo (Error: ' + err.message + ')'
        }
      ];
    }
  }
}
