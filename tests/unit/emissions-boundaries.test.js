import { describe, it, expect } from 'vitest';
import { calculateEmissionsSavings, validateExposureProxyBoundaries } from '@dayshift/domain';

describe('Emissions & Impact Receipt Boundaries', () => {
  it('returns not_estimated when no matching factor exists, NEVER zero', () => {
    const result = calculateEmissionsSavings('ferry', 10, {});
    expect(result.status).toBe('not_estimated');
    expect(result.estimatedTailpipeCo2GramsSaved).toBeNull();
  });

  it('computes positive savings when a verified factor exists', () => {
    const factors = {
      transit: { id: 'ef_bus', activityClass: 'urban_bus', gramsPerKm: 50, source: 'ARAI 2024', vintage: '2024' }
    };
    const result = calculateEmissionsSavings('transit', 10, factors);
    expect(result.status).toBe('estimated');
    expect(result.estimatedTailpipeCo2GramsSaved).toBeGreaterThan(0);
  });

  it('strictly forbids converting ambient AQI into personal inhaled dose', () => {
    const check = validateExposureProxyBoundaries(150);
    expect(check.allowed).toBe(false);
  });
});
