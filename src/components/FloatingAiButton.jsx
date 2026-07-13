"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoClose, IoSend, IoPerson, IoChatbubbles } from "react-icons/io5";
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
      { keywords: ["ما هو", "شنو هو", "عن انماط", "عن النظام", "ايش هو"], reply: "أنماط (Anmaat) هو نظام إدارة مؤسسات متكامل يوفر:\n\n📊 إدارة المشاريع والمهام\n👥 إدارة الفريق والأقسام\n💬 التواصل الفوري\n📱 إدارة التواصل الاجتماعي\n📈 التحليلات الذكية\n🤖 مساعد ذكاء اصطناعي\n\nكل هذا في منصة واحدة!" },
      { keywords: ["مميزات", "ايش يقدم", "قدرات"], reply: "مميزات أنماط:\n✅ إدارة المشاريع والمهام\n✅ إدارة الفريق والموظفين\n✅ تقويم ومواعيد ذكية\n✅ محادثات فورية\n✅ إدارة التواصل الاجتماعي\n✅ تحليلات وتقارير\n✅ مساعد ذكاء اصطناعي\n✅ نظام أذونات متقدم\n✅ دعم عربي وإنجليزي" },
      { keywords: ["سعر", "تسعير", "كم يكلف", "مجاني", "free", "price"], reply: "لدينا خطط متنوعة:\n💳 الخطة المجانية - للتجربة\n💎 خطة Pro - ميزات متقدمة\n🏢 خطة Enterprise - حلول مخصصة\n\nالأسعار تبدأ من خطط شهرية وسنوية." },
      { keywords: ["كيف ابدا", "كيف اسجل", "تسجيل", "اشتراك"], reply: "للبدء:\n1️⃣ اضغط \"ابدأ الآن\"\n2️⃣ أدخل بريدك وكلمة المرور\n3️⃣ اختر الخطة المناسبة\n4️⃣ أضف فريقك ومشاريعك\n\nالتسجيل مجاني وسريع! 🚀" },
      { keywords: ["فريق", "موظفين", "قسم"], reply: "إدارة الفريق:\n👥 إضافة وتعديل الموظفين\n🏢 إنشاء أقسام\n🏷️ مواقع وظيفية\n📋 أدوار وصلاحيات\n📊 حضور وانصراف\n💰 رواتب" },
      { keywords: ["مشاريع", "مهام", "تتبع"], reply: "إدارة المشاريع:\n📁 إنشاء مشاريع\n✅ مهام فرعية\n🏷️ حالات متعددة\n⏰ مواعيد نهائية\n📎 إرفاق ملفات\n💬 تعليقات" },
      { keywords: ["تواصل اجتماعي", "سوشيال", "فيسبوك", "تويتر"], reply: "التواصل الاجتماعي:\n📱 ربط حسابات متعددة\n📝 جدولة ونشر\n💬 رد على التعليقات\n📊 تحليل الأداء" },
      { keywords: ["امان", "خصوصية", "حماية"], reply: "الأمان:\n🔒 تشفير البيانات\n🛡️ أذونات متقدمة\n📋 سجل نشاطات\n🔐 مصادقة آمنة\n☁️ نسخ احتياطي" },
    ],
    fallback: "شكراً لسؤالك! للإجابة التفصيلية، يمكنك تسجيل الدخول للنظام أو التحدث مع فريق الدعم الفني.",
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
      { keywords: ["what is", "about", "anmat"], reply: "Anmaat is a comprehensive enterprise management platform:\n\n📊 Project & Task Management\n👥 Team Management\n💬 Real-time Communication\n📱 Social Media Management\n📈 Smart Analytics\n🤖 AI Assistant\n\nAll in one platform!" },
      { keywords: ["features", "capabilities"], reply: "Key features:\n✅ Project & task management\n✅ Team & employee management\n✅ Smart calendar\n✅ Instant messaging\n✅ Social media management\n✅ Analytics & reports\n✅ AI assistant\n✅ Multi-language support" },
      { keywords: ["price", "pricing", "cost", "free", "plan"], reply: "Plans available:\n💳 Free Plan - Basic features\n💎 Pro Plan - Advanced features\n🏢 Enterprise Plan - Custom solutions\n\nMonthly & yearly pricing available." },
      { keywords: ["get started", "register", "sign up"], reply: "To get started:\n1️⃣ Click \"Get Started\"\n2️⃣ Enter email & password\n3️⃣ Choose your plan\n4️⃣ Add your team\n\nRegistration is free! 🚀" },
      { keywords: ["team", "employees"], reply: "Team management:\n👥 Add & manage employees\n🏢 Create departments\n🏷️ Job positions\n📋 Roles & permissions\n📊 Attendance tracking\n💰 Salary management" },
      { keywords: ["project", "task"], reply: "Project management:\n📁 Create projects\n✅ Subtasks\n🏷️ Multiple statuses\n⏰ Deadlines\n📎 File attachments\n💬 Comments" },
      { keywords: ["social media"], reply: "Social media:\n📱 Connect multiple accounts\n📅 Schedule & publish\n💬 Reply to comments\n📊 Performance analytics" },
      { keywords: ["security", "privacy"], reply: "Security:\n🔒 Data encryption\n🛡️ Advanced permissions\n📋 Activity logs\n🔐 Secure auth\n☁️ Regular backups" },
    ],
    fallback: "Thank you for your question! For a detailed answer, you can sign in to the system or talk to our support team.",
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
      if (lowerMsg.includes(kw.toLowerCase())) return pattern.reply;
    }
  }

  const thankWords = lang === "ar" ? ["شكرا", "Thank"] : ["Thank"];
  if (thankWords.some((w) => lowerMsg.includes(w.toLowerCase()))) {
    return lang === "ar" ? "على الرحب والسعة! 😊" : "You're welcome! 😊";
  }

  return knowledge.fallback;
}

