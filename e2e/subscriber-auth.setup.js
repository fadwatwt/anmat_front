// @ts-check
const { test, expect } = require('@playwright/test');
const { BACKEND_URL } = require('./utils/data');

const SUBSCRIBER = {
  email: process.env.E2E_SUBSCRIBER_EMAIL || 'nextsub1@anmat.test',
  password: process.env.E2E_SUBSCRIBER_PASSWORD || 'aA@123456',
};

/**
 * تسجيل الدخول بحساب المشترك (nextsub1@anmat.test) عبر API وحفظ الجلسة
 * في storageState ليستخدمها فحص لوحة تحكم المشترك.
 * (يُستخدم مسار /api/user/auth/login الخاص بالمشتركين وليس /api/admin/auth/login)
 */
test('subscriber session is stored', async ({ page }) => {
  const response = await page.request.post(`${BACKEND_URL}/api/user/auth/login`, {
    data: { email: SUBSCRIBER.email, password: SUBSCRIBER.password },
  });
  if (!response.ok()) {
    throw new Error(`Subscriber login API failed: ${response.status()} ${await response.text()}`);
  }
  const body = await response.json();
  const token = body.data.access_token;
  expect(token).toBeTruthy();

  await page.addInitScript((tok) => {
    window.localStorage.setItem('token', tok);
  }, token);

  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 60000 });
  await expect(page.locator('.header')).toBeVisible({ timeout: 60000 });
  await expect(page.locator('main')).toBeVisible();

  await page.context().storageState({ path: 'e2e/.auth/subscriber.json' });
});
