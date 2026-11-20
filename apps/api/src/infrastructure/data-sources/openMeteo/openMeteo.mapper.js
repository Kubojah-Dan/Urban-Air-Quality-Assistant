export function mapOpenMeteoToRecord(raw) {
  const current = raw.current || {};
  return {
    id: `om_${Date.now()}`,
    provider: 'open-meteo',
    recordKind: 'forecast',
    modelId: 'cams_global',
    pollutant: 'PM2.5',
    value: current.pm2_5 || 0,
    unit: 'µg/m³',
    validAt: current.time ? new Date(current.time).toISOString() : new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    coverage: 'Regional grid (~45km)',
    qualityFlags: ['valid'],
    attribution: 'Copernicus Atmosphere Monitoring Service (CAMS) / Open-Meteo'
  };
}
