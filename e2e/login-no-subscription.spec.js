const { test, expect } = require('@playwright/test');

test('successful subscriber login without a plan opens plan setup', async ({ page }) => {
  const user = {
    _id: '64b000000000000000000001',
    name: 'Test Subscriber',
    email: 'subscriber@example.test',
    type: 'Subscriber',
    is_active: true,
    is_organization_registered: true,
    active_subscription_id: null,
    has_subscription_access: false,
  };

  await page.route('**/api/user/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify({ status: 'success', data: { access_token: 'test-session-token', user } }),
    });
  });
  await page.route('**/api/user/auth', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify({ status: 'success', data: user }),
    });
  });

  await page.goto('/sign-in');
  await page.getByPlaceholder('Enter your email').fill(user.email);
  await page.getByLabel('Password', { exact: true }).fill('example-password');
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  await expect(page).toHaveURL(/\/account-setup\/subscriber\/plans/);
  await expect(page.getByText('Login failed')).not.toBeVisible();
});
