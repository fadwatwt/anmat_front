import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ storageState: 'e2e/.auth/subscriber.json' });
  await context.addInitScript(() => localStorage.setItem('i18nextLng', 'en'));
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('http://localhost:3001/hr/departments', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.getByRole('button', { name: 'Import departments' }).click();
  await page.getByLabel('Departments file').setInputFiles({
    name: 'departments.csv', mimeType: 'text/csv',
    buffer: Buffer.from('name,description,positions\nPreview Department,For preview only,Missing Position\nPreview Department,Duplicate,Missing Position'),
  });
  await page.getByText('Ready to import: 0 / 2').waitFor();
  const positionsResponse = await page.request.get('http://localhost:3000/api/subscriber/organization/positions', {
    headers: { Authorization: `Bearer ${await page.evaluate(() => localStorage.getItem('token'))}` },
  });
  assert.equal(positionsResponse.ok(), true, 'test account must be able to list positions');
  const position = (await positionsResponse.json()).data?.[0];
  assert(position, 'test account needs at least one position for the valid-row check');
  if (position) {
    let payload;
    await page.route('**/api/subscriber/organization/departments', async (route) => {
      if (route.request().method() !== 'POST') return route.continue();
      payload = route.request().postDataJSON();
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ status: 'success', data: { _id: 'preview-only', ...payload } }) });
    });
    await page.getByLabel('Departments file').setInputFiles({
      name: 'valid-department.csv', mimeType: 'text/csv',
      buffer: Buffer.from(`name,description,positions\nPreview Department,For preview only,${position.title}`),
    });
    await page.getByText('Ready to import: 1 / 1').waitFor();
    await page.getByRole('button', { name: 'Import ready rows' }).click();
    await page.getByText('Import finished. Review each row.').waitFor();
    assert.deepEqual(payload.positions_ids, [position._id]);
  }
  assert.deepEqual(errors, []);
  console.log('Department import preview: PASS');
} finally { await browser.close(); }
