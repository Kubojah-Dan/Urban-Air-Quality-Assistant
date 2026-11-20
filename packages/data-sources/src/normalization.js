/**
 * Normalizes raw upstream provider payload into standard AirQualityRecord representation.
 *
 * @param {Object} rawRecord
 * @param {string} provider
 * @returns {Object}
 */
export function normalizeAirRecord(rawRecord, provider) {
  return {
    id: rawRecord.id || `${provider}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    provider,
    recordKind: rawRecord.recordKind || 'forecast',
    stationId: rawRecord.stationId || undefined,
    modelId: rawRecord.modelId || undefined,
    pollutant: rawRecord.pollutant || 'PM2.5',
    value: Number(rawRecord.value) || 0,
    unit: rawRecord.unit || 'µg/m³',
    validAt: rawRecord.validAt || new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    coverage: rawRecord.coverage || 'regional',
    qualityFlags: rawRecord.qualityFlags || ['valid'],
    attribution: rawRecord.attribution || 'Official Source'
  };
}
