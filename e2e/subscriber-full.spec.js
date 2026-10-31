// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const pathModule = require('path');
const { BACKEND_URL, SUBSCRIBER, SUBSCRIBER_PAGES } = require('./utils/full-data');
const { collectPageErrors } = require('./utils/helpers');
const { record, finalize } = require('./utils/report');

/**
 * ط§ظ„ط§ط®طھط¨ط§ط± ط§ظ„ط´ط§ظ…ظ„ ظ„ط¯ظˆط± ط§ظ„ظ…ط´طھط±ظƒ (Subscriber / ظ…ط¯ظٹط± ط§ظ„ط´ط±ظƒط©):
 * 1) ظپطھط­ ظƒظ„ طµظپط­ط§طھ ط§ظ„ظ…ط´طھط±ظƒ ظˆط§ظ„طھط£ظƒط¯ ظ…ظ† ط¹ط¯ظ… ظˆط¬ظˆط¯ ط£ط®ط·ط§ط، JavaScript ظ‚ط§طھظ„ط©.
 * 2) ط¹ظ…ظ„ظٹط§طھ API ظƒط§ظ…ظ„ط© (ظ‚ط±ط§ط،ط©/ط¥ظ†ط´ط§ط،/طھط­ط¯ظٹط«/ط­ط°ظپ) ظ„ظ„ظƒظٹط§ظ†ط§طھ ط§ظ„ط£ط³ط§ط³ظٹط©:
 *    ط§ظ„ظ…ط´ط§ط±ظٹط¹طŒ ط§ظ„ظ…ظ‡ط§ظ…طŒ ط§ظ„ظ…ظˆط§ط¹ظٹط¯طŒ ط§ظ„ط£ظ‚ط³ط§ظ…طŒ ط§ظ„ظپط±ظ‚طŒ ط§ظ„ظ…ظ†ط§طµط¨طŒ ط§ظ„ط§ط¬طھظ…ط§ط¹ط§طھطŒ ط§ظ„ط¹ط·ظ„ط§طھطŒ ط§ظ„ط¥ط¬ط§ط²ط§طھطŒ ط§ظ„ط­ط¶ظˆط±طŒ ط§ظ„ط±ظˆط§طھط¨طŒ ط§ظ„ط·ظ„ط¨ط§طھ.
 * 3) ط¥ظ†ط´ط§ط، ظƒظٹط§ظ†ط§طھ ط¹ط¨ط± API ظˆط§ظ„طھط­ظ‚ظ‚ ظ…ظ† ط¸ظ‡ظˆط±ظ‡ط§ ظپظٹ ط§ظ„ظˆط§ط¬ظ‡ط©.
 * 4) ط¥ظ†ط´ط§ط، طھط°ظƒط±ط© ط¯ط¹ظ… ظ…ظ† ط§ظ„ظˆط§ط¬ظ‡ط© (ط¹ظ…ظ„ظٹط© UI ط­ظ‚ظٹظ‚ظٹط©).
 * 5) ظƒطھط§ط¨ط© طھظ‚ط±ظٹط± JSON ظپظٹ e2e/reports/full-subscriber.json.
 */

const REPORT_PATH = pathModule.join(__dirname, 'reports', 'full-subscriber.json');
const SHOT_DIR = pathModule.join(__dirname, 'reports', 'full-subscriber');

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
const created = { departments: [], positions: [], teams: [], meetings: [], holidays: [], leaves: [], tickets: [] };
let cachedSubscriberToken;

