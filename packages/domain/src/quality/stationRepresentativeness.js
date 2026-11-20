/**
 * Computes station representativeness distance and warning caveats.
 *
 * @param {number} distanceKm
 * @returns {{ representativeness: 'high' | 'moderate' | 'regional_only', caveat: string | null }}
 */
export function evaluateStationRepresentativeness(distanceKm) {
  if (distanceKm <= 5) {
    return {
      representativeness: 'high',
      caveat: null
    };
  }
  if (distanceKm <= 15) {
    return {
      representativeness: 'moderate',
      caveat: `Station is ${distanceKm.toFixed(1)} km away; hyper-local conditions may vary.`
    };
  }
  return {
    representativeness: 'regional_only',
    caveat: `Station is distant (${distanceKm.toFixed(1)} km). Treated as regional background only.`
  };
}
