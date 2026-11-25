/**
 * Evaluates whether an air quality observation or forecast timestamp is fresh.
 *
 * @param {string} validAt - ISO 8601 timestamp representing the observation or forecast window.
 * @param {string} retrievedAt - ISO 8601 timestamp representing when data was fetched.
 * @param {number} [maxStaleMinutes=180] - Threshold in minutes before data is considered stale.
 * @returns {'fresh' | 'stale' | 'expired'}
 */
export function evaluateFreshness(validAt, retrievedAt, maxStaleMinutes = 180) {
  const validTime = new Date(validAt).getTime();
  const fetchTime = new Date(retrievedAt).getTime();

  if (isNaN(validTime) || isNaN(fetchTime)) {
    return 'expired';
  }

  const ageMinutes = Math.abs(fetchTime - validTime) / (1000 * 60);

  if (ageMinutes <= 60) {
    return 'fresh';
  }
  if (ageMinutes <= maxStaleMinutes) {
    return 'stale';
  }
  return 'expired';
}

/**
 * Evaluates detailed provenance, data kind, and freshness for an individual PM2.5 record.
 *
 * Invariant: Forecasts, cached telemetry, and expired records MUST NEVER be represented
 * as current live ground monitoring observations.
 *
 * @param {Object|null|undefined} record - Air quality record
 * @param {Object} [options]
 * @param {number} [options.now] - Current timestamp in ms (defaults to Date.now())
 * @param {number} [options.staleThresholdMinutes=60] - Minutes after which ground observation is stale
 * @param {number} [options.expiryThresholdMinutes=180] - Minutes after which data is considered expired
 * @returns {{
 *   status: 'live_observation' | 'forecast' | 'cached' | 'stale' | 'expired' | 'unavailable',
 *   value: number | null,
 *   displayLabel: string,
 *   badgeText: string,
 *   badgeStyle: string,
 *   isLive: boolean,
 *   isForecast: boolean,
 *   isStale: boolean,
 *   isExpired: boolean,
 *   isPrecautionary: boolean,
 *   attribution: string,
 *   sourceType: string,
 *   ageMinutes: number | null
 * }}
 */
export function evaluateRecordProvenance(record, options = {}) {
  if (!record || record.value == null || !Number.isFinite(record.value)) {
    return {
      status: 'unavailable',
      value: null,
      displayLabel: 'PM2.5 measurement unavailable',
      badgeText: 'Unavailable',
      badgeStyle: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
      isLive: false,
      isForecast: false,
      isStale: false,
      isExpired: false,
      isPrecautionary: true,
      attribution: 'Unmonitored Zone',
      sourceType: 'Precautionary Guidance',
      ageMinutes: null
    };
  }

  const roundedValue = Math.round(record.value);
  const now = options.now || Date.now();
  const isForecast = record.recordKind === 'forecast';
  const isCached = Boolean(record.isCached || record.qualityFlags?.includes('cached'));

  const validTime = record.validAt ? new Date(record.validAt).getTime() : NaN;
  const ageMinutes = !isNaN(validTime) ? Math.max(0, Math.round((now - validTime) / 60000)) : null;

  const staleThreshold = options.staleThresholdMinutes || 60;
  const expiryThreshold = options.expiryThresholdMinutes || 180;

  // Missing or unparseable timestamps cannot be verified as fresh
  if (ageMinutes === null) {
    return {
      status: 'expired',
      value: roundedValue,
      displayLabel: `Observation: ${roundedValue} µg/m³ (Timestamp Missing/Unverified)`,
      badgeText: 'Unverified Timestamp',
      badgeStyle: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
      isLive: false,
      isForecast,
      isStale: true,
      isExpired: true,
      isPrecautionary: false,
      attribution: record.attribution || 'Unknown Source',
      sourceType: 'Unverified Observation',
      ageMinutes: null
    };
  }

  // Expired data (> 180 minutes old)
  if (ageMinutes > expiryThreshold) {
    return {
      status: 'expired',
      value: roundedValue,
      displayLabel: `Stale PM2.5: ${roundedValue} µg/m³ (Data Expired >3h ago)`,
      badgeText: 'Expired / Stale',
      badgeStyle: 'text-rose-500 bg-rose-500/10 border-rose-500/30',
      isLive: false,
      isForecast,
      isStale: true,
      isExpired: true,
      isPrecautionary: false,
      attribution: `${record.attribution || 'Station'} (Expired observation)`,
      sourceType: 'Expired Telemetry',
      ageMinutes
    };
  }

  // Forecast data (e.g. Copernicus CAMS)
  if (isForecast) {
    return {
      status: 'forecast',
      value: roundedValue,
      displayLabel: `Forecast PM2.5: ${roundedValue} µg/m³ (Numerical Model)`,
      badgeText: 'Forecast',
      badgeStyle: 'text-sky-500 bg-sky-500/10 border-sky-500/30',
      isLive: false, // Invariant: Forecast is NEVER live ground observation
      isForecast: true,
      isStale: false,
      isExpired: false,
      isPrecautionary: false,
      attribution: record.attribution || 'Copernicus CAMS Forecast Model',
      sourceType: 'Numerical Forecast Model',
      ageMinutes
    };
  }

  // Stale observation (between 60 and 180 minutes old)
  if (ageMinutes > staleThreshold) {
    return {
      status: 'stale',
      value: roundedValue,
      displayLabel: `Observation: ${roundedValue} µg/m³ (Stale, observed ${ageMinutes}m ago)`,
      badgeText: 'Stale Observation',
      badgeStyle: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
      isLive: false,
      isForecast: false,
      isStale: true,
      isExpired: false,
      isPrecautionary: false,
      attribution: `${record.attribution || 'Ground Station'} (${ageMinutes}m old)`,
      sourceType: 'Stale Ground Telemetry',
      ageMinutes
    };
  }

  // Cached but valid observation
  if (isCached) {
    return {
      status: 'cached',
      value: roundedValue,
      displayLabel: `Cached Observation: ${roundedValue} µg/m³`,
      badgeText: 'Cached',
      badgeStyle: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
      isLive: false,
      isForecast: false,
      isStale: false,
      isExpired: false,
      isPrecautionary: false,
      attribution: `${record.attribution || 'Ground Station'} (Cached)`,
      sourceType: 'Cached Ground Telemetry',
      ageMinutes
    };
  }

  // Fresh ground observation (<= 60 minutes old)
  return {
    status: 'live_observation',
    value: roundedValue,
    displayLabel: `Live Monitored PM2.5: ${roundedValue} µg/m³`,
    badgeText: 'Live Observation',
    badgeStyle: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    isLive: true,
    isForecast: false,
    isStale: false,
    isExpired: false,
    isPrecautionary: false,
    attribution: record.attribution || 'CPCB Ground Telemetry',
    sourceType: 'Live Ground Telemetry',
    ageMinutes
  };
}
