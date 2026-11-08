import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
try {
  for (const language of ['ar', 'en']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, storageState: 'e2e/.auth/subscriber.json' });
    await context.addInitScript((lang) => localStorage.setItem('i18nextLng', lang), language);
    const page = await context.newPage();
    for (const route of ['/hr/employees', '/hr/departments', '/hr/teams', '/hr/positions', '/hr/meetings', '/analytics']) {
      const errors = [];
      const onError = (error) => errors.push(error.message);
      page.on('pageerror', onError);
      await page.goto(`http://localhost:3001${route}`, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      const state = await page.evaluate(() => ({ pathname: location.pathname, main: Boolean(document.querySelector('main')), overflow: document.documentElement.scrollWidth > innerWidth + 1 }));
      page.off('pageerror', onError);
      assert.equal(state.pathname, route, `${language}${route}: redirect`);
      assert.equal(state.main, true, `${language}${route}: main content missing`);
      assert.equal(state.overflow, false, `${language}${route}: horizontal overflow`);
      assert.equal(errors.length, 0, `${language}${route}: ${errors.join('; ')}`);
      console.log(`${language}${route}: PASS`);
    }
    await context.close();
  }
} finally { await browser.close(); }
