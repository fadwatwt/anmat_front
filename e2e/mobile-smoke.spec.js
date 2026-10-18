// @ts-check
const { test, expect } = require('@playwright/test');
const { collectPageErrors, waitForStablePage } = require('./utils/helpers');

async function expectHealthyMobilePage(page, route) {
  const watch = collectPageErrors(page, {
    ignore: [/favicon/i, /WebSocket/i, /socket\.io/i],
  });
  await page.goto(route);
  await waitForStablePage(page);
  await expect(page.locator('main')).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1
  );
  const brokenImages = await page.evaluate(() =>
    Array.from(document.images)
      .filter((image) => image.src && image.complete && image.naturalWidth === 0)
      .map((image) => image.src)
  );

  watch.stop();
  expect(overflow, `horizontal overflow on ${route}`).toBe(false);
  expect(brokenImages, `broken images on ${route}`).toEqual([]);
  expect(watch.errors, `fatal errors on ${route}:\n${watch.errors.join('\n')}`).toEqual([]);
}

test.describe('Mobile admin smoke check', () => {
  for (const route of ['/dashboard', '/subscribers', '/setting']) {
    test(`${route} fits a 390px viewport`, async ({ page }) => {
      await expectHealthyMobilePage(page, route);
    });
  }
});