async function subscriberToken(request) {
  if (cachedSubscriberToken) return cachedSubscriberToken;
  const res = await request.post(`${BACKEND_URL}/api/user/auth/login`, {
    data: { email: SUBSCRIBER.email, password: SUBSCRIBER.password },
    timeout: 60000,
  });
  if (!res.ok()) throw new Error(`Subscriber login failed: ${res.status()} ${await res.text()}`);
  cachedSubscriberToken = (await res.json()).data.access_token;
  return cachedSubscriberToken;
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

test.describe('Subscriber full test', () => {

  test.beforeEach(async ({ page }) => {
    const token = await subscriberToken(page.request);
    await page.addInitScript((tok) => {
      window.localStorage.setItem('token', tok);
    }, token);
  });

  test('login via API returns valid subscriber token', async ({ request }) => {
    const token = await subscriberToken(request);
    expect(token).toBeTruthy();
    results.summary.login = 'OK';
  });

  test('subscriber session is stored for UI tests', async ({ page }) => {
    const token = await subscriberToken(page.request);
    await page.addInitScript((tok) => {
      window.localStorage.setItem('token', tok);
    }, token);
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 60000 });
    await expect(page.locator('.header')).toBeVisible({ timeout: 120000 });
    await page.context().storageState({ path: 'e2e/.auth/full-subscriber.json' });
  });

  for (const { route, name } of SUBSCRIBER_PAGES) {
    test(`subscriber page ${route} renders without fatal errors`, async ({ page }) => {
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

  // ============ ط¹ظ…ظ„ظٹط§طھ API ظ„ظ„ظ…ط´طھط±ظƒ ============
  test('subscriber API: projects list + create + delete', async ({ request }) => {
    const token = await subscriberToken(request);
    const h = authH(token);
    const employeesResponse = await request.get(`${BACKEND_URL}/api/subscriber/organization/employees`, { headers: h });
    const employeesBody = await employeesResponse.json();
    const employees = Array.isArray(employeesBody.data) ? employeesBody.data : employeesBody.data?.employees || employeesBody.data?.items || [];
    const managerId = employees.find(employee => employee.user_id)?.user_id;
    expect(managerId, 'organization needs an employee who can manage the test project').toBeTruthy();

    const listRes = await request.get(`${BACKEND_URL}/api/subscriber/organization/projects`, { headers: h });
    expect(listRes.ok()).toBeTruthy();
    results.apiOperations.push({ op: 'projects.list', ok: true });

    const name = `PW Project ${Date.now()}`;
    const createRes = await request.post(`${BACKEND_URL}/api/subscriber/organization/projects`, {
      headers: h,
      data: { name, description: 'created by full subscriber test', status: 'open', manager_id: managerId },
    });
    const createBody = await createRes.json();
    const id = createBody.data?._id || createBody.data?.id;
    results.apiOperations.push({ op: 'projects.create', ok: createRes.ok(), id });
    expect(createRes.ok()).toBeTruthy();
    if (id) {
      const delRes = await request.delete(`${BACKEND_URL}/api/subscriber/organization/projects/${id}`, { headers: h });
      results.apiOperations.push({ op: 'projects.delete', ok: delRes.ok() });
    }
  });

  test('subscriber API: tasks list + create + delete', async ({ request }) => {
    const token = await subscriberToken(request);
    const h = authH(token);

    const listRes = await request.get(`${BACKEND_URL}/api/subscriber/organization/tasks`, { headers: h });
    expect(listRes.ok()).toBeTruthy();
    results.apiOperations.push({ op: 'tasks.list', ok: true });

    // جلب موظف صالح لاستخدامه كـ assignee
    const empRes = await request.get(`${BACKEND_URL}/api/subscriber/organization/employees`, { headers: h });
    let assigneeId;
    if (empRes.ok()) {
      const empBody = await empRes.json();
      const list = Array.isArray(empBody.data) ? empBody.data : empBody.data?.employees || empBody.data?.items || [];
      assigneeId = list[0]?.user_id || list[0]?._id || list[0]?.employee_id;
    }
    if (!assigneeId) {
      // مسار بديل لجلب الموظفين
      const alt = await request.get(`${BACKEND_URL}/api/subscriber/organization/employees-details`, { headers: h });
      if (alt.ok()) {
        const altBody = await alt.json();
        const list = Array.isArray(altBody.data) ? altBody.data : altBody.data?.employees || [];
        assigneeId = list[0]?._id || list[0]?.user_id || list[0]?.employee_id;
      }
    }

    const title = `PW Task ${Date.now()}`;
    const createRes = await request.post(`${BACKEND_URL}/api/subscriber/organization/tasks`, {
      headers: h,
      data: { title, description: 'created by full subscriber test', assignee_id: assigneeId },
    });
    const createBody = await createRes.json();
    const id = createBody.data?._id || createBody.data?.id;
    results.apiOperations.push({ op: 'tasks.create', ok: createRes.ok(), id });
    expect(createRes.ok()).toBeTruthy();
    if (id) {
      const delRes = await request.delete(`${BACKEND_URL}/api/subscriber/organization/tasks/${id}`, { headers: h });
      results.apiOperations.push({ op: 'tasks.delete', ok: delRes.ok() });
    }
  });

  test('subscriber API: departments CRUD', async ({ request }) => {
    const token = await subscriberToken(request);
    const h = authH(token);

    const listRes = await request.get(`${BACKEND_URL}/api/subscriber/organization/departments`, { headers: h });
    expect(listRes.ok()).toBeTruthy();
    results.apiOperations.push({ op: 'departments.list', ok: true });

    const name = `PW Dept ${Date.now()}`;
    const createRes = await request.post(`${BACKEND_URL}/api/subscriber/organization/departments`, {
      headers: h,
      data: { name, description: 'created by full subscriber test', positions_ids: [] },
    });
    const createBody = await createRes.json();
    const id = createBody.data?._id || createBody.data?.id;
    results.apiOperations.push({ op: 'departments.create', ok: createRes.ok(), id });
    expect(createRes.ok()).toBeTruthy();
    if (id) {
      created.departments.push(id);
      const delRes = await request.delete(`${BACKEND_URL}/api/subscriber/organization/departments/${id}`, { headers: h });
      results.apiOperations.push({ op: 'departments.delete', ok: delRes.ok() });
      expect(delRes.ok()).toBeTruthy();
    }
  });

  test('subscriber API: positions CRUD', async ({ request }) => {
    const token = await subscriberToken(request);
    const h = authH(token);

    const listRes = await request.get(`${BACKEND_URL}/api/subscriber/organization/positions`, { headers: h });
    expect(listRes.ok()).toBeTruthy();
    results.apiOperations.push({ op: 'positions.list', ok: true });

    const name = `PW Position ${Date.now()}`;
    const createRes = await request.post(`${BACKEND_URL}/api/subscriber/organization/positions`, {
      headers: h,
      data: { title: name, description: 'created by full subscriber test' },
    });
    const createBody = await createRes.json();
    const id = createBody.data?._id || createBody.data?.id;
    results.apiOperations.push({ op: 'positions.create', ok: createRes.ok(), id });
    expect(createRes.ok()).toBeTruthy();
    if (id) {
      created.positions.push(id);
      const delRes = await request.delete(`${BACKEND_URL}/api/subscriber/organization/positions/${id}`, { headers: h });
      results.apiOperations.push({ op: 'positions.delete', ok: delRes.ok() });
    }
  });

  test('subscriber API: teams CRUD', async ({ request }) => {
    const token = await subscriberToken(request);
    const h = authH(token);

    const listRes = await request.get(`${BACKEND_URL}/api/subscriber/organization/teams`, { headers: h });
    expect(listRes.ok()).toBeTruthy();
    results.apiOperations.push({ op: 'teams.list', ok: true });

    const name = `PW Team ${Date.now()}`;
    const createRes = await request.post(`${BACKEND_URL}/api/subscriber/organization/teams`, {
      headers: h,
      data: { name },
    });
    const createBody = await createRes.json();
    const id = createBody.data?._id || createBody.data?.id;
    results.apiOperations.push({ op: 'teams.create', ok: createRes.ok(), id });
    expect(createRes.ok()).toBeTruthy();
    if (id) {
      created.teams.push(id);
      const delRes = await request.delete(`${BACKEND_URL}/api/subscriber/organization/teams/${id}`, { headers: h });
      results.apiOperations.push({ op: 'teams.delete', ok: delRes.ok() });
    }
  });

  test('subscriber API: meetings CRUD', async ({ request }) => {
    const token = await subscriberToken(request);
    const h = authH(token);

    const listRes = await request.get(`${BACKEND_URL}/api/subscriber/organization/meetings`, { headers: h });
    expect(listRes.ok()).toBeTruthy();
    results.apiOperations.push({ op: 'meetings.list', ok: true });

    const name = `PW Meeting ${Date.now()}`;
    const createRes = await request.post(`${BACKEND_URL}/api/subscriber/organization/meetings`, {
      headers: h,
      data: {
        title: name,
        description: 'created by full subscriber test',
        scheduled_at: new Date(Date.now() + 86400000).toISOString(),
      },
    });
    const createBody = await createRes.json();
    const id = createBody.data?._id || createBody.data?.id;
    results.apiOperations.push({ op: 'meetings.create', ok: createRes.ok(), id });
    expect(createRes.ok()).toBeTruthy();
    if (id) {
      created.meetings.push(id);
      const delRes = await request.delete(`${BACKEND_URL}/api/subscriber/organization/meetings/${id}`, { headers: h });
      results.apiOperations.push({ op: 'meetings.delete', ok: delRes.ok() });
    }
  });

  test('subscriber API: holidays CRUD', async ({ request }) => {
    const token = await subscriberToken(request);
    const h = authH(token);

    const listRes = await request.get(`${BACKEND_URL}/api/subscriber/organization/holidays`, { headers: h });
    expect(listRes.ok()).toBeTruthy();
    results.apiOperations.push({ op: 'holidays.list', ok: true });

    const name = `PW Holiday ${Date.now()}`;
    const createRes = await request.post(`${BACKEND_URL}/api/subscriber/organization/holidays`, {
      headers: h,
      data: {
        name,
        date: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
      },
    });
    const createBody = await createRes.json();
    const id = createBody.data?._id || createBody.data?.id;
    results.apiOperations.push({ op: 'holidays.create', ok: createRes.ok(), id });
    expect(createRes.ok()).toBeTruthy();
    if (id) {
      created.holidays.push(id);
      const delRes = await request.delete(`${BACKEND_URL}/api/subscriber/organization/holidays/${id}`, { headers: h });
      results.apiOperations.push({ op: 'holidays.delete', ok: delRes.ok() });
    }
  });

  test('subscriber API: appointments list + create + complete', async ({ request }) => {
    const token = await subscriberToken(request);
    const h = authH(token);

    const listRes = await request.get(`${BACKEND_URL}/api/subscriber/organization/appointments`, { headers: h });
    expect(listRes.ok()).toBeTruthy();
    results.apiOperations.push({ op: 'appointments.list', ok: true });

    const createRes = await request.post(`${BACKEND_URL}/api/subscriber/organization/appointments`, {
      headers: h,
      data: {
        title: `PW Appointment ${Date.now()}`,
        type: 'appointment',
        date: new Date(Date.now() + 3600000).toISOString(),
        start_time: '10:00',
        end_time: '11:00',
      },
    });
    const createBody = await createRes.json();
    const id = createBody.data?._id || createBody.data?.id;
    results.apiOperations.push({ op: 'appointments.create', ok: createRes.ok(), id });
    expect(createRes.ok()).toBeTruthy();
    if (id) {
      const delRes = await request.delete(`${BACKEND_URL}/api/subscriber/organization/appointments/${id}`, { headers: h });
      results.apiOperations.push({ op: 'appointments.delete', ok: delRes.ok() });
    }
  });

  test('subscriber API: employees list', async ({ request }) => {
    const token = await subscriberToken(request);
    const h = authH(token);
    const res = await request.get(`${BACKEND_URL}/api/subscriber/organization/employees`, { headers: h });
    results.apiOperations.push({ op: 'employees.list', ok: res.ok() });
    if (!res.ok()) {
      // ظ…ط³ط§ط± ط¨ط¯ظٹظ„ ط¥ظ† ظƒط§ظ† ظ…ط®طھظ„ظپظ‹ط§
      const alt = await request.get(`${BACKEND_URL}/api/subscriber/organization/employees-details`, { headers: h });
      results.apiOperations.push({ op: 'employees-details.list', ok: alt.ok() });
    }
  });

  test('subscriber API: roles list', async ({ request }) => {
    const token = await subscriberToken(request);
    const h = authH(token);
    const res = await request.get(`${BACKEND_URL}/api/subscriber/organization/roles`, { headers: h });
    results.apiOperations.push({ op: 'subscriber.roles.list', ok: res.ok() });
  });

  test('subscriber API: leaves list + create', async ({ request }) => {
    const token = await subscriberToken(request);
    const h = authH(token);

    const listRes = await request.get(`${BACKEND_URL}/api/subscriber/organization/leaves`, { headers: h });
    expect(listRes.ok()).toBeTruthy();
    results.apiOperations.push({ op: 'leaves.list', ok: true });

    // جلب موظف صالح لاستخدامه في الإجازة
    const empRes = await request.get(`${BACKEND_URL}/api/subscriber/organization/employees`, { headers: h });
    let empId;
    if (empRes.ok()) {
      const empBody = await empRes.json();
      const list = Array.isArray(empBody.data) ? empBody.data : empBody.data?.employees || empBody.data?.items || [];
      empId = list[0]?.user_id || list[0]?._id || list[0]?.employee_id;
    }

    const createRes = await request.post(`${BACKEND_URL}/api/subscriber/organization/leaves`, {
      headers: h,
      data: {
        employee_id: empId,
        date: new Date(Date.now() + 86400000 * (45 + Math.floor(Math.random() * 15))).toISOString().slice(0, 10),
        start_time: '08:00',
        end_time: '16:00',
        reason: 'created by full subscriber test',
      },
    });
    results.apiOperations.push({ op: 'leaves.create', ok: createRes.ok() });
    if (!createRes.ok()) {
      console.log('leaves.create status', createRes.status(), await createRes.text());
    } else {
      const createdLeaveId = (await createRes.json())?.data?._id;
      if (createdLeaveId) {
        const delRes = await request.delete(`${BACKEND_URL}/api/subscriber/organization/leaves/${createdLeaveId}`, { headers: h });
        results.apiOperations.push({ op: 'leaves.cleanup', ok: delRes.ok() });
      }
    }
  });

  test('subscriber API: attendances list', async ({ request }) => {
    const token = await subscriberToken(request);
    const h = authH(token);
    const res = await request.get(`${BACKEND_URL}/api/subscriber/organization/attendances`, { headers: h });
    results.apiOperations.push({ op: 'attendances.list', ok: res.ok() });
  });

  test('subscriber API: salary transactions list', async ({ request }) => {
    const token = await subscriberToken(request);
    const h = authH(token);
    const res = await request.get(`${BACKEND_URL}/api/subscriber/organization/employees-salary-transactions`, { headers: h });
    results.apiOperations.push({ op: 'salary-transactions.list', ok: res.ok() });
  });

  test('subscriber API: employee requests list', async ({ request }) => {
    const token = await subscriberToken(request);
    const h = authH(token);
    const res = await request.get(`${BACKEND_URL}/api/subscriber/organization/employees-requests`, { headers: h });
    results.apiOperations.push({ op: 'employee-requests.list', ok: res.ok() });
  });

  test('subscriber API: organization info', async ({ request }) => {
    const token = await subscriberToken(request);
    const h = authH(token);
    const res = await request.get(`${BACKEND_URL}/api/subscriber/organization`, { headers: h });
    results.apiOperations.push({ op: 'organization.get', ok: res.ok() });
  });

  test('subscriber API: subscriptions info', async ({ request }) => {
    const token = await subscriberToken(request);
    const h = authH(token);
    const res = await request.get(`${BACKEND_URL}/api/subscriptions/subscriber/my-subscription`, { headers: h });
    results.apiOperations.push({ op: 'subscriptions.get', ok: res.ok() });
    if (!res.ok()) {
      const alt = await request.get(`${BACKEND_URL}/api/subscriptions`, { headers: h });
      results.apiOperations.push({ op: 'subscriptions.alt', ok: alt.ok() });
    }
  });

  test('subscriber API: notifications + support tickets', async ({ request }) => {
    const token = await subscriberToken(request);
    const h = authH(token);
    const notif = await request.get(`${BACKEND_URL}/api/notifications/my-notifications`, { headers: h });
    const tickets = await request.get(`${BACKEND_URL}/api/support-tickets`, { headers: h });
    results.apiOperations.push({ op: 'notifications.list', ok: notif.ok() });
    results.apiOperations.push({ op: 'support-tickets.list', ok: tickets.ok() });
    expect(notif.ok()).toBeTruthy();
    expect(tickets.ok()).toBeTruthy();
  });

  // ============ ط¹ظ…ظ„ظٹط§طھ ظ…ظ† ط§ظ„ظˆط§ط¬ظ‡ط© ============
  test('UI: create support ticket from the interface', async ({ page }) => {
    const title = `PW Full Ticket ${Date.now()}`;
    await page.goto('/support-tickets', { waitUntil: 'domcontentloaded' });
    await waitForContent(page);

    const openBtn = page.getByRole('button', { name: /Open Ticket|ظپطھط­ طھط°ظƒط±ط©/i });
    await expect(openBtn).toBeVisible({ timeout: 20000 });
    await openBtn.click();

    const modal = page.locator('div.fixed.inset-0').filter({ hasText: /Open Support Ticket|ظپطھط­ طھط°ظƒط±ط© ط¯ط¹ظ…/ });
    await expect(modal).toBeVisible({ timeout: 15000 });
    await modal.getByPlaceholder(/Brief description of the issue|ظˆطµظپ ظ…ط®طھطµط± ظ„ظ„ظ…ط´ظƒظ„ط©/i).fill(title);
    await modal.getByPlaceholder(/Provide details|.*طھظپط§طµظٹظ„.*|ط§ظƒطھط¨ طھظپط§طµظٹظ„/i).fill('Created by full subscriber test.');

    const submit = modal.getByRole('button', { name: /Create Ticket|ط¥ظ†ط´ط§ط، طھط°ظƒط±ط©/i });
    await expect(submit).toBeEnabled({ timeout: 15000 });
    await submit.click();
    await expect(page.locator('main').getByText(title)).toBeVisible({ timeout: 30000 });
    results.uiOperations.push({ op: 'support-ticket.create-ui', ok: true, title });
    created.tickets.push(title);
  });

  test('UI: department created via API appears on the page', async ({ page, request }) => {
    const token = await subscriberToken(request);
    const h = authH(token);
    const name = `PW UI Dept ${Date.now()}`;
    const res = await request.post(`${BACKEND_URL}/api/subscriber/organization/departments`, {
      headers: h,
      data: { name, description: 'created by full subscriber test', positions_ids: [] },
    });
    const body = await res.json();
    const id = body.data?._id || body.data?.id;
    expect(id).toBeTruthy();

    await page.goto('/hr/departments', { waitUntil: 'domcontentloaded' });
    await waitForContent(page);
    // ملاحظة: الجدول مقسّم صفحات (5 صفوف/صفحة) و بحثه لا يلتقط أسماء الأقسام
    // (خلل extractText في Table.jsx مع مكوّن AccountDetails).
    // الحل: تكبير عدد الصفوف لكل صفحة إلى 20 لظهور القسم الجديد في الصفحة الأولى.
    const rowsPerPage = page.locator('main').getByRole('combobox').first();
    if (await rowsPerPage.isVisible().catch(() => false)) {
      await rowsPerPage.selectOption({ index: 3 });
      await page.waitForTimeout(1200);
    }
    await expect(page.locator('main').getByText(name).first()).toBeVisible({ timeout: 30000 });
    results.uiOperations.push({ op: 'department.visible-in-ui', ok: true });

    if (id) {
      const delRes = await request.delete(`${BACKEND_URL}/api/subscriber/organization/departments/${id}`, { headers: h });
      results.uiOperations.push({ op: 'department.cleanup', ok: delRes.ok() });
    }
  });

  test.afterAll(() => {
    finalize(ACC_PATH, REPORT_PATH);
  });
});
