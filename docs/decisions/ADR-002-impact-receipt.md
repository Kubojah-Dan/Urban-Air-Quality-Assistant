# ADR-002: Three-Channel Impact Receipt Architecture

## Status
Accepted

## Context
Generic air apps often show a single arbitrary "clean air score" or conflate outdoor AQI changes with personal inhaled doses or carbon emission savings. Such claims are scientifically indefensible without personal ventilation data and micro-environment sensors.

## Decision
Every recommended routine option provides an **Impact Receipt** with three distinct, non-conflated channels:
1. **Outdoor Air Context**: Relative outdoor pollutant windows, grid resolution, and validity time.
2. **Indoor Air Action**: Reviewed mechanical or behavioural action (source control, exhaust, filtration).
3. **Emissions Estimate**: Bounded calculation (e.g. avoided tailpipe CO2) based strictly on verified, regional emission factors. If no matching factor exists, it reports "not estimated" rather than zero.

## Consequences
- Prevents misleading claims.
- Maintains scientific and ethical transparency.
