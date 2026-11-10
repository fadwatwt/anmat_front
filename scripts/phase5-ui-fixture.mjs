// Isolated UI fixtures: no real login, employee writes, or business API calls.
export async function createFixtureContext(browser) {
  const employee = process.env.UI_FIXTURE_ROLE === 'Employee';
  const context = await browser.newContext();
  await context.addCookies([{ name: 'token', value: 'ui-fixture-only', url: 'http://localhost:3001' }]);
  await context.addInitScript(() => {
    localStorage.setItem('token', 'ui-fixture-only');
    localStorage.setItem('i18nextLng', 'en');
  });
  await context.route('**/socket.io/**', (route) => route.abort());
  await context.route('**/api/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    let data = [];
    if (path === '/api/user/auth') data = { _id: '000000000000000000000001', name: 'UI Test Owner', type: employee ? 'Employee' : 'Subscriber', is_active: true, email_verification: { is_verified: true }, employee_detail: { _id: '000000000000000000000003' }, is_organization_registered: true, active_subscription_id: '000000000000000000000002', has_subscription_access: true };
    if (path === '/api/user/auth/permissions') data = { permissions: ['*'], social_media_grants: [] };
    await route.fulfill({ json: { status: 'success', data } });
  });
  return context;
}
