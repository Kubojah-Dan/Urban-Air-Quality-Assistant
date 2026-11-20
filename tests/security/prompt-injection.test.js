import { describe, it, expect } from 'vitest';
import { validateModelOutput } from '../../apps/api/src/infrastructure/ai/outputValidator.js';

describe('Security: Prompt Injection & Semantic Defense', () => {
  it('rejects candidate IDs injected by adversarial LLM output not in allowlist', () => {
    const maliciousOutput = {
      rankedCandidateIds: ['candidate_malicious_override'],
      reasonCodes: ['EVIL_REASON'],
      evidenceIds: ['evidence_real'],
      explanation: 'Injecting unapproved route'
    };

    const allowlistedCandidates = ['candidate_01', 'candidate_02'];
    const allowlistedEvidence = ['evidence_real'];

    const check = validateModelOutput(maliciousOutput, allowlistedCandidates, allowlistedEvidence);
    expect(check.valid).toBe(false);
    expect(check.error).toContain('unauthorized candidate IDs');
  });
});
