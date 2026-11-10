import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { createFixtureContext } from './phase5-ui-fixture.mjs';

const browser = await chromium.launch({ headless: true });
try {
  const context = await createFixtureContext(browser);
  await context.addInitScript(() => localStorage.setItem('i18nextLng', 'en'));
  const page = await context.newPage();
  const writes = [];
  await page.route('**/api/subscriber/organization/employees', async (route) => {
    if (route.request().method() !== 'POST') return route.fulfill({ json: { data: [] } });
    writes.push(route.request().postDataJSON());
    await route.fulfill({ status: 201, json: { data: { _id: 'test-only' } } });
  });
  await page.goto('http://localhost:3001/hr/employees', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.getByRole('button', { name: 'Import employees', exact: true }).click({ timeout: 120000 });
  await page.getByLabel('Employees file').setInputFiles({ name: 'employees.csv', mimeType: 'text/csv', buffer: Buffer.from('name,email,phone,password,date_of_birth,salary\nTest Import,import-only@example.test,+970599112233,temporary123,1995-02-14,2000\nDuplicate,import-only@example.test,+970599112234,temporary123,1995-02-14,2000\nInvalid,bad,123,short,1995-02-30,-1') });
  await page.getByText('Ready to import: 1 / 3').waitFor();
  assert.equal(writes.length, 0, 'preview must never create employees');
  assert.equal(await page.getByText('temporary123').count(), 0, 'passwords must be hidden');
  await page.getByRole('button', { name: 'Import ready rows' }).click();
  await page.getByText('Imported', { exact: true }).waitFor();
  assert.equal(writes.length, 1);
  assert.equal(writes[0].employee_detail.salary, 2000);
  assert.equal(writes[0].email, 'import-only@example.test');
  assert.equal(writes[0].employee_detail.roles_ids, undefined);
  console.log('Employee import preview and mocked create: PASS (no real employee created)');
} finally { await browser.close(); }
