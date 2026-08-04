// @ts-check
const { test, expect } = require('@playwright/test');
const { FRONTEND_URL, ADMIN } = require('./utils/data');
const { loginViaApi } = require('./utils/helpers');

/**
 * تسجيل الدخول بالسوبر أدمن عبر API ثم حفظ الجلسة في storageState
 * لاستخدامها في كل الاختبارات الأخرى دون تكرار تسجيل الدخول.
 * (الاختبارات الوظيفية لواجهة تسجيل الدخول نفسها موجودة في login.spec.js)
 */
test.describe('Auth setup', () => {
  test('admin session is stored', async ({ page }) => {
    const token = await loginViaApi(page.request);

    // إدخال token في localStorage بنفس الطريقة التي يستخدمها النظام
    await page.addInitScript(
      ([tok]) => {
        window.localStorage.setItem('token', tok);
      },
      [token],
    );

    await page.goto(`${FRONTEND_URL}/dashboard`);
    await expect(page).toHaveURL(/\/dashboard/);
    // تأكيد تحميل لوحة التحكم بعد التحقق من الجلسة
    await expect(page.locator('.header')).toBeVisible({ timeout: 30000 });

    // حفظ الجلسة
    await page.context().storageState({ path: 'e2e/.auth/admin.json' });
  });
});
