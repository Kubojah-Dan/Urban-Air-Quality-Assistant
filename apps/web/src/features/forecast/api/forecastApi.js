import { httpClient } from '../../../infrastructure/http/httpClient.js';

export async function fetchAirQualityEvidence(cityId, countryCode, lat, lon) {
  return httpClient(
    `/air-quality?cityId=${encodeURIComponent(cityId)}&countryCode=${encodeURIComponent(
      countryCode
    )}&lat=${lat}&lon=${lon}`
  );
}
