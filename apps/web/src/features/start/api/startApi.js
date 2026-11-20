import { httpClient } from '../../../infrastructure/http/httpClient.js';

export async function fetchHealth() {
  return httpClient('/health');
}
