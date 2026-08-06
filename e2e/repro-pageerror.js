const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ storageState: 'e2e/.auth/employee.json' });
  const page = await ctx.newPage();
  page.on('pageerror', (err) => {
    console.log('PAGEERROR:', err.message);
    console.log('STACK:', err.stack);
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text());
  });
  page.on('requestfailed', (req) => console.log('REQ FAILED:', req.url(), req.failure()?.errorText));
  page.on('response', (res) => { if (res.status() >= 400) console.log('HTTP', res.status(), res.url()); });

  for (const route of ['/leaves', '/salary']) {
    console.log('=== navigating', route);
    try {
      await page.goto('http://localhost:3001' + route, { waitUntil: 'load', timeout: 180000 });
      await page.waitForTimeout(6000);
      console.log('=== loaded', route, 'url=', page.url());
    } catch (e) {
      console.log('=== goto error', e.message.split('\n')[0]);
    }
  }
  await browser.close();
})();
