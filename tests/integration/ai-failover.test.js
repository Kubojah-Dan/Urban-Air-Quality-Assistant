import { describe, it, expect } from 'vitest';
import { ModelRouter } from '../../apps/api/src/infrastructure/ai/modelRouter.js';

describe('AI Dual-Provider Failover & Semantic Validation', () => {
  it('falls back from Gemini to Groq on 429 transient failure and validates output', async () => {
    let geminiCalls = 0;
    let groqCalls = 0;

    const failingGemini = {
      model: 'gemini-2.5-flash',
      generateRankedRecommendation: async () => {
        geminiCalls++;
        const err = new Error('Gemini 429 Resource Exhausted / Quota Exceeded');
        err.status = 429;
        err.retryable = true;
        throw err;
      }
    };

    const workingGroq = {
      model: 'openai/gpt-oss-120b',
      generateRankedRecommendation: async () => {
        groqCalls++;
        return {
          provider: 'groq',
          model: 'openai/gpt-oss-120b',
          output: {
            rankedCandidateIds: ['cand_rec', 'cand_usual'],
            reasonCodes: ['LOWER_EXPOSURE_WINDOW'],
            evidenceIds: ['ev_cams_1'],
            explanation: 'Shift to earlier window avoids peak particulate matter.'
          }
        };
      }
    };

    const router = new ModelRouter({
      primaryProvider: failingGemini,
      fallbackProvider: workingGroq,
      enableFallback: true,
      maxRetriesPerProvider: 0 // No retry so we verify exactly 1 fallback call
    });

    const result = await router.routeRecommendation({
      baseline: { id: 'b_test' },
      candidates: [{ id: 'cand_rec' }, { id: 'cand_usual' }],
      evidenceIds: ['ev_cams_1']
    });

    expect(geminiCalls).toBe(1);
    expect(groqCalls).toBe(1);
    expect(result.fallbackTriggered).toBe(true);
    expect(result.fallbackReason).toContain('429');
    expect(result.provider).toBe('groq');
    expect(result.model).toBe('openai/gpt-oss-120b');
    expect(result.rankedCandidateIds).toEqual(['cand_rec', 'cand_usual']);
    expect(result.degradedMode).toBe(false);
  });

  it('rejects an invalid Groq response through semantic validator and falls back to deterministic', async () => {
    const failingGemini = {
      model: 'gemini-2.5-flash',
      generateRankedRecommendation: async () => {
        const err = new Error('Gemini 503 Service Unavailable');
        err.status = 503;
        err.retryable = true;
        throw err;
      }
    };

    // Groq returns candidate IDs NOT in allowlist
    const invalidGroq = {
      model: 'openai/gpt-oss-120b',
      generateRankedRecommendation: async () => ({
        provider: 'groq',
        model: 'openai/gpt-oss-120b',
        output: {
          rankedCandidateIds: ['hallucinated_candidate_xyz'],
          reasonCodes: ['SOME_REASON'],
          evidenceIds: ['ev_cams_1'],
          explanation: 'Hallucinated candidate ranking.'
        }
      })
    };

    const router = new ModelRouter({
      primaryProvider: failingGemini,
      fallbackProvider: invalidGroq,
      enableFallback: true,
      maxRetriesPerProvider: 0
    });

    const result = await router.routeRecommendation({
      baseline: { id: 'b_test' },
      candidates: [{ id: 'cand_01' }, { id: 'cand_02' }],
      evidenceIds: ['ev_cams_1']
    });

    expect(result.fallbackTriggered).toBe(true);
    expect(result.provider).toBe('deterministic_fallback');
    expect(result.degradedMode).toBe(true);
    expect(result.rankedCandidateIds).toEqual(['cand_01', 'cand_02']);
  });

  it('rejects prohibited personal dose claims in LLM explanation', async () => {
    const prohibitedClaimGemini = {
      model: 'gemini-2.5-flash',
      generateRankedRecommendation: async () => ({
        provider: 'google',
        model: 'gemini-2.5-flash',
        output: {
          rankedCandidateIds: ['cand_01'],
          reasonCodes: ['CLEAN_WINDOW'],
          evidenceIds: ['ev_1'],
          explanation: 'This route will reduce your personal inhaled dose by 45% and prevent lung disease.'
        }
      })
    };

    const router = new ModelRouter({
      primaryProvider: prohibitedClaimGemini,
      enableFallback: false
    });

    const result = await router.routeRecommendation({
      baseline: { id: 'b_test' },
      candidates: [{ id: 'cand_01' }],
      evidenceIds: ['ev_1']
    });

    // Semantic validator catches prohibited health claim, router defaults safely
    expect(result.provider).toBe('deterministic_fallback');
    expect(result.degradedMode).toBe(true);
  });

  it('falls back to deterministic engine when both AI providers fail', async () => {
    const failingGemini = {
      model: 'gemini-2.5-flash',
      generateRankedRecommendation: async () => {
        throw new Error('Gemini unavailable');
      }
    };
    const failingGroq = {
      model: 'openai/gpt-oss-120b',
      generateRankedRecommendation: async () => {
        throw new Error('Groq unavailable');
      }
    };

    const router = new ModelRouter({
      primaryProvider: failingGemini,
      fallbackProvider: failingGroq,
      enableFallback: true
    });

    const result = await router.routeRecommendation({
      baseline: { id: 'b1' },
      candidates: [{ id: 'c1' }, { id: 'c2' }],
      evidenceIds: []
    });

    expect(result.fallbackTriggered).toBe(true);
    expect(result.provider).toBe('deterministic_fallback');
    expect(result.degradedMode).toBe(true);
    expect(result.rankedCandidateIds).toEqual(['c1', 'c2']);
  });

  it('primary circuit breaker trips to OPEN after threshold failures', async () => {
    let attempts = 0;
    const failingGemini = {
      model: 'gemini-2.5-flash',
      generateRankedRecommendation: async () => {
        attempts++;
        const err = new Error('500 Internal Server Error');
        err.status = 500;
        err.retryable = true;
        throw err;
      }
    };

    const router = new ModelRouter({
      primaryProvider: failingGemini,
      enableFallback: false,
      maxRetriesPerProvider: 0
    });

    // Trigger 3 failures
    for (let i = 0; i < 3; i++) {
      await router.routeRecommendation({ baseline: { id: 'b1' }, candidates: [{ id: 'c1' }] });
    }
    expect(attempts).toBe(3);
    expect(router.primaryBreaker.state).toBe('OPEN');

    // 4th call should NOT call gemini at all (circuit breaker is OPEN)
    const result = await router.routeRecommendation({ baseline: { id: 'b1' }, candidates: [{ id: 'c1' }] });
    expect(attempts).toBe(3); // untouched
    expect(result.fallbackReason).toContain('circuit breaker OPEN');
  });

  it('correctly consumes err.retryAfter on transient error during retry', async () => {
    let callCount = 0;
    const retryProvider = {
      model: 'test-model',
      generateRankedRecommendation: async () => {
        callCount++;
        if (callCount === 1) {
          const err = new Error('Rate limit with Retry-After');
          err.status = 429;
          err.retryable = true;
          err.retryAfter = '1'; // 1 second
          throw err;
        }
        return {
          provider: 'test',
          model: 'test-model',
          output: {
            rankedCandidateIds: ['cand_rec'],
            reasonCodes: ['LOWER_EXPOSURE_WINDOW'],
            evidenceIds: ['ev_1'],
            explanation: 'Clean shift.'
          }
        };
      }
    };

    const router = new ModelRouter({
      primaryProvider: retryProvider,
      enableFallback: false,
      maxRetriesPerProvider: 1
    });

    const start = Date.now();
    const res = await router.routeRecommendation({
      baseline: { id: 'b' },
      candidates: [{ id: 'cand_rec' }],
      evidenceIds: ['ev_1']
    });

    const elapsed = Date.now() - start;
    expect(callCount).toBe(2);
    expect(elapsed).toBeGreaterThanOrEqual(900); // Respects the 1s backoff from retryAfter
    expect(res.provider).toBe('google');
  });
});
