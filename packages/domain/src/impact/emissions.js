/**
 * Verified Emission Factors Registry
 * Region, activity, and vintage specific factors.
 * Invariant: Never reuse cross-region factors without verification.
 */
export const VERIFIED_EMISSION_FACTORS = {
  IN: {
    transit_bus: {
      id: 'ef_in_arai_bus_2024',
      region: 'IN',
      activityClass: 'urban_public_transit',
      fuel: 'cng_diesel_grid_avg',
      basis: 'passenger_km',
      gramsPerKm: 42,
      boundary: 'tank_to_wheel',
      source: 'Automotive Research Association of India (ARAI) Comprehensive Emissions Factors 2024',
      vintage: '2024'
    },
    private_car_baseline: {
      id: 'ef_in_arai_car_2024',
      region: 'IN',
      activityClass: 'private_combustion_car',
      fuel: 'petrol_diesel_avg',
      basis: 'vehicle_km',
      gramsPerKm: 148,
      boundary: 'tank_to_wheel',
      source: 'ARAI 2024 / MoEFCC Guidelines',
      vintage: '2024'
    }
  },
  US: {
    transit_bus: {
      id: 'ef_us_epa_transit_2024',
      region: 'US',
      activityClass: 'urban_transit_bus',
      fuel: 'cng_diesel_hybrid_avg',
      basis: 'passenger_km',
      gramsPerKm: 58,
      boundary: 'tank_to_wheel',
      source: 'U.S. EPA Emission Factors for Greenhouse Gas Inventories 2024',
      vintage: '2024'
    },
    private_car_baseline: {
      id: 'ef_us_epa_car_2024',
      region: 'US',
      activityClass: 'passenger_gasoline_car',
      fuel: 'gasoline',
      basis: 'vehicle_km',
      gramsPerKm: 170,
      boundary: 'tank_to_wheel',
      source: 'U.S. EPA MOVES 2024',
      vintage: '2024'
    }
  }
};

/**
 * Computes emissions savings only when a matching, verified regional factor exists.
 *
 * Invariant: If no matching factor is verified for the region/activity,
 * status MUST be 'not_estimated' and estimatedTailpipeCo2GramsSaved MUST be null, NEVER zero.
 *
 * @param {string} mode - 'transit' | 'walk' | 'bike' | 'car'
 * @param {number} distanceKm - Estimated distance in kilometers
 * @param {string} regionCode - 'IN' | 'US' | 'EU' | etc.
 * @param {Object} [customFactorRegistry] - Optional custom injection for testing
 * @returns {{
 *   status: 'estimated' | 'not_estimated',
 *   factorId?: string,
 *   activityClass?: string,
 *   estimatedTailpipeCo2GramsSaved: number | null,
 *   factorSource?: string,
 *   factorVintage?: string,
 *   boundary?: string,
 *   unitBasis?: string,
 *   note: string
 * }}
 */
export function calculateEmissionsSavings(mode, distanceKm, regionCode = 'IN', customFactorRegistry = null) {
  const registry = customFactorRegistry || VERIFIED_EMISSION_FACTORS[regionCode];

  // If no registry for this region, strictly report not_estimated
  if (!registry) {
    return {
      status: 'not_estimated',
      estimatedTailpipeCo2GramsSaved: null,
      note: `No verified emission factor dataset exists for region '${regionCode}'. Value is not estimated.`
    };
  }

  // Active transportation modes (walk/bike) produce zero direct tailpipe emissions
  if (mode === 'walk' || mode === 'bike') {
    const carBaseline = registry.private_car_baseline;
    if (!carBaseline) {
      return {
        status: 'not_estimated',
        estimatedTailpipeCo2GramsSaved: null,
        note: 'Baseline combustion vehicle factor not available. Value is not estimated.'
      };
    }
    const avoidedGrams = Math.round(distanceKm * carBaseline.gramsPerKm);
    return {
      status: 'estimated',
      factorId: carBaseline.id,
      activityClass: mode === 'walk' ? 'walking' : 'bicycling',
      estimatedTailpipeCo2GramsSaved: avoidedGrams,
      factorSource: carBaseline.source,
      factorVintage: carBaseline.vintage,
      boundary: carBaseline.boundary,
      unitBasis: 'passenger_km_avoided',
      note: `Avoided tailpipe CO₂ by choosing active non-motorized transport over private vehicle based on ${carBaseline.source}.`
    };
  }

  // Public transit mode
  if (mode === 'transit') {
    const transitFactor = registry.transit_bus;
    const carBaseline = registry.private_car_baseline;

    if (!transitFactor || !carBaseline) {
      return {
        status: 'not_estimated',
        estimatedTailpipeCo2GramsSaved: null,
        note: `Verified transit factor not found for region '${regionCode}'. Value is not estimated.`
      };
    }

    const baselineGrams = distanceKm * carBaseline.gramsPerKm;
    const transitGrams = distanceKm * transitFactor.gramsPerKm;
    const netSavedGrams = Math.max(0, Math.round(baselineGrams - transitGrams));

    return {
      status: 'estimated',
      factorId: transitFactor.id,
      activityClass: transitFactor.activityClass,
      estimatedTailpipeCo2GramsSaved: netSavedGrams,
      factorSource: transitFactor.source,
      factorVintage: transitFactor.vintage,
      boundary: transitFactor.boundary,
      unitBasis: transitFactor.basis,
      note: `Estimated net tailpipe CO₂ avoided by choosing shared public transit over private vehicle (${transitFactor.source}).`
    };
  }

  // Any other mode without explicit verified factor
  return {
    status: 'not_estimated',
    estimatedTailpipeCo2GramsSaved: null,
    note: `No matching verified emission factor for mode '${mode}' in region '${regionCode}'. Value is not estimated.`
  };
}
