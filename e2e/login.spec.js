// @ts-check
const { test, expect } = require('@playwright/test');
const { FRONTEND_URL, ADMIN } = require('./utils/data');

/**
 * اختبارات واجهة تسجيل الدخول والصفحات العامة.
 * تعمل ضمن مشروع chromium-public (بدون جلسة محفوظة)
 * حتى تكون نماذج الدخول فارغة ويمكن اختبارها.
 */
test.describe('Sign-in UI', () => {
  test('regular sign-in page loads with expected form fields', async ({ page }) => {
    await page.goto('/sign-in');

    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Forgot Password?' })).toBeVisible();
  });

  test('login rejects empty credentials (native required validation)', async ({ page }) => {
    await page.goto('/sign-in');

    await page.getByRole('button', { name: 'Login' }).click();
    // المتصفح يمنع الإرسال مع حقول فارغة
    await expect(page).toHaveURL(/\/sign-in/);
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
  });

  test('login with wrong password shows an error message', async ({ page }) => {
    await page.goto('/sign-in');

    await page.getByPlaceholder('Enter your email').fill('wrong@anmat.test');
    await page.getByPlaceholder('*').fill('wrong-password');
    await page.getByRole('button', { name: 'Login' }).click();

    // رسالة الخطأ الحمراء تظهر، ويبقى المستخدم على صفحة الدخول
    await expect(page.locator('p.text-red-500')).toBeVisible({ timeout: 20000 });
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('admin signs in via admin/sign-in and reaches dashboard', async ({ page }) => {
    await page.goto('/admin/sign-in');

    await page.getByPlaceholder('Enter your email').fill(ADMIN.email);
    await page.getByPlaceholder('*').fill(ADMIN.password);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 60000 });
    await expect(page.locator('.header')).toBeVisible({ timeout: 60000 });
  });

  test('admin is rejected by the regular (user) sign-in', async ({ page }) => {
    await page.goto('/sign-in');

    await page.getByPlaceholder('Enter your email').fill(ADMIN.email);
    await page.getByPlaceholder('*').fill(ADMIN.password);
    await page.getByRole('button', { name: 'Login' }).click();

    // يجب أن يظهر خطأ "Access Denied" ولا ينتقل للوحة التحكم
    await expect(page.locator('p.text-red-500')).toBeVisible({ timeout: 20000 });
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('forget-password page is reachable from sign-in', async ({ page }) => {
    await page.goto('/sign-in');

    await page.getByRole('link', { name: 'Forgot Password?' }).click();
    await expect(page).toHaveURL(/\/forget-password/, { timeout: 30000 });
  });
});
