import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
const browser = await chromium.launch({ headless: true });
try {
  for (const language of ['ar', 'en']) {
    for (const width of [390, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: 844 },
        storageState: 'e2e/.auth/subscriber.json',
      });
      await context.addInitScript((lang) => localStorage.setItem('i18nextLng', lang), language);
      const page = await context.newPage();
      for (const route of ['/tasks', '/projects', '/hr/time-off', '/setting']) {
        const errors = [];
        const onError = (error) => errors.push(error.message);
        page.on('pageerror', onError);
        await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 90000 });
        await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
        const state = await page.evaluate(() => ({
          pathname: location.pathname,
          overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
          hasMain: Boolean(document.querySelector('main')),
        }));
        page.off('pageerror', onError);
        assert.equal(state.pathname, route, `${language}/${width}${route}: redirected to ${state.pathname}`);
        assert.equal(state.hasMain, true, `${language}/${width}${route}: main content missing`);
        assert.equal(state.overflow, false, `${language}/${width}${route}: horizontal overflow`);
        assert.equal(errors.length, 0, `${language}/${width}${route}: ${errors.join('; ')}`);
        console.log(`${language}/${width}${route}: PASS`);
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
}
