# ADR-004: Location Privacy and Data Minimization

## Status
Accepted

## Context
Air quality applications frequently demand continuous GPS location and full residential addresses, creating unnecessary surveillance risks and violating privacy-by-design principles.

## Decision
1. DayShift defaults to manual city and district selection.
2. Geolocation coordinates are never requested on startup or persisted to disk.
3. Queries use coarse centroids of selected municipalities.
4. User routines are kept in-session by default; persistence requires explicit opt-in authentication.

## Consequences
- Maximum privacy compliance with DPDP 2023 / GDPR principles.
- Low barrier to entry for guest users.
