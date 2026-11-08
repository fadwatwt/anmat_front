import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ storageState: 'e2e/.auth/subscriber.json' });
  await context.addInitScript(() => localStorage.setItem('i18nextLng', 'en'));
  const page = await context.newPage();
  const urls = [];
  page.on('request', (request) => {
    if (request.url().includes('/api/subscriber/organization/projects?')) urls.push(request.url());
  });
  await page.goto('http://localhost:3001/projects', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.getByLabel('Search projects').waitFor({ timeout: 90000 });
  assert(urls.some((url) => url.includes('page_size=100') && url.includes('page=1')), 'first project request must be paged');
  await page.getByLabel('Search projects').fill('preview-only-search');
  await page.waitForTimeout(700);
  assert(urls.some((url) => url.includes('search=preview-only-search')), 'search must reach the server');
  console.log('Project paging and server search: PASS');
} finally { await browser.close(); }
