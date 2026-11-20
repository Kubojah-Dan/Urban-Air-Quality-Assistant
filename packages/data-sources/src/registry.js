export const DATA_SOURCE_REGISTRY = {
  'open-meteo': {
    id: 'open-meteo',
    name: 'Open-Meteo Air Quality',
    type: 'model_forecast',
    models: {
      global: 'cams_global (~45km)',
      europe: 'cams_europe (~11km)'
    },
    attribution: 'Copernicus Atmosphere Monitoring Service (CAMS) / Open-Meteo'
  },
  airnow: {
    id: 'airnow',
    name: 'AirNow EPA',
    type: 'reporting_area_observation',
    coverage: 'United States',
    attribution: 'U.S. EPA AirNow Program'
  },
  cpcb: {
    id: 'cpcb',
    name: 'CPCB / data.gov.in',
    type: 'station_observation',
    coverage: 'India',
    attribution: 'Central Pollution Control Board (CPCB), India'
  },
  openaq: {
    id: 'openaq',
    name: 'OpenAQ',
    type: 'station_aggregator',
    attribution: 'OpenAQ Platform'
  }
};
