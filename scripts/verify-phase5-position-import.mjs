import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ storageState: 'e2e/.auth/subscriber.json' });
  await context.addInitScript(() => localStorage.setItem('i18nextLng', 'en'));
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('http://localhost:3001/hr/positions', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.getByRole('button', { name: 'Import positions' }).click();
  await page.getByLabel('Positions file').setInputFiles({
    name: 'positions.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('title,description,level\nSample role,For preview only,2\nSample role,Duplicate,1\n,Invalid,1'),
  });
  await page.getByText('Ready to import: 1 / 3').waitFor();
  assert.equal(await page.getByText('Duplicate', { exact: true }).count(), 1);
  assert.equal(await page.getByText('Invalid', { exact: true }).count(), 1);
  assert.deepEqual(errors, []);
  console.log('Position import preview: PASS');
} finally {
  await browser.close();
}
