# Test Strategy & Quality Assurance Matrix

## 1. Test Levels
- **Unit Tests (`tests/unit/`, `packages/*/tests/`)**:
  - Pure domain rules: AQI units, timestamp freshness, routine constraints, emissions factor calculation, safety policy invariants.
- **Integration Tests (`tests/integration/`)**:
  - Provider contracts: Schema validation of upstream responses against mock fixtures.
  - Failover testing: Simulation of Gemini 429/timeout with fallback to Groq.
  - Cache and quota testing: TTL verification and request coalescing.
- **Security & Privacy Tests (`tests/security/`)**:
  - Authorization isolation (owner checks).
  - Prompt injection resilience and boundary defence.
  - Payload minimization and log redaction verification.
- **Accessibility Tests (`tests/accessibility/`)**:
  - Playwright + axe-core automated audit.
  - Keyboard navigation and focus restoration spec.
- **End-to-End Tests (`tests/e2e/`)**:
  - Commuter journey with constraint revisions.
  - Indoor guidance coach flow.
  - Degraded mode and stale data handling.
- **Performance Tests (`tests/performance/`)**:
  - k6 load testing for concurrency, cache hit ratios, and p95 latency.
