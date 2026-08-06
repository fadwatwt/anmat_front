// @ts-check
const { test, expect } = require('@playwright/test');
const pathModule = require('path');
const fs = require('fs');

/**
 * تدقيق لغة لوحة تحكم الموظف بالنسخة العربية:
 *  - يُجبر التطبيق على العربية ثم يزحف على كل شاشات الموظف.
 *  - يجمع أي نص مرئي يحتوي أحرفًا لاتينية (إنجليزية) في الصفحة.
 *  - يفتح المودالز الرئيسية ويعيد الفحص داخلها.
 *  - يفتح قائمة الإشعارات (alert dropdown) ويفحصها.
 *  - يفحص أي حاوية تنبيه/توست ظاهرة في كل شاشة.
 *
 * النتيجة تُكتب دائمًا (حتى عند فشل خطوة) في e2e/reports/employee-i18n-check.json + txt.
 */

const REPORT_DIR = pathModule.join(__dirname, 'reports');
const REPORT_JSON = pathModule.join(REPORT_DIR, 'employee-i18n-check.json');
const REPORT_TXT = pathModule.join(REPORT_DIR, 'employee-i18n-check.txt');

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

const ALLOWED_TOKENS = /^(Anmaat|anmaat|AI|ChatGPT|Gemini|React|Node|HTML|CSS|JS|TS|API|HTTP|HTTPS|OK|ID|vs|GB|MB|KB|AM|PM|GMT|UTC|NaN|undefined|null|true|false|Email|E-mail|Password|Loading|Loading\.\.\.|Loading session|socket\.io|WebSocket|WebSockets|favicon)$/i;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL = /^(https?:\/\/|www\.)/i;
const DATE_TIME = /^(\d{1,4}[\s\-/.,:]\d{1,4}|[A-Za-z]{3,4}[\s\-.,]\d{1,4}|GMT|[+-]\d{4}|[A-Za-z]{3,9}\s+\d{1,2}[,.]?\s+\d{4})/;
const PURE_SYMBOL = /^[^A-Za-z]{2,}$/;
const SINGLE = /^.{1,3}$/;

function classify(text) {
  if (EMAIL.test(text) || URL.test(text)) return 'email-url';
  if (DATE_TIME.test(text)) return 'date-number';
  if (PURE_SYMBOL.test(text)) return 'symbols';
  if (SINGLE.test(text)) return 'short';
  if (ALLOWED_TOKENS.test(text)) return 'allowed';
  return 'FLAG';
}

async function waitForContent(page) {
  const waitForMain = async () =>
    expect(page.locator('main')).toBeVisible({ timeout: 60000 });
  await waitForMain().catch(async () => {
    await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
    await waitForMain();
  });
  const spinner = page.locator('main .animate-spin').first();
  if (await spinner.count()) {
    await spinner.waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});
  }
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(800);
}

async function waitForArabic(page) {
  await page
    .waitForFunction(() => document.documentElement.lang === 'ar', null, { timeout: 60000 })
    .catch(() => {});
  // i18next loads translation JSON asynchronously; wait until the visible Latin
  // text set stops changing so we don't snapshot the pre-translation fallback DOM.
  // Only visible text counts (scripts have no layout), otherwise the constant
  // __next_f payloads make the set look stable immediately.
  const snapshotVisibleLatin = () =>
    page.evaluate(() => {
      const results = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const isVisible = (el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      };
      let node;
      while ((node = walker.nextNode())) {
        const el = node.parentElement;
        if (!el || !isVisible(el)) continue;
        const text = (node.textContent || '').trim();
        if (text && /[A-Za-z]/.test(text)) results.push(text);
      }
      return JSON.stringify([...new Set(results)]);
    });
  for (let i = 0; i < 10; i++) {
    const before = await snapshotVisibleLatin();
    await page.waitForTimeout(1500);
    const after = await snapshotVisibleLatin();
    if (before === after) break;
  }
  await page.waitForTimeout(800);
}

