import { test, expect } from '@playwright/test';

test.describe('E2E: Indoor Flow & Safety Protocol Disclosures', () => {
  test('navigates to indoor page and verifies sensor disclaimer, ventilation schedule, and source control', async ({ page }) => {
    await page.goto('/indoor');

    // 1. Title verification
    await expect(page.getByText(/Indoor Air Quality Coach/i).first()).toBeVisible();

    // 2. Strict Sensor Disclaimer is visible (EPA/WHO scientific boundary)
    await expect(
      page.getByText(/Sensor Measurement Boundary/i).or(page.getByText(/not directly measured/i)).first()
    ).toBeVisible();

    // 3. Ventilation schedule (Inversion freeze vs afternoon purge)
    await expect(
      page.getByText(/Keep Closed/i).or(page.getByText(/Morning Ground Inversion/i)).first()
    ).toBeVisible();
    await expect(
      page.getByText(/Optimal Purge Window/i).or(page.getByText(/Smart Ventilation/i)).first()
    ).toBeVisible();

    // 4. Source control protocols
    await expect(
      page.getByText(/Source Control/i).or(page.getByText(/Cooking & Tadka Control/i)).first()
    ).toBeVisible();
  });
});
