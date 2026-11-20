import { httpClient } from '../../../infrastructure/http/httpClient.js';

export async function fetchPreferences() {
  return httpClient('/preferences');
}

export async function savePreferences(preferences) {
  return httpClient('/preferences', {
    method: 'PUT',
    body: JSON.stringify(preferences)
  });
}