const QUICK_ACTIONS_AR = ["ما هو أنماط؟", "المميزات", "الأسعار", "التحدث مع الدعم"];
const QUICK_ACTIONS_EN = ["What is Anmaat?", "Features", "Pricing", "Talk to support"];

// ── حفظ جلسة الزائر في localStorage ──────────────────────────────────────
// عند إنشاء تذكرة دعم، تُحفظ البيانات في localStorage حتى لو أغلق الزائر المتصفح
// وعند العودة يتم استعادة الجلسة تلقائياً (المعرّف + الرسائل + الإيميل)
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
  const [chatMode, setChatMode] = useState("ai"); // "ai" | "form" | "support"
  const [ticketId, setTicketId] = useState(null);
  const [ticketNumber, setTicketNumber] = useState(null);
  const [guestEmail, setGuestEmail] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formErrors, setFormErrors] = useState({});
  const [supportMessages, setSupportMessages] = useState([]);
  const [pendingActionId, setPendingActionId] = useState(null);
  const [pendingActionSummary, setPendingActionSummary] = useState(null);
  const [guestName, setGuestName] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const pollingRef = useRef(null);

  const isAr = i18n.language === "ar";
  const quickActions = isAr ? QUICK_ACTIONS_AR : QUICK_ACTIONS_EN;
  const lang = isAr ? "ar" : "en";
  const knowledge = isAr ? VISITOR_KNOWLEDGE.ar : VISITOR_KNOWLEDGE.en;
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("token");

  const endGuestSession = () => {
    clearGuestSession();
    setTicketId(null);
    setTicketNumber(null);
    setGuestEmail(null);
    setGuestName(null);
    setSupportMessages([]);
    setChatMode("ai");
  };

  useEffect(() => {
    const saved = loadGuestSession();
    if (saved?.ticketId && saved?.guestEmail && !isLoggedIn) {
      setTicketId(saved.ticketId);
      setTicketNumber(saved.ticketNumber || null);
      setGuestEmail(saved.guestEmail);
      setGuestName(saved.guestName || null);
      setSupportMessages(saved.supportMessages || []);
      setChatMode("support");
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, supportMessages]);

  useEffect(() => {
    if (isOpen && messages.length === 0 && chatMode !== "support") {
      const greeting = isLoggedIn
        ? (isAr
            ? "مرحباً! 👋 أنا مساعد أنماط الذكي. يمكنني مساعدتك في إدارة مهامك ومشاريعك والرد على استفساراتك. كيف أستطيع مساعدتك؟"
            : "Hello! 👋 I'm the Anmaat AI Assistant. I can help you with tasks, projects, and answer your questions. How can I help you?")
        : knowledge.greeting;
      setMessages([{ role: "assistant", content: greeting }]);
    }
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
    if (!isOpen) {
      setPendingActionId(null);
      setPendingActionSummary(null);
    }
  }, [isOpen]);

  // Polling for support ticket messages
  useEffect(() => {
    if (chatMode === "support" && ticketId) {
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
              role: m.sender_type === "guest" ? "visitor" : "support",
              content: m.message,
              time: m.createdAt,
            }));
            setSupportMessages((prev) => {
              const prevIds = prev.map((m) => m.id).filter(Boolean);
              const newMsgs = msgs.filter((m) => !prevIds.includes(m.id));
              if (newMsgs.length > 0) {
                const updated = [...prev, ...newMsgs];
                saveGuestSession({ ticketId, ticketNumber, guestEmail, guestName, supportMessages: updated });
                return updated;
              }
              return prev;
            });
          }
        } catch { /* polling error */ }
      };

      poll();
      pollingRef.current = setInterval(poll, 8000);
      return () => clearInterval(pollingRef.current);
    }
  }, [chatMode, ticketId, guestEmail]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = knowledge.requiredField;
    if (!formData.email.trim()) errors.email = knowledge.requiredField;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = knowledge.invalidEmail;
    if (!formData.message.trim()) errors.message = knowledge.requiredField;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createTicket = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    const authToken = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({
      title: formData.message.substring(0, 100),
      description: formData.message,
      priority: "medium",
      guest_name: formData.name,
      guest_email: formData.email,
    });

    try {
      let res;
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
        res = await fetch(`${RootRoute}/api/support-tickets`, {
          method: "POST",
          headers,
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
        setGuestEmail(formData.email);
        setGuestName(formData.name);
        setChatMode("support");

        const welcomeMsg = {
          id: "welcome",
          role: "support",
          content: isAr
            ? `مرحباً ${formData.name}! 👋 تم استلام طلبك. فريق الدعم سي رد عليك قريباً.`
            : `Hello ${formData.name}! 👋 Your request has been received. Our support team will reply to you soon.`,
          time: new Date().toISOString(),
        };
        setSupportMessages([welcomeMsg]);

        saveGuestSession({
          ticketId: ticket?._id,
          ticketNumber: ticket?.ticket_number || "TKT-" + Date.now(),
          guestEmail: formData.email,
          guestName: formData.name,
          supportMessages: [welcomeMsg],
        });
      } else {
        setChatMode("ai");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: isAr
              ? "تم استلام طلبك. يمكنك التواصل معنا عبر البريد الإلكتروني: support@anmat.com\n\nأو يمكنك تسجيل الدخول للتحدث المباشر مع فريق الدعم."
              : "Your request has been received. You can contact us via email: support@anmat.com\n\nOr sign in to chat directly with our support team.",
            hasSignInLink: true,
          },
        ]);
      }
    } catch {
      setChatMode("ai");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: isAr
            ? "تم استلام طلبك. يمكنك التواصل معنا عبر البريد الإلكتروني: support@anmat.com\n\nأو يمكنك تسجيل الدخول للتحدث المباشر مع فريق الدعم."
            : "Your request has been received. You can contact us via email: support@anmat.com\n\nOr sign in to chat directly with our support team.",
          hasSignInLink: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendSupportMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || !ticketId) return;

    const userMsg = {
      id: "user-" + Date.now(),
      role: "visitor",
      content: trimmed,
      time: new Date().toISOString(),
    };
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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: trimmed }),
        });
      } else if (guestEmail) {
        await fetch(`${RootRoute}/api/public/support-tickets/${ticketId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, email: guestEmail }),
        });
      }
    } catch { /* send error */ }
  };

  const handleSend = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;

    const userLang = detectLanguage(trimmed);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");

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

    if (wantsHuman(trimmed, userLang)) {
      setChatMode("form");
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: knowledge.talkToHuman },
      ]);
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));
    const reply = getVisitorReply(trimmed, userLang);
    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
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
    if (chatMode === "support") {
      sendSupportMessage();
    } else {
      handleSend();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendSupport();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: "fixed", bottom: "24px", [isAr ? "left" : "right"]: "24px", zIndex: 9999 }}
        className="w-14 h-14 rounded-full bg-primary-500 hover:bg-primary-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
      >
        {isOpen ? <IoClose size={24} color="#fff" /> : <FaRobot size={24} color="#fff" className="group-hover:scale-110 transition-transform" />}
        {!isOpen && (
          <span style={{ position: "absolute", top: "-4px", [isAr ? "left" : "right"]: "-4px", width: "14px", height: "14px", backgroundColor: "#4ade80", borderRadius: "50%", border: "2px solid white" }} className="animate-pulse" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed", bottom: "96px", [isAr ? "left" : "right"]: "24px", zIndex: 9999,
            width: "380px", maxWidth: "calc(100vw - 2rem)", height: "520px", maxHeight: "calc(100vh - 8rem)",
            backgroundColor: "#ffffff", borderRadius: "16px",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", border: "1px solid #e5e7eb",
            display: "flex", flexDirection: "column", overflow: "hidden", color: "#374151",
          }}
        >
          {/* Header */}
          <div style={{ backgroundColor: chatMode === "support" ? "#10b981" : "#3b82f6", color: "#fff", padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {chatMode === "support" ? <IoChatbubbles size={18} color="#fff" /> : <FaRobot size={18} color="#fff" />}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: "14px", margin: 0, color: "#fff" }}>
                {chatMode === "support"
                  ? (isAr ? "فريق الدعم" : "Support Team")
                  : t("AI Assistant")}
              </p>
              <p style={{ fontSize: "11px", margin: 0, color: "rgba(255,255,255,0.8)" }}>
                {chatMode === "support"
                  ? (ticketNumber || (isAr ? "تذكرة دعم" : "Support Ticket"))
                  : (isAr ? "اسألني أي شيء عن النظام" : "Ask me anything about the system")}
              </p>
            </div>
            {chatMode === "support" && (
              <button
                onClick={endGuestSession}
                title={isAr ? "محادثة جديدة" : "New conversation"}
                style={{ color: "rgba(255,255,255,0.8)", background: "none", border: "none", cursor: "pointer", fontSize: "11px" }}
              >
                {isAr ? "محادثة جديدة" : "New"}
              </button>
            )}
            <button onClick={() => setIsOpen(false)} style={{ color: "rgba(255,255,255,0.8)", background: "none", border: "none", cursor: "pointer" }}>
              <IoClose size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* AI Mode Messages */}
            {chatMode !== "support" && messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", gap: "6px" }}>
                <div style={{
                  maxWidth: "85%", padding: "10px 14px",
                  borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  fontSize: "13px", lineHeight: "1.6", whiteSpace: "pre-wrap",
                  backgroundColor: msg.role === "user" ? "#3b82f6" : "#f3f4f6",
                  color: msg.role === "user" ? "#ffffff" : "#374151",
                }}>
                  {msg.content}
                </div>
                {msg.hasSignInLink && (
                  <Link href="/sign-in"
                    style={{ display: "inline-block", padding: "8px 16px", borderRadius: "10px", backgroundColor: "#3b82f6", color: "#fff", fontSize: "13px", fontWeight: 600, textDecoration: "none", textAlign: "center" }}>
                    {isAr ? "تسجيل الدخول" : "Sign In"}
                  </Link>
                )}
              </div>
            ))}

            {/* Pending Action Confirmation */}
            {pendingActionId && pendingActionSummary && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ maxWidth: "85%", padding: "10px 14px", borderRadius: "14px 14px 14px 4px", backgroundColor: "#fef3c7", border: "1px solid #f59e0b", fontSize: "13px", lineHeight: "1.6" }}>
                  <p style={{ margin: "0 0 8px 0", fontWeight: 600, color: "#92400e" }}>
                    {isAr ? "⏳ موافقة مطلوبة" : "⏳ Confirmation Required"}
                  </p>
                  <p style={{ margin: "0 0 10px 0", color: "#78350f", whiteSpace: "pre-wrap" }}>{pendingActionSummary}</p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={confirmPendingAction} disabled={isLoading}
                      style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", backgroundColor: "#10b981", color: "#fff", fontSize: "12px", cursor: isLoading ? "not-allowed" : "pointer", fontWeight: 600 }}>
                      {isAr ? "✓ تأكيد" : "✓ Confirm"}
                    </button>
                    <button onClick={cancelPendingAction} disabled={isLoading}
                      style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", backgroundColor: "#ef4444", color: "#fff", fontSize: "12px", cursor: isLoading ? "not-allowed" : "pointer", fontWeight: 600 }}>
                      {isAr ? "✗ إلغاء" : "✗ Cancel"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Support Mode Messages */}
            {chatMode === "support" && supportMessages.map((msg) => (
              <div key={msg.id} style={{ display: "flex", justifyContent: msg.role === "visitor" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "85%", padding: "10px 14px",
                  borderRadius: msg.role === "visitor" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  fontSize: "13px", lineHeight: "1.6", whiteSpace: "pre-wrap",
                  backgroundColor: msg.role === "visitor" ? "#3b82f6" : "#10b981",
                  color: "#ffffff",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ padding: "10px 14px", borderRadius: "14px 14px 14px 4px", backgroundColor: "#f3f4f6" }}>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <span className="animate-bounce" style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#9ca3af", animationDelay: "0ms" }} />
                    <span className="animate-bounce" style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#9ca3af", animationDelay: "150ms" }} />
                    <span className="animate-bounce" style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#9ca3af", animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions (AI mode only) */}
            {chatMode === "ai" && messages.length <= 1 && !isLoading && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                {(isLoggedIn
                  ? (isAr
                      ? ["ما هي مهامي؟", "مشاريعي", "التحدث مع موظف"]
                      : ["What are my tasks?", "My projects", "Talk to support"])
                  : quickActions
                ).map((action, i) => (
                  <button key={i} onClick={() => handleSend(action)}
                    style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#3b82f6", fontSize: "12px", cursor: "pointer" }}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = "#eff6ff"; e.target.style.borderColor = "#3b82f6"; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = "#fff"; e.target.style.borderColor = "#d1d5db"; }}
                  >{action}</button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form Mode */}
          {chatMode === "form" && (
            <div style={{ borderTop: "1px solid #e5e7eb", padding: "12px", display: "flex", flexDirection: "column", gap: "8px", maxHeight: "280px", overflowY: "auto" }}>
              <input
                type="text" placeholder={knowledge.namePlaceholder} value={formData.name}
                onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setFormErrors({ ...formErrors, name: "" }); }}
                style={{ width: "100%", fontSize: "13px", borderRadius: "10px", padding: "9px 12px", outline: "none", border: formErrors.name ? "1.5px solid #ef4444" : "1px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#1f2937", boxSizing: "border-box" }}
              />
              {formErrors.name && <span style={{ fontSize: "11px", color: "#ef4444" }}>{formErrors.name}</span>}

              <input
                type="email" placeholder={knowledge.emailPlaceholder} value={formData.email}
                onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setFormErrors({ ...formErrors, email: "" }); }}
                style={{ width: "100%", fontSize: "13px", borderRadius: "10px", padding: "9px 12px", outline: "none", border: formErrors.email ? "1.5px solid #ef4444" : "1px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#1f2937", boxSizing: "border-box" }}
              />
              {formErrors.email && <span style={{ fontSize: "11px", color: "#ef4444" }}>{formErrors.email}</span>}

              <textarea
                placeholder={knowledge.messagePlaceholder} value={formData.message}
                onChange={(e) => { setFormData({ ...formData, message: e.target.value }); setFormErrors({ ...formErrors, message: "" }); }}
                rows={3}
                style={{ width: "100%", fontSize: "13px", borderRadius: "10px", padding: "9px 12px", outline: "none", border: formErrors.message ? "1.5px solid #ef4444" : "1px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#1f2937", resize: "none", boxSizing: "border-box" }}
              />
              {formErrors.message && <span style={{ fontSize: "11px", color: "#ef4444" }}>{formErrors.message}</span>}

              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => { setChatMode("ai"); setFormData({ name: "", email: "", message: "" }); setFormErrors({}); setGuestEmail(null); setTicketId(null); setTicketNumber(null); setSupportMessages([]); }}
                  style={{ flex: 1, padding: "9px", borderRadius: "10px", border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#6b7280", fontSize: "13px", cursor: "pointer", fontWeight: 500 }}>
                  {isAr ? "رجوع" : "Back"}
                </button>
                <button onClick={createTicket} disabled={isLoading}
                  style={{ flex: 1, padding: "9px", borderRadius: "10px", border: "none", backgroundColor: isLoading ? "#93c5fd" : "#3b82f6", color: "#fff", fontSize: "13px", cursor: isLoading ? "not-allowed" : "pointer", fontWeight: 600 }}>
                  {isLoading ? (isAr ? "جاري الإنشاء..." : "Creating...") : knowledge.sendRequest}
                </button>
              </div>
            </div>
          )}

          {/* Support Mode Input */}
          {chatMode === "support" && (
            <div style={{ borderTop: "1px solid #e5e7eb", padding: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                  placeholder={isAr ? "اكتب رسالتك..." : "Type your message..."}
                  style={{ flex: 1, fontSize: "13px", borderRadius: "12px", padding: "10px 14px", outline: "none", border: "1px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#1f2937" }}
                />
                <button onClick={sendSupportMessage} disabled={!input.trim()}
                  style={{ width: "40px", height: "40px", borderRadius: "12px", border: "none", backgroundColor: input.trim() ? "#10b981" : "#d1d5db", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() ? "pointer" : "not-allowed", flexShrink: 0 }}>
                  <IoSend size={16} style={{ transform: isAr ? "scaleX(-1)" : "none" }} />
                </button>
              </div>
            </div>
          )}

          {/* AI Mode Input */}
          {chatMode === "ai" && (
            <div style={{ borderTop: "1px solid #e5e7eb", padding: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                  placeholder={isAr ? "اكتب رسالتك..." : "Type your message..."}
                  style={{ flex: 1, fontSize: "13px", borderRadius: "12px", padding: "10px 14px", outline: "none", border: "1px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#1f2937" }}
                  disabled={isLoading}
                />
                <button onClick={() => handleSend()} disabled={!input.trim() || isLoading}
                  style={{ width: "40px", height: "40px", borderRadius: "12px", border: "none", backgroundColor: !input.trim() || isLoading ? "#d1d5db" : "#3b82f6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: !input.trim() || isLoading ? "not-allowed" : "pointer", flexShrink: 0 }}>
                  <IoSend size={16} style={{ transform: isAr ? "scaleX(-1)" : "none" }} />
                </button>
              </div>
              <div style={{ textAlign: "center", marginTop: "8px" }}>
                {!isLoggedIn && (
                  <Link href="/sign-in" style={{ fontSize: "11px", color: "#6b7280", textDecoration: "underline" }}>
                    {isAr ? "تسجيل الدخول للدردشة المتقدمة" : "Sign in for advanced chat"}
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
