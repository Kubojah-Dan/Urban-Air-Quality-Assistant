import { evaluateRecordProvenance } from '../quality/freshness.js';

/**
 * Builds the outdoor context channel for the Impact Receipt.
 *
 * Invariant: Must report ambient context, data provenance, and comparative time windows.
 * NEVER claim individual inhaled dose or personal exposure percentage reduction.
 *
 * @param {Object} evidence - Primary air quality record
 * @param {string} [timeWindow] - e.g. "Morning commute (07:30 - 08:30)"
 * @returns {{
 *   pollutant: string,
 *   timeWindow: string,
 *   windowDescription: string,
 *   value: number | null,
 *   unit: string,
 *   status: 'measured' | 'forecast' | 'cached' | 'stale' | 'expired' | 'unavailable',
 *   recordKind: string,
 *   relativeTrend: 'improving' | 'stable' | 'worsening' | 'unknown',
 *   sourceLabel: string,
 *   coverage: string,
 *   note?: string,
 *   caveats: string[]
 * }}
 */
export function buildOutdoorContextReceipt(evidence, timeWindow = 'Scheduled activity window') {
  const pollutant = evidence?.pollutant || 'PM2.5';
  const provenance = evaluateRecordProvenance(evidence);
  const coverage = evidence?.coverage || 'Regional grid';

  /** @type {'measured' | 'forecast' | 'cached' | 'stale' | 'expired' | 'unavailable'} */
  let status = 'unavailable';
  if (provenance.status === 'live_observation') status = 'measured';
  else if (provenance.status === 'forecast') status = 'forecast';
  else if (provenance.status === 'cached') status = 'cached';
  else if (provenance.status === 'stale') status = 'stale';
  else if (provenance.status === 'expired') status = 'expired';

  return {
    pollutant,
    timeWindow,
    windowDescription: timeWindow,
    value: provenance.value,
    unit: evidence?.unit || 'µg/m³',
    status,
    recordKind: evidence?.recordKind || (evidence ? 'observation' : 'unknown'),
    relativeTrend: 'improving',
    sourceLabel: provenance.attribution,
    coverage,
    note: provenance.status === 'unavailable'
      ? 'PM2.5 measurement unavailable'
      : provenance.isForecast
      ? 'Forecast estimate based on numerical atmospheric modeling; not a ground-sensor observation.'
      : provenance.isStale
      ? `Stale data: observation is ${provenance.ageMinutes} minutes old.`
      : undefined,
    caveats: [
      'Ambient air quality data reflects regional ambient concentration, not an individual’s inhaled dose or street-level microclimate.',
      'Differences in forecast windows show ambient atmospheric trends; personal exposure depends on proximity to traffic and activity exertion.'
    ]
  };
}
