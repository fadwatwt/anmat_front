// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const { ADMIN_PAGES } = require('./utils/data');

/**
 * تدقيق لغة الواجهة: يُجبر التطبيق على العربية ثم يزحف على كل صفحات
 * لوحة الأدمن ويجمع أي نص مرئي يحتوي أحرفًا لاتينية (إنجليزية).
 *
 * النتائج تُكتب في ملف تقرير خارجي دون إفشال الحزمة، لأن بعض النصوص
 * اللاتينية مشروعة (أسماء مستخدمين، بريد، أسماء علامات تجارية، أرقام).
 */

const REPORT = 'C:/Users/HP/AppData/Local/Temp/opencode/i18n-runtime-report.txt';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL = /^(https?:\/\/|www\.)/i;
const DATE_TIME = /^(\d{1,4}[\s\-/.,:]\d{1,4}|[A-Za-z]{3,4}[\s\-.,]\d{1,4}|GMT|[+-]\d{4})/;
const PURE_SYMBOL = /^[^A-Za-z]{2,}$/;
const SINGLE = /^.{1,2}$/;

function classify(text) {
  if (EMAIL.test(text) || URL.test(text)) return 'email-url';
  if (DATE_TIME.test(text)) return 'date-number';
  if (PURE_SYMBOL.test(text)) return 'symbols';
  if (SINGLE.test(text)) return 'short';
  return 'FLAG';
}

test.describe('Arabic text audit (admin dashboard)', () => {
  const findings = [];

  test('scan all admin pages for Latin text in Arabic mode', async ({ page }) => {
    test.setTimeout(900000);
    // فرض اللغة العربية قبل تشغيل سكربتات التطبيق
    await page.addInitScript(() => {
      window.localStorage.setItem('i18nextLng', 'ar');
      window.localStorage.setItem('token', window.localStorage.getItem('token') || '');
    });

    for (const { path, title } of ADMIN_PAGES) {
      const pageFindings = [];
      await page.goto(path, { waitUntil: 'domcontentloaded' }).catch(() => {});
      // انتظار تحميل ملف الترجمة العربية
      await page.waitForFunction(() => document.documentElement.lang === 'ar', null, { timeout: 60000 })
        .catch(() => {});
      await page.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {});
      await page.waitForTimeout(2000);

      const lang = await page.evaluate(() => document.documentElement.lang);
      const dir = await page.evaluate(() => document.documentElement.dir);

      const texts = await page.evaluate(() => {
        const results = [];
        const root = document.body;
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
        // attributes المرئية (placeholders, aria-label, title)
        for (const el of root.querySelectorAll('input,textarea,select,[aria-label],[title],[placeholder]')) {
          if (!isVisible(el)) continue;
          for (const attr of ['placeholder', 'aria-label', 'title']) {
            const v = (el.getAttribute(attr) || '').trim();
            if (v && /[A-Za-z]/.test(v)) results.push(`[${attr}] ${v}`);
          }
        }
        return results;
      });

      for (const t of texts) {
        const kind = classify(t.replace(/^\[[a-z-]+\]\s*/, ''));
        if (kind === 'FLAG') pageFindings.push(t);
      }

      findings.push({ path, title, lang, dir, flagged: pageFindings });
    }

    const lines = [];
    let totalFlags = 0;
    for (const f of findings) {
      lines.push(`\n=== ${f.path}  [lang=${f.lang}, dir=${f.dir}] ===`);
      if (f.lang !== 'ar') lines.push('  !! page did NOT reach Arabic mode');
      if (f.flagged.length === 0) {
        lines.push('  (no Latin text found)');
      } else {
        totalFlags += f.flagged.length;
        for (const s of f.flagged) lines.push(`  - ${s}`);
      }
    }
    lines.push(`\n===== TOTAL FLAGGED: ${totalFlags} =====`);
    fs.writeFileSync(REPORT, lines.join('\n'), 'utf8');
    console.log(`\nAudit report: ${REPORT}`);

    // تحقق ناعم: كل صفحة يجب أن تعمل في وضع عربي
    const notArabic = findings.filter((f) => f.lang !== 'ar');
    expect(notArabic, `pages not in Arabic mode: ${notArabic.map((f) => f.path).join(', ')}`).toEqual([]);
  });
});
