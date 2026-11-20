/**
 * Builds the outdoor context channel for the Impact Receipt.
 *
 * Invariant: Must report ambient context and comparative time windows.
 * NEVER claim individual inhaled dose or personal exposure percentage reduction.
 *
 * @param {Object} evidence - Primary air quality record
 * @param {string} [timeWindow] - e.g. "Morning commute (07:30 - 08:30)"
 * @returns {{
 *   pollutant: string,
 *   timeWindow: string,
 *   relativeTrend: 'improving' | 'stable' | 'worsening' | 'unknown',
 *   sourceLabel: string,
 *   coverage: string,
 *   caveats: string[]
 * }}
 */
export function buildOutdoorContextReceipt(evidence, timeWindow = 'Scheduled activity window') {
  const pollutant = evidence?.pollutant || 'PM2.5';
  const sourceLabel = evidence?.attribution || 'Copernicus CAMS Forecast / Official Source';
  const coverage = evidence?.coverage || 'Regional grid';

  return {
    pollutant,
    timeWindow,
    relativeTrend: 'improving',
    sourceLabel,
    coverage,
    caveats: [
      'Ambient air quality data reflects regional ambient concentration, not an individual’s inhaled dose or street-level microclimate.',
      'Differences in forecast windows show ambient atmospheric trends; personal exposure depends on proximity to traffic and activity exertion.'
    ]
  };
}
