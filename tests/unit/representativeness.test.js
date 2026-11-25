import { describe, it, expect } from 'vitest';
import { evaluateStationRepresentativeness } from '../../packages/domain/src/quality/stationRepresentativeness.js';

describe('Domain: Station Representativeness Evaluation', () => {
  it('evaluates distance <= 5km as high representativeness with zero caveat', () => {
    const result = evaluateStationRepresentativeness(3.2);
    expect(result.representativeness).toBe('high');
    expect(result.caveat).toBeNull();
  });

  it('evaluates distance 5km < d <= 15km as moderate representativeness with caveat', () => {
    const result = evaluateStationRepresentativeness(10.5);
    expect(result.representativeness).toBe('moderate');
    expect(result.caveat).toContain('Station is 10.5 km away');
  });

  it('evaluates distance > 15km as regional background only', () => {
    const result = evaluateStationRepresentativeness(24.0);
    expect(result.representativeness).toBe('regional_only');
    expect(result.caveat).toContain('Station is distant');
  });
});
