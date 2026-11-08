import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const labels = {
  ar: { '/employee/projects': 'المشاريع', '/employee/tasks': 'المهام', '/appointments': 'المواعيد', '/attendance': 'الحضور', '/salary': 'الراتب', '/leaves': 'الإجازات القصيرة', '/requests': 'الطلبات' },
  en: { '/employee/projects': 'Projects', '/employee/tasks': 'Tasks', '/appointments': 'Appointments', '/attendance': 'Attendance', '/salary': 'Salary', '/leaves': 'Short Leaves', '/requests': 'Requests' },
};
const browser = await chromium.launch({ headless: true });
try {
  for (const language of ['ar', 'en']) {
    const context = await browser.newContext({ storageState: 'e2e/.auth/employee.json' });
    await context.addInitScript((lang) => localStorage.setItem('i18nextLng', lang), language);
    const page = await context.newPage();
    await page.goto('http://localhost:3001/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 });
    for (const [path, title] of Object.entries(labels[language])) {
      await page.locator(`a[href="${path}"]`).getByText(title, { exact: true }).first().waitFor({ timeout: 60000 });
    }
    console.log(`${language}: PASS`);
    await context.close();
  }
} finally { await browser.close(); }
