import { describe, it, expect } from 'vitest';
import { areMetricsCompatible } from '@dayshift/domain';

describe('AQI Scale & Metric Invariants', () => {
  it('prohibits comparing or averaging different regional indices', () => {
    // US EPA AQI (0-500) vs NAQI (India)
    const compatible = areMetricsCompatible(
      'airnow',
      'index',
      'AQI (US EPA)',
      'cpcb',
      'index',
      'NAQI'
    );
    expect(compatible).toBe(false);
  });

  it('prohibits averaging station observations with regional model forecasts', () => {
    const compatible = areMetricsCompatible(
      'cpcb',
      'observation',
      'µg/m³',
      'open-meteo',
      'forecast',
      'µg/m³'
    );
    expect(compatible).toBe(false);
  });
});
