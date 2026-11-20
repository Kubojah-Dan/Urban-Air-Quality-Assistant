/**
 * Invariant enforcement: DayShift strictly forbids converting ambient AQI readings
 * into personal health-risk scores, personal inhaled dose, or percentage reductions in exposure.
 *
 * @param {number} ambientAqi
 * @returns {{ allowed: boolean, reason: string }}
 */
export function validateExposureProxyBoundaries(_ambientAqi) {
  return {
    allowed: false,
    reason: 'Ambient outdoor index cannot be converted to individual inhaled dose or health score without calibrated personal biometric and exposure sensors.'
  };
}

/**
 * Validates that an impact receipt does not contain prohibited exposure claims.
 *
 * @param {Object} receipt
 * @returns {boolean}
 */
export function verifyReceiptProhibitions(receipt) {
  if (!receipt) return true;
  const serialized = JSON.stringify(receipt).toLowerCase();

  // Prohibit claiming percentage reduction in personal exposure or inhaled dose
  if (serialized.includes('personal dose') || serialized.includes('inhaled dose')) {
    return false;
  }
  return true;
}
