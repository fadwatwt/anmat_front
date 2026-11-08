import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
try {
  for (const language of ['ar', 'en']) {
    for (const width of [390, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, storageState: 'e2e/.auth/employee.json' });
      await context.addInitScript((lang) => localStorage.setItem('i18nextLng', lang), language);
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto('http://localhost:3001/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 });
      await page.getByRole('heading', { level: 1 }).waitFor({ timeout: 90000 });
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      const state = await page.evaluate(() => ({ pathname: location.pathname, overflow: document.documentElement.scrollWidth > innerWidth + 1, main: Boolean(document.querySelector('main')) }));
      assert.equal(state.pathname, '/dashboard');
      assert.equal(state.main, true);
      assert.equal(state.overflow, false, `${language}/${width}: horizontal overflow`);
      assert.deepEqual(errors, [], `${language}/${width}: page errors`);
      console.log(`${language}/${width}: PASS`);
      await context.close();
    }
  }
} finally { await browser.close(); }
