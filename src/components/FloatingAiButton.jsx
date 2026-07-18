"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoClose, IoSend, IoChatbubbles, IoTimeOutline } from "react-icons/io5";
import { FaRobot } from "react-icons/fa"; // تم تغيير الأيقونة من Cpu إلى FaRobot لعرض أيقونة روبوت
import Link from "next/link";
import { RootRoute } from "@/Root.Route";

function detectLanguage(text) {
  const arabicChars = text.match(/[\u0600-\u06FF]/g);
  return arabicChars && arabicChars.length > 0 ? "ar" : "en";
}

const HUMAN_KEYWORDS_AR = ["موظف", "دعم فني", "بشري", "شخص", "تحدث مع", "كلم", "ممثل", "خدمة العملاء", "استشارة"];
const HUMAN_KEYWORDS_EN = ["human", "agent", "staff", "support agent", "real person", "talk to", "speak with", "customer service", "representative"];

function wantsHuman(message, lang) {
  const lower = message.toLowerCase();
  const keywords = lang === "ar" ? HUMAN_KEYWORDS_AR : HUMAN_KEYWORDS_EN;
  return keywords.some((kw) => lower.includes(kw));
}

const VISITOR_KNOWLEDGE = {
  ar: {
    greeting: "مرحباً! 👋 أنا مساعد أنماط الذكي. يمكنني الإجابة عن أسئلتك حول النظام والميزات والأسعار. كيف أستطيع مساعدتك؟",
    patterns: [
      { keywords: ["مرحبا", "اهلا", "سلام", "هاي", "هلا", "صباح", "مساء"], reply: "مرحباً! 👋 أهلاً بك في أنماط. أنا هنا لمساعدتك. ما الذي تريد معرفته عن النظام؟" },
      { keywords: ["ما هو", "شنو هو", "عن انماط", "عن النظام", "ايش هو", "اشرح", "شرح", "هذا النظام", "تشرح", "اعرف", "اعلمني", "ايش هذا", "شنو هذا", "تعريف", "ما معنى", "عنك", "عنكم", "بخصوص", "استفسار"], reply: "أنماط (Anmaat) هو نظام إدارة مؤسسات متكامل يوفر:\n\n📊 إدارة المشاريع والمهام\n👥 إدارة الفريق والأقسام\n💬 التواصل الفوري\n📱 إدارة التواصل الاجتماعي\n📈 التحليلات الذكية\n🤖 مساعد ذكاء اصطناعي\n\nكل هذا في منصة واحدة!" },
      { keywords: ["مميزات", "ايش يقدم", "قدرات", "ماذا يقدم", "فوائد", "ميزة", "مميز", "استخدمات", "وظائف", "يعمل ايش", "يسوي ايش", "ش يسوي"], reply: "مميزات أنماط:\n✅ إدارة المشاريع والمهام\n✅ إدارة الفريق والموظفين\n✅ تقويم ومواعيد ذكية\n✅ محادثات فورية\n✅ إدارة التواصل الاجتماعي\n✅ تحليلات وتقارير\n✅ مساعد ذكاء اصطناعي\n✅ نظام أذونات متقدم\n✅ دعم عربي وإنجليزي" },
      { keywords: ["سعر", "تسعير", "كم يكلف", "مجاني", "free", "price", "اسعار", "الاسعار", "السعر", "خطط", "الخطط", "تكلفة", "اشتراك", "اشتراكات", "باقي", "ادفع", "دفع", "فواتير"], reply: "لدينا خطط متنوعة:\n💳 الخطة المجانية - للتجربة\n💎 خطة Pro - ميزات متقدمة\n🏢 خطة Enterprise - حلول مخصصة\n\nالأسعار تبدأ من خطط شهرية وسنوية." },
      { keywords: ["كيف ابدا", "كيف اسجل", "تسجيل", "اشتراك", "كيف استخدم", "طريقة الاستخدام", "دليل", "خطوة", "ابدأ", "بداية", "start", "how to use", "guide", "tutorial", "setup"], reply: "للبدء:\n1️⃣ اضغط \"ابدأ الآن\"\n2️⃣ أدخل بريدك وكلمة المرور\n3️⃣ اختر الخطة المناسبة\n4️⃣ أضف فريقك ومشاريعك\n\nالتسجيل مجاني وسريع! 🚀", hasRegisterLink: true },
      { keywords: ["دخول", "تسجيل دخول", "لوق ان", "الدخول للنظام", "سجّل", "ادخل"], reply: "يمكنك تسجيل الدخول من هنا:", hasSignInLink: true },
      { keywords: ["فريق", "موظفين", "قسم", "موظف", "طاقم", "كوادر"], reply: "إدارة الفريق:\n👥 إضافة وتعديل الموظفين\n🏢 إنشاء أقسام\n🏷️ مواقع وظيفية\n📋 أدوار وصلاحيات\n📊 حضور وانصراف\n💰 رواتب" },
      { keywords: ["مشاريع", "مهام", "تتبع", "مهامتي", "مهمتي", "أعمالي"], reply: "إدارة المشاريع:\n📁 إنشاء مشاريع\n✅ مهام فرعية\n🏷️ حالات متعددة\n⏰ مواعيد نهائية\n📎 إرفاق ملفات\n💬 تعليقات" },
      { keywords: ["تواصل اجتماعي", "سوشيال", "فيسبوك", "تويتر", "انستقرام", "تيك توك", "يوتيوب"], reply: "التواصل الاجتماعي:\n📱 ربط حسابات متعددة\n📝 جدولة ونشر\n💬 رد على التعليقات\n📊 تحليل الأداء" },
      { keywords: ["امان", "خصوصية", "حماية", "تشفير", "حماية البيانات", "أمان"], reply: "الأمان:\n🔒 تشفير البيانات\n🛡️ أذونات متقدمة\n📋 سجل نشاطات\n🔐 مصادقة آمنة\n☁️ نسخ احتياطي" },
      // ── حل المشاكل الشائعة ──
      { keywords: ["مشكلة", "مشكله", "خطا", "خطأ", "لا يعمل", "غير شغال", "تعذر", "فشل", "معلق", "تجمد", "مرفوض", "منعدم", "خرب", "ضاع", "失踪"], reply: "أعتذر عن هذه المشكلة! دعني أساعدك:\n\n1️⃣ تأكد من اتصالك بالإنترنت\n2️⃣ امسح ذاكرة التخزين المؤقت للمتصفح\n3️⃣ جرب استخدام متصفح آخر\n4️⃣ تأكد من صحة البريد الإلكتروني وكلمة المرور\n\nإذا استمرت المشكلة، يمكنني إنشاء تذكرة دعم فني لك." },
      { keywords: ["تسجيل دخول", "كلمة المرور", "باسوورد", "البريد", "حسابي", "الحساب", "لا استطيع الدخول", "محظور"], reply: "لحل مشاكل تسجيل الدخول:\n\n🔑 **نسيت كلمة المرور؟**\n- اضغط \"نسيت كلمة المرور\" في صفحة تسجيل الدخول\n- ستصلك رسالة على بريدك لإعادة التعيين\n\n📧 **البريد الإلكتروني غير صحيح؟**\n- تأكد من كتابة البريد بشكل صحيح\n- تحقق من صندوق البريد غير المرغوب فيه (Spam)\n\n🔒 **الحساب محظور؟**\n- تواصل مع فريق الدعم الفني\n\nهل تريد إنشاء تذكرة دعم؟" },
      { keywords: ["بطيء", "بطئ", "تأخير", "تاخير", " freezes", "تجمد"], reply: "لتحسين أداء النظام:\n\n⚡ افتح تطبيق أنماط فقط (أقفل التطبيقات الأخرى)\n🗑️ امسح ذاكرة التخزين المؤقت للمتصفح\n🔄 حدّث المتصفح لأحدث إصدار\n🌐 تأكد من اتصال الإنترنت مستقر\n\nإذا استمرت المشكلة، أخبرني!" },
      { keywords: ["android", "اندرويد", "ايفون", "ios", "موبايل", "جوال", "تطبيق", "app"], reply: "تطبيق أنماط للجوال:\n\n📱 **Android:** متاح على Google Play\n🍎 **iOS:** متاح على App Store\n\nبحث عن \"Anmaat\" في المتجر.\n\n⚠️ بعض الميزات قد تكون متاحة فقط على الويب." },
      { keywords: ["تثبيت", "تحديث", "versions", "إصدار"], reply: "تحديث النظام:\n\n🔄 **على الويب:** التحديث تلقائي\n📱 **على الجوال:** حدّث من المتجر\n\nللحصول على أحدث ميزات وإصلاح الأخطاء، تأكد من استخدام أحدث إصدار." },
      { keywords: ["بيانات", "معلوماتي", "اختراق", "سرقة"], reply: "البيانات محفوظة بأمان:\n\n🔐 جميع البيانات مشفرة\n🛡️ نظام أذونات متقدم\n📋 سجل نشاطات كامل\n☁️ نسخ احتياطي يومي\n\n⚠️ إذا suspects أي نشاط غير عادي:\n1. غيّر كلمة المرور فوراً\n2. تواصل مع الدعم الفني" },
      { keywords: ["شكر", "ممتاز", "رائع", "حلو", "تمام", "شكرا", "thanks", "great", "awesome", "good", "perfect"], reply: "العفو! 😊 يسعدني أساعدك. إذا عندك أي سؤال ثاني، أنا هنا!" },
      { keywords: ["عمليات", "ادارة", "تنظيم", "تتبع", "متابعة", "تقارير", "احصائيات"], reply: "أنماط يساعدك في:\n📊 تتبع المشاريع والمهام\n📈 تقارير وإحصائيات\n📋 تنظيم المواعيد\n👥 إدارة الفريق\nكل هذا في مكان واحد!" },
    ],
    fallback: "أعتذر، لم أتمكن من فهم سؤالك بدقة. يمكنني مساعدتك في:\n\n• 💰 معلومات الأسعار والخطط\n• 📋 شرح المميزات والقدرات\n• 🔑 حل مشاكل تسجيل الدخول\n• ⚙️ طريقة الاستخدام والإعداد\n• 📊 إدارة المشاريع والمهام\n• 👥 إدارة الفريق والموظفين\n• 📱 التواصل الاجتماعي\n• 🔒 الأمان والخصوصية\n\nجرّب أن تُعيد صياغة سؤالك، أو اختر أحد المواضيع أعلاه.",
    talkToHuman: "بالتأكيد! سأربطك مع فريق الدعم الفني. يرجى تعبئة النموذج التالي:",
    ticketCreated: "تم إنشاء تذكرتك بنجاح! رقم التذكرة: {{number}}\n\nفريق الدعم سي رد عليك قريباً. يمكنك إرسال رسائل هنا وستظهر ردودهم تلقائياً.",
    ticketError: "حدث خطأ أثناء إنشاء التذكرة. يمكنك التواصل معنا عبر البريد الإلكتروني: support@anmat.com",
    namePlaceholder: "الاسم الكامل",
    emailPlaceholder: "البريد الإلكتروني",
    messagePlaceholder: "اشرح مشكلتك أو استفسارك...",
    sendRequest: "إرسال الطلب",
    requiredField: "هذا الحقل مطلوب",
    invalidEmail: "البريد الإلكتروني غير صحيح",
    waitingForReply: "في انتظار رد فريق الدعم...",
    you: "أنت",
    support: "فريق الدعم",
  },
  en: {
    greeting: "Hello! 👋 I'm the Anmaat AI Assistant. I can answer your questions about the system, features, and pricing. How can I help you?",
    patterns: [
      { keywords: ["hello", "hi", "hey"], reply: "Hello! 👋 Welcome to Anmaat. I'm here to help. What would you like to know?" },
      { keywords: ["what is", "about", "anmat", "explain", "tell me about", "describe", "how does it work", "what does it do", "overview", "system"], reply: "Anmaat is a comprehensive enterprise management platform:\n\n📊 Project & Task Management\n👥 Team Management\n💬 Real-time Communication\n📱 Social Media Management\n📈 Smart Analytics\n🤖 AI Assistant\n\nAll in one platform!" },
      { keywords: ["features", "capabilities", "what does it do", "benefits", "feature", "functions", "uses", "can it", "offer", "provide", "include"], reply: "Key features:\n✅ Project & task management\n✅ Team & employee management\n✅ Smart calendar\n✅ Instant messaging\n✅ Social media management\n✅ Analytics & reports\n✅ AI assistant\n✅ Multi-language support" },
      { keywords: ["price", "pricing", "cost", "free", "plan", "plans", "subscription", "subscribe", "how much", "fee", "rates"], reply: "Plans available:\n💳 Free Plan - Basic features\n💎 Pro Plan - Advanced features\n🏢 Enterprise Plan - Custom solutions\n\nMonthly & yearly pricing available." },
      { keywords: ["get started", "register", "sign up"], reply: "To get started:\n1️⃣ Click \"Get Started\"\n2️⃣ Enter email & password\n3️⃣ Choose your plan\n4️⃣ Add your team\n\nRegistration is free! 🚀", hasRegisterLink: true },
      { keywords: ["login", "sign in", "log in", "signin", "log-in"], reply: "You can sign in here:", hasSignInLink: true },
      { keywords: ["team", "employees", "staff", "member", "workers"], reply: "Team management:\n👥 Add & manage employees\n🏢 Create departments\n🏷️ Job positions\n📋 Roles & permissions\n📊 Attendance tracking\n💰 Salary management" },
      { keywords: ["project", "task", "tasks", "projects", "tracking"], reply: "Project management:\n📁 Create projects\n✅ Subtasks\n🏷️ Multiple statuses\n⏰ Deadlines\n📎 File attachments\n💬 Comments" },
      { keywords: ["social media"], reply: "Social media:\n📱 Connect multiple accounts\n📅 Schedule & publish\n💬 Reply to comments\n📊 Performance analytics" },
      { keywords: ["security", "privacy"], reply: "Security:\n🔒 Data encryption\n🛡️ Advanced permissions\n📋 Activity logs\n🔐 Secure auth\n☁️ Regular backups" },
      // ── Troubleshooting ──
      { keywords: ["issue", "problem", "error", "bug", "not working", "broken", "failed", "stuck", "crash", "help"], reply: "I'm sorry about that issue! Let me help you:\n\n1️⃣ Check your internet connection\n2️⃣ Clear your browser cache\n3️⃣ Try a different browser\n4️⃣ Verify your email and password\n\nIf the problem persists, I can create a support ticket for you." },
      { keywords: ["password", "forgot", "reset", "email", "account", "can't login", "locked", "blocked"], reply: "To resolve login issues:\n\n🔑 **Forgot Password?**\n- Click \"Forgot Password\" on the login page\n- You'll receive a reset link via email\n\n📧 **Wrong Email?**\n- Double-check your email address\n- Check your spam/junk folder\n\n🔒 **Account Locked?**\n- Contact our support team\n\nWould you like me to create a support ticket?" },
      { keywords: ["slow", "lag", "freeze", "loading"], reply: "To improve performance:\n\n⚡ Close other tabs/apps\n🗑️ Clear browser cache\n🔄 Update your browser\n🌐 Check your internet connection\n\nLet me know if the issue continues!" },
      { keywords: ["android", "ios", "mobile", "phone", "app"], reply: "Anmaat mobile app:\n\n📱 **Android:** Available on Google Play\n🍎 **iOS:** Available on App Store\n\nSearch for \"Anmaat\" in your store.\n\n⚠️ Some features may only be available on web." },
      { keywords: ["install", "update", "version"], reply: "Updating the system:\n\n🔄 **Web:** Updates are automatic\n📱 **Mobile:** Update from the app store\n\nAlways use the latest version for the best experience and bug fixes." },
      { keywords: ["data", "information", "breach", "stolen"], reply: "Your data is secure:\n\n🔐 All data is encrypted\n🛡️ Advanced permission system\n📋 Full activity logs\n☁️ Daily backups\n\n⚠️ If you notice suspicious activity:\n1. Change your password immediately\n2. Contact support" },
      { keywords: ["thanks", "thank you", "great", "awesome", "good", "perfect", "excellent", "nice"], reply: "You're welcome! 😊 I'm happy to help. If you have any other questions, I'm here!" },
      { keywords: ["manage", "organize", "track", "report", "analytics", "operations"], reply: "Anmaat helps you with:\n📊 Track projects & tasks\n📈 Reports & analytics\n📋 Schedule management\n👥 Team management\nAll in one place!" },
    ],
    fallback: "I'm sorry, I couldn't fully understand your question. I can help you with:\n\n• 💰 Pricing & plans\n• 📋 Features overview\n• 🔑 Login troubleshooting\n• ⚙️ Setup & usage guide\n• 📊 Projects & tasks\n• 👥 Team management\n• 📱 Social media\n• 🔒 Security & privacy\n\nTry rephrasing your question, or pick one of the topics above.",
    talkToHuman: "Of course! I'll connect you with our support team. Please fill out the form below:",
    ticketCreated: "Your ticket has been created successfully! Ticket number: {{number}}\n\nOur support team will reply soon. You can send messages here and their replies will appear automatically.",
    ticketError: "An error occurred while creating the ticket. You can contact us via email: support@anmat.com",
    namePlaceholder: "Full name",
    emailPlaceholder: "Email address",
    messagePlaceholder: "Describe your issue or question...",
    sendRequest: "Send Request",
    requiredField: "This field is required",
    invalidEmail: "Invalid email address",
    waitingForReply: "Waiting for support team reply...",
    you: "You",
    support: "Support Team",
  },
};

