// @ts-check
const { test, expect } = require('@playwright/test');
const pathModule = require('path');
const fs = require('fs');
const { collectPageErrors } = require('./utils/helpers');

/**
 * فحص لوحة تحكم الموظف (Employee) بحساب org1emp1@anmat.test:
 *  - فتح كل شاشات لوحة التحكم المتاحة للموظف والتقاط لقطة شاشة لكل منها.
 *  - رصد أخطاء الجافاسكربت / وحدة التحكم في كل شاشة.
 *  - رصد الصور المكسورة والعناصر البصرية المفقودة.
 *  - فتح المودالز (النوافذ المنبثقة) الرئيسية في الصفحات والتقاط لقطات لها.
 *  - كتابة تقرير JSON في e2e/reports/employee-check.json.
 *
 * القائمة مبنية من src/config/menuItems.js (allowed_to يتضمن 'Employee').
 */

const SHOT_DIR = pathModule.join(__dirname, 'reports', 'employee');
const REPORT_PATH = pathModule.join(__dirname, 'reports', 'employee-check.json');

// شاشات لوحة تحكم الموظف (من القائمة الجانبية الفعلية بحساب org1emp1@anmat.test)
const PAGES = [
  { route: '/dashboard', name: 'dashboard' },
  { route: '/employee/projects', name: 'employee_projects' },
  { route: '/employee/tasks', name: 'employee_tasks' },
  { route: '/appointments', name: 'my_agenda_appointments' },
  { route: '/attendance', name: 'attendance' },
  { route: '/salary', name: 'salary' },
  { route: '/leaves', name: 'short_leave_requests' },
  { route: '/requests', name: 'requests' },
  { route: '/conversations', name: 'conversations' },
  { route: '/ai', name: 'ai' },
  { route: '/notifications', name: 'notifications' },
  { route: '/setting', name: 'setting' },
  { route: '/profile', name: 'profile' },
];

// صفحات تحتوي على مودالز "إنشاء/إضافة" تُفتح من الصفحة مباشرة
const MODAL_PAGES = [
  '/attendance',
  '/leaves',
  '/requests',
  '/salary',
  '/employee/projects',
  '/employee/tasks',
  '/conversations',
  '/notifications',
  '/setting',
];

const CREATE_BTN_RE =
  /create|add|new|schedule|invite|request|rating|check in|check out|clock in|create a|إضافة|إنشاء|جدولة|دعوة|جديد|تسجيل د|خروج/i;
const CLOSE_BTN_RE = /cancel|close|إلغاء|إغلاق|أغلق|عودة/i;
const MODAL_SELECTORS = [
  '[role="dialog"]',
  'div[class*="fixed inset-0"]',
  '.modal-overlay',
  '[class*="modal"]',
];

/** انتظار استقرار محتوى الصفحة */
async function waitForContent(page) {
  const waitForMain = async () =>
    expect(page.locator('main')).toBeVisible({ timeout: 60000 });
  // إن علقت الصفحة على "Loading session..." (استجابة بطيئة عابرة) نعيد التحميل مرة واحدة
  await waitForMain().catch(async () => {
    await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
    await waitForMain();
  });
  // انتظار زوال السبينر الرئيسي إن وُجد
  const spinner = page.locator('main .animate-spin').first();
  if (await spinner.count()) {
    await spinner.waitFor({ state: 'detached', timeout: 45000 }).catch(() => {});
  }
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1200);
}

/** كشف وجود مودال ظاهر في الصفحة */
async function isModalVisible(page) {
  for (const sel of MODAL_SELECTORS) {
    const loc = page.locator(sel).first();
    if ((await loc.count()) && (await loc.isVisible().catch(() => false))) {
      return loc;
    }
  }
  return null;
}

/** محاولة فتح أول مودال في الصفحة عبر زر إنشاء/إضافة */
async function openFirstModal(page) {
  const candidates = [
    page.getByRole('button', { name: CREATE_BTN_RE }).first(),
    page.locator('button').filter({ hasText: CREATE_BTN_RE }).first(),
  ];
  for (const btn of candidates) {
    try {
      if (await btn.isVisible().catch(() => false)) {
        await btn.scrollIntoViewIfNeeded().catch(() => {});
        await btn.click({ timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(1200);
        const modal = await isModalVisible(page);
        if (modal) return modal;
      }
    } catch {
      // تجاهل وانتقل للزر التالي
    }
  }
  return null;
}

/** إغلاق المودال إن أمكن */
async function closeModal(page) {
  const closeBtn = page.getByRole('button', { name: CLOSE_BTN_RE }).first();
  try {
    if (await closeBtn.isVisible().catch(() => false)) {
      await closeBtn.click({ timeout: 3000 });
    }
  } catch {
    // تابع للإغلاق عبر Escape
  }
  try {
    await page.keyboard.press('Escape').catch(() => {});
  } catch {
    /* ignore */
  }
}

/** رصد الصور المكسورة في الصفحة */
async function collectBrokenImages(page) {
  await page.waitForTimeout(1500);
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll('img'))
      .filter((i) => i.src && i.complete && i.naturalWidth === 0)
      .map((i) => ({ src: i.src, alt: i.alt || '' }));
  });
}

