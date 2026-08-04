// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

// وضع الإنتاج (الافتراضي) أسرع وأكثر استقرارًا من خادم التطوير،
// لأنه لا يعيد تجميع كل مسار عند أول زيارة ولا يتجاوز عتبة الذاكرة.
// للعودة لوضع التطوير: E2E_MODE=dev
const E2E_MODE = process.env.E2E_MODE || 'production';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // تنفيذ تسلسلي لتفادي إرباك خادم Next.js أثناء أول تجميع للصفحات
  workers: 1,
  timeout: 180000,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],

  expect: {
    timeout: 15000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
      caret: 'hide',
    },
  },

  use: {
    baseURL: FRONTEND_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1440, height: 900 },
    actionTimeout: 15000,
    navigationTimeout: 180000,
  },

  // إقلاع الخوادم تلقائيًا قبل الاختبارات (تُعاد استخدامها إذا كانت تعمل مسبقًا)
  webServer: [
    {
      command: 'npm run start:dev',
      cwd: '../Anmat_Backend_System-development',
      url: BACKEND_URL,
      reuseExistingServer: true,
      timeout: 240000,
      stdout: 'ignore',
      stderr: 'pipe',
    },
    {
      command: E2E_MODE === 'dev'
        ? 'npm run dev'
        : 'npm run build && npm run start',
      cwd: '.',
      url: FRONTEND_URL,
      reuseExistingServer: true,
      timeout: 600000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
  ],

  projects: [
    // 1) تسجيل الدخول مرة واحدة وحفظ الجلسة
    {
      name: 'setup',
      testMatch: /auth\.setup\.js/,
    },
    // 2) الصفحات العامة (دخول، هبوط) — بدون جلسة محفوظة
    {
      name: 'chromium-public',
      testMatch: /(login|landing|visual-public)\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    // 3) الصفحات الداخلية (لوحة التحكم + البصرية) — بجلسة السوبر أدمن
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/admin.json',
      },
      dependencies: ['setup'],
      testIgnore: /(login|landing|visual-public|auth\.setup)\.(spec|setup)\.js/,
    },
  ],
});
