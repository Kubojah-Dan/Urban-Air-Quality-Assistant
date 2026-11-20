# ADR-003: Dual Model Provider Architecture (Gemini Primary, Groq Fallback)

## Status
Accepted

## Context
High-traffic and latency-sensitive user routine recommendations require reliable AI interpretation and ranking. Single-provider dependencies risk downtime during rate limiting (429) or transient cloud errors.

## Decision
1. **Google Gemini** is the primary provider via `@genkit-ai/google-genai`.
2. **Groq** serves as transient failover capacity via `@genkit-ai/compat-oai`.
3. Failover triggers only on eligible transient failures (HTTP 429, retryable 5xx, timeouts).
4. Both providers consume identical minimized context contracts and validate against the same Zod output schema.
5. If both providers fail, a deterministic ranking engine serves the request in degraded mode.

## Consequences
- High resilience and predictable degraded behavior.
- Clean separation between GenAI ranking and deterministic math.
