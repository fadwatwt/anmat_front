import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';
import { createFixtureContext } from './phase5-ui-fixture.mjs';

const browser = await chromium.launch({ headless: true });
const report = { result: 'running', api: 'isolated fixtures; no real task modified', cases: [] };
let page;
const pageErrors = [];
try {
  const context = await createFixtureContext(browser);
  page = await context.newPage();
  page.on('pageerror', (error) => pageErrors.push(error.message));
  const taskId = '000000000000000000000011';
  const task = { _id: taskId, title: 'Recurrence route fixture', description: 'UI test', status: 'open', priority: 'medium', stages: [], comments: [], attachments: [], blocked_by_ids: [], ratings: [], time_tracks: [], created_at: '2026-11-09T00:00:00Z' };
  let rule;
  let failStop = true;
  const saved = [];
  const dependencyQueries = [];
  await page.route('**/api/subscriber/organization/tasks?*', async (route) => {
    const params = new URL(route.request().url()).searchParams;
    dependencyQueries.push(Object.fromEntries(params));
    await route.fulfill({ json: { data: params.get('search') === 'Remote dependency'
      ? [{ _id: '000000000000000000000012', title: 'Remote dependency', status: 'open' }] : [] } });
  });
  await page.route(`**/api/subscriber/organization/tasks/${taskId}`, (route) => route.fulfill({ json: { data: task } }));
  await page.route('**/api/subscriber/organization/task-recurrences', (route) => route.fulfill({ json: { data: rule ? [rule] : [] } }));
  await page.route(`**/api/subscriber/organization/task-recurrences/${taskId}`, async (route) => {
    if (route.request().method() === 'DELETE') {
      if (failStop) { failStop = false; return route.fulfill({ status: 503, json: { message: 'Could not stop recurring task' } }); }
      rule = undefined;
    } else {
      const payload = route.request().postDataJSON(); saved.push(payload);
      rule = { source_task_id: taskId, active: true, next_run_at: payload.first_occurrence, ...payload };
    }
    await route.fulfill({ json: { data: rule || true } });
  });
  await page.goto(`http://localhost:3001/tasks/${taskId}/details`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.getByLabel('Repeat every', { exact: true }).waitFor({ timeout: 30000 });
  assert.equal(dependencyQueries.length, 0, 'task details must not preload the organization task list');
  await page.getByRole('button', { name: '+ Add dependency', exact: true }).click();
  await page.getByLabel('Search for a task', { exact: true }).fill('Remote dependency');
  await page.getByText('Remote dependency', { exact: true }).waitFor();
  assert(dependencyQueries.every((query) => query.page_size === '50' && query.page === '1'));
  assert(dependencyQueries.some((query) => query.search === 'Remote dependency'));
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  report.cases.push('dependency candidates load only on demand, in batches of 50, with server-side search');
  for (const cadence of ['daily', 'weekly', 'monthly']) {
    await page.getByLabel('Repeat every', { exact: true }).selectOption(cadence);
    await page.getByLabel('Interval', { exact: true }).fill('2');
    await page.getByLabel('First occurrence', { exact: true }).fill('2026-12-01');
    await page.getByLabel('Repeat until (optional)', { exact: true }).fill('2026-12-31');
    await Promise.all([
      page.waitForResponse((response) => response.url().endsWith(`/task-recurrences/${taskId}`) && response.request().method() === 'POST'),
      page.getByRole('button', { name: 'Save recurrence', exact: true }).click(),
    ]);
    assert.deepEqual(saved.at(-1), { cadence, interval: 2, first_occurrence: '2026-12-01', until: '2026-12-31' });
    report.cases.push(`${cadence} recurrence configured through the actual task-details route`);
  }
  await page.getByLabel('Repeat until (optional)', { exact: true }).fill('2026-11-01');
  assert.equal(await page.getByRole('button', { name: 'Save recurrence', exact: true }).isDisabled(), true);
  await page.getByRole('alert').filter({ hasText: 'Repeat end must not precede first occurrence' }).waitFor();
  report.cases.push('end before first occurrence is rejected in the page');
  await page.getByRole('button', { name: 'Stop recurrence', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'Could not stop recurring task' }).waitFor();
  assert.equal(await page.getByRole('status').filter({ hasText: 'Recurring task stopped' }).count(), 0);
  await page.getByRole('button', { name: 'Stop recurrence', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'Recurring task stopped' }).waitFor();
  report.cases.push('failed stop shows an error; successful stop shows success');
  report.result = 'pass';
} catch (error) {
  report.result = 'fail'; report.error = { name: error.name, message: error.message };
  report.page_errors = pageErrors;
  if (page) { report.url = page.url(); report.visible_text = (await page.locator('body').innerText().catch(() => '')).slice(0, 3000); }
  process.exitCode = 1;
}
finally {
  await browser.close();
  writeFileSync('../outputs/PHASE3_RECURRENCE_ROUTE_2026-11-09.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
}