/** جمع النصوص اللاتينية الظاهرة داخل root (سلسلة محدد) */
async function collectLatinTexts(page, rootSelector) {
  return page.evaluate((sel) => {
    const root = sel ? document.querySelector(sel) : document.body;
    if (!root) return [];
    const results = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const isVisible = (el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    let node;
    while ((node = walker.nextNode())) {
      const el = node.parentElement;
      if (!el || !isVisible(el)) continue;
      const text = (node.textContent || '').trim();
      if (text && /[A-Za-z]/.test(text)) results.push(text);
    }
    for (const el of root.querySelectorAll(
      'input,textarea,select,[aria-label],[title],[placeholder]',
    )) {
      if (!isVisible(el)) continue;
      for (const attr of ['placeholder', 'aria-label', 'title']) {
        const v = (el.getAttribute(attr) || '').trim();
        if (v && /[A-Za-z]/.test(v)) results.push(`[${attr}] ${v}`);
      }
    }
    return [...new Set(results)];
  }, rootSelector);
}

/** جمع النصوص اللاتينية داخل المودال الظاهر (يُحدد داخل المتصفح) */
async function collectLatinTextsInModal(page) {
  return page.evaluate(() => {
    const sels = [
      '[role="dialog"]',
      'div[class*="fixed inset-0"]',
      '.modal-overlay',
      '[class*="modal"]',
    ];
    let root = null;
    for (const s of sels) {
      const el = document.querySelector(s);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        root = el;
        break;
      }
    }
    if (!root) return [];
    const results = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const isVisible = (el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    let node;
    while ((node = walker.nextNode())) {
      const el = node.parentElement;
      if (!el || !isVisible(el)) continue;
      const text = (node.textContent || '').trim();
      if (text && /[A-Za-z]/.test(text)) results.push(text);
    }
    for (const el of root.querySelectorAll(
      'input,textarea,select,[aria-label],[title],[placeholder]',
    )) {
      if (!isVisible(el)) continue;
      for (const attr of ['placeholder', 'aria-label', 'title']) {
        const v = (el.getAttribute(attr) || '').trim();
        if (v && /[A-Za-z]/.test(v)) results.push(`[${attr}] ${v}`);
      }
    }
    return [...new Set(results)];
  });
}

async function openFirstModal(page) {
  const candidates = [
    page.getByRole('button', { name: CREATE_BTN_RE }).first(),
    page.locator('button').filter({ hasText: CREATE_BTN_RE }).first(),
  ];
  for (const btn of candidates) {
    try {
      if ((await btn.count()) && (await btn.isVisible().catch(() => false))) {
        await btn.scrollIntoViewIfNeeded().catch(() => {});
        await btn.click({ timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(1000);
        const hasDialog = await page
          .evaluate(() => {
            const sels = [
              '[role="dialog"]',
              'div[class*="fixed inset-0"]',
              '.modal-overlay',
              '[class*="modal"]',
            ];
            return sels.some((s) => {
              const el = document.querySelector(s);
              if (!el) return false;
              const r = el.getBoundingClientRect();
              return r.width > 0 && r.height > 0;
            });
          })
          .catch(() => false);
        if (hasDialog) return true;
      }
    } catch {
      /* ignore */
    }
  }
  return false;
}

async function openNotificationsDropdown(page) {
  const bell = page
    .locator('[aria-label*="notification" i], [title*="notification" i], [class*="bell"], [class*="Bell"]')
    .first();
  try {
    if ((await bell.count()) && (await bell.isVisible().catch(() => false))) {
      await bell.click({ timeout: 4000 }).catch(() => {});
      await page.waitForTimeout(1200);
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

function buildEntry(path, lang, dir, scope, error) {
  const texts = [...new Set(scope || [])];
  const flagged = [];
  for (const t of texts) {
    const kind = classify(t.replace(/^\[[a-z-]+\]\s*/, ''));
    if (kind === 'FLAG') flagged.push(t);
  }
  return { path, lang, dir, totalLatin: texts.length, flagged, error: error || null };
}

test.describe('Arabic text audit (employee dashboard)', () => {
  const findings = { pages: [], modals: [], alerts: [], errors: [] };

  test('scan all employee pages for Latin text in Arabic mode', async ({ page }) => {
    test.setTimeout(1500000);
    await page.addInitScript(() => {
      window.localStorage.setItem('i18nextLng', 'ar');
    });

    try {
      for (const { route } of PAGES) {
        try {
          await page.goto(route, { waitUntil: 'domcontentloaded' }).catch(() => {});
          await waitForContent(page);
          await waitForArabic(page);

          const lang = await page.evaluate(() => document.documentElement.lang);
          const dir = await page.evaluate(() => document.documentElement.dir);

          const pageScope = await collectLatinTexts(page, null);
          findings.pages.push(buildEntry(route, lang, dir, pageScope));

          if (await openNotificationsDropdown(page)) {
            const alertScope = await collectLatinTexts(page, null);
            findings.alerts.push(buildEntry(`${route} → notifications`, lang, dir, alertScope));
            await page.keyboard.press('Escape').catch(() => {});
          }

          const toastScope = await collectLatinTexts(
            page,
            '[role="alert"], [class*="toast"], [class*="Toast"], [class*="alert"], [class*="Alert"]',
          );
          if (toastScope.length) {
            findings.alerts.push(buildEntry(`${route} → toasts`, lang, dir, toastScope));
          }
        } catch (e) {
          findings.errors.push(`page ${route}: ${String(e).split('\n')[0]}`);
        }
      }

      for (const route of MODAL_PAGES) {
        try {
          await page.goto(route, { waitUntil: 'domcontentloaded' }).catch(() => {});
          await waitForContent(page);
          await waitForArabic(page);
          const lang = await page.evaluate(() => document.documentElement.lang);
          const dir = await page.evaluate(() => document.documentElement.dir);

          const opened = await openFirstModal(page);
          if (opened) {
            const scope = await collectLatinTextsInModal(page);
            findings.modals.push(buildEntry(route, lang, dir, scope));
          } else {
            findings.modals.push(buildEntry(route, lang, dir, [], 'no modal opened'));
          }
        } catch (e) {
          findings.errors.push(`modal ${route}: ${String(e).split('\n')[0]}`);
        }
      }
    } finally {
      const totalFlags = [...findings.pages, ...findings.modals, ...findings.alerts].reduce(
        (n, f) => n + f.flagged.length,
        0,
      );

      fs.mkdirSync(REPORT_DIR, { recursive: true });
      fs.writeFileSync(REPORT_JSON, JSON.stringify(findings, null, 2));

      const lines = [];
      const dump = (label, list) => {
        for (const f of list) {
          lines.push(`\n=== ${label} ${f.path}  [lang=${f.lang}, dir=${f.dir}, latin=${f.totalLatin}] ===`);
          if (f.error) lines.push(`  !! ${f.error}`);
          if (f.lang !== 'ar') lines.push('  !! page did NOT reach Arabic mode');
          if (f.flagged.length === 0) {
            lines.push('  (no suspicious Latin text)');
          } else {
            for (const s of f.flagged) lines.push(`  - ${s}`);
          }
        }
      };
      dump('PAGE', findings.pages);
      dump('MODAL', findings.modals);
      dump('ALERT', findings.alerts);
      if (findings.errors.length) {
        lines.push('\n=== ERRORS ===');
        for (const e of findings.errors) lines.push(`  - ${e}`);
      }
      lines.push(`\n===== TOTAL SUSPICIOUS: ${totalFlags} =====`);
      fs.writeFileSync(REPORT_TXT, lines.join('\n'), 'utf8');
      console.log(`\nEmployee i18n report: ${REPORT_TXT}`);
    }
  });
});
