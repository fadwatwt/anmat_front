const { BACKEND_URL, FRONTEND_URL, ADMIN } = require('./data');

/**
 * تسجيل الدخول عبر API (بديل سريع عن الواجهة)
 * يُستخدم عندما لا يكون الغرض من الاختبار هو واجهة تسجيل الدخول نفسها.
 */
async function loginViaApi(request, { email = ADMIN.email, password = ADMIN.password } = {}) {
  const response = await request.post(`${BACKEND_URL}/api/admin/auth/login`, {
    data: { email, password },
  });
  if (!response.ok()) {
    throw new Error(`Login API failed: ${response.status()} ${await response.text()}`);
  }
  const body = await response.json();
  return body.data.access_token;
}

/**
 * إعداد جلسة المتصفح مباشرة (token في localStorage)
 * دون المرور بالواجهة — يفيد في تحضير الحالة لاختبارات الصفحات الداخلية.
 */
async function authenticateViaStorage(page, { email = ADMIN.email, password = ADMIN.password } = {}) {
  const token = await loginViaApi(page.request, { email, password });
  await page.addInitScript(
    ([tok, origin]) => {
      window.localStorage.setItem('token', tok);
    },
    [token, FRONTEND_URL],
  );
  return token;
}

/**
 * التقاط أخطاء الصفحة.
 * - pageErrorsOnly: تجاهل رسائل console والاكتفاء بالأخطاء غير الملتقطة (pageerror)
 */
function collectPageErrors(page, { ignore = [], pageErrorsOnly = false } = {}) {
  const errors = [];
  const isIgnored = (text) => ignore.some((re) => re.test(text));
  const onConsole = (msg) => {
    if (pageErrorsOnly) return;
    if (msg.type() === 'error' && !isIgnored(msg.text())) errors.push(`console: ${msg.text()}`);
  };
  const onPageError = (err) => {
    if (!isIgnored(err.message)) errors.push(`pageerror: ${err.message}`);
  };
  page.on('console', onConsole);
  page.on('pageerror', onPageError);
  return {
    errors,
    stop() {
      page.off('console', onConsole);
      page.off('pageerror', onPageError);
    },
  };
}

/**
 * انتظار استقرار الصفحة بعد تحميل البيانات (Skeleton -> محتوى)
 */
async function waitForStablePage(page) {
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
}

module.exports = { loginViaApi, authenticateViaStorage, collectPageErrors, waitForStablePage };
