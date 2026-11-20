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