function getVisitorReply(message, lang) {
  const knowledge = lang === "ar" ? VISITOR_KNOWLEDGE.ar : VISITOR_KNOWLEDGE.en;
  const lowerMsg = message.toLowerCase();

  for (const pattern of knowledge.patterns) {
    for (const kw of pattern.keywords) {
      if (lowerMsg.includes(kw.toLowerCase())) return { content: pattern.reply, hasRegisterLink: !!pattern.hasRegisterLink, hasSignInLink: !!pattern.hasSignInLink };
    }
  }

  const thankWords = lang === "ar" ? ["شكرا", "Thank"] : ["Thank"];
  if (thankWords.some((w) => lowerMsg.includes(w.toLowerCase()))) {
    return { content: lang === "ar" ? "على الرحب والسعة! 😊" : "You're welcome! 😊", hasRegisterLink: false, hasSignInLink: false };
  }

  return { content: knowledge.fallback, hasRegisterLink: false, hasSignInLink: false };
}

const QUICK_ACTIONS_AR = ["ما هو أنماط؟", "المميزات", "الأسعار", "التسجيل", "تسجيل الدخول"];
const QUICK_ACTIONS_EN = ["What is Anmaat?", "Features", "Pricing", "Register", "Sign In"];
const SUPPORT_ACTION_AR = "التحدث مع الدعم الفني";
const SUPPORT_ACTION_EN = "Talk to support";

