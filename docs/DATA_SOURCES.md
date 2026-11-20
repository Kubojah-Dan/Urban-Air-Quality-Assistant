# Air Quality Data Sources & Provenance Policy

## 1. Supported Providers
- **Open-Meteo Air Quality (CAMS Global / Regional)**:
  - Global CAMS forecast (~45 km resolution, 3-hourly) used for India and global coverage.
  - Regional CAMS (~11 km resolution) used strictly where European coverage applies.
  - Always labelled as a numerical forecast model, never as a ground sensor.
- **AirNow (U.S. EPA)**:
  - Reporting-area AQI, forecasts, and action advisories for the United States.
  - Distinctly labels observations as "preliminary" and cites the reporting agency.
  - Uses the updated post-retirement API endpoints (June 2026 specifications).
- **CPCB / data.gov.in (India)**:
  - Official ground monitoring stations across Indian cities.
  - Cites station name, reporting timestamp, and sensor caveats. Does not claim universal city coverage.
- **OpenAQ (Optional corroboration)**:
  - Station-level corroboration when available; always labelled independently without averaging.

## 2. Invariants & Prohibitions
1. **No Incompatible Averaging**: Never average station observations with regional model forecasts.
2. **No Index Conflation**: U.S. EPA AQI (0-500) and India National AQI (NAQI) have different breakpoints and health categories. They must never be treated as equivalent numeric values.
3. **No Fabricated Readings**: If data is missing or out of coverage, the system returns "not available" or "stale", never placeholder or synthetic values in production.
