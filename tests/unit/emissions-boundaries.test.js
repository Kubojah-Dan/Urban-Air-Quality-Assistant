import { describe, it, expect } from 'vitest';
import {
  calculateEmissionsSavings,
  validateExposureProxyBoundaries,
  verifyReceiptProhibitions,
  VERIFIED_EMISSION_FACTORS
} from '@dayshift/domain';

describe('Emissions & Impact Receipt Boundaries (Phase 3 Invariants)', () => {
  describe('Verified Regional Factors Integrity', () => {
    it('contains ARAI 2024 factors for India with complete provenance metadata', () => {
      const indiaFactors = VERIFIED_EMISSION_FACTORS.IN;
      expect(indiaFactors).toBeDefined();
      expect(indiaFactors.transit_bus.vintage).toBe('2024');
      expect(indiaFactors.transit_bus.boundary).toBe('tank_to_wheel');
      expect(indiaFactors.transit_bus.source).toContain('Automotive Research Association of India');
      expect(indiaFactors.transit_bus.basis).toBe('passenger_km');
    });

    it('contains EPA 2024 factors for USA with complete provenance metadata', () => {
      const usFactors = VERIFIED_EMISSION_FACTORS.US;
      expect(usFactors).toBeDefined();
      expect(usFactors.transit_bus.vintage).toBe('2024');
      expect(usFactors.transit_bus.boundary).toBe('tank_to_wheel');
      expect(usFactors.transit_bus.source).toContain('U.S. EPA');
    });
  });

  describe('Emissions Calculation Semantics', () => {
    it('returns not_estimated and null value when region has no verified factors, NEVER zero', () => {
      const result = calculateEmissionsSavings('transit', 12, 'UNKNOWN_REGION');
      expect(result.status).toBe('not_estimated');
      expect(result.estimatedTailpipeCo2GramsSaved).toBeNull();
      expect(result.note).toContain('No verified emission factor dataset exists');
    });

    it('returns not_estimated when mode has no matching factor for region', () => {
      const result = calculateEmissionsSavings('unsupported_ferry', 10, 'IN');
      expect(result.status).toBe('not_estimated');
      expect(result.estimatedTailpipeCo2GramsSaved).toBeNull();
    });

    it('calculates net avoided tailpipe CO2 for India transit with full attribution', () => {
      const result = calculateEmissionsSavings('transit', 10, 'IN');
      expect(result.status).toBe('estimated');
      expect(typeof result.estimatedTailpipeCo2GramsSaved).toBe('number');
      expect(result.estimatedTailpipeCo2GramsSaved).toBeGreaterThan(0);
      expect(result.factorSource).toContain('ARAI');
      expect(result.factorVintage).toBe('2024');
      expect(result.boundary).toBe('tank_to_wheel');
    });

    it('calculates net avoided tailpipe CO2 for US active walk mode', () => {
      const result = calculateEmissionsSavings('walk', 5, 'US');
      expect(result.status).toBe('estimated');
      expect(result.estimatedTailpipeCo2GramsSaved).toBeGreaterThan(0);
      expect(result.activityClass).toBe('walking');
      expect(result.unitBasis).toBe('passenger_km_avoided');
    });
  });

  describe('Exposure Proxy Prohibitions', () => {
    it('strictly forbids converting ambient outdoor AQI to personal inhaled dose', () => {
      const check = validateExposureProxyBoundaries(180);
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain('individual inhaled dose');
    });

    it('verifies receipt does not contain prohibited personal dose claims', () => {
      const validReceipt = {
        outdoorContext: { pollutant: 'PM2.5', timeWindow: '08:00 - 09:00' },
        emissionsEstimate: { status: 'estimated', estimatedTailpipeCo2GramsSaved: 500 }
      };
      expect(verifyReceiptProhibitions(validReceipt)).toBe(true);

      const invalidReceipt = {
        outdoorContext: { personalDoseReduction: '20% less inhaled dose' }
      };
      expect(verifyReceiptProhibitions(invalidReceipt)).toBe(false);
    });
  });
});
