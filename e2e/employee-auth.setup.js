// @ts-check
const { test, expect } = require('@playwright/test');
const { BACKEND_URL } = require('./utils/data');

const EMPLOYEE = {
  email: process.env.E2E_EMPLOYEE_EMAIL || 'org1emp1@anmat.test',
  password: process.env.E2E_EMPLOYEE_PASSWORD || 'aA@123456',
};

/**
 * تسجيل الدخول بحساب الموظف (org1emp1@anmat.test) عبر API وحفظ الجلسة
 * في storageState ليستخدمها فحص لوحة تحكم الموظف.
 * (يُستخدم مسار /api/user/auth/login الخاص بالمشتركين والموظفين)
 */
test('employee session is stored', async ({ page }) => {
  const response = await page.request.post(`${BACKEND_URL}/api/user/auth/login`, {
    data: { email: EMPLOYEE.email, password: EMPLOYEE.password },
  });
  if (!response.ok()) {
    throw new Error(`Employee login API failed: ${response.status()} ${await response.text()}`);
  }
  const body = await response.json();
  const token = body.data.access_token;
  expect(token).toBeTruthy();
  expect(body.data.user.type).toBe('Employee');

  await page.addInitScript((tok) => {
    window.localStorage.setItem('token', tok);
  }, token);

  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 60000 });
  await expect(page.locator('.header')).toBeVisible({ timeout: 60000 });
  await expect(page.locator('main')).toBeVisible();

  await page.context().storageState({ path: 'e2e/.auth/employee.json' });
});
