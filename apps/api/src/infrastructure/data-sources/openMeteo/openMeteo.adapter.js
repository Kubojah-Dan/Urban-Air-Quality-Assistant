import { AirQualityProvider } from '../../../ports/AirQualityProvider.js';
import { OpenMeteoClient } from './openMeteo.client.js';
import { mapOpenMeteoToRecords } from './openMeteo.mapper.js';
import { logger } from '../../../observability/logger.js';

const EUROPEAN_COUNTRY_CODES = new Set([
  'EU',
  'FR',
  'DE',
  'IT',
  'ES',
  'NL',
  'BE',
  'PL',
  'SE',
  'AT',
  'DK',
  'FI',
  'IE',
  'PT',
  'GR',
  'CZ',
  'RO',
  'HU'
]);

export class OpenMeteoAdapter extends AirQualityProvider {
  constructor(client = new OpenMeteoClient()) {
    super();
    this.client = client;
  }

  isEuropeanRegion(locationContext) {
    if (EUROPEAN_COUNTRY_CODES.has(locationContext.countryCode?.toUpperCase())) {
      return true;
    }
    const lat = locationContext.latitude;
    const lon = locationContext.longitude;
    // Bounding box for Europe: roughly lat 34 to 72, lon -25 to 45 (excluding non-EU jurisdictions when countryCode is set)
    if (
      locationContext.countryCode !== 'IN' &&
      locationContext.countryCode !== 'US' &&
      lat >= 34 &&
      lat <= 72 &&
      lon >= -25 &&
      lon <= 45
    ) {
      return true;
    }
    return false;
  }

  async getAirQualityRecords(locationContext) {
    const isEurope = this.isEuropeanRegion(locationContext);

    try {
      const data = await this.client.fetchAirQuality(
        locationContext.latitude,
        locationContext.longitude,
        isEurope
      );
      return mapOpenMeteoToRecords(data, isEurope);
    } catch (err) {
      logger.warn('Open-Meteo provider call failed', { message: err.message });
      return [
        {
          id: `om_unavailable_${Date.now()}`,
          provider: 'open-meteo',
          recordKind: 'forecast',
          modelId: isEurope ? 'cams_europe' : 'cams_global',
          pollutant: 'PM2.5',
          value: 0,
          unit: 'µg/m³',
          validAt: new Date().toISOString(),
          retrievedAt: new Date().toISOString(),
          coverage: isEurope
            ? 'Regional CAMS European forecast grid (~11 km resolution)'
            : 'Regional CAMS global forecast grid (~45 km resolution, 3-hourly)',
          qualityFlags: ['sensor_offline'],
          attribution: 'Open-Meteo (Temporarily unavailable: ' + err.message + ')'
        }
      ];
    }
  }
}
