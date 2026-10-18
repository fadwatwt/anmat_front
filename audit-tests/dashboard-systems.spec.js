const { test, expect } = require('@playwright/test');
const dictionaries = {
  ar: require('../public/locales/ar/translation.json'),
  en: require('../public/locales/en/translation.json'),
};

for (const language of ['ar', 'en']) {
  test.describe(language, () => {
    test.beforeEach(async ({ page, context }) => {
      await context.addCookies([{ name: 'token', value: 'isolated-audit-token', url: 'http://localhost:3012' }]);
      await page.addInitScript(lang => {
        localStorage.setItem('token', 'isolated-audit-token');
        localStorage.setItem('i18nextLng', lang);
        localStorage.setItem('subscriber_dashboard_tour_completed', 'true');
      }, language);
      // No real backend, AI billing, account actions, or outgoing messages.
      await page.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (url.hostname === 'localhost') return route.continue();
        if (!url.pathname.includes('/api/') && !url.pathname.startsWith('/api/')) return route.abort();
        let data = [];
        if (url.pathname === '/api/user/auth') data = {
          _id: '507f1f77bcf86cd799439011', name: 'مستخدم الاختبار', type: 'Subscriber',
          is_organization_registered: true, active_subscription_id: 'test', has_subscription_access: true,
        };
        else if (url.pathname.endsWith('/auth/permissions')) data = { permissions: ['*'], social_media_grants: ['tweet'] };
        else if (url.pathname.endsWith('/tokens/balance')) data = { is_unlimited: true };
        else if (url.pathname === '/api/ai/chat') data = { conversation_id: 'audit-chat', assistant_message: { _id: 'answer', role: 'assistant', content: 'مثال `code`\n\n```js\nconst value = 1;\n```' } };
        else if (url.pathname === '/api/ai/conversations/audit-chat/messages') data = { messages: [{ _id: 'answer', role: 'assistant', content: 'مثال `code`\n\n```js\nconst value = 1;\n```' }] };
        else if (url.pathname.endsWith('/social-media-quota')) data = { used: 0, limit: 10 };
        else if (url.pathname.endsWith('/open/latest')) data = null;
        else if (url.pathname.endsWith('/accounts/tweet')) return route.fulfill({ status: 503, json: { message: 'Service unavailable' } });
        return route.fulfill({ json: { status: 'success', data } });
      });
    });

    test('social integrations show real availability and service failures', async ({ page }) => {
      const t = key => dictionaries[language][key] || key;
      await page.goto('/social-media');
      await expect(page.locator('html')).toHaveAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
      await expect(page.getByText(t('Integration unavailable').replace('{{platform}}', t('Facebook')), { exact: true })).toBeVisible();
      await expect(page.getByText('Account Name 1', { exact: true })).toHaveCount(0);
      for (const platform of ['Instagram', 'Gmail', 'Youtube']) {
        await page.locator('.tabs-nav').getByText(t(platform), { exact: true }).click();
        await expect(page.getByText(t('Integration unavailable').replace('{{platform}}', t(platform)), { exact: true })).toBeVisible();
      }
      await page.locator('.tabs-nav').getByText(t('Twitter'), { exact: true }).click();
      await expect(page.getByText(t('Unable to load social media accounts. Please try again.'), { exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: t('Retry'), exact: true })).toBeVisible();
      await page.screenshot({ path: `audit-results/social-${language}.png`, fullPage: true });
    });

    test('legacy assistant opens the real assistant', async ({ page }) => {
      await page.goto('/dashboard/ai');
      await expect(page).toHaveURL(/\/ai$/);
      await expect(page.getByText(dictionaries[language]['Welcome to AI Assistant'], { exact: true })).toBeVisible();
      await expect(page.getByPlaceholder(dictionaries[language]['Type your message...'])).toBeVisible();
      await expect(page.getByText(/lorem ipsum/i)).toHaveCount(0);
    });

    test('mixed Arabic and code renders with isolated code direction', async ({ page }) => {
      await page.goto('/ai');
      const input = page.getByPlaceholder(dictionaries[language]['Type your message...']);
      await input.fill('اعرض مثالًا');
      await input.press('Enter');
      await expect(page.locator('pre')).toHaveCount(1);
      await expect(page.locator('pre')).toHaveAttribute('dir', 'ltr');
      await expect(page.locator('pre pre')).toHaveCount(0);
      await expect(page.locator('code').filter({ hasText: /^code$/ })).toHaveAttribute('dir', 'ltr');
    });
  });
}
