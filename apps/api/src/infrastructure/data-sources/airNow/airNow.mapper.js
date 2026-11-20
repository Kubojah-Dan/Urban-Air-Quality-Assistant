export function mapAirNowToRecord(item) {
  return {
    id: `airnow_${item.ReportingArea}_${Date.now()}`,
    provider: 'airnow',
    recordKind: 'observation',
    stationId: item.ReportingArea,
    pollutant: item.ParameterName || 'PM2.5',
    value: item.AQI || 0,
    unit: 'AQI (US EPA)',
    validAt: new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    coverage: `Reporting Area: ${item.ReportingArea}, ${item.StateCode}`,
    qualityFlags: ['preliminary'],
    attribution: `Reporting agency via U.S. EPA AirNow (${item.ReportingArea})`
  };
}
