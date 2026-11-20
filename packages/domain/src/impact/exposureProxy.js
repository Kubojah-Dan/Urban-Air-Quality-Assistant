/**
 * Invariant enforcement: DayShift strictly rejects claiming personal inhaled dose or
 * converting AQI numbers directly into individual health benefit or exposure reductions.
 *
 * @param {number} ambientAqi
 * @returns {{ allowed: boolean, reason: string }}
 */
export function validateExposureProxyBoundaries(_ambientAqi) {
  return {
    allowed: false,
    reason: 'Ambient outdoor index cannot be converted to individual inhaled dose without calibrated personal sensors.'
  };
}
