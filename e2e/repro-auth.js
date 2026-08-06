const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ storageState: 'e2e/.auth/employee.json' });
  const page = await ctx.newPage();
  page.on('pageerror', (err) => console.log('PAGEERROR:', err.message));
  page.on('console', (msg) => { if (msg.type() === 'error') console.log('CONSOLE ERR:', msg.text().slice(0, 300)); });
  page.on('response', (res) => {
    const u = res.url();
    if (u.includes('127.0.0.1') || u.includes('user/auth') || u.includes('permissions'))
      console.log('RESP', res.status(), u.slice(0, 120));
  });
  page.on('requestfailed', (req) => console.log('REQFAIL', req.url().slice(0, 120), req.failure()?.errorText));

  await page.goto('http://localhost:3001/dashboard', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(8000);
  console.log('FINAL URL:', page.url());
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 300).replace(/\s+/g, ' '));
  console.log('BODY:', bodyText);
  await browser.close();
})();
