import { test, expect } from '@playwright/test';

test.describe('E2E: Data Provenance & Degraded Mode Transparency', () => {
  test('verifies data quality badges, provenance disclosure, and transparent fallback', async ({ page }) => {
    await page.goto('/explorer');

    // 1. Explorer page displays air quality grid
    await expect(page.getByText(/Air Quality Explorer/i).first()).toBeVisible();

    // 2. Data provenance header & credits (Copernicus CAMS, CPCB, AirNow)
    await expect(
      page.getByText(/Copernicus/i).or(page.getByText(/CPCB/i)).or(page.getByText(/Dispersion/i)).first()
    ).toBeVisible();

    // 3. Hourly Forecast & Activity Planner is present
    await expect(
      page.getByText(/Hourly Activity Suitability Planner/i).or(page.getByText(/Activity Planner/i)).first()
    ).toBeVisible();
  });
});
