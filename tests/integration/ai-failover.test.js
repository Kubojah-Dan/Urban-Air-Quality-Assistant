import { describe, it, expect } from 'vitest';
import { ModelRouter } from '../../apps/api/src/infrastructure/ai/modelRouter.js';

describe('AI Dual-Provider Failover', () => {
  it('falls back from Gemini to Groq on transient failure', async () => {
    const failingGemini = {
      generateRankedRecommendation: async () => {
        const err = new Error('Gemini 429 Resource Exhausted');
        err.status = 429;
        throw err;
      }
    };

    const workingGroq = {
      generateRankedRecommendation: async () => ({
        provider: 'groq',
        model: 'openai/gpt-oss-120b',
        rankedCandidateIds: ['c_rec', 'c_usual']
      })
    };

    const router = new ModelRouter({
      primaryProvider: failingGemini,
      fallbackProvider: workingGroq,
      enableFallback: true
    });

    const result = await router.routeRecommendation({ candidates: [{ id: 'c_rec' }, { id: 'c_usual' }] });
    expect(result.fallbackTriggered).toBe(true);
    expect(result.provider).toBe('groq');
  });

  it('falls back to deterministic engine when both AI providers fail', async () => {
    const failingGemini = {
      generateRankedRecommendation: async () => {
        throw new Error('Gemini unavailable');
      }
    };
    const failingGroq = {
      generateRankedRecommendation: async () => {
        throw new Error('Groq unavailable');
      }
    };

    const router = new ModelRouter({
      primaryProvider: failingGemini,
      fallbackProvider: failingGroq,
      enableFallback: true
    });

    const result = await router.routeRecommendation({ candidates: [{ id: 'c1' }, { id: 'c2' }] });
    expect(result.fallbackTriggered).toBe(true);
    expect(result.provider).toBe('deterministic_fallback');
  });
});
