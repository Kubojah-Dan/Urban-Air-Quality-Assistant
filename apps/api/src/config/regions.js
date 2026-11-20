export const REGIONS_CONFIG = {
  IN: {
    name: 'India',
    preferredProvider: 'cpcb',
    modelFallback: 'open-meteo-cams-global',
    timeZone: 'Asia/Kolkata',
    camsGridResolutionKm: 45
  },
  US: {
    name: 'United States',
    preferredProvider: 'airnow',
    modelFallback: 'open-meteo-cams-global',
    timeZone: 'America/New_York',
    camsGridResolutionKm: 45
  },
  EU: {
    name: 'European Union',
    preferredProvider: 'open-meteo-cams-regional',
    modelFallback: 'open-meteo-cams-global',
    timeZone: 'Europe/Brussels',
    camsGridResolutionKm: 11
  }
};
