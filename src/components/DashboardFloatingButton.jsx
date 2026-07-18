"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoClose, IoSend, IoChatbubbles, IoTimeOutline } from "react-icons/io5";
import { FaRobot } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/auth/authSlice";
import { useCreateSupportTicketMutation } from "@/redux/support-tickets/supportTicketsApi";
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

const QUICK_ACTIONS_AR = ["ما هو أنماط؟", "الأسعار والخطط", "المميزات", "مشكلة في الحساب"];
const QUICK_ACTIONS_EN = ["What is Anmaat?", "Pricing & Plans", "Features", "Account issue"];
const SUPPORT_ACTION_AR = "التحدث مع الدعم الفني";
const SUPPORT_ACTION_EN = "Talk to support";

const HISTORY_KEY = "anmat_bot_history_";
function loadHistory(userId) {
  try {
    const raw = localStorage.getItem(HISTORY_KEY + userId);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { void e; return []; }
}
function saveHistory(userId, list) {
  try { localStorage.setItem(HISTORY_KEY + userId, JSON.stringify(list)); } catch (e) { void e; }
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

export default function DashboardFloatingButton() {
  const { t, i18n } = useTranslation();
  const { user, token } = useSelector(selectAuth);
  const [createSupportTicket] = useCreateSupportTicketMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("ai");
  const [ticketId, setTicketId] = useState(null);
  const [ticketNumber, setTicketNumber] = useState(null);
  const [supportMessages, setSupportMessages] = useState([]);
  const [pendingActionId, setPendingActionId] = useState(null);
  const [pendingActionSummary, setPendingActionSummary] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [viewingHistory, setViewingHistory] = useState(null);
  const [ticketClosed, setTicketClosed] = useState(false);
  const [greetingLang, setGreetingLang] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const pollingRef = useRef(null);

  const isAr = i18n.language === "ar";
  const userName = user?.name || user?.first_name || "";
  const userId = user?._id || user?.id;

  useEffect(() => {
    if (userId) {
      setHistory(loadHistory(userId));
    }
  }, [userId]);

  const archiveAndNew = () => {
    const hasContent = messages.length > 1 || supportMessages.length > 0;
    if (userId && hasContent) {
      const firstUser = messages.find((m) => m.role === "user") || supportMessages.find((m) => m.role === "user");
      const title = firstUser?.content?.slice(0, 60) || (isAr ? "محادثة" : "Chat");
      const list = loadHistory(userId);
      list.unshift({ id: Date.now().toString(), messages, supportMessages, ticketId, ticketNumber, timestamp: new Date().toISOString(), title });
      if (list.length > 30) list.length = 30;
      saveHistory(userId, list);
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
  };

  const prevOpenRef = useRef(false);
  useEffect(() => {
    if (prevOpenRef.current && !isOpen && userId) {
      const hasContent = messages.length > 1 || supportMessages.length > 0;
      if (hasContent) {
        const firstUser = messages.find((m) => m.role === "user") || supportMessages.find((m) => m.role === "user");
        const title = firstUser?.content?.slice(0, 60) || (isAr ? "محادثة" : "Chat");
        const list = loadHistory(userId);
        list.unshift({ id: Date.now().toString(), messages, supportMessages, ticketId, ticketNumber, timestamp: new Date().toISOString(), title });
        if (list.length > 30) list.length = 30;
        saveHistory(userId, list);
        setHistory(list);
      }
    }
    prevOpenRef.current = isOpen;
  }, [isOpen, userId, messages, supportMessages, isAr]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, supportMessages]);

  useEffect(() => {
    if (isOpen && !showHistory && !viewingHistory && !ticketId && !ticketClosed) {
      const greetingAr = `مرحباً ${userName ? userName + " " : ""}! 👋 أنا مساعد أنماط الذكي. يمكنني مساعدتك في إدارة مهامك ومشاريعك والرد على استفساراتك. كيف أستطيع مساعدتك؟`;
      const greetingEn = `Hello${userName ? " " + userName : ""}! 👋 I'm the Anmaat AI Assistant. I can help you with tasks, projects, and answer your questions. How can I help you?`;
      const targetGreeting = isAr ? greetingAr : greetingEn;
      const currentLang = isAr ? "ar" : "en";
      if (messages.length === 0) {
        setMessages([{ role: "assistant", content: targetGreeting }]);
        setGreetingLang(currentLang);
      } else if (greetingLang && greetingLang !== currentLang) {
        setMessages((prev) => {
          const updated = [...prev];
          if (updated.length > 0 && (updated[0].content === greetingAr || updated[0].content === greetingEn)) {
            updated[0] = { ...updated[0], content: targetGreeting };
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
  }, [isOpen, isAr, userName, messages.length, showHistory, viewingHistory, ticketId, ticketClosed, greetingLang]);

  useEffect(() => {
    if (ticketId && token) {
      const poll = async () => {
        try {
          const res = await fetch(`${RootRoute}/api/support-tickets/${ticketId}/messages`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            const msgs = (data?.data || data || []).map((m) => {
              const senderId = typeof m.sender_id === "object" ? m.sender_id?._id : m.sender_id;
              const isOwn = senderId && userId && String(senderId) === String(userId);
              return { id: m._id, role: isOwn ? "user" : "support", content: m.message, time: m.createdAt };
            });
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
          const ticketRes = await fetch(`${RootRoute}/api/support-tickets/${ticketId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (ticketRes.ok) {
            const ticketData = await ticketRes.json();
            const status = ticketData?.data?.status || ticketData?.status;
            if (status === "closed" || status === "resolved") {
              clearInterval(pollingRef.current);
              setTicketId(null);
              setTicketNumber(null);
              setTicketClosed(true);
            }
          }
        } catch (e) { void e; }
      };
      poll();
      pollingRef.current = setInterval(poll, 8000);
      return () => clearInterval(pollingRef.current);
    }
  }, [ticketId, token, userId]);

  const createUrgentTicket = async (message) => {
    try {
      const result = await createSupportTicket({
        title: message.substring(0, 100),
        description: message,
        priority: "urgent",
      }).unwrap();
      const ticket = result?.data || result;
      setTicketId(ticket?._id);
      setTicketNumber(ticket?.ticket_number || "TKT-" + Date.now());
      setViewMode("support");
      setSupportMessages([{
        id: "welcome",
        role: "support",
        content: isAr
          ? `مرحباً ${userName || ""}! 👋 تم استلام تذكرتك العاجلة. فريق الدعم سي رد عليك قريباً.`
          : `Hello ${userName || ""}! 👋 Your urgent ticket has been received. Our support team will reply to you soon.`,
        time: new Date().toISOString(),
      }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: isAr ? "حدث خطأ أثناء إنشاء التذكرة." : "An error occurred while creating the ticket.",
      }]);
    }
  };

  const sendSupportMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || !ticketId || !token) return;
    setSupportMessages((prev) => [...prev, { id: "user-" + Date.now(), role: "user", content: trimmed, time: new Date().toISOString() }]);
    setInput("");
    try {
      await fetch(`${RootRoute}/api/support-tickets/${ticketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: trimmed }),
      });
    } catch (e) { void e; }
  };

  const handleSend = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading || !token) return;
    const userLang = detectLanguage(trimmed);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    if (wantsHuman(trimmed, userLang)) {
      setIsLoading(true);
      await createUrgentTicket(trimmed);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${RootRoute}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
          setMessages((prev) => [...prev, { role: "assistant", content: assistantMsg.content || pa.summary, hasPendingAction: true }]);
        } else {
          setMessages((prev) => [...prev, { role: "assistant", content: assistantMsg?.content || "" }]);
        }
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: isAr ? "عذراً، لم أتمكن من المعالجة." : "Sorry, I couldn't process that." }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: isAr ? "حدث خطأ في الاتصال." : "Connection error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmPendingAction = async () => {
    if (!pendingActionId || !token) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${RootRoute}/api/ai/pending-actions/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ pending_action_id: pendingActionId }),
      });
      if (res.ok) {
        const data = await res.json();
        const assistantMsg = data?.data?.assistant_message;
        setMessages((prev) => [...prev, { role: "assistant", content: assistantMsg?.content || (isAr ? "تم تنفيذ الطلب بنجاح." : "Done.") }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: isAr ? "حدث خطأ." : "Error." }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: isAr ? "حدث خطأ." : "Error." }]);
    } finally {
      setPendingActionId(null);
      setPendingActionSummary(null);
      setIsLoading(false);
    }
  };

  const cancelPendingAction = () => {
    setPendingActionId(null);
    setPendingActionSummary(null);
    setMessages((prev) => [...prev, { role: "assistant", content: isAr ? "تم الإلغاء." : "Cancelled." }]);
  };

  const handleSendSupport = () => {
    if (viewMode === "support") sendSupportMessage();
    else handleSend();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendSupport(); }
  };

  const deleteHistoryItem = (id) => {
    const updated = history.filter((h) => h.id !== id);
    saveHistory(userId, updated);
    setHistory(updated);
  };

  const handleHistorySend = async () => {
    const trimmed = input.trim();
    if (!trimmed || !token) return;
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
      try {
        await fetch(`${RootRoute}/api/support-tickets/${session.ticketId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ message: trimmed }),
        });
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
                {(messages.length > 1 || (ticketClosed && supportMessages.length > 0)) && !ticketId && (
                  <button onClick={archiveAndNew} className="text-white/80 hover:text-white text-[11px] bg-transparent border-none cursor-pointer">{isAr ? "جديد" : "New"}</button>
                )}
                <button onClick={() => { setHistory(loadHistory(userId)); setShowHistory(true); }} className="text-white/80 hover:text-white bg-transparent border-none cursor-pointer" title={isAr ? "السجل" : "History"}>
                  <IoTimeOutline size={18} />
                </button>
              </>
            )}
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white bg-transparent border-none cursor-pointer"><IoClose size={20} /></button>
          </div>

          {(ticketId || (ticketClosed && supportMessages.length > 0)) && !viewingHistory && !showHistory && (
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
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
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
                      {(isAr ? QUICK_ACTIONS_AR : QUICK_ACTIONS_EN).map((action, i) => (
                        <button key={i} onClick={() => handleSend(action)} className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-blue-500 dark:text-blue-400 text-xs cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-500 transition-colors">{action}</button>
                      ))}
                    </div>
                  )}

                  {viewMode === "ai" && messages.length > 6 && messages.length <= 10 && !ticketId && !isLoading && (
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
                      className="flex-1 text-[13px] rounded-xl py-2.5 px-3.5 outline-none border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-cell-primary" disabled={isLoading || ticketClosed} />
                    <button onClick={() => handleSendSupport()} disabled={!input.trim() || isLoading || ticketClosed}
                      className="w-10 h-10 rounded-xl border-none flex items-center justify-center flex-shrink-0 transition-colors"
                      style={{ backgroundColor: !input.trim() || isLoading ? "#d1d5db" : "#3b82f6", color: "#fff", cursor: !input.trim() || isLoading ? "not-allowed" : "pointer" }}>
                      <IoSend size={16} style={{ transform: isAr ? "scaleX(-1)" : "none" }} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
