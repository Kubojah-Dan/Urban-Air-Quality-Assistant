# Privacy & Data Minimization Specification

## 1. Location Privacy
- **Manual City/Area Selection**: Users select their city or district from a curated public list or search.
- **No Continuous Tracking**: Background geolocation, GPS continuous tracking, home/work street addresses, and exact route coordinates are strictly prohibited in the MVP.
- **Coarse Resolution**: Internal queries operate on district or city centroids.

## 2. Health & Demographic Privacy
- **Zero Diagnosis Collection**: DayShift never asks for asthma, COPD, pregnancy, medication, pediatric details, or health records.
- **Abstract Caution Preferences**: Users may select an optional "cautious outdoor planning" toggle without disclosing medical reasons.

## 3. Routine Data Minimization
- **Session-First**: Daily plans are held in client-side memory by default.
- **Opt-in Storage**: Routines are only persisted if the user explicitly signs in and requests profile saving.
- **Redacted Telemetry**: Server logs redact prompts, routines, and user IDs. Only operational metrics (latency, HTTP status, token counts, provider fallback reasons) are logged.
