// @ts-check
const { test, expect } = require('@playwright/test');
const { waitForStablePage } = require('./utils/helpers');

/**
 * الاختبارات البصرية (Visual Regression) للصفحات الداخلية بجلسة السوبر أدمن.
 * تُولَّد النسخ المرجعية (baseline) عند أول تشغيل بالأمر:
 *   npx playwright test e2e/visual.spec.js --update-snapshots
 * ثم تقارن اللقطات اللاحقة معها.
 * (لقطات الصفحات العامة موجودة في visual-public.spec.js)
 */
test.describe('Visual regression (authenticated admin)', () => {
  test('admin dashboard snapshot', async ({ page }) => {
    await page.goto('/dashboard');
    await waitForStablePage(page);
    await expect(page.locator('.header')).toBeVisible({ timeout: 60000 });
    await expect(page).toHaveScreenshot('admin-dashboard.png');
  });

  for (const path of ['/system-admins', '/industries', '/subscribers', '/plans']) {
    test(`admin page ${path} snapshot`, async ({ page }) => {
      await page.goto(path);
      await waitForStablePage(page);
      await expect(page.locator('main')).toBeVisible();
      await expect(page).toHaveScreenshot(`admin-${path.replace(/\//g, '_')}.png`);
    });
  }
});
