# ADR-001: Pure JavaScript Monorepo with Strict Runtime Contracts

## Status
Accepted

## Context
The project guidelines mandate standard JavaScript (ES6+) and JSX without TypeScript (.ts/.tsx). However, strict type and schema integrity is required across web, api, and domain packages to eliminate runtime defects.

## Decision
1. We use a pnpm workspace monorepo.
2. We enforce runtime contracts using **Zod** (`packages/contracts`) at every boundary: HTTP API, provider adapters, and GenAI structured outputs.
3. We document public functions and domain interfaces using descriptive JSDoc type annotations.
4. We enforce pure domain isolation: domain packages have zero dependencies on frameworks, databases, or cloud SDKs.

## Consequences
- High development velocity without TypeScript compilation overhead.
- Strong runtime safety at boundaries.