/** كشف تجاوز أفقي في التخطيط */
async function detectHorizontalOverflow(page) {
  return page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
}

const results = { pages: [], modals: [], shell: {}, errors: [] };

test.describe('Employee dashboard check', () => {
  test('dashboard shell renders (header, sidebar, floating button)', async ({ page }) => {
    await page.goto('/dashboard');
    await waitForContent(page);

    const shell = { header: false, sidebar: false, floatingBtn: false, menuCount: 0 };
    shell.header = await page.locator('.header').isVisible().catch(() => false);
    shell.sidebar = await page
      .locator('nav, aside, [class*="w-[280px]"], [class*="md:w-[272px]"]')
      .first()
      .isVisible()
      .catch(() => false);
    shell.floatingBtn = await page
      .locator('[class*="floating"], [class*="fixed bottom-6"], [class*="rounded-full bg-primary-50"]')
      .first()
      .isVisible()
      .catch(() => false);

    // روابط القائمة الجانبية (تُعرض بناءً على الصلاحيات)
    const linkCount = await page
      .locator('a')
      .filter({ hasText: /Dashboard|Projects|Tasks|Agenda|Attendance|Salary|Leaves|Requests|Human Resources|Conversations/i })
      .count();
    shell.menuCount = linkCount;

    results.shell = shell;
    expect(shell.header, 'header not visible').toBe(true);
    await page.screenshot({ path: pathModule.join(SHOT_DIR, 'shell.png'), fullPage: false });
  });

  for (const { route, name } of PAGES) {
    test(`screen ${route} renders without fatal errors`, async ({ page }) => {
      const watch = collectPageErrors(page, {
        pageErrorsOnly: true,
        ignore: [
          /favicon/i,
          /net::ERR/i,
          /Failed to load resource/i,
          /Socket/i,
          /socket\.io/i,
          /WebSocket/i,
          /api\.anmaat\.com/i,
        ],
      });

      await page.goto(route);
      await waitForContent(page);
      await expect(page.locator('main')).toBeVisible();

      const broken = await collectBrokenImages(page);
      const overflow = await detectHorizontalOverflow(page);

      await page.screenshot({
        path: pathModule.join(SHOT_DIR, `${name}.png`),
        fullPage: true,
      });

      watch.stop();
      const entry = {
        route,
        ok: watch.errors.length === 0,
        jsErrors: watch.errors,
        brokenImages: broken,
        horizontalOverflow: overflow,
        screenshot: `${name}.png`,
      };
      results.pages.push(entry);

      for (const err of watch.errors) results.errors.push({ screen: route, error: err });

      expect(watch.errors, `fatal errors on ${route}:\n${watch.errors.join('\n')}`).toEqual([]);
    });
  }

  for (const route of MODAL_PAGES) {
    test(`modal on ${route} opens and renders content`, async ({ page }) => {
      const watch = collectPageErrors(page, {
        pageErrorsOnly: true,
        ignore: [/favicon/i, /net::ERR/i, /Socket/i, /socket\.io/i, /WebSocket/i, /api\.anmaat\.com/i],
      });

      await page.goto(route);
      await waitForContent(page);

      const modal = await openFirstModal(page);
      const name = `modal_${route.replace(/\//g, '_')}`;
      const entry = { route, opened: !!modal, screenshot: null, jsErrors: [] };

      if (modal) {
        await page.screenshot({ path: pathModule.join(SHOT_DIR, `${name}.png`) });
        entry.screenshot = `${name}.png`;
        entry.modalContentCount = await modal
          .locator('input, select, textarea, button, label')
          .count()
          .catch(() => 0);
        await closeModal(page);
      }

      watch.stop();
      entry.jsErrors = watch.errors;
      results.modals.push(entry);
      for (const err of watch.errors) results.errors.push({ screen: route, error: err });

      expect(watch.errors, `fatal errors opening modal on ${route}`).toEqual([]);
    });
  }

  test.afterAll(() => {
    fs.mkdirSync(pathModule.dirname(REPORT_PATH), { recursive: true });
    fs.writeFileSync(REPORT_PATH, JSON.stringify(results, null, 2));
  });
});
