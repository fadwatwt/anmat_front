import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { request, chromium } from '@playwright/test';

// Supply credentials as JSON on stdin; never save them in code, reports or auth files.
let input = ''; for await (const chunk of process.stdin) input += chunk;
const credentials = JSON.parse(input); input = '';
const backend = 'http://127.0.0.1:3000', frontend = 'http://localhost:3001';
const report = { result: 'running', cases: [], roles: [], errors: [], business_writes_blocked: true, human_acceptance_test: false };
const api = await request.newContext();
const browser = await chromium.launch({ headless: true });
try {
  let ownerEmployees;
  for (const [role, expectedType] of [['owner', 'Subscriber'], ['employee', 'Employee']]) {
    const account = credentials[role]; assert(account?.email && account?.password);
    const login = await api.post(`${backend}/api/user/auth/login`, { data: account });
    assert(login.ok(), `${role} login failed with HTTP ${login.status()}`);
    const session = (await login.json()).data;
    const token = session.access_token; assert(token);
    const headers = { Authorization: `Bearer ${token}` };
    const response = await api.get(`${backend}/api/user/auth`, { headers }); assert(response.ok());
    const user = (await response.json()).data;
    assert.equal(user.type, expectedType, `${role} has the expected account type`);
    assert.notEqual(user.has_subscription_access, false, `${role} organization subscription must allow access`);
    const permissionsResponse = await api.get(`${backend}/api/user/auth/permissions`, { headers }); assert(permissionsResponse.ok());
    const permissionData = (await permissionsResponse.json()).data;
    const permissions = Array.isArray(permissionData) ? permissionData : permissionData.permissions;
    report.roles.push({ role, type: user.type, permission_count: permissions.length, wildcard: permissions.includes('*') });
    if (role === 'owner') {
      const employeesResponse = await api.get(`${backend}/api/subscriber/organization/employees`, { headers }); assert(employeesResponse.ok());
      ownerEmployees = (await employeesResponse.json()).data;
    } else {
      assert(!permissions.includes('*'), 'Employee must not inherit the owner wildcard');
      const tasks = await api.get(`${backend}/api/employee/tasks?page=1&page_size=100`, { headers }); assert(tasks.ok());
      assert((await tasks.json()).data.length <= 100);
    }
    report.cases.push(`${role} authenticates with the expected role and reads its authorized data`);
    const context = await browser.newContext();
    await context.addCookies([{ name: 'token', value: token, url: frontend }]);
    await context.addInitScript((value) => { localStorage.setItem('token', value); localStorage.setItem('i18nextLng', 'en'); }, token);
    await context.route('**/api/**', async (route) => {
      const req = route.request(), url = new URL(req.url());
      if (url.hostname === 'ui-avatars.com') return route.abort();
      const readPost = req.method() === 'POST' && url.pathname === '/api/subscriber/organization/attendances/rotations';
      if (!['127.0.0.1', 'localhost'].includes(url.hostname) || (!['GET', 'HEAD', 'OPTIONS'].includes(req.method()) && !readPost)) {
        report.errors.push({ role, type: 'blocked_write', path: url.pathname }); return route.abort();
      }
      return route.continue();
    });
    const page = await context.newPage();
    page.on('pageerror', (error) => report.errors.push({ role, type: 'runtime', message: error.message }));
    await page.goto(`${frontend}/tasks`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.getByLabel('Search tasks', { exact: true }).waitFor({ timeout: 60000 });
    assert(!page.url().includes('/account-setup'), `${role} account setup must be complete`);
    report.cases.push(`${role} reaches the actual task page without setup redirection`);
    await context.close();
    account.password = '';
  }
  assert(ownerEmployees.some((employee) => employee.user?.email?.toLowerCase() === credentials.employee.email.toLowerCase()), 'Supplied employee must belong to the supplied owner organization');
  report.cases.push('supplied employee appears inside the supplied owner organization');
  assert.equal(report.errors.length, 0);
  report.result = 'pass';
} catch (error) { report.result = 'fail'; report.failure = { name: error.name, message: error.message }; process.exitCode = 1; }
finally {
  for (const account of Object.values(credentials)) if (account) account.password = '';
  await browser.close(); await api.dispose();
  writeFileSync('../outputs/PILOT_ACCOUNT_READINESS_2026-11-09.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
}
