import { describe, it, expect } from 'vitest';
import { OpenMeteoClient } from '../../apps/api/src/infrastructure/data-sources/openMeteo/openMeteo.client.js';
import { OpenMeteoAdapter } from '../../apps/api/src/infrastructure/data-sources/openMeteo/openMeteo.adapter.js';
import { AirNowClient } from '../../apps/api/src/infrastructure/data-sources/airNow/airNow.client.js';
import { AirNowAdapter } from '../../apps/api/src/infrastructure/data-sources/airNow/airNow.adapter.js';
import { env } from '../../apps/api/src/config/env.js';

describe('Phase 2: Upstream Real Provider Smoke Tests', () => {
  it('successfully fetches real CAMS air quality forecast for Delhi, India', async () => {
    const client = new OpenMeteoClient();
    const adapter = new OpenMeteoAdapter(client);

    const records = await adapter.getAirQualityRecords({
      countryCode: 'IN',
      cityId: 'delhi',
      latitude: 28.6139,
      longitude: 77.2090
    });

    expect(records.length).toBeGreaterThan(0);
    const pmRecord = records.find((r) => r.pollutant === 'PM2.5');
    expect(pmRecord).toBeDefined();
    expect(typeof pmRecord.value).toBe('number');
    expect(pmRecord.provider).toBe('open-meteo');
    expect(pmRecord.recordKind).toBe('forecast');
    expect(pmRecord.modelId).toBe('cams_global');
    expect(pmRecord.coverage).toContain('45 km');
  }, 15000);

  it('successfully fetches real CAMS air quality forecast for San Francisco, USA', async () => {
    const client = new OpenMeteoClient();
    const adapter = new OpenMeteoAdapter(client);

    const records = await adapter.getAirQualityRecords({
      countryCode: 'US',
      cityId: 'san_francisco',
      latitude: 37.7749,
      longitude: -122.4194
    });

    expect(records.length).toBeGreaterThan(0);
    const pmRecord = records.find((r) => r.pollutant === 'PM2.5');
    expect(pmRecord).toBeDefined();
    expect(typeof pmRecord.value).toBe('number');
    expect(pmRecord.provider).toBe('open-meteo');
  }, 15000);

  it('queries real AirNow endpoint if AIRNOW_API_KEY is configured in .env', async () => {
    if (!env.AIRNOW_API_KEY) {
      // Skipped gracefully if user has not filled AirNow key yet
      expect(true).toBe(true);
      return;
    }

    const client = new AirNowClient(env.AIRNOW_API_KEY);
    const adapter = new AirNowAdapter(client);

    const records = await adapter.getAirQualityRecords({
      countryCode: 'US',
      cityId: 'san_francisco',
      latitude: 37.7749,
      longitude: -122.4194,
      zipCode: '94103'
    });

    // If API key is valid and area is reporting, records will be present
    expect(Array.isArray(records)).toBe(true);
    if (records.length > 0) {
      expect(records[0].provider).toBe('airnow');
      expect(records[0].qualityFlags).toContain('preliminary');
    }
  }, 15000);
});
