import { httpClient } from '../../../infrastructure/http/httpClient.js';

export async function previewRecommendation(baseline, locationContext) {
  return httpClient('/recommendations/preview', {
    method: 'POST',
    body: JSON.stringify({ baseline, locationContext })
  });
}

export async function reviseRecommendation(baseline, modifiedConstraint, currentCandidates, locationContext) {
  return httpClient('/recommendations/revise', {
    method: 'POST',
    body: JSON.stringify({ baseline, modifiedConstraint, currentCandidates, locationContext })
  });
}
