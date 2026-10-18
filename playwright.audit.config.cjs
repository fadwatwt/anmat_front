const { defineConfig } = require('@playwright/test');
const baseURL = process.env.AUDIT_BASE_URL || 'http://localhost:3012';
module.exports = defineConfig({
  testDir: './audit-tests',
  workers: 1,
  timeout: 60000,
  reporter: [['list']],
  outputDir: './audit-results',
  use: { baseURL, viewport: { width: 1440, height: 1000 }, screenshot: 'only-on-failure' },
  webServer: process.env.AUDIT_BASE_URL
    ? undefined
    : { command: 'npx next start -p 3012', url: baseURL, reuseExistingServer: false, timeout: 60000 },
});
