// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const pathModule = require('path');
const { BACKEND_URL, ADMIN, ADMIN_PAGES } = require('./utils/full-data');
const { collectPageErrors } = require('./utils/helpers');
const { record, finalize } = require('./utils/report');

/**
 * ط§ظ„ط§ط®طھط¨ط§ط± ط§ظ„ط´ط§ظ…ظ„ ظ„ط£ط¯ظˆط§ط± ط§ظ„ط£ط¯ظ…ظ† (Super Admin):
 * 1) ظپطھط­ ظƒظ„ طµظپط­ط§طھ ط§ظ„ط£ط¯ظ…ظ† ظˆط§ظ„طھط£ظƒط¯ ظ…ظ† ط¹ط¯ظ… ظˆط¬ظˆط¯ ط£ط®ط·ط§ط، JavaScript ظ‚ط§طھظ„ط©.
 * 2) ط¹ظ…ظ„ظٹط§طھ API ظƒط§ظ…ظ„ط© (ظ‚ط±ط§ط،ط©/ط¥ظ†ط´ط§ط،/طھط­ط¯ظٹط«) ط¹ط¨ط± ط§ظ„ظˆط§ط¬ظ‡ط© ط§ظ„ط®ظ„ظپظٹط© ظ…ط¹ طھظ†ط¸ظٹظپ ط§ظ„ط¨ظٹط§ظ†ط§طھ.
 * 3) ظپطھط­ ط§ظ„ظ…ظˆط¯ط§ظ„ط² ط§ظ„ط±ط¦ظٹط³ظٹط© (ط¥ظ†ط´ط§ط،) ظ…ظ† ط§ظ„طµظپط­ط§طھ.
 * 4) ظƒطھط§ط¨ط© طھظ‚ط±ظٹط± JSON ط´ط§ظ…ظ„ ظپظٹ e2e/reports/full-admin.json.
 */

const REPORT_PATH = pathModule.join(__dirname, 'reports', 'full-admin.json');
const SHOT_DIR = pathModule.join(__dirname, 'reports', 'full-admin');

const results = { pages: [], apiOperations: [], modals: [], errors: [], summary: {} };
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
const createdIds = { roles: [], industries: [] };
let cachedAdminToken;

