const REQUEST_LABELS = { DAY_OFF: 'إجازة يومية', SHORT_LEAVE: 'إجازة قصيرة', SALARY_ADVANCE: 'سلفة راتب', WORK_DELAY: 'تأخير عن العمل', accepted: 'مقبول', rejected: 'مرفوض', cancelled: 'ملغى', open: 'مفتوح' };
const requestLabel = (value) => REQUEST_LABELS[value] || value;
const MESSAGE_PATTERNS = [
  { regex: /^(.+?) has logged in to the system\.?$/, ar: (m) => `${m[1]} قام بتسجيل الدخول إلى النظام.` },
  { regex: /^(.+?) has logged out of the system\.?$/, ar: (m) => `${m[1]} قام بتسجيل الخروج من النظام.` },
  { regex: /^(.+?) requested a short leave on (.+?) from (.+?) to (.+?)$/, ar: (m) => `${m[1]} طلب إجازة قصيرة في ${m[2]} من ${m[3]} إلى ${m[4]}` },
  { regex: /^(.+?) updated their leave request for (.+?) from (.+?) to (.+?)$/, ar: (m) => `${m[1]} قام بتعديل طلب إجازته ليوم ${m[2]} من ${m[3]} إلى ${m[4]}` },
  { regex: /^(.+?) cancelled their leave request for (.+?)$/, ar: (m) => `${m[1]} قام بإلغاء طلب إجازته ليوم ${m[2]}` },
  { regex: /^(.+?) has checked in at (.+?)$/, ar: (m) => `${m[1]} قام بتسجيل الحضور في ${m[2]}` },
  { regex: /^(.+?) checked in (\d+) minutes late at (.+?)$/, ar: (m) => `${m[1]} قام بتسجيل الحضور متأخراً ${m[2]} دقيقة في ${m[3]}` },
  { regex: /^(.+?) has checked out at (.+?) \((.+?)h worked\)$/, ar: (m) => `${m[1]} قام بتسجيل الانصراف في ${m[2]} (${m[3]} ساعة عمل)` },
  { regex: /^(.+?) has submitted a new (.+?) request\.?$/, ar: (m) => `${m[1]} قدم طلب ${requestLabel(m[2])} جديد.` },
  { regex: /^(.+?) tokens added to your account$/, ar: (m) => `تمت إضافة ${m[1]} رمز إلى حسابك` },
  { regex: /^You have been assigned a new task: "(.+?)"\.?$/, ar: (m) => `تم تعيين مهمة جديدة لك: "${m[1]}".` },
  { regex: /^A new task "(.+?)" has been added to project "(.+?)"\.?$/, ar: (m) => `تمت إضافة مهمة جديدة "${m[1]}" إلى مشروع "${m[2]}".` },
  { regex: /^You have been unassigned from task: "(.+?)"\.?$/, ar: (m) => `تم إلغاء تعيينك من المهمة: "${m[1]}".` },
  { regex: /^An employee has updated task: "(.+?)"\.?$/, ar: (m) => `قام موظف بتحديث المهمة: "${m[1]}".` },
  { regex: /^Your task "(.+?)" has been updated\.?$/, ar: (m) => `تم تحديث مهمتك "${m[1]}".` },
  { regex: /^Your task "(.+?)" has been evaluated with a score of (.+?)\/5\.?$/, ar: (m) => `تم تقييم مهمتك "${m[1]}" بدرجة ${m[2]}/5.` },
  { regex: /^You have been assigned as manager for new project: "(.+?)"\.?$/, ar: (m) => `تم تعيينك كمدير لمشروع جديد: "${m[1]}".` },
  { regex: /^You have been assigned to new project: "(.+?)"\.?$/, ar: (m) => `تم تعيينك في مشروع جديد: "${m[1]}".` },
  { regex: /^You are no longer the manager for project: "(.+?)"\.?$/, ar: (m) => `لم تعد مديراً لمشروع: "${m[1]}".` },
  { regex: /^You have been assigned as manager for project: "(.+?)"\.?$/, ar: (m) => `تم تعيينك كمدير لمشروع: "${m[1]}".` },
  { regex: /^You have been unassigned from project: "(.+?)"\.?$/, ar: (m) => `تم إلغاء تعيينك من مشروع: "${m[1]}".` },
  { regex: /^You have been assigned to project: "(.+?)"\.?$/, ar: (m) => `تم تعيينك في مشروع: "${m[1]}".` },
  { regex: /^Your project "(.+?)" has been updated\.?$/, ar: (m) => `تم تحديث مشروعك "${m[1]}".` },
  { regex: /^"(.+?)": leaved from (.+?) to (.+?) in (.+?)$/, ar: (m) => `${m[1]}: مغادرة من ${m[2]} إلى ${m[3]} في ${m[4]}` },
  { regex: /^Your leave for (.+?) has been deleted by the administrator\.?$/, ar: (m) => `تم حذف إجازتك ليوم ${m[1]} من قِبَل المسؤول.` },
  { regex: /^An attendance record for (.+?) \((.+?) - (.+?)\) has been created by the administrator\.?$/, ar: (m) => `تم إنشاء سجل حضور ليوم ${m[1]} (${m[2]} - ${m[3]}) من قِبَل المسؤول.` },
  { regex: /^Your attendance record for (.+?) has been deleted by the administrator\.?$/, ar: (m) => `تم حذف سجل حضورك ليوم ${m[1]} من قِبَل المسؤول.` },
  { regex: /^Your (.+?) request status has been updated to "(.+?)"\.\s*Reason:\s*(.+?)$/, ar: (m) => `تم تحديث حالة طلبك ${requestLabel(m[1])} إلى "${requestLabel(m[2])}". السبب: ${m[3]}` },
  { regex: /^Your (.+?) request status has been updated to "(.+?)"\.?\s*$/, ar: (m) => `تم تحديث حالة طلبك ${requestLabel(m[1])} إلى "${requestLabel(m[2])}".` },
  { regex: /^Your (.+?) request has been deleted by the administrator\.?$/, ar: (m) => `تم حذف طلبك ${requestLabel(m[1])} من قِبَل المسؤول.` },
  { regex: /^Your department "(.+?)" information has been updated\.?$/, ar: (m) => `تم تحديث معلومات قسمك "${m[1]}".` },
  { regex: /^You have been assigned to the department "(.+?)"\.?$/, ar: (m) => `تم تعيينك في قسم "${m[1]}".` },
  { regex: /^You have been removed from the department "(.+?)"\.?$/, ar: (m) => `تم إزالتك من قسم "${m[1]}".` },
  { regex: /^Your profile information has been updated by the administrator\.?$/, ar: () => `تم تحديث معلومات ملفك الشخصي من قِبَل المسؤول.` },
  { regex: /^A salary transaction for (.+?) has been deleted from your account\.?$/, ar: (m) => `تم حذف معاملة راتب بقيمة ${m[1]} من حسابك.` },
  { regex: /^A salary transaction for (.+?) has been updated\.?$/, ar: (m) => `تم تحديث معاملة راتب بقيمة ${m[1]}.` },
  { regex: /^A new salary transaction of (.+?) has been added to your account\.?$/, ar: (m) => `تمت إضافة معاملة راتب جديدة بقيمة ${m[1]} إلى حسابك.` },
];

export function translateMessage(text, lang) {
  if (!text || !lang?.startsWith("ar")) return text;
  for (const pattern of MESSAGE_PATTERNS) {
    const match = text.match(pattern.regex);
    if (match) return pattern.ar(match);
  }
  return text;
}
