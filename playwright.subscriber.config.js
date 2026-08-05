// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

/**
 * إعداد Playwright مستقل لفحص لوحة تحكم المشترك (Subscriber).
 * لا يشغّل خوادم بنفسه — يُفترض أن الواجهة تعمل على FRONTEND_URL.
 */
module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 240000,
  expect: { timeout: 20000 },
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results-subscriber.json' }],
  ],
  use: {
    baseURL: FRONTEND_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    viewport: { width: 1440, height: 900 },
    actionTimeout: 20000,
    navigationTimeout: 120000,
  },
  projects: [
    {
      name: 'subscriber-setup',
      testMatch: /subscriber-auth\.setup\.js/,
    },
    {
      name: 'subscriber-check',
      testMatch: /subscriber-check\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/subscriber.json',
      },
      dependencies: ['subscriber-setup'],
    },
  ],
});
