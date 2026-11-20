# DayShift Antigravity Handoff Kit

This folder contains the implementation handoff for DayShift.

- `DESIGN.md` — merged product, domain, privacy, data-source, GenAI, architecture, stack and evaluation design.
- `PHASE.md` — seven build phases with exit criteria.
- `PROMPT.md` — master instruction for Google Antigravity; start with Phase 1 only.
- `ARCHITECTURE.mmd` — standalone Mermaid architecture diagram.
- `.env.example` — safe configuration placeholders; contains no credentials.

## How to use

1. Create/open the DayShift repository in Google Antigravity.
2. Copy these four files into the repository root.
3. Open `PROMPT.md` and submit its instructions to Antigravity.
4. Ensure Antigravity reads `DESIGN.md` and `PHASE.md` before it writes code.
5. Complete and verify one phase before advancing.

## Important setup notes

- Source code must use JavaScript/JSX only; do not create TypeScript files.
- API keys belong on the server and should be kept in Secret Manager or an untracked local `.env` file.
- `Open-Meteo` free API use is non-commercial and requires CC BY 4.0 attribution. Verify whether the intended public demo falls within the free terms.
- AirNow is only for U.S. reporting-area air-quality data. India needs the CPCB/data.gov.in source when available.
- Gemini and Groq model IDs, availability, context limits and quotas must be checked at implementation time.
