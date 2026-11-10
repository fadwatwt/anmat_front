import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { createFixtureContext } from './phase5-ui-fixture.mjs';

const browser = await chromium.launch({ headless: true });
try {
  const context = await createFixtureContext(browser);
  await context.addInitScript(() => { localStorage.setItem('i18nextLng', 'en'); localStorage.setItem('tasks-view-mode', 'kanban'); });
  const page = await context.newPage();
  const urls = [];
  const tasks = Array.from({ length: 10000 }, (_, index) => ({ _id: index.toString(16).padStart(24, '0'), title: `Performance task ${index}`, status: 'open', priority: 'medium', description: '' }));
  const employee = process.env.UI_FIXTURE_ROLE === 'Employee';
  await page.route(employee ? '**/api/employee/tasks?*' : '**/api/subscriber/organization/tasks?*', async (route) => {
    const url = new URL(route.request().url()); urls.push(url);
    const search = url.searchParams.get('search') || '';
    const filtered = tasks.filter((task) => task.title.includes(search));
    const offset = (Number(url.searchParams.get('page')) - 1) * 100;
    await route.fulfill({ json: { data: filtered.slice(offset, offset + 100) } });
  });
  const started = performance.now();
  await page.goto('http://localhost:3001/tasks', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.getByText('Performance task 0', { exact: true }).waitFor({ timeout: 120000 });
  const firstRenderMs = Math.round(performance.now() - started);
  assert.equal(await page.locator('p').filter({ hasText: /^Performance task \d+$/ }).count(), 30);
  assert(urls.every((url) => url.searchParams.get('page_size') === '100'));
  await page.getByRole('button', { name: 'Show more cards' }).click();
  assert.equal(await page.locator('p').filter({ hasText: /^Performance task \d+$/ }).count(), 60);
  await page.getByRole('button', { name: 'Load more tasks', exact: true }).click();
  await page.getByText('200', { exact: true }).waitFor();
  assert(urls.some((url) => url.searchParams.get('page') === '2'));
  await page.getByLabel('Search tasks', { exact: true }).fill('Performance task 9999');
  await page.getByText('Performance task 9999', { exact: true }).waitFor();
  assert(urls.some((url) => url.searchParams.get('search') === 'Performance task 9999' && url.searchParams.get('page') === '1'));
  assert.equal(await page.getByRole('button', { name: 'Load more tasks', exact: true }).count(), 0);
  console.log(JSON.stringify({ result: 'PASS', fixtureTasks: tasks.length, initialCards: 30, firstRenderMs, note: 'Mocked API, local dev rendering; not production latency.' }));
} finally { await browser.close(); }
