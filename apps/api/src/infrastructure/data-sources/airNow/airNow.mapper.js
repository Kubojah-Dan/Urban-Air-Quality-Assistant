import { MalformedPayloadError } from '../errors.js';

const CATEGORY_NAMES = {
  1: 'Good',
  2: 'Moderate',
  3: 'Unhealthy for Sensitive Groups',
  4: 'Unhealthy',
  5: 'Very Unhealthy',
  6: 'Hazardous'
};

export function mapAirNowToRecord(item) {
  if (!item || typeof item !== 'object') {
    throw new MalformedPayloadError('airnow', 'Expected object for AirNow record');
  }

  const siteName = item.SiteName || item.ReportingArea || 'U.S. Monitoring Station';
  const agencyName = item.AgencyName || 'AirNow Reporting Agency';
  const param = item.Parameter || item.ParameterName || 'PM2.5';
  const catNum = typeof item.Category === 'object' ? item.Category?.Number : item.Category;
  const categoryLabel = CATEGORY_NAMES[catNum] || item.Category?.Name || 'Reported';

  let validAt = new Date().toISOString();
  if (item.UTC) {
    const parsed = new Date(item.UTC.endsWith('Z') ? item.UTC : `${item.UTC}Z`);
    if (!isNaN(parsed.getTime())) {
      validAt = parsed.toISOString();
    }
  } else if (item.DateObserved) {
    const hour = String(item.HourObserved || 0).padStart(2, '0');
    const parsed = new Date(`${item.DateObserved}T${hour}:00:00Z`);
    if (!isNaN(parsed.getTime())) {
      validAt = parsed.toISOString();
    }
  }

  return {
    id: `airnow_${siteName.replace(/\s+/g, '_')}_${param}_${Date.now()}`,
    provider: 'airnow',
    recordKind: 'observation',
    stationId: siteName,
    pollutant: param === 'OZONE' ? 'O3' : param,
    value: Number(item.AQI) || Number(item.Value) || 0,
    unit: `AQI (US EPA - ${categoryLabel})`,
    validAt,
    retrievedAt: new Date().toISOString(),
    coverage: `U.S. Station: ${siteName} (${agencyName})`,
    qualityFlags: ['preliminary'],
    attribution: `Reporting agency (${agencyName}) via U.S. EPA AirNow — Preliminary observation (not regulatory-certified EPA AQS)`
  };
}

export function mapAirNowToRecords(raw) {
  if (!Array.isArray(raw)) {
    throw new MalformedPayloadError('airnow', 'Expected array payload from AirNow');
  }
  return raw.map(mapAirNowToRecord);
}
