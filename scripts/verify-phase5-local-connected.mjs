import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { chromium, request } from '@playwright/test';

const frontend = process.env.FRONTEND_URL || 'http://localhost:3001';
const backend = process.env.BACKEND_URL || 'http://127.0.0.1:3000';
assert(['localhost', '127.0.0.1'].includes(new URL(frontend).hostname), 'This check is local-only');
assert(['localhost', '127.0.0.1'].includes(new URL(backend).hostname), 'This check is local-only');
const report = { result: 'running', frontend, backend, cases: [], business_writes_blocked: true, external_assets_blocked: 0, errors: [] };
const api = await request.newContext();
const browser = await chromium.launch({ headless: true });
try {
  for (const path of ['/health/live', '/health/ready']) {
    const response = await api.get(`${backend}${path}`); assert.equal(response.status(), 200);
    report.cases.push(`${path}: 200`);
  }
  const login = await api.post(`${backend}/api/user/auth/login`, { data: {
    email: process.env.E2E_SUBSCRIBER_EMAIL || 'nextsub1@anmat.test',
    password: process.env.E2E_SUBSCRIBER_PASSWORD || 'aA@123456',
  }, timeout: 30000 });
  assert.equal(login.status(), 200, 'Existing subscriber test account must authenticate');
  const token = (await login.json()).data.access_token;
  assert(token);
  report.cases.push('existing subscriber test account authenticated against the local backend');
  const context = await browser.newContext();
  await context.addCookies([{ name: 'token', value: token, url: frontend, sameSite: 'Lax' }]);
  await context.addInitScript((value) => {
    localStorage.setItem('token', value); localStorage.setItem('i18nextLng', 'en'); localStorage.setItem('tasks-view-mode', 'table');
  }, token);
  const businessRequests = [];
  await context.route('**/api/**', async (route) => {
    const req = route.request(), url = new URL(req.url());
    if (url.hostname === 'ui-avatars.com') { report.external_assets_blocked++; return route.abort(); }
    // This existing POST endpoint only reads the attendance report; its
    // controller/service were checked before allowing it through this test.
    const readOnlyPost = req.method() === 'POST' && url.pathname === '/api/subscriber/organization/attendances/rotations';
    if (!['localhost', '127.0.0.1'].includes(url.hostname) || (!['GET', 'HEAD', 'OPTIONS'].includes(req.method()) && !readOnlyPost)) {
      report.errors.push({ event: 'blocked_request', method: req.method(), path: url.pathname, host: url.hostname });
      return route.abort();
    }
    businessRequests.push({ method: req.method(), path: url.pathname, query: url.searchParams.toString() });
    await route.continue();
  });
  const page = await context.newPage();
  page.on('pageerror', (error) => report.errors.push({ event: 'pageerror', message: error.message }));
  page.on('response', (response) => {
    if (response.url().includes('/api/') && response.status() >= 400) report.errors.push({ event: 'http_error', path: new URL(response.url()).pathname, status: response.status() });
  });
  await page.goto(`${frontend}/tasks`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.getByLabel('Search tasks', { exact: true }).waitFor({ timeout: 90000 });
  await page.getByText('Loading tasks...', { exact: true }).first().waitFor({ state: 'hidden', timeout: 60000 });
  assert(businessRequests.some((item) => item.path.endsWith('/organization/tasks') && new URLSearchParams(item.query).get('page_size') === '100'));
  report.cases.push('task table loads through a real authenticated paged request');
  await page.getByTitle('Kanban View', { exact: true }).click();
  await page.getByTitle('Table View', { exact: true }).waitFor();
  report.cases.push('task board can be opened from the connected task page');
  await page.getByLabel('Search tasks', { exact: true }).fill('local-verification-no-match');
  await page.waitForResponse((response) => response.url().includes('/organization/tasks?') && new URL(response.url()).searchParams.get('search') === 'local-verification-no-match' && response.status() === 200);
  report.cases.push('task search reaches the actual backend successfully');
  await page.goto(`${frontend}/projects`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.getByLabel('Search projects', { exact: true }).waitFor({ timeout: 90000 });
  report.cases.push('projects page loads with the connected session');
  await page.goto(`${frontend}/hr/employees`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.getByRole('button', { name: 'Import employees', exact: true }).click({ timeout: 90000 });
  await page.getByLabel('Employees file', { exact: true }).waitFor();
  report.cases.push('employee import dialog opens with actual account permissions and reference data');
  assert.equal(report.errors.length, 0, 'Connected UI must not have HTTP/runtime failures or attempt writes');
  report.result = 'pass';
} catch (error) { report.result = 'fail'; report.failure = { name: error.name, message: error.message }; process.exitCode = 1; }
finally {
  await browser.close(); await api.dispose();
  writeFileSync('../outputs/PHASE5_LOCAL_CONNECTED_2026-11-09.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
}
