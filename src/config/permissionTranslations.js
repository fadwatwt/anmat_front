import i18n from "i18next";

const permissionTranslations = {
  // ── Projects ──
  "projects.create": { en: "Create Project", ar: "إنشاء مشروع" },
  "projects.update": { en: "Update Project", ar: "تعديل مشروع" },
  "projects.delete": { en: "Delete Project", ar: "حذف مشروع" },
  "projects.list": { en: "List Projects", ar: "عرض المشاريع" },
  "projects.view": { en: "View Project", ar: "عرض مشروع" },
  "projects.track_all": { en: "Manage All Projects", ar: "إدارة جميع المشاريع" },
  "projects.track_department": { en: "Manage Department Projects", ar: "إدارة مشاريع القسم" },
  "projects.evaluate": { en: "Evaluate Projects", ar: "تقييم المشاريع" },
  "projects.comment": { en: "Comment on Projects", ar: "التعليق على المشاريع" },

  // ── Tasks ──
  "tasks.create": { en: "Create Task", ar: "إنشاء مهمة" },
  "tasks.update": { en: "Update Task", ar: "تعديل مهمة" },
  "tasks.delete": { en: "Delete Task", ar: "حذف مهمة" },
  "tasks.list": { en: "List Tasks", ar: "عرض المهام" },
  "tasks.view": { en: "View Task", ar: "عرض مهمة" },
  "tasks.track_all": { en: "Manage All Tasks", ar: "إدارة جميع المهام" },
  "tasks.track_department": { en: "Manage Department Tasks", ar: "إدارة مهام القسم" },
  "tasks.evaluate": { en: "Evaluate Tasks", ar: "تقييم المهام" },
  "tasks.comment": { en: "Comment on Tasks", ar: "التعليق على المهام" },

  // ── Attendances ──
  "attendances.list": { en: "List Attendances", ar: "عرض سجلات الحضور" },
  "attendances.create": { en: "Create Attendance", ar: "تسجيل حضور" },
  "attendances.update": { en: "Update Attendance", ar: "تعديل حضور" },
  "attendances.delete": { en: "Delete Attendance", ar: "حذف حضور" },
  "attendances.track_all": { en: "Manage All Attendances", ar: "إدارة جميع سجلات الحضور" },
  "attendances.track_department": { en: "Manage Department Attendances", ar: "إدارة حضور القسم" },
  "attendances.manage_settings": { en: "Manage Attendance Settings", ar: "إدارة إعدادات الحضور" },

  // ── Leaves ──
  "leaves.list": { en: "List Leaves", ar: "عرض الإجازات" },
  "leaves.create": { en: "Create Leave", ar: "إنشاء إجازة" },
  "leaves.update": { en: "Update Leave", ar: "تعديل إجازة" },
  "leaves.delete": { en: "Delete Leave", ar: "حذف إجازة" },
  "leaves.track_all": { en: "Manage All Leaves", ar: "إدارة جميع الإجازات" },
  "leaves.track_department": { en: "Manage Department Leaves", ar: "إدارة إجازات القسم" },

  // ── Salary Transactions ──
  "salary_transactions.create": { en: "Create Salary Transaction", ar: "إنشاء معاملة راتب" },
  "salary_transactions.update": { en: "Update Salary Transaction", ar: "تعديل معاملة راتب" },
  "salary_transactions.list": { en: "List Salary Transactions", ar: "عرض معاملات الرواتب" },
  "salary_transactions.delete": { en: "Delete Salary Transaction", ar: "حذف معاملة راتب" },
  "salary_transactions.track_all": { en: "Manage All Salary Transactions", ar: "إدارة جميع معاملات الرواتب" },
  "salary_transactions.track_department": { en: "Manage Department Salary Transactions", ar: "إدارة معاملات رواتب القسم" },

  // ── Employee Requests ──
  "employee_requests.list": { en: "List Requests", ar: "عرض الطلبات" },
  "employee_requests.update": { en: "Update Request Status", ar: "تعديل حالة الطلب" },
  "employee_requests.delete": { en: "Delete Request", ar: "حذف طلب" },
  "employee_requests.create": { en: "Create Request", ar: "إنشاء طلب" },
  "employee_requests.track_all": { en: "Manage All Requests", ar: "إدارة جميع الطلبات" },
  "employee_requests.track_department": { en: "Manage Department Requests", ar: "إدارة طلبات القسم" },

  // ── Departments ──
  "departments.list": { en: "List Departments", ar: "عرض الأقسام" },
  "departments.create": { en: "Create Department", ar: "إنشاء قسم" },
  "departments.update": { en: "Update Department", ar: "تعديل قسم" },
  "departments.delete": { en: "Delete Department", ar: "حذف قسم" },
  "departments.view": { en: "View Department", ar: "عرض قسم" },

  // ── Positions ──
  "positions.list": { en: "List Positions", ar: "عرض المواقع الوظيفية" },
  "positions.create": { en: "Create Position", ar: "إنشاء موقع وظيفي" },
  "positions.update": { en: "Update Position", ar: "تعديل موقع وظيفي" },
  "positions.delete": { en: "Delete Position", ar: "حذف موقع وظيفي" },
  "positions.view": { en: "View Position", ar: "عرض موقع وظيفي" },

  // ── Holidays ──
  "holidays.list": { en: "List Holidays", ar: "عرض العطل" },
  "holidays.create": { en: "Create Holiday", ar: "إنشاء عطلة" },
  "holidays.update": { en: "Update Holiday", ar: "تعديل عطلة" },
  "holidays.delete": { en: "Delete Holiday", ar: "حذف عطلة" },

  // ── Meetings ──
  "meetings.list": { en: "List Meetings", ar: "عرض الاجتماعات" },
  "meetings.create": { en: "Create Meeting", ar: "إنشاء اجتماع" },
  "meetings.update": { en: "Update Meeting", ar: "تعديل اجتماع" },
  "meetings.delete": { en: "Delete Meeting", ar: "حذف اجتماع" },

  // ── Teams ──
  "teams.list": { en: "List Teams", ar: "عرض الفرق" },
  "teams.create": { en: "Create Team", ar: "إنشاء فريق" },
  "teams.update": { en: "Update Team", ar: "تعديل فريق" },
  "teams.delete": { en: "Delete Team", ar: "حذف فريق" },

  // ── Roles ──
  "roles.list": { en: "List Roles", ar: "عرض الأدوار" },
  "roles.create": { en: "Create Role", ar: "إنشاء دور" },
  "roles.update": { en: "Update Role", ar: "تعديل دور" },
  "roles.delete": { en: "Delete Role", ar: "حذف دور" },
  "roles.view": { en: "View Role", ar: "عرض دور" },

  // ── Employee Details ──
  "employee_details.list": { en: "List Employees", ar: "عرض الموظفين" },
  "employee_details.view": { en: "View Employee Profile", ar: "عرض ملف الموظف" },
  "employee_details.update": { en: "Update Employee Profile", ar: "تعديل ملف الموظف" },
  "employee_details.create": { en: "Create Employee", ar: "إنشاء موظف" },
  "employee_details.delete": { en: "Delete Employee", ar: "حذف موظف" },

  // ── Project Templates ──
  "project_templates.list": { en: "List Project Templates", ar: "عرض قوالب المشاريع" },
  "project_templates.create": { en: "Create Project Template", ar: "إنشاء قالب مشروع" },
  "project_templates.update": { en: "Update Project Template", ar: "تعديل قالب مشروع" },
  "project_templates.delete": { en: "Delete Project Template", ar: "حذف قالب مشروع" },

  // ── Notifications ──
  "notifications.list": { en: "View Notifications", ar: "عرض الإشعارات" },
  "notifications.delete": { en: "Delete Notification", ar: "حذف إشعار" },

  // ── Analytics ──
  "analytics.view": { en: "View Analytics", ar: "عرض التحليلات" },

  // ── Chats ──
  "chats.initiate": { en: "Initiate Chat", ar: "بدء محادثة" },
  "chats.cross_department_scope": { en: "Cross-Department Chat Scope", ar: "نطاق المحادثة بين الأقسام" },
  "chats.manage_participants": { en: "Manage Chat Participants", ar: "إدارة المشاركين في المحادثة" },
  "chats.export": { en: "Export Chat History", ar: "تصدير سجل المحادثة" },
  "chats.manage_settings": { en: "Manage Chat Settings", ar: "إدارة إعدادات المحادثة" },
  "chats.call": { en: "Make Voice/Video Calls", ar: "إجراء مكالمات صوتية/فيديو" },

  // ── Support Tickets ──
  "support_tickets.create": { en: "Create Support Ticket", ar: "إنشاء تذكرة دعم" },
  "support_tickets.list": { en: "List Support Tickets", ar: "عرض تذاكر الدعم" },
  "support_tickets.view": { en: "View Support Ticket", ar: "عرض تذكرة دعم" },
  "support_tickets.update": { en: "Update Support Ticket", ar: "تعديل تذكرة دعم" },

  // ── Subscriptions ──
  "subscriptions.create": { en: "Create Subscription", ar: "إنشاء اشتراك" },
  "subscriptions.view": { en: "View Subscription", ar: "عرض اشتراك" },
  "subscriptions.update": { en: "Update Subscription", ar: "تعديل اشتراك" },

  // ── Social Media Accounts ──
  "social_media_accounts.list": { en: "List Social Media Accounts", ar: "عرض حسابات التواصل الاجتماعي" },
  "social_media_accounts.view": { en: "View Social Media Account", ar: "عرض حساب تواصل اجتماعي" },
  "social_media_accounts.create": { en: "Create Social Media Account", ar: "إنشاء حساب تواصل اجتماعي" },
  "social_media_accounts.update": { en: "Update Social Media Account", ar: "تعديل حساب تواصل اجتماعي" },
  "social_media_accounts.delete": { en: "Delete Social Media Account", ar: "حذف حساب تواصل اجتماعي" },
  "social_media_accounts.import": { en: "Import Social Media Accounts", ar: "استيراد حسابات التواصل الاجتماعي" },
  "social_media_accounts.bind_proxy": { en: "Bind Proxy to Account", ar: "ربط بروكسي بالحساب" },

  // ── Social Media Actions ──
  "social_media_actions.post": { en: "Publish Posts", ar: "نشر منشورات" },
  "social_media_actions.delete_post": { en: "Delete Posts", ar: "حذف منشورات" },
  "social_media_actions.repost": { en: "Repost / Retweet", ar: "إعادة نشر" },
  "social_media_actions.delete_repost": { en: "Undo Repost", ar: "التراجع عن إعادة النشر" },
  "social_media_actions.like": { en: "Like Posts", ar: "إعجاب بالمنشورات" },
  "social_media_actions.unlike": { en: "Unlike Posts", ar: "إلغاء الإعجاب" },
  "social_media_actions.follow": { en: "Follow Accounts", ar: "متابعة حسابات" },
  "social_media_actions.unfollow": { en: "Unfollow Accounts", ar: "إلغاء متابعة حسابات" },
  "social_media_actions.reply": { en: "Reply to Posts", ar: "الرد على منشورات" },
  "social_media_actions.update_profile": { en: "Update Account Profile", ar: "تعديل ملف الحساب" },
  "social_media_actions.view_post": { en: "View Posts", ar: "عرض منشورات" },

  // ── Social Media Content ──
  "social_media_content.submit_for_approval": { en: "Submit Draft for Approval", ar: "إرسال مسودة للموافقة" },
  "social_media_content.list_pending": { en: "List Pending Drafts", ar: "عرض المسودات المعلقة" },
  "social_media_content.approve": { en: "Approve & Publish Drafts", ar: "الموافقة على المسودات ونشرها" },
  "social_media_content.reject": { en: "Reject Drafts", ar: "رفض المسودات" },

  // ── Social Media Categories ──
  "social_media_categories.list": { en: "List Account Categories", ar: "عرض فئات الحسابات" },
  "social_media_categories.create": { en: "Create Account Category", ar: "إنشاء فئة حساب" },
  "social_media_categories.update": { en: "Update Account Category", ar: "تعديل فئة حساب" },
  "social_media_categories.delete": { en: "Delete Account Category", ar: "حذف فئة حساب" },

  // ── Social Media Analytics ──
  "social_media_analytics.view": { en: "View Social Media Analytics", ar: "عرض تحليلات التواصل الاجتماعي" },

  // ── Appointments ──
  "appointments.create": { en: "Create Appointment", ar: "إنشاء موعد" },
  "appointments.update": { en: "Update Appointment", ar: "تعديل موعد" },
  "appointments.delete": { en: "Delete Appointment", ar: "حذف موعد" },
  "appointments.track_all": { en: "Track All Appointments", ar: "تتبع جميع المواعيد" },
  "appointments.track_department": { en: "Track Department Appointments", ar: "تتبع مواعيد القسم" },

  // ── Reports ──
  "reports.export": { en: "Export Data", ar: "تصدير البيانات" },

  // ── Organizations ──
  "organizations.manage_settings": { en: "Manage Organization Settings", ar: "إدارة إعدادات المؤسسة" },

  // ══════════════════════════════════════════
  // Admin System Permissions
  // ══════════════════════════════════════════
  "admin.profile.password.update": { en: "Update Password", ar: "تعديل كلمة المرور" },
  "admin.profile.update": { en: "Update Profile", ar: "تعديل الملف الشخصي" },
  "admin.permissions.list": { en: "View Permissions", ar: "عرض الصلاحيات" },
  "admin.roles.list": { en: "View Roles", ar: "عرض الأدوار" },
  "admin.roles.create": { en: "Create Role", ar: "إنشاء دور" },
  "admin.roles.delete": { en: "Delete Role", ar: "حذف دور" },
  "admin.roles.permissions.sync": { en: "Sync Role Permissions", ar: "مزامنة صلاحيات الدور" },
  "admin.roles.assign": { en: "Assign Role", ar: "تعيين دور" },
  "admin.roles.unassign": { en: "Unassign Role", ar: "إلغاء تعيين دور" },
  "admin.subscribers.list": { en: "View Subscribers", ar: "عرض المشتركين" },
  "admin.subscribers.view": { en: "View Subscriber", ar: "عرض مشترك" },
  "admin.subscribers.update": { en: "Update Subscriber", ar: "تعديل بيانات المشترك" },
  "admin.subscribers.toggle_status": { en: "Toggle Subscriber Status", ar: "تفعيل/تعطيل حالة المشترك" },
  "admin.industries.create": { en: "Create Industry", ar: "إنشاء صناعة" },
  "admin.industries.list": { en: "View Industries", ar: "عرض الصناعات" },
  "admin.industries.delete": { en: "Delete Industry", ar: "حذف صناعة" },
  "admin.subscriptions.list": { en: "View Subscriptions", ar: "عرض الاشتراكات" },
  "admin.subscriptions.update": { en: "Update Subscription", ar: "تعديل الاشتراك" },
  "admin.subscriptions.update_status": { en: "Update Subscription Status", ar: "تعديل حالة الاشتراك" },
  "admin.subscription_feature_types.create": { en: "Create Feature Type", ar: "إنشاء نوع ميزة" },
  "admin.subscription_feature_types.toggle_activation": { en: "Toggle Feature Type", ar: "تفعيل/تعطيل نوع الميزة" },
  "admin.subscription_feature_types.list": { en: "View Feature Types", ar: "عرض أنواع الميزات" },
  "admin.industries.update": { en: "Update Industry", ar: "تعديل صناعة" },
  "admin.subscription_plans.list": { en: "View Subscription Plans", ar: "عرض خطط الاشتراك" },
  "admin.subscription_plans.create": { en: "Create Subscription Plan", ar: "إنشاء خطة اشتراك" },
  "admin.subscription_plans.delete": { en: "Delete Subscription Plan", ar: "حذف خطة اشتراك" },
  "admin.subscription_plans.update": { en: "Update Subscription Plan", ar: "تعديل خطة اشتراك" },
  "admin.subscription_plans.view": { en: "View Subscription Plan", ar: "عرض خطة اشتراك" },
  "admin.subscription_plans.add_trial": { en: "Add Trial Period", ar: "إضافة فترة تجريبية" },
  "admin.subscription_plans.update_availability": { en: "Update Plan Availability", ar: "تعديل توفر الخطة" },
  "admin.subscription_plans.toggle_activity": { en: "Toggle Plan Activity", ar: "تفعيل/تعطيل الخطة" },
  "admin.subscription_plans.manage_trial": { en: "Manage Trial", ar: "إدارة التجربة" },
  "admin.subscription_plans.trials.toggle_activity": { en: "Toggle Trial Activity", ar: "تفعيل/تعطيل التجربة" },
  "admin.admin_roles.list": { en: "View Admin Roles", ar: "عرض أدوار المسؤولين" },
  "admin.admin_roles.create": { en: "Create Admin Role", ar: "إنشاء دور مسؤول" },
  "admin.admin_roles.update": { en: "Update Admin Role", ar: "تعديل دور مسؤول" },
  "admin.admin_roles.delete": { en: "Delete Admin Role", ar: "حذف دور مسؤول" },
  "admin.admin_permissions.list": { en: "View Admin Permissions", ar: "عرض صلاحيات المسؤولين" },
  "admin.system_admins.list": { en: "View System Admins", ar: "عرض مدراء النظام" },
  "admin.system_admins.create": { en: "Create System Admin", ar: "إنشاء مدير نظام" },
  "admin.system_admins.view": { en: "View System Admin", ar: "عرض مدير نظام" },
  "admin.analytics.view": { en: "View System Analytics", ar: "عرض تحليلات النظام" },
  "admin.settings.view": { en: "View System Settings", ar: "عرض إعدادات النظام" },
  "admin.settings.update": { en: "Update System Settings", ar: "تعديل إعدادات النظام" },
  "admin.social_media_quota.view": { en: "View Social Media Quota", ar: "عرض حصص التواصل الاجتماعي" },
  "admin.social_media_quota.update": { en: "Update Social Media Quota", ar: "تعديل حصص التواصل الاجتماعي" },
  "admin.support_tickets.list": { en: "View Support Tickets", ar: "عرض تذاكر الدعم" },
  "admin.support_tickets.create": { en: "Create Support Ticket", ar: "إنشاء تذكرة دعم" },
  "admin.support_tickets.view": { en: "View Support Ticket", ar: "عرض تذكرة دعم" },
  "admin.support_tickets.update": { en: "Update Support Ticket", ar: "تعديل تذكرة دعم" },
};

/**
 * Returns the localized label for a permission.
 * @param {string} permissionName - e.g. "projects.create"
 * @param {object} [permission] - optional permission object with title/name
 * @returns {string} translated label or the original name as fallback
 */
export const getPermissionLabel = (permissionName, permission) => {
  const lang = i18n?.language || "en";
  const translation = permissionTranslations[permissionName];

  if (translation) {
    return translation[lang] || translation.en || permissionName;
  }

  if (permission?.title) return permission.title;
  if (permission?.name) return permission.name;
  return permissionName;
};

export default permissionTranslations;
