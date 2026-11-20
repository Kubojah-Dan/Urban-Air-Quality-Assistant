import { MalformedPayloadError } from '../errors.js';

export function mapCpcbToRecord(record) {
  if (!record || typeof record !== 'object') {
    throw new MalformedPayloadError('cpcb', 'Expected object for CPCB station record');
  }

  const stationName = record.station || record.station_name || 'Ground Monitoring Station';
  const city = record.city || 'India';
  const pollutant = record.pollutant_id || 'PM2.5';
  const value = Number(record.pollutant_avg || record.avg_value || record.value) || 0;

  let validAt = new Date().toISOString();
  if (record.last_update) {
    const parsed = new Date(record.last_update);
    if (!isNaN(parsed.getTime())) {
      validAt = parsed.toISOString();
    }
  }

  return {
    id: `cpcb_${stationName.replace(/\s+/g, '_')}_${pollutant}_${Date.now()}`,
    provider: 'cpcb',
    recordKind: 'observation',
    stationId: stationName,
    pollutant,
    value,
    unit: 'µg/m³',
    validAt,
    retrievedAt: new Date().toISOString(),
    coverage: `Ground Station: ${stationName}, ${city} (Hyper-local sensor point)`,
    qualityFlags: ['valid'],
    attribution: `CPCB / data.gov.in (${stationName}, ${city}) — Ground observation station`
  };
}

export function mapCpcbToRecords(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new MalformedPayloadError('cpcb', 'Expected object with records array from CPCB');
  }
  const records = Array.isArray(raw.records) ? raw.records : [];
  return records.map(mapCpcbToRecord);
}
