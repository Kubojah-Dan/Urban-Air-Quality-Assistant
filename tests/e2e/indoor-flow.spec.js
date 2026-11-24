import { test, expect } from '@playwright/test';

test.describe('E2E: Indoor Flow & Safety Protocol Disclosures', () => {
  test('navigates to indoor page and verifies sensor disclaimer, ventilation schedule, and source control', async ({ page }) => {
    await page.goto('/indoor');

    // 1. Title verification
    await expect(page.getByText(/Indoor Air Quality Coach/i)).toBeVisible();

    // 2. Strict Sensor Disclaimer is visible (EPA/WHO scientific boundary)
    await expect(page.getByText(/Explicit Sensor Disclaimer/i).or(page.getByText(/No Indoor Sensor Installed/i))).toBeVisible();

    // 3. Ventilation schedule (Inversion freeze vs afternoon purge)
    await expect(page.getByText(/Keep Windows Sealed/i).or(page.getByText(/Morning Inversion Window/i))).toBeVisible();
    await expect(page.getByText(/Optimal Ventilation/i).or(page.getByText(/Safe Flush Window/i))).toBeVisible();

    // 4. Source control protocols
    await expect(page.getByText(/Source Control & In-Home Actions/i)).toBeVisible();
  });
});
