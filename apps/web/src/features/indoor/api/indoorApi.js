import { httpClient } from '../../../infrastructure/http/httpClient.js';

export async function fetchIndoorGuidance(scenario) {
  const query = scenario ? `?scenario=${encodeURIComponent(scenario)}` : '';
  return httpClient(`/guidance/indoor${query}`);
}
