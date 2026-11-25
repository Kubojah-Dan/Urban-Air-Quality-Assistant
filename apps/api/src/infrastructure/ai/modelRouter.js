import { CircuitBreaker } from './circuitBreaker.js';
import { validateModelOutput } from './outputValidator.js';
import { buildRankCandidatesPrompt } from '@dayshift/ai';
import { logger } from '../../observability/logger.js';

export class ModelRouter {
  constructor({
    primaryProvider,
    fallbackProvider,
    enableFallback = true,
    maxRetriesPerProvider = 1
  }) {
    this.primaryProvider = primaryProvider;
    this.fallbackProvider = fallbackProvider;
    this.enableFallback = enableFallback;
    this.maxRetriesPerProvider = maxRetriesPerProvider;
    this.primaryBreaker = new CircuitBreaker();
    this.fallbackBreaker = new CircuitBreaker();
  }

  isRetryable(err) {
    if (!err) return false;
    if (err.retryable) return true;
    if (err.status === 429) return true;
    if (err.status >= 500 && err.status <= 504) return true;
    if (err.name === 'AbortError' || err.name === 'TimeoutError') return true;
    return false;
  }

  async _executeWithRetry(provider, promptPayload) {
    let lastError = null;
    const maxAttempts = 1 + Math.max(0, this.maxRetriesPerProvider);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await provider.generateRankedRecommendation(promptPayload);
      } catch (err) {
        lastError = err;
        const retryable = this.isRetryable(err);
        if (!retryable || attempt === maxAttempts) {
          throw err;
        }

        // Parse Retry-After (supplied directly on err.retryAfter by provider or via headers)
        let backoffMs = attempt * 300;
        const retryAfterVal =
          err?.retryAfter ||
          (err?.headers?.get && typeof err.headers.get === 'function'
            ? err.headers.get('retry-after')
            : err?.headers?.['retry-after']);

        if (retryAfterVal) {
          const parsedSeconds = parseInt(String(retryAfterVal), 10);
          if (!isNaN(parsedSeconds) && parsedSeconds > 0) {
            backoffMs = Math.min(2000, parsedSeconds * 1000);
          }
        }

        await new Promise((r) => setTimeout(r, backoffMs));
      }
    }
    throw lastError;
  }

  async routeRecommendation({ baseline, candidates = [], evidenceIds = [], locationContext = null }) {
    const eligibleCandidateIds = candidates.map((c) => c.id);
    const allowlistedEvidenceIds = evidenceIds;

    const promptPayload = buildRankCandidatesPrompt({
      baseline,
      candidates,
      evidenceIds: allowlistedEvidenceIds,
      locationContext
    });

    let fallbackReason = null;

    // 1. Try Gemini Primary Provider
    if (this.primaryProvider && this.primaryBreaker.canExecute()) {
      try {
        const result = await this._executeWithRetry(this.primaryProvider, promptPayload);
        const validation = validateModelOutput(result.output, eligibleCandidateIds, allowlistedEvidenceIds);
        if (validation.valid) {
          this.primaryBreaker.recordSuccess();
          return {
            ...validation.parsed,
            provider: 'google',
            model: result.model || this.primaryProvider.model,
            fallbackTriggered: false,
            degradedMode: false
          };
        }
        // Semantic validation failed — record circuit breaker failure
        this.primaryBreaker.recordFailure();
        logger.warn('Gemini primary failed semantic validation', { error: validation.error });
        fallbackReason = `Primary provider semantic validation failed: ${validation.error}`;
      } catch (err) {
        this.primaryBreaker.recordFailure();
        fallbackReason = `Primary provider failed (${err.status || err.name}): ${err.message}`;
        logger.warn('Gemini primary error, initiating fallback check', {
          status: err.status,
          message: err.message
        });
      }
    } else if (this.primaryProvider) {
      fallbackReason = 'Primary circuit breaker OPEN';
    }

    // 2. Try Groq Fallback Provider
    if (this.enableFallback && this.fallbackProvider && this.fallbackBreaker.canExecute()) {
      try {
        const result = await this._executeWithRetry(this.fallbackProvider, promptPayload);
        const validation = validateModelOutput(result.output, eligibleCandidateIds, allowlistedEvidenceIds);
        if (validation.valid) {
          this.fallbackBreaker.recordSuccess();
          return {
            ...validation.parsed,
            provider: 'groq',
            model: result.model || this.fallbackProvider.model,
            fallbackTriggered: true,
            fallbackReason,
            degradedMode: false
          };
        }
        logger.warn('Groq fallback failed semantic validation', { error: validation.error });
        this.fallbackBreaker.recordFailure();
        fallbackReason = `${fallbackReason || 'Primary failed'}; Groq semantic validation failed: ${validation.error}`;
      } catch (fallbackErr) {
        this.fallbackBreaker.recordFailure();
        logger.warn('Groq fallback failed', {
          status: fallbackErr.status,
          message: fallbackErr.message
        });
        fallbackReason = `${fallbackReason || 'Primary failed'}; Groq error: ${fallbackErr.message}`;
      }
    }

    // 3. Deterministic Fallback Mode (Both providers failed or unavailable)
    return {
      provider: 'deterministic_fallback',
      model: 'rule-engine-v1',
      fallbackTriggered: true,
      fallbackReason: fallbackReason || 'All AI providers unavailable or unconfigured',
      degradedMode: true,
      rankedCandidateIds: eligibleCandidateIds,
      reasonCodes: ['DETERMINISTIC_RULES_FALLBACK'],
      evidenceIds: allowlistedEvidenceIds,
      missingInputs: [],
      explanation:
        'AI contextual ranking is temporarily unavailable. Presenting deterministic cleaner-air candidate ordering.'
    };
  }
}
