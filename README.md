# DayShift — Constraint-Aware Urban Air Quality Assistant

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](file:///d:/DayShift/Urban-Air-Quality-Assistant)
[![Tests](https://img.shields.io/badge/tests-65%2F65%20passing-brightgreen.svg)](file:///d:/DayShift/Urban-Air-Quality-Assistant/tests)
[![Code Style](https://img.shields.io/badge/code%20style-pure%20JavaScript%20ES6+-blue.svg)](file:///d:/DayShift/Urban-Air-Quality-Assistant)
[![Accessibility](https://img.shields.io/badge/accessibility-WCAG%202.2%20AA-success.svg)](file:///d:/DayShift/Urban-Air-Quality-Assistant/docs/ACCESSIBILITY.md)
[![Privacy](https://img.shields.io/badge/privacy-DPDP%20Act%202023%20%2F%20GDPR-blueviolet.svg)](file:///d:/DayShift/Urban-Air-Quality-Assistant/apps/web/src/features/preferences/pages/PrivacySettingsPage.jsx)
[![License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](file:///d:/DayShift/Urban-Air-Quality-Assistant/LICENSE)

> **PromptWars / Hack2Skill Challenge 6**  
> An evidence-aware daily routine planner that delivers realistic, constraint-aware cleaner-air choices without demanding continuous GPS tracking, expensive air purifiers, or complete lifestyle disruption.

---

## 1. Executive Summary & The Core Dilemma

Most air quality applications are passive dashboards. They present colorful heatmaps, global AQI gauges, and generic health warnings—such as *"Air quality is unhealthy: stay indoors and avoid exertion."*

For urban commuters with fixed work hours, students with mandatory exam schedules, and apartment renters without HVAC controls, **staying indoors is not an option**.

DayShift answers the real question urban residents face every morning:
> **“Here is what I actually need to do today. What is one realistic change I can make, what will it actually improve, and what should I do if conditions change?”**

### Core Differentiators

```
+---------------------------------------------------------------------------------------------------+
|                                  THE DAYSHIFT DECISION LOOP                                       |
|                                                                                                   |
|  [ Coarse City Context ]        [ User Stated Constraints ]       [ Live Evidence Ingestion ]     |
|   Coimbatore, Delhi, Chennai      Commute window, fixed hours       Copernicus CAMS, AirNow, CPCB |
|            |                                |                                   |                 |
|            +--------------------------------+-----------------------------------+                 |
|                                             |                                                     |
|                                             v                                                     |
|                        [ Deterministic Candidate Engine ]                                         |
|                         • Generates baseline usual plan                                           |
|                         • Filters out infeasible options before AI                                |
|                         • Applies ARAI 2024 / EPA MOVES 2024 emissions registry                   |
|                                             |                                                     |
|                                             v                                                     |
|                     [ Dual-Provider GenAI Gateway + Safeguards ]                                  |
|                      Gemini 2.5 Flash (primary) -> Groq (fallback)                                |
|                      Semantic allowlist validator & safety policy guardrails                      |
|                                             |                                                     |
|                                             v                                                     |
|                                  [ The Today Board ]                                              |
|            +--------------------------------+----------------------------------+                  |
|            |                                |                                  |                  |
|    (1) Usual Plan Baseline      (2) One Recommended Change             (3) Practical Backup       |
|    Your unaltered routine        Highest-value feasible shift           Weather/schedule failover |
|                                             |                                                     |
|                                             v                                                     |
|                                  [ 3-Channel Impact Receipt ]                                     |
|                      Outdoor Context  |  Indoor Mechanism  |  Emissions Delta                     |
|                                (NEVER collapsed or conflated)                                     |
+---------------------------------------------------------------------------------------------------+
```

1. **3-Option Comparison Hero Board:**
   - **(1) Usual Plan (Baseline):** The user's unaltered schedule, preserving all fixed constraints.
   - **(2) One Feasible Recommended Change:** Subtle visual emphasis highlighting the single highest-value feasible adjustment supported by current evidence (e.g. leaving 30 minutes earlier to beat the morning inversion layer, or switching vehicle ventilation to AC recirculation).
   - **(3) Practical Backup Plan:** A dependable contingency option if the primary recommendation becomes impossible.

2. **3-Channel Impact Receipt (No Scientific Conflation):**
   - **Channel 1 (Outdoor Air Context):** Real ambient PM₂.₅ concentration, forecast trajectory, and explicit scientific boundary (*"Ambient concentration is not an individual's personal inhaled dose"*).
   - **Channel 2 (Indoor / In-Cabin Action Mechanism):** Verified source-control, filtration, or ventilation mechanisms and their strict preconditions (e.g., cabin HEPA filter + recirculation, or vented kitchen range hood).
   - **Channel 3 (Emissions Estimate):** Verified tailpipe CO₂/PM delta calculated via official ARAI 2024 (India) and EPA MOVES 2024 (US) factor registries. Marked strictly `not_estimated` when no tailpipe change occurred.
   - **The Anti-Conflation Rule:** These channels are **never** combined into a fabricated "Clean Air Score". A low-carbon trip is not necessarily a low-exposure trip.

3. **In-Place Scoped Replanning ("What If...?" Assistant):**
   - When the user asks a question or changes a constraint (e.g., *"Can I leave 30 minutes earlier?"* or *"What if I take the metro?"*), DayShift updates **only** the affected candidate. The baseline usual plan stays locked, and a transparent revision badge details exactly what changed.

4. **Honest Data Provenance & Degraded-Mode Transparency:**
   - Every observation, forecast, or station reading carries its timestamp, provider credit, and data-quality status badge (`observation`, `forecast`, `preliminary`, `stale`, or `no_coverage`). Zero hardcoded dummy readings.

5. **Privacy by Design & DPDP Act 2023 Compliance:**
   - Coarse city/neighborhood resolution only. **Zero background GPS tracking.**
   - 100% functional for guests with no account required.
   - Full implementation of the **Right to Erasure** (`DELETE /api/v1/preferences`) and **Right to Data Portability** (`GET /api/v1/preferences/export`).

---

## 2. Project Architecture & Monorepo Structure

DayShift is built as a pure JavaScript (ES6+) pnpm monorepo enforcing Clean Architecture boundaries. All contracts between packages and API boundaries are validated at runtime with Zod schemas.

```
DayShift/
├── apps/
│   ├── web/                                  # React 19 + Vite client (WCAG 2.2 AA)
│   │   ├── public/                           # Manifest, icons, accessible SVGs
│   │   ├── src/
│   │   │   ├── app/                          # App root, React Router, QueryClient, Providers
│   │   │   ├── features/
│   │   │   │   ├── start/                    # Coarse city picker & routine entry
│   │   │   │   ├── routine/                  # Hero DecisionBoard & OptionCards
│   │   │   │   ├── forecast/                 # Copernicus CAMS PM2.5 hourly timeline & table
│   │   │   │   ├── impact/                   # 3-channel ImpactReceipt & disclosures
│   │   │   │   ├── assistant/                # In-place "What If...?" replanner drawer
│   │   │   │   ├── indoor/                   # Reviewed indoor action coach & CO alarm
│   │   │   │   ├── preferences/              # DPDP Act privacy settings & data export
│   │   │   │   └── shared/                   # Status badges, TopBar, state components
│   │   │   ├── infrastructure/               # HTTP client (transport only), telemetry
│   │   │   └── styles/                       # Accessible color tokens & Tailwind CSS
│   │   └── vite.config.js
│   │
│   └── api/                                  # Node.js + Express Clean Architecture server
│       ├── src/
│       │   ├── composition/                  # Dependency injection container (createContainer.js)
│       │   ├── routes/                       # Express routes (airQuality, recommendation, indoor, preferences)
│       │   ├── middleware/                   # Rate limiting, authz, security headers, log redaction
│       │   ├── application/                  # Use cases (getAirEvidence, createRecommendation, reviseRecommendation)
│       │   ├── ports/                        # Abstract interfaces (AirQualityProvider, ModelProvider, CacheStore)
│       │   ├── infrastructure/
│       │   │   ├── data-sources/             # CAMS/Open-Meteo, AirNow, CPCB adapters & mappers
│       │   │   ├── ai/                       # Gemini 2.5 Flash, Groq fallback, circuit breaker, semantic validator
│       │   │   ├── cache/                    # RedisCacheStore (ioredis) & RequestCoalescer
│       │   │   ├── quota/                    # RedisQuotaStore (distributed rate limiting)
│       │   │   ├── persistence/              # FirestorePreferenceRepository (isolated per-user storage)
│       │   │   └── secrets/                  # Google Secret Manager provider
│       │   └── observability/                # Structured logger with recursive PII redaction
│       └── server.js
│
├── packages/
│   ├── contracts/                            # Shared Zod schemas (API, evidence, candidate, receipt)
│   ├── domain/                               # Pure business logic (freshness, routine constraints, safety policy)
│   ├── guidance/                             # Reviewed indoor protocols (EPA/WHO) & CO escalation
│   └── emissions/                            # Verified ARAI 2024 & EPA MOVES 2024 emission factors
│
├── tests/                                    # Automated Vitest test suite (65 tests across 21 files)
│   ├── unit/                                 # Unit tests (constraints, freshness, emissions boundaries, AQI units)
│   ├── integration/                          # Integration tests (live AI providers, failover, upstream smoke, UI flow)
│   ├── security/                             # Security tests (per-user authz, log redaction, prompt injection)
│   ├── accessibility/                        # A11y tests (dialog focus trap, Tab/Shift+Tab, Escape restore)
│   └── performance/                          # Latency benchmarks, cache coalescing & k6 load test script
│
├── docs/
│   ├── ACCESSIBILITY.md                      # WCAG 2.2 AA contrast matrix, keyboard journeys & screen reader spec
│   ├── EVALUATION_TRACEABILITY.md            # Traceability matrix mapping requirements to code & tests
│   └── adr/                                  # Architectural Decision Records (ADR 001 - ADR 005)
│
├── firestore.rules                           # Strict per-user Firestore isolation & server collection protection
├── eslint.config.js                          # ESLint 9 flat configuration (0 errors, 0 warnings)
└── package.json                              # pnpm workspace configuration
```

---

## 3. Technology Stack & Design Decisions

| Layer | Technologies Selected | Rationale & Boundaries |
|---|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, TanStack Query | Fast client rendering, accessible semantic HTML5, zero TypeScript (`.js`/`.jsx` only). |
| **Backend** | Node.js (v20+), Express, Google Genkit | Clean Architecture with pure domain separation and dependency injection. |
| **GenAI Primary** | Google Gemini (`gemini-2.5-flash`) | Fast, structured JSON generation for candidate trade-off explanations. |
| **GenAI Fallback** | Groq (`openai/gpt-oss-120b`) | Automatic failover when Gemini encounters rate limits (HTTP 429) or transient errors. |
| **Deterministic Fallback** | Pure Domain Candidate Engine | Instant, rule-based fallback if all AI providers fail or trip the circuit breaker. |
| **Data Sources** | Copernicus CAMS / Open-Meteo, AirNow, CPCB | Real hourly PM₂.₅ forecasts and regulatory station readings with honest provenance. |
| **Cache & Quota** | Redis (`ioredis`) + In-Memory Fallback | Dual-mode distributed caching for Cloud Run with automatic memory fallback for local dev. |
| **Persistence** | Google Cloud Firestore | Per-user document isolation (`users/{userId}/*`), denying direct client writes to server data. |
| **Secrets** | Google Secret Manager + `.env` | Server-side only; zero client bundle leakage. |

---

## 4. Getting Started & Installation

### Prerequisites
- **Node.js**: `v20.0.0` or higher
- **pnpm**: `v9.0.0` or higher (`npm install -g pnpm`)

### 1. Clone & Install
```bash
git clone https://github.com/your-org/Urban-Air-Quality-Assistant.git
cd Urban-Air-Quality-Assistant
pnpm install
```

### 2. Configure Environment Variables
Copy the template to `.env` in the repository root:
```bash
cp .env.example .env
```

Open `.env` and configure your credentials:
```ini
# Server Configuration
PORT=8080
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

# AI Model Configuration (GenAI Gateway)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b

# Environmental Data Source Credentials
AIRNOW_API_KEY=your_airnow_api_key_here
CPCB_API_KEY=your_data_gov_in_api_key_here
# Open-Meteo / Copernicus CAMS requires no API key (CC BY 4.0 attributed)

# Optional Distributed Cache & Storage
REDIS_URL=rediss://default:your_token@your_redis_host:6379
FIREBASE_PROJECT_ID=your_firebase_project_id
```
*(Note: If AI or environmental keys are left blank, DayShift automatically and transparently operates in its verified deterministic fallback mode with real CAMS forecasts).*

---

## 5. Running the Application

### Development Mode (Concurrent)
To run both backend API and frontend client together:

Open **Terminal 1** (Backend API):
```bash
pnpm --filter @dayshift/api dev
```
> API starts at `http://localhost:8080` (Health check at `http://localhost:8080/api/v1/health`).

Open **Terminal 2** (Frontend Web Client):
```bash
pnpm --filter @dayshift/web dev
```
> Web client starts at `http://localhost:5173`. Open this URL in your browser.

---

## 6. Testing & Quality Assurance

DayShift features an exhaustive, multi-layered automated test suite ensuring reliability, safety, accessibility, and high performance.

### Run All 65 Tests
```bash
pnpm test
```

### Run Specific Test Modules
```bash
# End-to-end full UI user journey flow
pnpm vitest run tests/integration/phase5-ui-flow.test.js

# Live AI provider connectivity & schema verification
pnpm vitest run tests/integration/ai-live-providers.test.js

# Dual-provider failover, semantic allowlist validation & circuit breaker
pnpm vitest run tests/integration/ai-failover.test.js

# Real environmental upstream smoke tests (CAMS, AirNow, CPCB)
pnpm vitest run tests/integration/upstream-smoke.test.js

# Security, authorization & log redaction
pnpm vitest run tests/security/

# Accessibility focus traps & keyboard navigation
pnpm vitest run tests/accessibility/

# Performance, sub-millisecond cache hits & request coalescing
pnpm vitest run tests/performance/latency.test.js
```

### Code Quality & Static Analysis
```bash
# Run ESLint (must be 0 errors, 0 warnings)
pnpm lint

# Production bundle build
pnpm build
```

### Load Testing (k6)
Simulate peak concurrent morning commute requests:
```bash
k6 run tests/performance/api-load.js
```

---

## 7. Interactive Feature Tour

### 1. Decision Entry & Coarse City Picker
- Select an urban area: **Delhi**, **Coimbatore**, **Chennai**, **Bengaluru**, **Mumbai**, or **San Francisco**.
- Choose your primary decision category:
  - **Commute:** Work, university, school, or errands.
  - **Outdoor Activity:** Exercise, sports, walking, or playground visits.
  - **Indoor Air:** Cooking, room ventilation, or sleep comfort.
- Provide coarse routine inputs (departure window, mode of travel, flexibility).

### 2. The Hero Decision Board
- Examine the 3 clear choices:
  1. **Usual Plan:** Your baseline routine with computed emissions and ambient air exposure.
  2. **Recommended Change:** One high-impact, realistic change (e.g. shift commute 30 mins earlier, switch car cabin ventilation to AC recirculation).
  3. **Practical Backup:** Contingency plan if meetings or transit delays prevent the primary change.
- Review transparent **AI Trade-Off Explanations** and **Reason Code Badges**.

### 3. The 3-Channel Impact Receipt
- **Channel 1 (Outdoor Air Context):** Real hourly PM₂.₅ level with qualitative band (Good, Satisfactory, Moderate, Poor, Very Poor, Severe).
- **Channel 2 (Indoor / In-Cabin Mechanism):** Action mechanisms backed by reviewed EPA/WHO science (cabin filtration, HEPA circulation, source control).
- **Channel 3 (Emissions Delta):** Verified tailpipe CO₂/PM reductions computed against ARAI 2024 / EPA MOVES 2024 factors.
- Expand the **Scientific Assumptions & Unknowns** disclosure drawer to see what is known, estimated, and unmodeled.

### 4. Hourly Forecast Day-Strip
- Hourly visual PM₂.₅ forecast timeline from Copernicus CAMS.
- One-click toggle to an accessible **Data Table View** for screen-reader users.

### 5. "What If...?" Scoped Replanner
- Use quick preset chips (*"Can I leave 30 minutes earlier?"*, *"What if I take the metro?"*) or free-form queries.
- DayShift executes a **scoped revision**: only the affected candidate changes in-place; the baseline remains untouched.

### 6. Reviewed Indoor Action Coach & Emergency Escalation
- Toggle household context factors: active cooking, vented range hood, combustion fragrances.
- Test the **CO Emergency Alarm Trigger**: immediately displays life-safety emergency protocols (evacuate immediately, call emergency services 112 / 911).

### 7. Privacy & Data Rights Center (DPDP Act 2023)
- Click **"Privacy & Rights"** in the top navigation bar.
- **Opt-in Storage:** Routine persistence is strictly opt-in (disabled by default).
- **Right to Portability:** Click *"Export My Data (JSON)"* to instantly download an offline machine-readable copy.
- **Right to Erasure:** Click *"Delete Stored Preferences"* to purge all persisted data from servers.

---

## 8. Scientific & Regulatory Citations

All data and guidance models in DayShift adhere to official scientific literature and regulatory methodologies:

- **Ambient Forecasts:** European Centre for Medium-Range Weather Forecasts (ECMWF) Copernicus Atmosphere Monitoring Service (CAMS) via Open-Meteo API. Used under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- **Regulatory Monitoring:**
  - United States: EPA AirNow API (Clean Air Act regulatory monitoring network).
  - India: Central Pollution Control Board (CPCB) National Ambient Air Quality Standards (NAAQS) via Data.gov.in.
- **Vehicle Emissions Registries:**
  - India: Automotive Research Association of India (ARAI 2024 emission factors by vehicle category, fuel, and Euro/BS compliance).
  - United States: EPA Motor Vehicle Emission Simulator (MOVES 2024).
- **Indoor Air Quality Protocols:** US EPA Indoor Air Quality Guidelines and World Health Organization (WHO 2021) Global Air Quality Guidelines.
- **Privacy & Data Protection:** Digital Personal Data Protection (DPDP) Act 2023 (India) and General Data Protection Regulation (GDPR) Art. 17 & 20.

---

## 9. License

This project is licensed under the [MIT License](LICENSE).
Open-Meteo weather and air quality data is credited to ECMWF Copernicus Atmosphere Monitoring Service under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
