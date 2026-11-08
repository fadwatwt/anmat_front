import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ storageState: 'e2e/.auth/subscriber.json' });
  await context.addInitScript(() => { localStorage.setItem('i18nextLng', 'en'); localStorage.setItem('tasks-view-mode', 'table'); });
  const page = await context.newPage();
  const urls = [];
  page.on('request', (request) => { if (request.url().includes('/api/subscriber/organization/tasks?')) urls.push(request.url()); });
  await page.goto('http://localhost:3001/tasks', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.getByLabel('Search tasks').waitFor({ timeout: 90000 });
  assert(urls.some((url) => url.includes('page_size=100') && url.includes('page=1')), 'first task request must be paged');
  await page.getByLabel('Search tasks').fill('preview-only-search');
  await page.waitForTimeout(700);
  assert(urls.some((url) => url.includes('search=preview-only-search')), 'task search must reach the server');
  console.log('Task paging and server search: PASS');
} finally { await browser.close(); }
