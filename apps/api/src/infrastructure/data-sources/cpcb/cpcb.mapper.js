export function mapCpcbToRecord(record) {
  return {
    id: `cpcb_${record.station}_${Date.now()}`,
    provider: 'cpcb',
    recordKind: 'observation',
    stationId: record.station || 'Unknown Station',
    pollutant: record.pollutant_id || 'PM2.5',
    value: Number(record.pollutant_avg) || 0,
    unit: 'µg/m³',
    validAt: record.last_update ? new Date(record.last_update).toISOString() : new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    coverage: `Station: ${record.station}, ${record.city}`,
    qualityFlags: ['valid'],
    attribution: `CPCB / data.gov.in (${record.station})`
  };
}