const HISTORY_KEY = "anmat_guest_bot_history";
function loadHistory(key) {
  try {
    const raw = localStorage.getItem(HISTORY_KEY + key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { void e; return []; }
}
function saveHistory(key, list) {
  try { localStorage.setItem(HISTORY_KEY + key, JSON.stringify(list)); } catch (e) { void e; }
}
function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "الآن";
  if (min < 60) return `${min}د`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}س`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}ي`;
  return `${d.getDate()}/${d.getMonth() + 1}`;
}
function formatMsgTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

const GUEST_SESSION_KEY = "anmat_guest_chat_session";

function saveGuestSession(data) {
  try { localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(data)); } catch {}
}

function loadGuestSession() {
  try {
    const raw = localStorage.getItem(GUEST_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function clearGuestSession() {
  try { localStorage.removeItem(GUEST_SESSION_KEY); } catch {}
}

export default function FloatingAiButton() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("ai");
  const [ticketId, setTicketId] = useState(null);
  const [ticketNumber, setTicketNumber] = useState(null);
  const [guestEmail, setGuestEmail] = useState(null);
  const [guestName, setGuestName] = useState(null);
  const [supportMessages, setSupportMessages] = useState([]);
  const [pendingActionId, setPendingActionId] = useState(null);
  const [pendingActionSummary, setPendingActionSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [viewingHistory, setViewingHistory] = useState(null);
  const [ticketClosed, setTicketClosed] = useState(false);
  const [greetingLang, setGreetingLang] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const pollingRef = useRef(null);

  const isAr = i18n.language === "ar";
  const knowledge = isAr ? VISITOR_KNOWLEDGE.ar : VISITOR_KNOWLEDGE.en;
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("token");
  const sessionKey = guestEmail || "guest";

  useEffect(() => {
    if (guestEmail) {
      setHistory(loadHistory(guestEmail));
    } else {
      setHistory(loadHistory("guest"));
    }
  }, [guestEmail]);

  const archiveAndNew = () => {
    const hasContent = messages.length > 1 || supportMessages.length > 0;
    if (hasContent) {
      const firstUser = messages.find((m) => m.role === "user") || supportMessages.find((m) => m.role === "user");
      const title = firstUser?.content?.slice(0, 60) || (isAr ? "محادثة" : "Chat");
      const list = loadHistory(sessionKey);
      list.unshift({ id: Date.now().toString(), messages, supportMessages, ticketId, ticketNumber, guestEmail, guestName, timestamp: new Date().toISOString(), title });
      if (list.length > 30) list.length = 30;
      saveHistory(sessionKey, list);
      setHistory(list);
    }
    setMessages([]);
    setViewMode("ai");
    setTicketId(null);
    setTicketNumber(null);
    setSupportMessages([]);
    setPendingActionId(null);
    setPendingActionSummary(null);
    setShowHistory(false);
    setViewingHistory(null);
    setTicketClosed(false);
    clearGuestSession();
  };

  const prevOpenRef = useRef(false);
  useEffect(() => {
    if (prevOpenRef.current && !isOpen) {
      const hasContent = messages.length > 1 || supportMessages.length > 0;
      if (hasContent) {
        const firstUser = messages.find((m) => m.role === "user") || supportMessages.find((m) => m.role === "user");
        const title = firstUser?.content?.slice(0, 60) || (isAr ? "محادثة" : "Chat");
        const list = loadHistory(sessionKey);
        list.unshift({ id: Date.now().toString(), messages, supportMessages, ticketId, ticketNumber, guestEmail, guestName, timestamp: new Date().toISOString(), title });
        if (list.length > 30) list.length = 30;
        saveHistory(sessionKey, list);
        setHistory(list);
      }
    }
    prevOpenRef.current = isOpen;
  }, [isOpen, messages, supportMessages, sessionKey, guestEmail, guestName, ticketId, ticketNumber, isAr]);

  useEffect(() => {
    const saved = loadGuestSession();
    if (saved?.ticketId && saved?.guestEmail && !isLoggedIn) {
      setTicketId(saved.ticketId);
      setTicketNumber(saved.ticketNumber || null);
      setGuestEmail(saved.guestEmail);
      setGuestName(saved.guestName || null);
      setSupportMessages(saved.supportMessages || []);

      (async () => {
        try {
          const res = await fetch(`${RootRoute}/api/public/support-tickets/${saved.ticketId}?email=${encodeURIComponent(saved.guestEmail)}`);
          if (res.ok) {
            const data = await res.json();
            const status = data?.data?.status || data?.status;
            if (status === "closed" || status === "resolved") {
              setTicketId(null);
              setTicketNumber(null);
              setTicketClosed(true);
              setViewMode("ai");
              clearGuestSession();
            }
          } else if (res.status === 404) {
            setTicketId(null);
            setTicketNumber(null);
            setTicketClosed(true);
            setViewMode("ai");
            clearGuestSession();
          }
        } catch { /* ignore */ }
      })();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, supportMessages]);

  useEffect(() => {
    if (isOpen && !showHistory && !viewingHistory && !ticketId && !ticketClosed) {
      const currentLang = isAr ? "ar" : "en";
      if (messages.length === 0) {
        const greeting = isLoggedIn
          ? (isAr
              ? `مرحباً! 👋 أنا مساعد أنماط الذكي. يمكنني مساعدتك في إدارة مهامك ومشاريعك والرد على استفساراتك. كيف أستطيع مساعدتك؟`
              : `Hello! 👋 I'm the Anmaat AI Assistant. I can help you with tasks, projects, and answer your questions. How can I help you?`)
          : knowledge.greeting;
        setMessages([{ role: "assistant", content: greeting }]);
        setGreetingLang(currentLang);
      } else if (greetingLang && greetingLang !== currentLang) {
        const newGreeting = isLoggedIn
          ? (isAr
              ? `مرحباً! 👋 أنا مساعد أنماط الذكي. يمكنني مساعدتك في إدارة مهامك ومشاريعك والرد على استفساراتك. كيف أستطيع مساعدتك؟`
              : `Hello! 👋 I'm the Anmaat AI Assistant. I can help you with tasks, projects, and answer your questions. How can I help you?`)
          : knowledge.greeting;
        setMessages((prev) => {
          const updated = [...prev];
          if (updated.length > 0 && (updated[0].content?.includes("مساعد أنماط") || updated[0].content?.includes("Anmaat AI Assistant") || updated[0].content?.includes("مرحباً") || updated[0].content?.includes("Hello"))) {
            updated[0] = { ...updated[0], content: newGreeting };
          }
          return updated;
        });
        setGreetingLang(currentLang);
      }
    }
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
    if (!isOpen) {
      setPendingActionId(null);
      setPendingActionSummary(null);
    }
  }, [isOpen, isAr, messages.length, showHistory, viewingHistory, ticketId, ticketClosed, greetingLang, isLoggedIn, knowledge.greeting]);

  // Polling for support ticket messages
  useEffect(() => {
    if (viewMode === "support" && ticketId) {
      const poll = async () => {
        try {
          const token = localStorage.getItem("token");
          let res;
          if (token) {
            res = await fetch(`${RootRoute}/api/support-tickets/${ticketId}/messages`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          } else if (guestEmail) {
            res = await fetch(`${RootRoute}/api/public/support-tickets/${ticketId}/messages?email=${encodeURIComponent(guestEmail)}`);
          }
          if (res && res.ok) {
            const data = await res.json();
            const msgs = (data?.data || data || []).map((m) => ({
              id: m._id,
              role: m.sender_type === "guest" ? "user" : "support",
              content: m.message,
              time: m.createdAt,
            }));
            setSupportMessages((prev) => {
              const prevIds = new Set(prev.map((m) => m.id).filter(Boolean));
              const updated = [...prev];
              for (const sm of msgs) {
                if (prevIds.has(sm.id)) continue;
                const idx = updated.findIndex((m) => m.id !== sm.id && m.role === sm.role && m.content === sm.content);
                if (idx !== -1) updated[idx] = sm;
                else updated.push(sm);
              }
              return updated;
            });
          }
          let ticketRes;
          if (token) {
            ticketRes = await fetch(`${RootRoute}/api/support-tickets/${ticketId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          } else if (guestEmail) {
            ticketRes = await fetch(`${RootRoute}/api/public/support-tickets/${ticketId}?email=${encodeURIComponent(guestEmail)}`);
          }
          if (ticketRes && ticketRes.ok) {
            const ticketData = await ticketRes.json();
            const status = ticketData?.data?.status || ticketData?.status;
            if (status === "closed" || status === "resolved") {
              clearInterval(pollingRef.current);
              setTicketId(null);
              setTicketNumber(null);
              setTicketClosed(true);
              setViewMode("ai");
            }
          }
        } catch { /* polling error */ }
      };

      poll();
      pollingRef.current = setInterval(poll, 8000);
      return () => clearInterval(pollingRef.current);
    }
  }, [viewMode, ticketId, guestEmail]);

  const createUrgentTicket = async (message) => {
    try {
      const token = localStorage.getItem("token");
      const body = JSON.stringify({
        title: message.substring(0, 100),
        description: message,
        priority: "urgent",
        guest_name: guestName || "Visitor",
        guest_email: guestEmail || "visitor@example.com",
      });

      let res;
      if (token) {
        res = await fetch(`${RootRoute}/api/support-tickets`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body,
        });
      }
      if (!res || !res.ok) {
        res = await fetch(`${RootRoute}/api/public/support-tickets`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
      }

      if (res.ok) {
        const data = await res.json();
        const ticket = data?.data || data;
        setTicketId(ticket?._id);
        setTicketNumber(ticket?.ticket_number || "TKT-" + Date.now());
        setViewMode("support");
        const welcomeMsg = {
          id: "welcome",
          role: "support",
          content: isAr
            ? `مرحباً! 👋 تم استلام تذكرتك العاجلة. فريق الدعم سي رد عليك قريباً.`
            : `Hello! 👋 Your urgent ticket has been received. Our support team will reply to you soon.`,
          time: new Date().toISOString(),
        };
        setSupportMessages([welcomeMsg]);
        saveGuestSession({
          ticketId: ticket?._id,
          ticketNumber: ticket?.ticket_number || "TKT-" + Date.now(),
          guestEmail,
          guestName,
          supportMessages: [welcomeMsg],
        });
      } else {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: isAr ? "حدث خطأ أثناء إنشاء التذكرة." : "An error occurred while creating the ticket.",
        }]);
      }
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: isAr ? "حدث خطأ أثناء إنشاء التذكرة." : "An error occurred while creating the ticket.",
      }]);
    }
  };

  const sendSupportMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || !ticketId || ticketClosed) return;
    const userMsg = { id: "user-" + Date.now(), role: "user", content: trimmed, time: new Date().toISOString() };
    setSupportMessages((prev) => {
      const updated = [...prev, userMsg];
      saveGuestSession({ ticketId, ticketNumber, guestEmail, guestName, supportMessages: updated });
      return updated;
    });
    setInput("");
    const token = localStorage.getItem("token");
    try {
      if (token) {
        await fetch(`${RootRoute}/api/support-tickets/${ticketId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ message: trimmed }),
        });
      } else if (guestEmail) {
        await fetch(`${RootRoute}/api/public/support-tickets/${ticketId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, email: guestEmail }),
        });
      }
    } catch (e) { void e; }
  };

  const handleSend = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;
    const userLang = detectLanguage(trimmed);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");

    if (wantsHuman(trimmed, userLang)) {
      setIsLoading(true);
      await createUrgentTicket(trimmed);
      setIsLoading(false);
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token) {
      setIsLoading(true);
      try {
        const res = await fetch(`${RootRoute}/api/ai/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: trimmed }),
        });

        if (res.ok) {
          const data = await res.json();
          const result = data?.data || data;
          const assistantMsg = result?.assistant_message;

          if (assistantMsg?.pending_action) {
            const pa = assistantMsg.pending_action;
            setPendingActionId(pa._id);
            setPendingActionSummary(pa.summary);
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: assistantMsg.content || pa.summary,
                hasPendingAction: true,
              },
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: assistantMsg?.content || "" },
            ]);
          }
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: knowledge.fallback },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: knowledge.fallback },
        ]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);

    const pricingKeywords = ["سعر", "تسعير", "كم يكلف", "مجاني", "free", "price", "اسعار", "الاسعار", "السعر", "خطط", "الخطط", "تكلفة", "اشتراك", "اشتراكات", "باقي"];
    const isPricingQuery = pricingKeywords.some((kw) => trimmed.toLowerCase().includes(kw.toLowerCase()));

    if (isPricingQuery) {
      try {
        const res = await fetch(`${RootRoute}/api/subscription-plans/public`);
        if (res.ok) {
          const data = await res.json();
          const plans = data?.data || data || [];
          if (Array.isArray(plans) && plans.length > 0) {
            let pricingText = isAr ? "💳 خطط الاشتراك المتاحة:\n\n" : "💳 Available subscription plans:\n\n";
            for (const plan of plans) {
              const name = plan.name || "Plan";
              const description = plan.description || "";
              pricingText += `**${name}**`;
              if (description) pricingText += ` - ${description}`;
              pricingText += "\n";
              if (Array.isArray(plan.pricing)) {
                for (const p of plan.pricing) {
                  if (!p.is_active) continue;
                  const interval = p.interval === "month" ? (isAr ? "شهري" : "monthly") : (isAr ? "سنوي" : "yearly");
                  const discount = p.discount > 0 ? ` (${p.discount}% ${isAr ? "خصم" : "off"})` : "";
                  pricingText += `  • ${interval}: ${p.price}${isAr ? " ر.س" : " SAR"}${discount}\n`;
                }
              }
              if (plan.trial?.is_active && plan.trial?.trial_days) {
                pricingText += `  🎁 ${isAr ? "فترة تجريبية" : "Free trial"}: ${plan.trial.trial_days} ${isAr ? "يوم" : "days"}\n`;
              }
              pricingText += "\n";
            }
            pricingText += isAr ? "للتسجيل المجاني، اضغط الزر أدناه 👇" : "To register for free, click the button below 👇";
            setMessages((prev) => [...prev, { role: "assistant", content: pricingText, hasRegisterLink: true }]);
            setIsLoading(false);
            return;
          }
        }
      } catch (e) { void e; }
    }

    await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));
    const reply = getVisitorReply(trimmed, userLang);
    setMessages((prev) => [...prev, { role: "assistant", content: reply.content, hasRegisterLink: reply.hasRegisterLink, hasSignInLink: reply.hasSignInLink }]);
    setIsLoading(false);
  };

  const confirmPendingAction = async () => {
    if (!pendingActionId) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${RootRoute}/api/ai/pending-actions/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pending_action_id: pendingActionId }),
      });

      if (res.ok) {
        const data = await res.json();
        const result = data?.data || data;
        const assistantMsg = result?.assistant_message;
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: assistantMsg?.content || (isAr ? "تم تنفيذ الطلب بنجاح." : "Action executed successfully.") },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: isAr ? "حدث خطأ أثناء تنفيذ الطلب." : "An error occurred while executing the action." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: isAr ? "حدث خطأ أثناء تنفيذ الطلب." : "An error occurred while executing the action." },
      ]);
    } finally {
      setPendingActionId(null);
      setPendingActionSummary(null);
      setIsLoading(false);
    }
  };

  const cancelPendingAction = () => {
    setPendingActionId(null);
    setPendingActionSummary(null);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: isAr ? "تم إلغاء الطلب." : "Action cancelled." },
    ]);
  };

  const handleSendSupport = () => {
    if (viewMode === "support" && !ticketClosed) sendSupportMessage();
    else handleSend();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendSupport();
    }
  };

  const deleteHistoryItem = (id) => {
    const updated = history.filter((h) => h.id !== id);
    saveHistory(sessionKey, updated);
    setHistory(updated);
  };

  const handleHistorySend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const session = viewingHistory;
    if (!session) return;
    setInput("");
    if (session.ticketId) {
      setTicketId(session.ticketId);
      setTicketNumber(session.ticketNumber || null);
      setSupportMessages([...(session.supportMessages || []), { id: "user-" + Date.now(), role: "user", content: trimmed, time: new Date().toISOString() }]);
      setMessages(session.messages || []);
      setViewMode("support");
      setViewingHistory(null);
      setShowHistory(false);
      setTicketClosed(false);
      const token = localStorage.getItem("token");
      try {
        if (token) {
          await fetch(`${RootRoute}/api/support-tickets/${session.ticketId}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ message: trimmed }),
          });
        } else if (guestEmail) {
          await fetch(`${RootRoute}/api/public/support-tickets/${session.ticketId}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: trimmed, email: guestEmail }),
          });
        }
      } catch (e) { void e; }
    } else {
      setMessages(session.messages || []);
      setViewingHistory(null);
      setShowHistory(false);
      await createUrgentTicket(trimmed);
    }
  };

  const handleHistoryKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleHistorySend(); }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 z-[9999] w-14 h-14 rounded-full bg-primary-500 hover:bg-primary-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        style={{ [isAr ? "left" : "right"]: "24px" }}
      >
        {isOpen ? <IoClose size={24} color="#fff" /> : <FaRobot size={24} color="#fff" className="group-hover:scale-110 transition-transform" />}
        {!isOpen && (
          <span className="absolute -top-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white animate-pulse" style={{ [isAr ? "left" : "right"]: "-4px" }} />
        )}
      </button>

      {isOpen && (
        <div
          className="fixed z-[9999] w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 text-cell-primary rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
          style={{ bottom: "96px", [isAr ? "left" : "right"]: "24px" }}
        >
          <div className="flex items-center gap-3 px-4 py-3 text-white shrink-0" style={{ backgroundColor: 'var(--color-primary)' }}>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              {viewMode === "support" ? <IoChatbubbles size={18} color="#fff" /> : <FaRobot size={18} color="#fff" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm m-0 text-white">
                {viewingHistory ? (viewingHistory.ticketId ? (viewMode === "support" || (!viewingHistory.messages?.length && viewingHistory.supportMessages?.length) ? (isAr ? "محادثة الدعم" : "Support Chat") : (isAr ? "محادثة سابقة" : "Past Chat")) : (isAr ? "محادثة سابقة" : "Past Chat")) : showHistory ? (isAr ? "سجل المحادثات" : "History") : viewMode === "support" ? (isAr ? "فريق الدعم" : "Support") : t("AI Assistant")}
              </p>
              <p className="text-[11px] m-0 text-white/80 truncate">
                {viewingHistory ? (viewingHistory.ticketNumber || viewingHistory.title || "") : showHistory ? `${history.length} ${isAr ? "محادثة" : "conversations"}` : viewMode === "support" ? (ticketNumber || (isAr ? "تذكرة دعم" : "Ticket")) : (isAr ? "اسألني أي شيء" : "Ask me anything")}
              </p>
            </div>
            {viewingHistory ? (
              <button onClick={() => setViewingHistory(null)} className="text-white/80 hover:text-white text-[11px] bg-transparent border-none cursor-pointer">{isAr ? "رجوع" : "Back"}</button>
            ) : showHistory ? (
              <button onClick={() => setShowHistory(false)} className="text-white/80 hover:text-white text-[11px] bg-transparent border-none cursor-pointer">{isAr ? "رجوع" : "Back"}</button>
            ) : (
              <>
                {(messages.length > 1 || supportMessages.length > 0) && (
                  <button onClick={archiveAndNew} className="text-white/80 hover:text-white text-[11px] bg-transparent border-none cursor-pointer">{isAr ? "جديد" : "New"}</button>
                )}
                <button onClick={() => { setHistory(loadHistory(sessionKey)); setShowHistory(true); }} className="text-white/80 hover:text-white bg-transparent border-none cursor-pointer" title={isAr ? "السجل" : "History"}>
                  <IoTimeOutline size={18} />
                </button>
              </>
            )}
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white bg-transparent border-none cursor-pointer"><IoClose size={20} /></button>
          </div>

          {ticketId && !ticketClosed && !viewingHistory && !showHistory && (
            <div className="flex shrink-0 border-b border-gray-200 dark:border-gray-700">
              <button onClick={() => setViewMode("ai")} className={`flex-1 py-2 text-xs font-medium transition-colors bg-transparent border-none cursor-pointer ${viewMode === "ai" ? "text-primary-500 border-b-2 border-primary-500" : "text-sub-500 hover:text-cell-primary"}`}>
                <FaRobot size={13} className="inline mr-1" />{isAr ? "الذكاء الاصطناعي" : "AI"}
              </button>
              <button onClick={() => setViewMode("support")} className={`flex-1 py-2 text-xs font-medium transition-colors bg-transparent border-none cursor-pointer ${viewMode === "support" ? "text-primary-500 border-b-2 border-primary-500" : "text-sub-500 hover:text-cell-primary"}`}>
                <IoChatbubbles size={13} className="inline mr-1" />{isAr ? "الدعم" : "Support"}
              </button>
            </div>
          )}

          <div className="flex-1 flex flex-col min-h-0">
            {showHistory && !viewingHistory ? (
              history.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-sm opacity-40">{isAr ? "لا توجد محادثات سابقة" : "No history yet"}</div>
              ) : (
                <div className="flex flex-col">
                  {history.map((session) => (
                    <div key={session.id} className="flex items-center border-b border-gray-100 dark:border-gray-800">
                      <button
                        onClick={() => setViewingHistory(session)}
                        className="flex-1 text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors bg-transparent cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {session.ticketId ? <IoChatbubbles size={13} className="text-blue-500 shrink-0" /> : <FaRobot size={13} className="text-blue-500 shrink-0" />}
                          <span className="text-[13px] font-medium truncate text-cell-primary">{session.title}</span>
                          {session.ticketNumber && <span className="text-[9px] bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full shrink-0">{session.ticketNumber}</span>}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-cell-secondary">{(session.messages?.length || 0) + (session.supportMessages?.length || 0)} {isAr ? "رسالة" : "msgs"}</span>
                          <span className="text-[11px] text-cell-secondary">{formatTime(session.timestamp)}</span>
                        </div>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteHistoryItem(session.id); }}
                        className="px-3 py-3 text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )
            ) : viewingHistory ? (
              <>
                <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
                  {viewingHistory.messages?.map((msg, i) => (
                    <div key={`ai-${i}`} className={`flex flex-col gap-1.5 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                      <div className={`max-w-[85%] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user" ? "bg-blue-500 text-white rounded-2xl rounded-br-sm" : "bg-gray-100 dark:bg-gray-800 text-cell-primary rounded-2xl rounded-bl-sm"
                      }`}>{msg.content}</div>
                      <span className={`text-[9px] text-sub-500 px-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>{formatMsgTime(msg.time)}</span>
                    </div>
                  ))}
                  {viewingHistory.supportMessages?.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 my-1">
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        <span className="text-[10px] text-sub-500">{isAr ? "محادثة الدعم" : "Support Chat"}</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                      </div>
                      {viewingHistory.supportMessages.map((msg) => (
                        <div key={`sup-${msg.id}`} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                          <div className={`max-w-[85%] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap rounded-2xl shadow-sm border ${msg.role === "user" ? "bg-primary-500 dark:bg-primary-200 dark:text-black text-white rounded-br-sm border-transparent" : "rounded-bl-sm text-cell-primary border-status-border"}`} style={msg.role === "user" ? {} : { backgroundColor: 'var(--color-blue-ebf1ff)' }}>{msg.content}</div>
                          <span className="text-[9px] text-sub-500 px-1">{formatMsgTime(msg.time)}</span>
                        </div>
                      ))}
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 p-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleHistoryKeyDown}
                      placeholder={viewingHistory.ticketId ? (isAr ? "أرسل رسالة في التذكرة..." : "Reply to ticket...") : (isAr ? "أرسل رسالة دعم جديدة..." : "Send new support message...")}
                      className="flex-1 text-[13px] rounded-xl py-2.5 px-3.5 outline-none border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-cell-primary" />
                    <button onClick={handleHistorySend} disabled={!input.trim()}
                      className="w-10 h-10 rounded-xl border-none flex items-center justify-center flex-shrink-0 transition-colors"
                      style={{ backgroundColor: !input.trim() ? "#d1d5db" : "#3b82f6", color: "#fff", cursor: !input.trim() ? "not-allowed" : "pointer" }}>
                      <IoSend size={16} style={{ transform: isAr ? "scaleX(-1)" : "none" }} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                  {viewMode === "ai" && messages.map((msg, i) => (
                    <div key={i} className={`flex flex-col gap-1.5 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                      <div className={`max-w-[85%] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user" ? "bg-blue-500 text-white rounded-2xl rounded-br-sm" : "bg-gray-100 dark:bg-gray-800 text-cell-primary rounded-2xl rounded-bl-sm"
                      }`}>{msg.content}</div>
                      {msg.hasRegisterLink && (
                        <Link href="/register/subscriber/email"
                          className="inline-block px-4 py-2 rounded-xl bg-emerald-500 text-white text-[13px] font-semibold no-underline text-center">
                          {isAr ? "ابدأ الآن" : "Get Started"}
                        </Link>
                      )}
                      {msg.hasSignInLink && (
                        <Link href="/sign-in"
                          className="inline-block px-4 py-2 rounded-xl bg-blue-500 text-white text-[13px] font-semibold no-underline text-center">
                          {isAr ? "تسجيل الدخول" : "Sign In"}
                        </Link>
                      )}
                    </div>
                  ))}

                  {pendingActionId && pendingActionSummary && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-amber-50 dark:bg-amber-900/30 border border-amber-400 dark:border-amber-600 text-[13px] leading-relaxed">
                        <p className="font-semibold text-amber-800 dark:text-amber-300 m-0 mb-2">{isAr ? "⏳ موافقة مطلوبة" : "⏳ Confirmation Required"}</p>
                        <p className="text-amber-900 dark:text-amber-200 m-0 mb-2.5 whitespace-pre-wrap">{pendingActionSummary}</p>
                        <div className="flex gap-2">
                          <button onClick={confirmPendingAction} disabled={isLoading} className="flex-1 py-2 rounded-lg border-none bg-emerald-500 text-white text-xs font-semibold cursor-pointer disabled:cursor-not-allowed">{isAr ? "✓ تأكيد" : "✓ Confirm"}</button>
                          <button onClick={cancelPendingAction} disabled={isLoading} className="flex-1 py-2 rounded-lg border-none bg-red-500 text-white text-xs font-semibold cursor-pointer disabled:cursor-not-allowed">{isAr ? "✗ إلغاء" : "✗ Cancel"}</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {viewMode === "support" && supportMessages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                      <div className={`max-w-[85%] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap rounded-2xl shadow-sm border ${msg.role === "user" ? "bg-primary-500 dark:bg-primary-200 dark:text-black text-white rounded-br-sm border-transparent" : "rounded-bl-sm text-cell-primary border-status-border"}`} style={msg.role === "user" ? {} : { backgroundColor: 'var(--color-blue-ebf1ff)' }}>{msg.content}</div>
                    </div>
                  ))}

                  {viewMode === "support" && ticketClosed && (
                    <div className="flex justify-center my-2">
                      <span className="text-[11px] text-sub-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">{isAr ? "تم إغلاق التذكرة" : "Ticket closed"}</span>
                    </div>
                  )}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-gray-100 dark:bg-gray-800">
                        <div className="flex gap-1">
                          <span className="animate-bounce w-2 h-2 rounded-full bg-gray-400" style={{ animationDelay: "0ms" }} />
                          <span className="animate-bounce w-2 h-2 rounded-full bg-gray-400" style={{ animationDelay: "150ms" }} />
                          <span className="animate-bounce w-2 h-2 rounded-full bg-gray-400" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {viewMode === "ai" && messages.length <= 1 && !isLoading && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {(isLoggedIn
                        ? (isAr
                            ? ["ما هي مهامي؟", "مشاريعي", "المهام المعلقة"]
                            : ["What are my tasks?", "My projects", "Pending tasks"])
                        : (isAr ? QUICK_ACTIONS_AR : QUICK_ACTIONS_EN)
                      ).map((action, i) => (
                        <button key={i} onClick={() => handleSend(action)} className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-blue-500 dark:text-blue-400 text-xs cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-500 transition-colors">{action}</button>
                      ))}
                    </div>
                  )}

                  {viewMode === "ai" && messages.length > 6 && messages.length <= 10 && !ticketId && !ticketClosed && !isLoading && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <button onClick={() => handleSend(isAr ? SUPPORT_ACTION_AR : SUPPORT_ACTION_EN)} className="px-3 py-1.5 rounded-full border border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:border-orange-500 transition-colors">
                        {isAr ? "💬 " + SUPPORT_ACTION_AR : "💬 " + SUPPORT_ACTION_EN}
                      </button>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 p-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                      placeholder={isAr ? "اكتب رسالتك..." : "Type your message..."}
                      className="flex-1 text-[13px] rounded-xl py-2.5 px-3.5 outline-none border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-cell-primary" disabled={isLoading || (viewMode === "support" && ticketClosed)} />
                    <button onClick={() => handleSendSupport()} disabled={!input.trim() || isLoading || (viewMode === "support" && ticketClosed)}
                      className="w-10 h-10 rounded-xl border-none flex items-center justify-center flex-shrink-0 transition-colors"
                      style={{ backgroundColor: !input.trim() || isLoading ? "#d1d5db" : "#3b82f6", color: "#fff", cursor: !input.trim() || isLoading ? "not-allowed" : "pointer" }}>
                      <IoSend size={16} style={{ transform: isAr ? "scaleX(-1)" : "none" }} />
                    </button>
                  </div>
                  {!isLoggedIn && viewMode === "ai" && (
                    <div className="text-center mt-2">
                      <Link href="/sign-in" className="text-[11px] text-cell-secondary underline hover:text-cell-primary">
                        {isAr ? "تسجيل الدخول للدردشة المتقدمة" : "Sign in for advanced chat"}
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
