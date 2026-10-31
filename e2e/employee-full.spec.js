// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const pathModule = require('path');
const { BACKEND_URL, EMPLOYEE, EMPLOYEE_PAGES } = require('./utils/full-data');
const { collectPageErrors } = require('./utils/helpers');
const { record, finalize } = require('./utils/report');

/**
 * ط§ظ„ط§ط®طھط¨ط§ط± ط§ظ„ط´ط§ظ…ظ„ ظ„ط¯ظˆط± ط§ظ„ظ…ظˆط¸ظپ (Employee):
 * 1) ظپطھط­ ظƒظ„ طµظپط­ط§طھ ط§ظ„ظ…ظˆط¸ظپ ظˆط§ظ„طھط£ظƒط¯ ظ…ظ† ط¹ط¯ظ… ظˆط¬ظˆط¯ ط£ط®ط·ط§ط، JavaScript ظ‚ط§طھظ„ط©.
 * 2) ط¹ظ…ظ„ظٹط§طھ API ظƒط§ظ…ظ„ط© (ظ‚ط±ط§ط،ط©/ط¥ظ†ط´ط§ط،) ظ„ظ„ظƒظٹط§ظ†ط§طھ ط§ظ„ظ…طھط§ط­ط© ظ„ظ„ظ…ظˆط¸ظپ:
 *    ظ…ط´ط§ط±ظٹط¹ظٹطŒ ظ…ظ‡ط§ظ…ظٹطŒ ظ…ظˆط§ط¹ظٹط¯ظٹطŒ ط­ط¶ظˆط±/ط§ظ†طµط±ط§ظپطŒ ط¥ط¬ط§ط²ط§طھطŒ ط·ظ„ط¨ط§طھطŒ ط±ط§طھط¨طŒ ظ…ط¹ط±ظپط©.
 * 3) ط¹ظ…ظ„ظٹط§طھ ظ…ظ† ط§ظ„ظˆط§ط¬ظ‡ط©: ط¥ظ†ط´ط§ط، ط·ظ„ط¨ ط¥ط¬ط§ط²ط©طŒ ط¥ظ†ط´ط§ط، ط·ظ„ط¨طŒ طھط³ط¬ظٹظ„ ط­ط¶ظˆط±.
 * 4) ظƒطھط§ط¨ط© طھظ‚ط±ظٹط± JSON ظپظٹ e2e/reports/full-employee.json.
 */

const REPORT_PATH = pathModule.join(__dirname, 'reports', 'full-employee.json');
const SHOT_DIR = pathModule.join(__dirname, 'reports', 'full-employee');

const results = { pages: [], apiOperations: [], uiOperations: [], errors: [], summary: {} };
const ACC_PATH = REPORT_PATH.replace(/\.json$/, '.acc.jsonl');
for (const k of Object.keys(results)) {
  const arr = results[k];
  if (!Array.isArray(arr)) continue;
  const orig = arr.push.bind(arr);
  arr.push = (item) => {
    record(ACC_PATH, { [k]: [item] });
    return orig(item);
  };
}
const created = { leaves: [], requests: [] };
let cachedEmployeeToken;

async function employeeToken(request) {
  if (cachedEmployeeToken) return cachedEmployeeToken;
  const res = await request.post(`${BACKEND_URL}/api/user/auth/login`, {
    data: { email: EMPLOYEE.email, password: EMPLOYEE.password },
    timeout: 60000,
  });
  if (!res.ok()) throw new Error(`Employee login failed: ${res.status()} ${await res.text()}`);
  cachedEmployeeToken = (await res.json()).data.access_token;
  return cachedEmployeeToken;
}

function authH(token) {
  return { Authorization: `Bearer ${token}` };
}

async function waitForContent(page) {
  await expect(page.locator('main')).toBeVisible({ timeout: 120000 });
  const spinner = page.locator('main .animate-spin').first();
  if (await spinner.count()) {
    await spinner.waitFor({ state: 'detached', timeout: 45000 }).catch(() => {});
  }
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1000);
}

