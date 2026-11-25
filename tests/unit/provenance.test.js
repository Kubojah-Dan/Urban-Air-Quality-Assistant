import { describe, it, expect } from 'vitest';
import { evaluateRecordProvenance, evaluateFreshness } from '../../packages/domain/src/quality/freshness.js';

describe('Evidence Freshness & Provenance Engine', () => {
  const now = new Date('2026-11-25T12:00:00Z').getTime();

  it('correctly classifies a fresh ground observation (CPCB)', () => {
    const record = {
      pollutant: 'PM2.5',
      value: 85,
      recordKind: 'observation',
      validAt: new Date(now - 25 * 60 * 1000).toISOString(), // 25 mins ago
      retrievedAt: new Date(now).toISOString(),
      attribution: 'CPCB Anand Vihar'
    };

    const res = evaluateRecordProvenance(record, { now });
    expect(res.status).toBe('live_observation');
    expect(res.isLive).toBe(true);
    expect(res.isForecast).toBe(false);
    expect(res.isStale).toBe(false);
    expect(res.badgeText).toBe('Live Observation');
    expect(res.value).toBe(85);
    expect(res.displayLabel).toContain('Live Monitored PM2.5: 85 µg/m³');
  });

  it('correctly classifies a fresh forecast record as FORECAST and NEVER live', () => {
    const record = {
      pollutant: 'PM2.5',
      value: 62,
      recordKind: 'forecast',
      validAt: new Date(now).toISOString(),
      retrievedAt: new Date(now).toISOString(),
      attribution: 'Copernicus CAMS Forecast Model'
    };

    const res = evaluateRecordProvenance(record, { now });
    expect(res.status).toBe('forecast');
    expect(res.isLive).toBe(false); // Invariant: forecast is NEVER live
    expect(res.isForecast).toBe(true);
    expect(res.badgeText).toBe('Forecast');
    expect(res.displayLabel).toContain('Forecast PM2.5: 62 µg/m³ (Numerical Model)');
  });

  it('correctly classifies a cached but valid observation', () => {
    const record = {
      pollutant: 'PM2.5',
      value: 70,
      recordKind: 'observation',
      validAt: new Date(now - 40 * 60 * 1000).toISOString(),
      retrievedAt: new Date(now - 40 * 60 * 1000).toISOString(),
      isCached: true,
      attribution: 'CPCB ITO'
    };

    const res = evaluateRecordProvenance(record, { now });
    expect(res.status).toBe('cached');
    expect(res.isLive).toBe(false);
    expect(res.badgeText).toBe('Cached');
    expect(res.displayLabel).toContain('Cached Observation: 70 µg/m³');
  });

  it('correctly classifies an expired observation (>3 hours old) as expired/stale', () => {
    const record = {
      pollutant: 'PM2.5',
      value: 120,
      recordKind: 'observation',
      validAt: new Date(now - 240 * 60 * 1000).toISOString(), // 4 hours ago
      retrievedAt: new Date(now).toISOString(),
      attribution: 'CPCB R.K. Puram'
    };

    const res = evaluateRecordProvenance(record, { now });
    expect(res.status).toBe('expired');
    expect(res.isLive).toBe(false);
    expect(res.isExpired).toBe(true);
    expect(res.badgeText).toBe('Expired / Stale');
    expect(res.displayLabel).toContain('Data Expired >3h ago');
  });

  it('handles missing timestamp safely without crashing and flags as unverified', () => {
    const record = {
      pollutant: 'PM2.5',
      value: 95,
      recordKind: 'observation',
      attribution: 'Unknown Sensor'
    };

    const res = evaluateRecordProvenance(record, { now });
    expect(res.status).toBe('expired');
    expect(res.isLive).toBe(false);
    expect(res.badgeText).toBe('Unverified Timestamp');
  });

  it('handles missing attribution gracefully with default source identifier', () => {
    const record = {
      pollutant: 'PM2.5',
      value: 50,
      recordKind: 'observation',
      validAt: new Date(now - 15 * 60 * 1000).toISOString()
    };

    const res = evaluateRecordProvenance(record, { now });
    expect(res.status).toBe('live_observation');
    expect(res.attribution).toBeDefined();
    expect(res.attribution.length).toBeGreaterThan(0);
  });

  it('preserves null PM2.5 and displays explicit unavailable state', () => {
    const res = evaluateRecordProvenance(null, { now });
    expect(res.status).toBe('unavailable');
    expect(res.value).toBeNull();
    expect(res.isLive).toBe(false);
    expect(res.isPrecautionary).toBe(true);
    expect(res.displayLabel).toBe('PM2.5 measurement unavailable');
  });

  it('preserves genuine zero PM2.5 observation accurately', () => {
    const record = {
      pollutant: 'PM2.5',
      value: 0,
      recordKind: 'observation',
      validAt: new Date(now - 10 * 60 * 1000).toISOString(),
      attribution: 'CPCB Clean Air Lab'
    };

    const res = evaluateRecordProvenance(record, { now });
    expect(res.status).toBe('live_observation');
    expect(res.value).toBe(0);
    expect(res.displayLabel).toContain('Live Monitored PM2.5: 0 µg/m³');
  });

  it('handles invalid NaN or non-finite PM2.5 values safely', () => {
    const record = {
      pollutant: 'PM2.5',
      value: NaN,
      recordKind: 'observation'
    };

    const res = evaluateRecordProvenance(record, { now });
    expect(res.status).toBe('unavailable');
    expect(res.value).toBeNull();
    expect(res.isPrecautionary).toBe(true);
  });

  it('handles mixed fresh and stale evidence: record-level check detects stale record even if bundle is fresh', () => {
    // The evidence bundle might be marked 'fresh' because a temperature or PM10 sensor was updated,
    // but the specific PM2.5 observation itself is 200 minutes old (expired).
    const bundleFreshness = 'fresh';
    expect(bundleFreshness).toBe('fresh');

    const stalePm25Record = {
      pollutant: 'PM2.5',
      value: 130,
      recordKind: 'observation',
      validAt: new Date(now - 200 * 60 * 1000).toISOString(), // 200 mins ago
      attribution: 'CPCB Mandir Marg'
    };

    const provenance = evaluateRecordProvenance(stalePm25Record, { now });
    // Invariant: The individual record MUST be classified as expired, never live!
    expect(provenance.status).toBe('expired');
    expect(provenance.isLive).toBe(false);
    expect(provenance.isExpired).toBe(true);
  });

  it('evaluateFreshness helper functions properly across thresholds', () => {
    const t0 = new Date('2026-11-25T12:00:00Z').toISOString();
    const t30 = new Date('2026-11-25T11:30:00Z').toISOString();
    const t90 = new Date('2026-11-25T10:30:00Z').toISOString();
    const t300 = new Date('2026-11-25T07:00:00Z').toISOString();

    expect(evaluateFreshness(t30, t0)).toBe('fresh');
    expect(evaluateFreshness(t90, t0)).toBe('stale');
    expect(evaluateFreshness(t300, t0)).toBe('expired');
    expect(evaluateFreshness('invalid', t0)).toBe('expired');
  });
});
