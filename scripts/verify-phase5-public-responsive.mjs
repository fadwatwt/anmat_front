import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
const browser = await chromium.launch({ headless: true });
try {
  for (const language of ['ar', 'en']) {
    for (const width of [390, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 844 } });
      await context.addInitScript((lang) => localStorage.setItem('i18nextLng', lang), language);
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(`${baseUrl}/sign-in`, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
      const state = await page.evaluate(() => ({
        title: document.title,
        language: document.documentElement.lang,
        overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        hasForm: Boolean(document.querySelector('form')),
      }));
      assert.equal(state.overflow, false, `${language}/${width}: horizontal overflow`);
      assert.equal(state.hasForm, true, `${language}/${width}: sign-in form missing`);
      assert.equal(errors.length, 0, `${language}/${width}: ${errors.join('; ')}`);
      console.log(`${language}/${width}: PASS`);
      await context.close();
    }
  }
} finally {
  await browser.close();
}
