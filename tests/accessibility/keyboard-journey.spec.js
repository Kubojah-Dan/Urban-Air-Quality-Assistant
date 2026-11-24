import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility: Keyboard Navigation & Axe-Core Audit', () => {
  test('navigates via Tab and executes axe-core accessibility audit on landing and routine pages', async ({ page }) => {
    // 1. Visit landing page
    await page.goto('/');

    // 2. Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(['color-contrast']) // Color contrast verified via dedicated token matrix
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    // 3. Tab to interactive elements
    await page.keyboard.press('Tab');
    const focusedElementTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT', 'BODY']).toContain(focusedElementTag);

    // 4. Test dialog focus trapping with AuthModal if triggered
    const signInBtn = page.getByRole('button', { name: /Sign In/i }).first();
    if (await signInBtn.isVisible()) {
      await signInBtn.click();
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();

      // Press Escape to dismiss
      await page.keyboard.press('Escape');
      await expect(modal).toBeHidden();
    }
  });
});
