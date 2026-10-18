const { test, expect } = require('@playwright/test');

for (const language of ['ar', 'en']) {
  test(`${language}: public assistant answers through the restricted endpoint`, async ({ page }) => {
    let requestBody;
    await page.addInitScript(lang => localStorage.setItem('i18nextLng', lang), language);
    await page.route('**/api/public/ai/chat', async route => {
      requestBody = route.request().postDataJSON();
      await route.fulfill({
        json: {
          status: 'success',
          data: {
            response: language === 'ar' ? 'أنماط منصة لإدارة المؤسسات.' : 'Anmaat is an enterprise management platform.',
            suggestSupport: true,
          },
        },
      });
    });
    await page.route('**/api/public/subscription-plans**', route => route.fulfill({ json: { status: 'success', data: [] } }));

    await page.goto('/');
    const openLabel = language === 'ar' ? 'فتح مساعد أنماط الذكي' : 'Open Anmaat AI assistant';
    await page.getByRole('button', { name: openLabel }).click();
    await expect(page.getByRole('note')).toContainText(language === 'ar' ? 'مساعد ذكي' : 'AI assistant');

    const input = page.getByLabel(language === 'ar' ? 'اكتب سؤالك عن أنماط…' : 'Ask about Anmaat…');
    await input.fill(language === 'ar' ? 'ما هي أنماط؟' : 'What is Anmaat?');
    await input.press('Enter');

    await expect(page.getByText(language === 'ar' ? 'أنماط منصة لإدارة المؤسسات.' : 'Anmaat is an enterprise management platform.')).toBeVisible();
    expect(requestBody.lang).toBe(language);
    expect(requestBody.history).toEqual([]);
    expect(requestBody).not.toHaveProperty('token');
    await expect(page.getByRole('link', { name: language === 'ar' ? 'التواصل مع الدعم' : 'Contact support' })).toBeVisible();
    await page.screenshot({ path: `audit-results/public-assistant-${language}.png`, fullPage: true });
  });
}
