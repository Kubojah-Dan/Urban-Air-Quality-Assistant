import { MalformedPayloadError } from '../errors.js';

const POLLUTANT_CONFIG = [
  { key: 'pm2_5', name: 'PM2.5', unit: 'µg/m³' },
  { key: 'pm10', name: 'PM10', unit: 'µg/m³' },
  { key: 'nitrogen_dioxide', name: 'NO2', unit: 'µg/m³' },
  { key: 'ozone', name: 'O3', unit: 'µg/m³' },
  { key: 'carbon_monoxide', name: 'CO', unit: 'µg/m³' },
  { key: 'sulphur_dioxide', name: 'SO2', unit: 'µg/m³' }
];

export function mapOpenMeteoToRecords(raw, isEurope = false) {
  if (!raw || typeof raw !== 'object') {
    throw new MalformedPayloadError('open-meteo', 'Expected object payload');
  }

  const current = raw.current || {};
  const currentUnits = raw.current_units || {};
  const validTime = current.time ? new Date(current.time).toISOString() : new Date().toISOString();
  const retrievedTime = new Date().toISOString();

  const modelId = isEurope ? 'cams_europe' : 'cams_global';
  const coverage = isEurope
    ? 'Regional CAMS European forecast grid (~11 km resolution)'
    : 'Regional CAMS global forecast grid (~45 km resolution, 3-hourly)';
  const attribution = 'Copernicus Atmosphere Monitoring Service (CAMS) / Open-Meteo (CC BY 4.0)';

  const records = [];

  // Generate pollutant records for available values
  for (const { key, name, unit } of POLLUTANT_CONFIG) {
    if (typeof current[key] === 'number') {
      records.push({
        id: `om_${modelId}_${key}_${Date.now()}`,
        provider: 'open-meteo',
        recordKind: 'forecast',
        modelId,
        pollutant: name,
        value: current[key],
        unit: currentUnits[key] || unit,
        validAt: validTime,
        retrievedAt: retrievedTime,
        coverage,
        qualityFlags: ['valid'],
        attribution
      });
    }
  }

  // Also include index records if present
  if (typeof current.european_aqi === 'number') {
    records.push({
      id: `om_${modelId}_eaqi_${Date.now()}`,
      provider: 'open-meteo',
      recordKind: 'index',
      modelId,
      pollutant: 'European AQI',
      value: current.european_aqi,
      unit: 'Index (EAQI)',
      validAt: validTime,
      retrievedAt: retrievedTime,
      coverage,
      qualityFlags: ['valid'],
      attribution
    });
  }

  if (typeof current.us_aqi === 'number') {
    records.push({
      id: `om_${modelId}_usaqi_${Date.now()}`,
      provider: 'open-meteo',
      recordKind: 'index',
      modelId,
      pollutant: 'US AQI (Estimated)',
      value: current.us_aqi,
      unit: 'AQI (US EPA Formula)',
      validAt: validTime,
      retrievedAt: retrievedTime,
      coverage,
      qualityFlags: ['valid'],
      attribution
    });
  }

  // Include hourly PM2.5 forecast sequence points for the day-strip timeline
  if (raw.hourly?.time && Array.isArray(raw.hourly.pm2_5)) {
    const nowMs = new Date().getTime();
    let count = 0;
    for (let i = 0; i < raw.hourly.time.length && count < 8; i++) {
      const forecastTime = new Date(raw.hourly.time[i]).getTime();
      // Include current and upcoming hourly forecast records
      if (forecastTime >= nowMs - 3600000) {
        const val = raw.hourly.pm2_5[i];
        if (typeof val === 'number') {
          records.push({
            id: `om_${modelId}_pm25_h${i}_${forecastTime}`,
            provider: 'open-meteo',
            recordKind: 'forecast',
            modelId,
            pollutant: 'PM2.5',
            value: val,
            unit: 'µg/m³',
            validAt: new Date(raw.hourly.time[i]).toISOString(),
            retrievedAt: retrievedTime,
            coverage,
            qualityFlags: ['valid'],
            attribution
          });
          count++;
        }
      }
    }
  }

  return records;
}

// Backward-compatible single record mapper
export function mapOpenMeteoToRecord(raw, isEurope = false) {
  const records = mapOpenMeteoToRecords(raw, isEurope);
  return (
    records.find((r) => r.pollutant === 'PM2.5') ||
    records[0] || {
      id: `om_empty_${Date.now()}`,
      provider: 'open-meteo',
      recordKind: 'forecast',
      modelId: isEurope ? 'cams_europe' : 'cams_global',
      pollutant: 'PM2.5',
      value: 0,
      unit: 'µg/m³',
      validAt: new Date().toISOString(),
      retrievedAt: new Date().toISOString(),
      coverage: isEurope ? 'Regional grid (~11km)' : 'Regional grid (~45km)',
      qualityFlags: ['unsupported'],
      attribution: 'Open-Meteo'
    }
  );
}
