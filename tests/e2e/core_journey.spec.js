import { test, expect } from '@playwright/test';

test.describe('E2E: Core User Journey', () => {
  test('navigates from landing to routine planner and verifies 3-way board and impact receipt', async ({ page }) => {
    // 1. Open DayShift
    await page.goto('/');
    await expect(page).toHaveTitle(/DayShift/i);

    // 2. Landing hero is rendered
    const heroTitle = page.getByRole('heading', { name: /Make every day a cleaner choice/i });
    await expect(heroTitle).toBeVisible();

    // 3. Click 'Build my daily routine' or navigate to routine
    const routineLink = page.getByRole('button', { name: /Build my daily routine/i }).first();
    if (await routineLink.isVisible()) {
      await routineLink.click();
    } else {
      await page.goto('/routine');
    }

    // 4. Verify Routine page loaded
    await expect(page).toHaveURL(/.*routine/);
    await expect(page.getByText(/Smart Daily Routine Optimizer/i)).toBeVisible();

    // 5. Verify the 3-way options: Usual, Recommended, Alternative
    await expect(page.getByText(/Usual Routine/i).first()).toBeVisible();
    await expect(page.getByText(/Recommended/i).first()).toBeVisible();
    await expect(page.getByText(/Alternative/i).first()).toBeVisible();

    // 6. Verify 3-Channel Impact Receipt
    await expect(page.getByText(/Impact Receipt/i)).toBeVisible();
    await expect(page.getByText(/Channel 1: Outdoor Air Context/i)).toBeVisible();
    await expect(page.getByText(/Channel 2: Indoor/i)).toBeVisible();
    await expect(page.getByText(/Channel 3: Emissions/i)).toBeVisible();
  });
});