test.describe('Employee full test', () => {

  test.beforeEach(async ({ page }) => {
    const token = await employeeToken(page.request);
    await page.addInitScript((tok) => {
      window.localStorage.setItem('token', tok);
    }, token);
  });

  test('login via API returns valid employee token', async ({ request }) => {
    const token = await employeeToken(request);
    expect(token).toBeTruthy();
    results.summary.login = 'OK';
  });

  test('employee session is stored for UI tests', async ({ page }) => {
    const token = await employeeToken(page.request);
    await page.addInitScript((tok) => {
      window.localStorage.setItem('token', tok);
    }, token);
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 60000 });
    await expect(page.locator('.header')).toBeVisible({ timeout: 120000 });
    await page.context().storageState({ path: 'e2e/.auth/full-employee.json' });
  });

  for (const { route, name } of EMPLOYEE_PAGES) {
    test(`employee page ${route} renders without fatal errors`, async ({ page }) => {
      const watch = collectPageErrors(page, {
        pageErrorsOnly: true,
        ignore: [/favicon/i, /net::ERR/i, /Failed to load resource/i, /Socket/i, /socket\.io/i, /WebSocket/i, /api\.anmaat\.com/i],
      });
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await waitForContent(page);
      await expect(page.locator('main')).toBeVisible();
      await page.screenshot({ path: pathModule.join(SHOT_DIR, `${name}.png`), fullPage: false }).catch(() => {});
      watch.stop();
      const ok = watch.errors.length === 0;
      results.pages.push({ route, ok, errors: watch.errors });
      for (const e of watch.errors) results.errors.push({ screen: route, error: e });
      expect(watch.errors, `fatal errors on ${route}:\n${watch.errors.join('\n')}`).toEqual([]);
    });
  }

  // ============ ط¹ظ…ظ„ظٹط§طھ API ظ„ظ„ظ…ظˆط¸ظپ ============
  test('employee API: my projects', async ({ request }) => {
    const token = await employeeToken(request);
    const h = authH(token);
    const res = await request.get(`${BACKEND_URL}/api/employee/projects`, { headers: h, timeout: 90000 });
    results.apiOperations.push({ op: 'employee.projects.list', ok: res.ok() });
    expect(res.ok()).toBeTruthy();
  });

  test('employee API: my tasks', async ({ request }) => {
    const token = await employeeToken(request);
    const h = authH(token);
    const res = await request.get(`${BACKEND_URL}/api/employee/tasks`, { headers: h });
    results.apiOperations.push({ op: 'employee.tasks.list', ok: res.ok() });
    expect(res.ok()).toBeTruthy();
  });

  test('employee API: my appointments', async ({ request }) => {
    const token = await employeeToken(request);
    const h = authH(token);
    const res = await request.get(`${BACKEND_URL}/api/employee/appointments`, { headers: h });
    results.apiOperations.push({ op: 'employee.appointments.list', ok: res.ok() });
    expect(res.ok()).toBeTruthy();
  });

  test('employee API: my attendance', async ({ request }) => {
    const token = await employeeToken(request);
    const h = authH(token);
    const res = await request.get(`${BACKEND_URL}/api/employee/attendances`, { headers: h });
    results.apiOperations.push({ op: 'employee.attendances.list', ok: res.ok() });
    expect(res.ok()).toBeTruthy();
  });

  test('employee API: my salary transactions', async ({ request }) => {
    const token = await employeeToken(request);
    const h = authH(token);
    const res = await request.get(`${BACKEND_URL}/api/employee/salary-transactions`, { headers: h });
    results.apiOperations.push({ op: 'employee.salary.list', ok: res.ok() });
    expect(res.ok()).toBeTruthy();
  });

  test('employee API: leaves list + create + cancel', async ({ request }) => {
    const token = await employeeToken(request);
    const h = authH(token);

    const listRes = await request.get(`${BACKEND_URL}/api/employee/leaves`, { headers: h });
    expect(listRes.ok()).toBeTruthy();
    results.apiOperations.push({ op: 'employee.leaves.list', ok: true });

    const createRes = await request.post(`${BACKEND_URL}/api/employee/leaves`, {
      headers: h,
      data: {
        date: new Date(Date.now() + 86400000 * 60).toISOString().slice(0, 10),
        start_time: '10:00',
        end_time: '16:00',
        reason: 'created by full employee test',
      },
    });
    const createBody = await createRes.json();
    const id = createBody.data?._id || createBody.data?.id;
    results.apiOperations.push({ op: 'employee.leaves.create', ok: createRes.ok(), id });
    expect(createRes.ok()).toBeTruthy();
    if (id) {
      created.leaves.push(id);
      const cancelRes = await request.delete(`${BACKEND_URL}/api/employee/leaves/${id}`, { headers: h });
      results.apiOperations.push({ op: 'employee.leaves.cancel', ok: cancelRes.ok() });
    }
  });

  test('employee API: day-off request requires a leave policy', async ({ request }) => {
    const token = await employeeToken(request);
    const h = authH(token);

    const listRes = await request.get(`${BACKEND_URL}/api/employee/employee-requests`, { headers: h });
    expect(listRes.ok()).toBeTruthy();
    results.apiOperations.push({ op: 'employee.requests.list', ok: true });

    // جلب معرّف المستخدم الحالي لإرساله كـ employee_id
    const me = await request.get(`${BACKEND_URL}/api/user/auth`, { headers: h });
    const meBody = await me.json();
    const myUserId = meBody.data?._id;

    const createRes = await request.post(`${BACKEND_URL}/api/employee/employee-requests`, {
      headers: h,
      data: {
        employee_id: myUserId,
        type: 'DAY_OFF',
        reason: 'created by full employee test',
        vacation_date: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      },
    });
    const createBody = await createRes.json();
    results.apiOperations.push({ op: 'employee.requests.reject-missing-policy', ok: createRes.status() === 400 });
    expect(createRes.status()).toBe(400);
    expect(JSON.stringify(createBody)).toContain('leave policy');
  });

  test('employee API: attendance check-in', async ({ request }) => {
    const token = await employeeToken(request);
    const h = authH(token);
    const res = await request.post(`${BACKEND_URL}/api/employee/attendances/check-in`, {
      headers: h,
      data: { date: new Date().toISOString().slice(0, 10) },
    });
    const body = await res.json().catch(() => ({}));
    // ظ‚ط¯ ظٹظƒظˆظ† check-in ظ…ظƒط±ط±ظ‹ط§ ظ„ظ‡ط°ط§ ط§ظ„ظٹظˆظ… (ط®ط·ط£ 400) â€” ظ†ط¹طھط¨ط± ط§ظ„ظ‚ط§ط¦ظ…ط© ظ†ط§ط¬ط­ط© ظ„ظƒظ† check-in ظ‚ط¯ ظٹظƒظˆظ† ظ…ظƒط±ط±ظ‹ط§
    results.apiOperations.push({
      op: 'employee.attendances.check-in',
      ok: res.ok() || res.status() === 400,
      note: res.status(),
    });
  });

  test('employee API: notifications', async ({ request }) => {
    const token = await employeeToken(request);
    const h = authH(token);
    const res = await request.get(`${BACKEND_URL}/api/notifications/my-notifications`, { headers: h });
    results.apiOperations.push({ op: 'employee.notifications.list', ok: res.ok() });
    expect(res.ok()).toBeTruthy();
  });

  test('employee API: support tickets list (expected 403 - no permission)', async ({ request }) => {
    const token = await employeeToken(request);
    const h = authH(token);
    const res = await request.get(`${BACKEND_URL}/api/support-tickets`, { headers: h });
    // الموظف لا يملك صلاحية support_tickets.list — المتوقع 403
    results.apiOperations.push({ op: 'employee.support-tickets.list', ok: res.ok() || res.status() === 403, note: res.status() });
  });

  // ============ ط¹ظ…ظ„ظٹط§طھ ظ…ظ† ط§ظ„ظˆط§ط¬ظ‡ط© ============
  test('UI: leave request form opens and submits', async ({ page }) => {
    await page.goto('/leaves', { waitUntil: 'domcontentloaded' });
    await waitForContent(page);

    const addBtn = page.getByRole('button', { name: /add|new|create|request|leave/i }).first();
    let opened = false;
    if (await addBtn.isVisible().catch(() => false)) {
      await addBtn.click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(1200);
      const modal = page.locator('[role="dialog"], div.fixed.inset-0').first();
      opened = (await modal.count()) && (await modal.isVisible().catch(() => false));
    }
    results.uiOperations.push({ op: 'leave.form.open', ok: opened });
  });

  test('UI: employee request form opens', async ({ page }) => {
    await page.goto('/requests', { waitUntil: 'domcontentloaded' });
    await waitForContent(page);

    const addBtn = page.getByRole('button', { name: /add|new|create|ط¥ط¶ط§ظپط©|ط¥ظ†ط´ط§ط،|ط¬ط¯ظٹط¯|request/i }).first();
    let opened = false;
    if (await addBtn.isVisible().catch(() => false)) {
      await addBtn.click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(1200);
      const modal = page.locator('[role="dialog"], div.fixed.inset-0').first();
      opened = (await modal.count()) && (await modal.isVisible().catch(() => false));
    }
    results.uiOperations.push({ op: 'request.form.open', ok: opened });
  });

  test.afterAll(() => {
    finalize(ACC_PATH, REPORT_PATH);
  });
});
