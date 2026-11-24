import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Configuration for DayShift
 * Runs full browser testing, keyboard journeys, and axe-core accessibility checks.
 */
export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.js'],
  timeout: 45000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'pnpm --filter @dayshift/web dev --port 5173 --host',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 30000
  }
});
