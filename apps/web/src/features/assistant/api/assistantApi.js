import { httpClient } from '../../../infrastructure/http/httpClient.js';

export async function askReplanner(query) {
  return httpClient('/assistant/replan', {
    method: 'POST',
    body: JSON.stringify({ query })
  });
}
