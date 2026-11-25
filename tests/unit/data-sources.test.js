import { describe, it, expect } from 'vitest';
import { normalizeAirRecord } from '../../packages/data-sources/src/normalization.js';
import { getProviderCapabilities, DATA_SOURCE_REGISTRY } from '../../packages/data-sources/src/index.js';

describe('Data Sources: Normalization & Capabilities Registry', () => {
  it('normalizes raw CPCB sensor record into standard AirQualityRecord representation', () => {
    const raw = {
      id: 'cpcb_anand_vihar_01',
      stationId: 'site_142',
      pollutant: 'PM2.5',
      value: 128.5,
      unit: 'µg/m³',
      recordKind: 'observation',
      attribution: 'CPCB CAAQMS Station'
    };

    const record = normalizeAirRecord(raw, 'cpcb');
    expect(record.id).toBe('cpcb_anand_vihar_01');
    expect(record.provider).toBe('cpcb');
    expect(record.recordKind).toBe('observation');
    expect(record.stationId).toBe('site_142');
    expect(record.value).toBe(128.5);
    expect(record.unit).toBe('µg/m³');
    expect(record.attribution).toBe('CPCB CAAQMS Station');
    expect(record.qualityFlags).toContain('valid');
  });

  it('provides safe defaults when raw record fields are missing', () => {
    const raw = { value: '45.2' };
    const record = normalizeAirRecord(raw, 'open-meteo');

    expect(record.provider).toBe('open-meteo');
    expect(record.pollutant).toBe('PM2.5');
    expect(record.value).toBe(45.2);
    expect(record.unit).toBe('µg/m³');
    expect(record.recordKind).toBe('forecast');
  });

  it('retrieves registered provider capabilities accurately', () => {
    const cpcbCap = getProviderCapabilities('cpcb');
    expect(cpcbCap).toBeDefined();
    expect(cpcbCap.type).toBe('station_observation');
    expect(cpcbCap.coverage).toBe('India');

    const openMeteoCap = getProviderCapabilities('open-meteo');
    expect(openMeteoCap).toBeDefined();
    expect(openMeteoCap.type).toBe('model_forecast');
    expect(DATA_SOURCE_REGISTRY['cpcb'].coverage).toBe('India');

    const unknownCap = getProviderCapabilities('unregistered_provider');
    expect(unknownCap).toBeNull();
  });
});
