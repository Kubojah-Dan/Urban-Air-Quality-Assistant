# DayShift System Architecture

## 1. Architectural Philosophy
DayShift follows Clean Architecture / Hexagonal Architecture (Ports and Adapters):
- **Core Domain Isolation**: Pure JavaScript business rules (freshness, constraints, emissions calculation, safety rules) have zero dependencies on frameworks, databases, or external APIs.
- **Dependency Inversion**: Application use-cases interact with abstract Ports. Adapters in the infrastructure layer implement these ports (Open-Meteo, AirNow, CPCB, Genkit AI, Redis cache).
- **Strict Boundary Validation**: Zod contracts validate data at every untrusted boundary: HTTP ingress, third-party provider responses, and GenAI structured outputs.

## 2. Monorepo Structure
- `apps/web`: React + Vite SPA using TanStack Query, Tailwind CSS, Lucide React, and feature-owned API clients.
- `apps/api`: Node.js + Express.js API server exposing REST endpoints, orchestrated by use-cases and dependency-injected containers.
- `packages/contracts`: Shared Zod schemas ensuring runtime type safety and contract consistency.
- `packages/domain`: Pure mathematical and policy logic for routine feasibility, freshness calculation, emissions, and safety.
- `packages/guidance`: Reviewed, versioned indoor guidance content and emergency escalation policies.
- `packages/ai`: Versioned prompt templates, ranking schemas, and evaluation sets.
- `packages/data-sources`: Capabilities registry and normalizers for air-quality data providers.
- `packages/config`: Shared tool configurations (ESLint, Prettier, Vitest).
- `packages/shared`: Shared utilities across backend and frontend.

## 3. Composition Root
The dependency injection container (`apps/api/src/composition/createContainer.js`) instantiates real or test adapters and wires them to application use cases. No business logic directly instantiates network clients or credentials.
