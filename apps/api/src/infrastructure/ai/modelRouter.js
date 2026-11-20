import { CircuitBreaker } from './circuitBreaker.js';
import { logger } from '../../observability/logger.js';

export class ModelRouter {
  constructor({ primaryProvider, fallbackProvider, enableFallback = true }) {
    this.primaryProvider = primaryProvider;
    this.fallbackProvider = fallbackProvider;
    this.enableFallback = enableFallback;
    this.primaryBreaker = new CircuitBreaker();
    this.fallbackBreaker = new CircuitBreaker();
  }

  async routeRecommendation(input) {
    let fallbackTriggered = false;
    let fallbackReason = null;

    if (this.primaryBreaker.canExecute()) {
      try {
        const result = await this.primaryProvider.generateRankedRecommendation(input);
        this.primaryBreaker.recordSuccess();
        return {
          ...result,
          fallbackTriggered: false
        };
      } catch (err) {
        this.primaryBreaker.recordFailure();
        fallbackTriggered = true;
        fallbackReason = `Primary provider failure: ${err.message}`;
        logger.warn('Gemini primary failed, attempting fallback', { reason: err.message });
      }
    } else {
      fallbackTriggered = true;
      fallbackReason = 'Primary circuit breaker OPEN';
    }

    if (this.enableFallback && this.fallbackProvider && this.fallbackBreaker.canExecute()) {
      try {
        const result = await this.fallbackProvider.generateRankedRecommendation(input);
        this.fallbackBreaker.recordSuccess();
        return {
          ...result,
          fallbackTriggered,
          fallbackReason
        };
      } catch (fallbackErr) {
        this.fallbackBreaker.recordFailure();
        logger.error('Groq fallback failed', fallbackErr);
      }
    }

    // Deterministic fallback mode
    return {
      provider: 'deterministic_fallback',
      model: 'rule-engine-v1',
      fallbackTriggered: true,
      fallbackReason: fallbackReason || 'All AI providers unavailable',
      rankedCandidateIds: input.candidates ? input.candidates.map((c) => c.id) : [],
      explanation: 'AI explanation is temporarily unavailable. Showing rule-based cleaner-air options.'
    };
  }
}
