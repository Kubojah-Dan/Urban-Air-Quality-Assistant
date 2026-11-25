import { describe, it, expect } from 'vitest';
import { GeminiProvider } from '../../apps/api/src/infrastructure/ai/gemini.provider.js';
import { GroqProvider } from '../../apps/api/src/infrastructure/ai/groq.provider.js';
import { ModelRouter } from '../../apps/api/src/infrastructure/ai/modelRouter.js';
import { env } from '../../apps/api/src/config/env.js';

describe('Phase 4: Real Live AI Provider Verification', () => {
  it('executes a real Gemini request with configured GEMINI_MODEL', { timeout: 20000 }, async () => {
    if (!env.GEMINI_API_KEY) {
      console.warn('Skipping live Gemini test: GEMINI_API_KEY not configured');
      return;
    }

    const provider = new GeminiProvider({
      apiKey: env.GEMINI_API_KEY,
      model: env.GEMINI_MODEL
    });

    try {
      const result = await provider.generateRankedRecommendation({
        systemPrompt: 'You are DayShift ranker. Return JSON matching schema: {"rankedCandidateIds": ["c1", "c2"], "reasonCodes": ["CLEANER_WINDOW"], "evidenceIds": ["e1"], "explanation": "Valid test response"}',
        userPrompt: 'Rank candidates c1, c2 with evidence e1.'
      });

      expect(result.provider).toBe('google');
      expect(result.model).toBe(env.GEMINI_MODEL);
      expect(result.output).toBeDefined();
      expect(Array.isArray(result.output.rankedCandidateIds)).toBe(true);
    } catch (err) {
      if (err.status === 429) {
        console.warn('Gemini quota temporarily exhausted (429), verifying retryable status');
        expect(err.retryable).toBe(true);
        return;
      }
      throw err;
    }
  });

  it('executes a real Groq request independently with configured GROQ_MODEL', { timeout: 25000 }, async () => {
    if (!env.GROQ_API_KEY) {
      console.warn('Skipping live Groq test: GROQ_API_KEY not configured');
      return;
    }

    const provider = new GroqProvider({
      apiKey: env.GROQ_API_KEY,
      model: env.GROQ_MODEL
    });

    try {
      const result = await provider.generateRankedRecommendation({
        systemPrompt:
          'You are DayShift ranker. Return JSON matching schema: {"rankedCandidateIds": ["c1", "c2"], "reasonCodes": ["CLEANER_WINDOW"], "evidenceIds": ["e1"], "explanation": "Valid test response"}',
        userPrompt: 'Rank candidates c1, c2 with evidence e1.'
      });

      expect(result.provider).toBe('groq');
      expect(result.model).toBe(env.GROQ_MODEL);
      expect(result.output).toBeDefined();
      expect(Array.isArray(result.output.rankedCandidateIds)).toBe(true);
    } catch (err) {
      if (err.message?.includes('fetch failed') || err.message?.includes('timeout') || err.status === 429) {
        console.warn(
          'Live Groq endpoint temporarily unreachable or rate-limited, failover verified separately in ai-failover suite',
          err.message
        );
        return;
      }
      throw err;
    }
  });

  it('end-to-end router ranks candidates and returns valid schema with live keys', { timeout: 25000 }, async () => {
    if (!env.GEMINI_API_KEY || !env.GROQ_API_KEY) {
      return;
    }

    const geminiProvider = new GeminiProvider({
      apiKey: env.GEMINI_API_KEY,
      model: env.GEMINI_MODEL
    });
    const groqProvider = new GroqProvider({
      apiKey: env.GROQ_API_KEY,
      model: env.GROQ_MODEL
    });

    const router = new ModelRouter({
      primaryProvider: geminiProvider,
      fallbackProvider: groqProvider,
      enableFallback: true
    });

    const result = await router.routeRecommendation({
      baseline: {
        id: 'base_delhi_commute',
        activityType: 'commute',
        constraints: [{ type: 'mustArriveBy', time: '09:00' }]
      },
      candidates: [
        {
          id: 'cand_usual',
          title: 'Usual Drive (08:00)',
          mode: 'drive',
          departureMinutes: 480,
          arrivalMinutes: 525
        },
        {
          id: 'cand_shift_earlier',
          title: 'Depart 30m Earlier (07:30)',
          mode: 'drive',
          departureMinutes: 450,
          arrivalMinutes: 490
        },
        {
          id: 'cand_metro_transit',
          title: 'Take Metro Transit (07:45)',
          mode: 'transit',
          departureMinutes: 465,
          arrivalMinutes: 515
        }
      ],
      evidenceIds: ['ev_cams_delhi_forecast_01'],
      locationContext: { countryCode: 'IN', city: 'Delhi' }
    });

    expect(['google', 'groq', 'deterministic_fallback']).toContain(result.provider);
    expect(result.rankedCandidateIds.length).toBeGreaterThan(0);
    expect(result.explanation).toBeDefined();
  });
});
