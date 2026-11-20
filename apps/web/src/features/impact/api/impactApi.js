import { httpClient } from '../../../infrastructure/http/httpClient.js';

export async function fetchImpactFactors() {
  return httpClient('/impact/factors');
}
