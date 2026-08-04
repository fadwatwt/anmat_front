// بيانات ثابتة مشتركة بين كل ملفات الاختبار
module.exports = {
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3001',
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3000',

  // بيانات السوبر أدمن (تُقرأ من متغيرات البيئة إن وُجدت)
  ADMIN: {
    email: process.env.E2E_ADMIN_EMAIL || 'admin@anmat.test',
    password: process.env.E2E_ADMIN_PASSWORD || 'anmatAdmin123',
    name: 'Anmat System Admin',
  },

  // صفحات السوبر أدمن (من src/config/menuItems.js)
  ADMIN_PAGES: [
    { path: '/dashboard', title: 'Dashboard' },
    { path: '/system-admins', title: 'System Admins' },
    { path: '/roles/admins', title: 'Roles' },
    { path: '/permissions/admins', title: 'Permissions' },
    { path: '/industries', title: 'Industries' },
    { path: '/subscribers', title: 'Subscribers' },
    { path: '/plans', title: 'Plans' },
    { path: '/money-receiving', title: 'Money Receiving Methods' },
    { path: '/translations', title: 'Translations' },
    { path: '/analytics', title: 'Analytics' },
    { path: '/ai', title: 'AI Assistant' },
    { path: '/notifications', title: 'Notifications' },
    { path: '/support-tickets', title: 'Support Tickets' },
    { path: '/setting', title: 'Settings' },
  ],
};
