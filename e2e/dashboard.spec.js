// @ts-check
const { test, expect } = require('@playwright/test');
const { ADMIN_PAGES } = require('./utils/data');
const { collectPageErrors, waitForStablePage } = require('./utils/helpers');

/**
 * اختبارات لوحة التحكم — تتطلب جلسة السوبر أدمن من مشروع setup.
 * تتحقق من أن الصفحات الإدارية تفتح وتُعرض دون أخطاء قاتلة.
 */
test.describe('Admin dashboard', () => {
  test('dashboard shell renders (header, sidebar, content)', async ({ page }) => {
    await page.goto('/dashboard');
    await waitForStablePage(page);

    await expect(page.locator('.header')).toBeVisible();
    // القائمة الجانبية تحتوي على روابط تنقل (لا توجد فئة menu-item في MenuItem.jsx)
    await expect(page.getByRole('link', { name: 'Dashboard' }).first()).toBeVisible();
    // محتوى اللوحة يظهر بعد اكتمال الاستيراد الديناميكي (يُعرض سبينر أثناء التحميل)
    await expect(page.locator('main')).toContainText('Dashboard Overview', { timeout: 60000 });
  });

  for (const { path, title } of ADMIN_PAGES) {
    test(`page "${path}" renders without fatal errors`, async ({ page }) => {
      const watch = collectPageErrors(page, {
        pageErrorsOnly: true,
        ignore: [/favicon/i, /net::ERR/i, /Failed to load resource/i, /Socket/i, /socket\.io/i, /WebSocket/i],
      });

      await page.goto(path);
      await expect(page).toHaveURL(new RegExp(`${path.replace('/', '\\/')}$|\\?`), { timeout: 30000 });
      await waitForStablePage(page);

      // لا نتحقق من نص العنوان لأنه مترجم (عربي/إنجليزي)، نكتفي بتأكيد أن الصفحة معروضة
      await expect(page.locator('main')).toBeVisible();

      watch.stop();
      expect(watch.errors, `fatal errors on ${path}:\n${watch.errors.join('\n')}`).toEqual([]);
    });
  }

  test('sidebar navigation moves between admin sections', async ({ page }) => {
    await page.goto('/dashboard');
    await waitForStablePage(page);

    // الانتقال إلى صفحة "Industries" من القائمة الجانبية
    await page.getByRole('link', { name: 'Industries' }).click();
    await expect(page).toHaveURL(/\/industries/, { timeout: 30000 });
    await waitForStablePage(page);

    // العودة إلى اللوحة
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 30000 });
  });

  test('theme toggle switches dark mode class', async ({ page }) => {
    await page.goto('/dashboard');
    await waitForStablePage(page);

    const toggle = page.getByTitle(/Switch to Dark Mode/);
    if (await toggle.count()) {
      await toggle.click();
      // الوضع الداكن يُطبق على جذر المستند
      await expect(page.locator('html')).toHaveClass(/dark/, { timeout: 10000 });
    }
  });
});
