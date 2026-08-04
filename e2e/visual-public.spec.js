// @ts-check
const { test, expect } = require('@playwright/test');
const { FRONTEND_URL } = require('./utils/data');
const { waitForStablePage } = require('./utils/helpers');

/**
 * اختبارات بصرية للصفحات العامة (بدون جلسة).
 * تعمل ضمن مشروع chromium-public.
 * توليد النسخ المرجعية: npx playwright test e2e/visual-public.spec.js --update-snapshots
 */
test.describe('Visual regression (public pages)', () => {
  test('sign-in page snapshot', async ({ page }) => {
    await page.goto('/sign-in');
    await waitForStablePage(page);
    await expect(page).toHaveScreenshot('sign-in.png');
  });

  test('landing page snapshot', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    await waitForStablePage(page);
    await expect(page).toHaveScreenshot('landing.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });
});
