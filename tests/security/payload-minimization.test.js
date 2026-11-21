import { describe, it, expect } from 'vitest';
import { buildRankCandidatesPrompt } from '@dayshift/ai';

describe('Security: Payload Minimization & Prompt Privacy (Phase 6)', () => {
  it('verifies prompt builder strips sensitive medical, GPS, and address details', () => {
    const rawUserData = {
      id: 'routine_sensitive_01',
      userId: 'user_private_999',
      streetAddress: '123 Elm Street, Apartment 4B',
      gpsCoordinates: { lat: 28.613912345, lon: 77.209012345 },
      medicalNotes: 'Severe chronic asthma patient, uses bronchodilator',
      activityType: 'commute',
      constraints: [{ type: 'mustArriveBy', time: '09:00' }]
    };

    const candidates = [
      { id: 'cand_01', title: 'Option 1', mode: 'transit', departureMinutes: 450, arrivalMinutes: 490 }
    ];
    const evidenceIds = ['ev_cams_01'];

    const promptPayload = buildRankCandidatesPrompt({
      baseline: rawUserData,
      candidates,
      evidenceIds,
      locationContext: { countryCode: 'IN', city: 'Delhi' }
    });

    // The userPrompt string passed to the LLM must NOT contain personal address, GPS, or medical details
    expect(promptPayload.userPrompt).not.toContain('123 Elm Street');
    expect(promptPayload.userPrompt).not.toContain('28.613912345');
    expect(promptPayload.userPrompt).not.toContain('asthma');
    expect(promptPayload.userPrompt).not.toContain('user_private_999');

    // Only allowlisted candidates and coarse IDs are sent
    expect(promptPayload.eligibleCandidateIds).toEqual(['cand_01']);
    expect(promptPayload.allowlistedEvidenceIds).toEqual(['ev_cams_01']);
  });
});
