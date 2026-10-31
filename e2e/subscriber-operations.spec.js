// @ts-check
const { test, expect } = require('@playwright/test');
const { BACKEND_URL } = require('./utils/data');
const { collectPageErrors } = require('./utils/helpers');

/**
 * عمليات المشترك (Subscriber) الوظيفية:
 *  - التنقل من الإشعارات (الميزة الجديدة: click-to-navigate + مودال التفاصيل).
 *  - إنشاء تذكرة دعم من الواجهة.
 *  - إنشاء قسم عبر API والتحقق من ظهوره في الواجهة.
 *  - صفحة الملف الشخصي تعرض بيانات المشترك.
 * جميع السجلات المُنشأة تُنظَّف في نهاية التشغيل (afterAll).
 */

const SUBSCRIBER = {
  email: process.env.E2E_SUBSCRIBER_EMAIL || 'nextsub1@anmat.test',
  password: process.env.E2E_SUBSCRIBER_PASSWORD || 'aA@123456',
};

const MODAL_SELECTOR = 'div.fixed.inset-0';

async function loginToken(request) {
  const response = await request.post(`${BACKEND_URL}/api/user/auth/login`, {
    data: { email: SUBSCRIBER.email, password: SUBSCRIBER.password },
  });
  if (!response.ok()) {
    throw new Error(`Subscriber login failed: ${response.status()} ${await response.text()}`);
  }
  return (await response.json()).data.access_token;
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

test.describe('Subscriber operations', () => {
  test.describe.configure({ mode: 'serial' });

  // تعطيل الجولة الترحيبية (DashboardTour) حتى لا تحجب النقر خلف طبقتها
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('subscriber_dashboard_tour_completed', 'true');
    });
  });

  const createdTicketTitles = [];
  const createdDepartmentIds = [];

  test('notification with a route navigates on click (click-to-navigate)', async ({ page }) => {
    const watch = collectPageErrors(page, {
      pageErrorsOnly: true,
      ignore: [/favicon/i, /net::ERR/i, /Socket/i, /socket\.io/i, /WebSocket/i, /api\.anmaat\.com/i],
    });

    await page.goto('/notifications');
    await expect(page.locator('main')).toBeVisible({ timeout: 60000 });

    // اشتراك مجدّد (Subscription Expired) يحمل model_type=Subscription + action_url نسبي
    const card = page.locator('main').getByText('Subscription Expired').first();
    await expect(card).toBeVisible({ timeout: 60000 });
    await card.click();

    await expect(page).toHaveURL(/\/subscriptions/, { timeout: 60000 });
    await expect(page.locator('main')).toBeVisible({ timeout: 60000 });

    watch.stop();
    expect(watch.errors, `fatal errors:\n${watch.errors.join('\n')}`).toEqual([]);
  });

  test('notification without a route opens the details modal', async ({ page }) => {
    const watch = collectPageErrors(page, {
      pageErrorsOnly: true,
      ignore: [/favicon/i, /net::ERR/i, /Socket/i, /socket\.io/i, /WebSocket/i, /api\.anmaat\.com/i],
    });

    await page.goto('/notifications');
    await expect(page.locator('main')).toBeVisible({ timeout: 60000 });

    const token = await page.evaluate(() => window.localStorage.getItem('token'));
    const response = await page.request.get(`${BACKEND_URL}/api/notifications/my-notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.ok()).toBeTruthy();
    const payload = await response.json();
    const notifications = Array.isArray(payload.data) ? payload.data : payload.data?.notifications || payload.data?.items || [];
    const withoutRoute = notifications.find((notification) => !notification.action_url && notification.title);
    if (!withoutRoute) {
      test.skip(true, 'No notification without an action URL in this account');
    }
    const card = page.locator('main').getByText(withoutRoute.title).first();
    await expect(card).toBeVisible({ timeout: 15000 });
    await card.click();

    const modal = page.locator(MODAL_SELECTOR).filter({ hasText: 'Notification Details' });
    await expect(modal).toBeVisible({ timeout: 15000 });
    await expect(modal).toContainText(withoutRoute.title);
    // ميزة "فتح العنصر المرتبط" لا تظهر لأنه لا يوجد مسار لهذا الإشعار
    await expect(modal.getByRole('button', { name: /Open Related|فتح العنصر المرتبط/i })).toHaveCount(0);

    // إغلاق المودال عبر زر X
    await modal.getByRole('button').first().click();
    await expect(modal).toBeHidden({ timeout: 10000 });

    watch.stop();
    expect(watch.errors, `fatal errors:\n${watch.errors.join('\n')}`).toEqual([]);
  });

  test('creates a support ticket from the UI', async ({ page }) => {
    const title = `PW Ticket ${Date.now()}`;

    await page.goto('/support-tickets');
    await expect(page.locator('main')).toBeVisible({ timeout: 60000 });

    await page.getByRole('button', { name: /Open Ticket|فتح تذكرة/i }).click();
    const modal = page.locator(MODAL_SELECTOR).filter({ hasText: /Open Support Ticket|فتح تذكرة دعم/ });
    await expect(modal).toBeVisible({ timeout: 15000 });

    await modal
      .getByPlaceholder(/Brief description of the issue|وصف مختصر للمشكلة/i)
      .fill(title);
    await modal
      .getByPlaceholder(/Provide details about the issue or request|.*تفاصيل.*المشكلة|اكتب تفاصيل/i)
      .fill('Created by the Playwright subscriber operations spec.');

    const submit = modal.getByRole('button', { name: /Create Ticket|إنشاء تذكرة/i });
    await expect(submit).toBeEnabled({ timeout: 15000 });
    await submit.click();

    // يظهر التذكرة الجديدة في الجدول (الأحدث أولاً)
    await expect(page.locator('main').getByText(title)).toBeVisible({ timeout: 30000 });
    createdTicketTitles.push(title);
  });

  test('creates a department via API and renders it in the UI', async ({ page, request }) => {
    const token = await loginToken(request);
    const name = `PW Dept ${Date.now()}`;

    const createResponse = await request.post(
      `${BACKEND_URL}/api/subscriber/organization/departments`,
      {
        headers: authHeaders(token),
        data: { name, description: 'Created by the Playwright subscriber operations spec.', positions_ids: [] },
      },
    );
    expect(createResponse.ok()).toBeTruthy();
    const created = await createResponse.json();
    const deptId = created.data?._id;
    expect(deptId).toBeTruthy();
    createdDepartmentIds.push(deptId);

    // التأكد أن القسم موجود في قائمة الأقسام عبر API
    const listResponse = await request.get(`${BACKEND_URL}/api/subscriber/organization/departments`, {
      headers: authHeaders(token),
    });
    expect(listResponse.ok()).toBeTruthy();
    const listBody = await listResponse.json();
    expect(listBody.data.some((d) => d.name === name)).toBeTruthy();

    // التحقق من ظهور القسم في الواجهة عبر صفحة ملف القسم
    await page.goto(`/hr/departments/${deptId}/profile`);
    await expect(page.locator('main')).toBeVisible({ timeout: 60000 });
    await expect(page.locator('main').getByRole('heading', { level: 1 })).toContainText(name, { timeout: 30000 });
  });

  test('profile page renders the subscriber info', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.locator('main')).toBeVisible({ timeout: 60000 });
    await expect(page.locator('main').getByText('Subscriber 4').first()).toBeVisible({ timeout: 30000 });
  });

  test.afterAll(async ({ request }) => {
    const token = await loginToken(request);

    for (const id of createdDepartmentIds) {
      await request.delete(`${BACKEND_URL}/api/subscriber/organization/departments/${id}`, {
        headers: authHeaders(token),
      }).catch(() => {});
    }

    if (createdTicketTitles.length) {
      const listResponse = await request.get(`${BACKEND_URL}/api/support-tickets`, {
        headers: authHeaders(token),
      }).catch(() => null);
      if (listResponse && listResponse.ok()) {
        const body = await listResponse.json();
        for (const ticket of body.data || []) {
          if (createdTicketTitles.includes(ticket.title)) {
            await request.delete(`${BACKEND_URL}/api/support-tickets/${ticket._id}`, {
              headers: authHeaders(token),
            }).catch(() => {});
          }
        }
      }
    }
  });
});
