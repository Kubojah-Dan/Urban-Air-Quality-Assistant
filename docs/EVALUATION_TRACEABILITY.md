# Evaluation Traceability Matrix

This document maps requirements and evaluation criteria to exact implementation files, tests, and acceptance proofs.

| Category | Requirement | Primary Implementation | Verification Test |
|---|---|---|---|
| Core Architecture | Hexagonal Ports & Adapters | `apps/api/src/composition/createContainer.js` | `apps/api/tests/health.test.js` |
| Domain Pure Logic | Freshness & Provenance Calculation | `packages/domain/src/quality/freshness.js` | `tests/unit/freshness.test.js` |
| Domain Pure Logic | Invariant Constraint Feasibility | `packages/domain/src/routine/constraints.js` | `tests/unit/routine-constraints.test.js` |
| Impact Receipt | Three Independent Impact Channels | `packages/domain/src/impact/emissions.js` | `tests/unit/emissions-boundaries.test.js` |
| Indoor Safety | Emergency Escalation (CO & Smoke) | `packages/domain/src/safety/indoorPolicy.js` | `tests/unit/safety-policy.test.js` |
| Provider Invariant | No Incompatible Averaging | `packages/data-sources/src/normalization.js` | `tests/unit/aqi-units.test.js` |
| AI Reliability | Dual Model Failover (Gemini -> Groq) | `apps/api/src/infrastructure/ai/modelRouter.js` | `tests/integration/ai-failover.test.js` |
| Security | Redacted Telemetry & Minimization | `apps/api/src/observability/logger.js` | `tests/security/log-redaction.test.js` |
| Accessibility | Keyboard-Only Navigation & WCAG AA | `apps/web/src/features/routine/components/DecisionBoard.jsx` | `tests/accessibility/keyboard-journey.spec.js` |