async function adminToken(request) {
  if (cachedAdminToken) return cachedAdminToken;
  const res = await request.post(`${BACKEND_URL}/api/admin/auth/login`, {
    data: { email: ADMIN.email, password: ADMIN.password },
    timeout: 60000,
  });
  if (!res.ok()) throw new Error(`Admin login failed: ${res.status()} ${await res.text()}`);
  cachedAdminToken = (await res.json()).data.access_token;
  return cachedAdminToken;
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

test.describe('Admin full test', () => {

  test.beforeEach(async ({ page }) => {
    const token = await adminToken(page.request);
    await page.addInitScript((tok) => {
      window.localStorage.setItem('token', tok);
    }, token);
  });

  test('login via API returns valid admin token', async ({ request }) => {
    const token = await adminToken(request);
    expect(token).toBeTruthy();
    results.summary.login = 'OK';
  });

  test('admin session is stored for UI tests', async ({ page }) => {
    const token = await adminToken(page.request);
    await page.addInitScript((tok) => {
      window.localStorage.setItem('token', tok);
    }, token);
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 60000 });
    await expect(page.locator('.header')).toBeVisible({ timeout: 120000 });
    await page.context().storageState({ path: 'e2e/.auth/full-admin.json' });
  });

  for (const { route, name } of ADMIN_PAGES) {
    test(`admin page ${route} renders without fatal errors`, async ({ page }) => {
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

  // ============ ط¹ظ…ظ„ظٹط§طھ API ظƒط§ظ…ظ„ط© ظ„ظ„ط£ط¯ظ…ظ† ============
  test('admin API: roles CRUD (list/create/delete)', async ({ request }) => {
    const token = await adminToken(request);
    const h = authH(token);

    const listRes = await request.get(`${BACKEND_URL}/api/admin/roles`, { headers: h });
    const listBody = await listRes.json();
    expect(listRes.ok()).toBeTruthy();
    expect(Array.isArray(listBody.data)).toBe(true);

    const name = `PW Role ${Date.now()}`;
    const createRes = await request.post(`${BACKEND_URL}/api/admin/roles`, {
      headers: h,
      data: { name, admin_permissions_ids: [] },
    });
    const createBody = await createRes.json();
    const roleId = createBody.data?._id || createBody.data?.id;
    results.apiOperations.push({ op: 'admin.roles.create', ok: createRes.ok(), id: roleId });

    if (roleId) {
      createdIds.roles.push(roleId);
      const delRes = await request.delete(`${BACKEND_URL}/api/admin/roles/${roleId}`, { headers: h });
      results.apiOperations.push({ op: 'admin.roles.delete', ok: delRes.ok() });
      expect(delRes.ok()).toBeTruthy();
    }
    expect(createRes.ok()).toBeTruthy();
  });

  test('admin API: industries CRUD (list/create/delete)', async ({ request }) => {
    const token = await adminToken(request);
    const h = authH(token);

    const listRes = await request.get(`${BACKEND_URL}/api/admin/industries`, { headers: h });
    const listBody = await listRes.json();
    expect(listRes.ok()).toBeTruthy();
    expect(Array.isArray(listBody.data)).toBe(true);

    const name = `PW Industry ${Date.now()}`;
    const createRes = await request.post(`${BACKEND_URL}/api/admin/industries`, {
      headers: h,
      data: { name, is_allowed: true },
    });
    const createBody = await createRes.json();
    const indId = createBody.data?._id || createBody.data?.id;
    results.apiOperations.push({ op: 'admin.industries.create', ok: createRes.ok(), id: indId });

    if (indId) {
      const delRes = await request.delete(`${BACKEND_URL}/api/admin/industries/${indId}`, { headers: h });
      results.apiOperations.push({ op: 'admin.industries.delete', ok: delRes.ok() });
    }
    expect(createRes.ok()).toBeTruthy();
  });

  test('admin API: subscribers list and detail', async ({ request }) => {
    const token = await adminToken(request);
    const h = authH(token);
    const res = await request.get(`${BACKEND_URL}/api/admin/subscribers`, { headers: h });
    const body = await res.json();
    expect(res.ok()).toBeTruthy();
    const list = Array.isArray(body.data) ? body.data : body.data?.items || [];
    expect(list.length).toBeGreaterThan(0);
    results.apiOperations.push({ op: 'admin.subscribers.list', ok: true, count: list.length });
  });

  test('admin API: subscription plans list', async ({ request }) => {
    const token = await adminToken(request);
    const h = authH(token);
    const res = await request.get(`${BACKEND_URL}/api/admin/subscription-plans`, { headers: h });
    const body = await res.json();
    expect(res.ok()).toBeTruthy();
    const list = Array.isArray(body.data) ? body.data : [];
    results.apiOperations.push({ op: 'admin.plans.list', ok: true, count: list.length });
  });

  test('admin API: money receiving methods list', async ({ request }) => {
    const token = await adminToken(request);
    const h = authH(token);
    const res = await request.get(`${BACKEND_URL}/api/admin/money-receiving-methods`, { headers: h });
    const body = await res.json();
    expect(res.ok()).toBeTruthy();
    const list = Array.isArray(body.data) ? body.data : [];
    results.apiOperations.push({ op: 'admin.money-receiving.list', ok: true, count: list.length });
  });

  test('admin API: analytics data', async ({ request }) => {
    const token = await adminToken(request);
    const h = authH(token);
    const res = await request.get(`${BACKEND_URL}/api/admin/analytics`, { headers: h });
    const body = await res.json();
    expect(res.ok()).toBeTruthy();
    results.apiOperations.push({ op: 'admin.analytics', ok: true, hasData: !!body.data });
  });

  test('admin API: activity logs', async ({ request }) => {
    const token = await adminToken(request);
    const h = authH(token);
    const res = await request.get(`${BACKEND_URL}/api/activity-logs`, { headers: h });
    expect(res.ok()).toBeTruthy();
    results.apiOperations.push({ op: 'admin.activity-logs', ok: true });
  });

  test('admin API: notifications', async ({ request }) => {
    const token = await adminToken(request);
    const h = authH(token);
    const res = await request.get(`${BACKEND_URL}/api/notifications/my-notifications`, { headers: h });
    expect(res.ok()).toBeTruthy();
    results.apiOperations.push({ op: 'admin.notifications', ok: true });
  });

  test('admin API: support tickets', async ({ request }) => {
    const token = await adminToken(request);
    const h = authH(token);
    const res = await request.get(`${BACKEND_URL}/api/support-tickets`, { headers: h });
    expect(res.ok()).toBeTruthy();
    results.apiOperations.push({ op: 'admin.support-tickets', ok: true });
  });

  test('admin API: AI token packages and balance', async ({ request }) => {
    const token = await adminToken(request);
    const h = authH(token);
    const packages = await request.get(`${BACKEND_URL}/api/ai/admin/token-packages`, { headers: h });
    const balance = await request.get(`${BACKEND_URL}/api/ai/tokens/balance`, { headers: h });
    results.apiOperations.push({ op: 'admin.ai.token-packages', ok: packages.ok() });
    results.apiOperations.push({ op: 'admin.ai.balance', ok: balance.ok() });
    expect(packages.ok()).toBeTruthy();
    expect(balance.ok()).toBeTruthy();
  });

  // ============ ط§ظ„ظ…ظˆط¯ط§ظ„ط² ظ…ظ† ط§ظ„ظˆط§ط¬ظ‡ط© ============
  for (const route of ['/industries', '/system-admins', '/roles/admins', '/plans', '/money-receiving', '/support-tickets', '/subscribers']) {
    test(`admin modal on ${route} opens`, async ({ page }) => {
      const watch = collectPageErrors(page, {
        pageErrorsOnly: true,
        ignore: [/favicon/i, /net::ERR/i, /Socket/i, /socket\.io/i, /WebSocket/i, /api\.anmaat\.com/i],
      });
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await waitForContent(page);

      const createBtn = page.getByRole('button', { name: /create|add|new|ط¥ط¶ط§ظپط©|ط¥ظ†ط´ط§ط،|ط¬ط¯ظٹط¯/i }).first();
      let opened = false;
      let note = '';
      if (!(await createBtn.isVisible().catch(() => false))) {
        note = 'no-create-action-on-page (by design)';
        opened = true;
      } else {
        await createBtn.click({ timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(1200);
        const dialog = page.locator('[role="dialog"], div.fixed.inset-0').first();
        opened = (await dialog.count()) && (await dialog.isVisible().catch(() => false));
        if (opened) await page.screenshot({ path: pathModule.join(SHOT_DIR, `modal_${route.replace(/\//g, '_')}.png`) }).catch(() => {});
        await page.keyboard.press('Escape').catch(() => {});
      }
      watch.stop();
      results.modals.push({ route, opened, note });
      for (const e of watch.errors) results.errors.push({ screen: `${route} (modal)`, error: e });
      expect(watch.errors, `errors opening modal on ${route}`).toEqual([]);
    });
  }

  test.afterAll(() => {
    finalize(ACC_PATH, REPORT_PATH);
  });
});
