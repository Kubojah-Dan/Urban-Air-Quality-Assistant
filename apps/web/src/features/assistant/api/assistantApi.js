import { httpClient } from '../../../infrastructure/http/httpClient.js';

export async function askAssistant({ query, city, context }) {
  return httpClient('/assistant/chat', {
    method: 'POST',
    body: JSON.stringify({ query, city, context })
  });
}
