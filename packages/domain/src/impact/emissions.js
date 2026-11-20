/**
 * Computes emissions savings only when a verified, regional factor exists.
 * Invariant: If no factor exists, status MUST be 'not_estimated', NEVER zero.
 *
 * @param {string} mode - 'transit' | 'car' | 'walk' | 'bike'
 * @param {number} distanceKm
 * @param {Object} [factorRegistry]
 * @returns {{ status: 'estimated' | 'not_estimated', estimatedTailpipeCo2GramsSaved?: number | null, note: string }}
 */
export function calculateEmissionsSavings(mode, distanceKm, factorRegistry = {}) {
  const factor = factorRegistry[mode];

  if (!factor || typeof factor.gramsPerKm !== 'number') {
    return {
      status: 'not_estimated',
      estimatedTailpipeCo2GramsSaved: null,
      note: 'No verified regional emission factor available for this mode and region. Value is not estimated.'
    };
  }

  const baselineGrams = distanceKm * 150; // Reference car baseline
  const modeGrams = distanceKm * factor.gramsPerKm;
  const savedGrams = Math.max(0, baselineGrams - modeGrams);

  return {
    status: 'estimated',
    factorId: factor.id,
    activityClass: factor.activityClass,
    estimatedTailpipeCo2GramsSaved: Math.round(savedGrams),
    factorSource: factor.source,
    factorVintage: factor.vintage,
    note: `Estimated tailpipe CO2 avoided versus private combustion vehicle based on ${factor.source}.`
  };
}
