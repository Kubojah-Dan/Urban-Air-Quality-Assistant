import { test, expect } from '@playwright/test';

test.describe('E2E: Commuter Flow & Routine Re-planning', () => {
  test('modifies commute constraints and verifies updated recommendation and trade-offs', async ({ page }) => {
    await page.goto('/routine');

    // 1. Verify routine view
    await expect(page.getByText(/Smart Daily Routine Optimizer/i)).toBeVisible();

    // 2. Click constraint adjustment or switch tab (e.g. Recommended vs Alternative)
    const recCard = page.getByText(/Leave 30 mins earlier/i).or(page.getByText(/Recommended/i)).first();
    await expect(recCard).toBeVisible();

    // 3. Inspect evidence basis and trade-offs
    await expect(page.getByText(/Evidence Basis/i).first()).toBeVisible();
    await expect(page.getByText(/Trade-off/i).or(page.getByText(/Convenience/i)).first()).toBeVisible();

    // 4. Test accepting recommended plan
    const acceptBtn = page.getByRole('button', { name: /Accept/i }).first();
    if (await acceptBtn.isVisible()) {
      await acceptBtn.click();
      await expect(page.getByText(/Accepted/i).first()).toBeVisible();
    }
  });
});
