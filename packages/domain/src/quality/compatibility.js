/**
 * Assesses whether two air quality metrics can be mathematically compared or combined.
 * Invariant: Station observations and forecast models, or different regional indices (US AQI vs NAQI),
 * must never be averaged or conflated as equivalent.
 *
 * @param {string} providerA
 * @param {string} kindA - 'observation' | 'forecast' | 'index'
 * @param {string} unitA
 * @param {string} providerB
 * @param {string} kindB
 * @param {string} unitB
 * @returns {boolean}
 */
export function areMetricsCompatible(providerA, kindA, unitA, providerB, kindB, unitB) {
  if (unitA !== unitB) return false;
  if (kindA !== kindB) return false;
  // Observations from different providers or station vs model are not directly swappable
  if (providerA !== providerB && (kindA === 'index' || kindA === 'forecast')) {
    return false;
  }
  return true;
}
