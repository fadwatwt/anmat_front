// @ts-check
const { test, expect } = require('@playwright/test');
const { FRONTEND_URL } = require('./utils/data');
const { collectPageErrors } = require('./utils/helpers');

/**
 * اختبارات الصفحة الرئيسية (Landing Page) — صفحة عامة لا تتطلب تسجيل دخول.
 */
test.describe('Landing page', () => {
  test('homepage renders key sections and header', async ({ page }) => {
    const watch = collectPageErrors(page, {
      ignore: [/favicon/i, /net::ERR/],
    });

    await page.goto(FRONTEND_URL);
    await expect(page).toHaveTitle(/Anmaat|Dashboard/i);

    // الشعار والتنقل الرئيسي
    await expect(page.getByRole('link', { name: 'Login' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign up' }).first()).toBeVisible();

    // أقسام الصفحة
    await expect(page.getByText('Your Ultimate Management Dashboard')).toBeVisible();
    await expect(page.getByText('Frequently asked questions')).toBeVisible();

    watch.stop();
    expect(watch.errors, `console errors:\n${watch.errors.join('\n')}`).toEqual([]);
  });

  test('login link navigates to the sign-in page', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    await page.getByRole('link', { name: 'Login' }).first().click();
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('sign up link navigates to subscriber registration', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    await page.getByRole('link', { name: 'Sign up' }).first().click();
    await expect(page).toHaveURL(/\/register\/subscriber\/email/, { timeout: 60000 });
  });

  test('pricing section displays plan pricing', async ({ page }) => {
    await page.goto(FRONTEND_URL);

    const pricing = page.getByText('Plans tailored for your team');
    await expect(pricing).toBeVisible();

    // أسعار الخطط (شهرية) تظهر مع علامة $
    const prices = page.locator('text=/\\$\\d+/');
    await expect(prices.first()).toBeVisible({ timeout: 20000 });
  });

  test('FAQ collapse expands when clicking the + icon', async ({ page }) => {
    await page.goto(FRONTEND_URL);

    const firstQuestion = page.getByText('Can I customize permissions for my team?');
    await firstQuestion.scrollIntoViewIfNeeded();

    // الـ Collapse يفتح بالنقر على أيقونة + وليس النص نفسه
    await page.locator('svg.cursor-pointer').first().click();

    // نص الإجابة يجب أن يظهر بعد فتح السؤال
    await expect(page.getByText(/Anmaat provides a comprehensive role-based permission system/)).toBeVisible();
  });
});
