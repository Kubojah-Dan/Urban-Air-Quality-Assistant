/**
 * Formats outdoor context receipt.
 * Invariant: Outdoor air changes must report context/window and never claim personal exposure percentage.
 *
 * @param {Object} evidence
 * @returns {Object}
 */
export function buildOutdoorContextReceipt(evidence) {
  return {
    pollutant: evidence?.pollutant || 'PM2.5',
    timeWindow: 'Morning peak commute window',
    relativeTrend: 'improving',
    sourceLabel: evidence?.attribution || 'Official Air Quality Forecast',
    coverage: evidence?.coverage || 'Regional city grid (~45 km)',
    caveats: [
      'Ambient concentration represents regional conditions, not micro-environment or street-canyon exposure.'
    ]
  };
}
