"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RiCloseLine, RiRobot2Line, RiSendPlane2Line } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { RootRoute } from "@/Root.Route";

const HISTORY_KEY = "anmaat_public_ai_history_v3";
const MAX_HISTORY = 10;

const copy = {
  ar: {
    open: "فتح مساعد أنماط الذكي",
    close: "إغلاق مساعد أنماط الذكي",
    title: "مساعد أنماط الذكي",
    subtitle: "معلومات عامة عن المنصة",
    disclosure: "أنت تتحدث مع مساعد ذكي. لا تشارك كلمات المرور أو بيانات الدفع.",
    greeting: "مرحبًا! أنا مساعد أنماط الذكي. يمكنني مساعدتك في التعرف على المنصة وميزاتها والباقات وطريقة التسجيل. كيف أساعدك؟",
    placeholder: "اكتب سؤالك عن أنماط…",
    send: "إرسال",
    error: "تعذر الوصول إلى المساعد الآن. يرجى المحاولة لاحقًا.",
    retry: "إعادة المحاولة",
    limit: "الرسالة طويلة جدًا. الحد الأقصى 2000 حرف.",
    signup: "إنشاء حساب",
    login: "تسجيل الدخول",
    support: "التواصل مع الدعم",
    typing: "جارٍ إعداد الإجابة…",
  },
  en: {
    open: "Open Anmaat AI assistant",
    close: "Close Anmaat AI assistant",
    title: "Anmaat AI Assistant",
    subtitle: "General platform information",
    disclosure: "You are chatting with an AI assistant. Do not share passwords or payment details.",
    greeting: "Hello! I'm the Anmaat AI Assistant. I can explain the platform, its features, plans, and registration. How can I help?",
    placeholder: "Ask about Anmaat…",
    send: "Send",
    error: "The assistant is unavailable right now. Please try again later.",
    retry: "Try again",
    limit: "Your message is too long. The maximum is 2,000 characters.",
    signup: "Create account",
    login: "Sign in",
    support: "Contact support",
    typing: "Preparing an answer…",
  },
};

function readHistory(language) {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(`${HISTORY_KEY}_${language}`) || "[]");
    return Array.isArray(parsed) ? parsed.slice(-MAX_HISTORY) : [];
  } catch {
    return [];
  }
}

export default function PublicAiAssistant() {
  const { i18n } = useTranslation();
  const language = i18n.language?.startsWith("ar") ? "ar" : "en";
  const text = copy[language];
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestSupport, setSuggestSupport] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    setMessages(readHistory(language));
  }, [language]);

  useEffect(() => {
    if (typeof endRef.current?.scrollIntoView === "function") {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const sendMessage = async (rawMessage, baseMessages = messages) => {
    const message = rawMessage.trim();
    if (!message || isLoading) return;
    if (message.length > 2000) {
      setMessages((current) => [...current, { role: "error", content: text.limit }]);
      return;
    }

    const history = baseMessages
      .filter(({ role }) => role === "user" || role === "assistant")
      .slice(-MAX_HISTORY)
      .map(({ role, content }) => ({ role, content }));
    const next = [...baseMessages, { role: "user", content: message }].slice(-MAX_HISTORY);
    setMessages(next);
    setInput("");
    setSuggestSupport(false);
    setIsLoading(true);

    try {
      const response = await fetch(`${RootRoute}/api/public/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history, lang: language }),
      });
      if (!response.ok) throw new Error("Public assistant request failed");
      const payload = await response.json();
      const result = payload?.data || payload;
      if (!result?.response) throw new Error("Public assistant returned an empty response");
      const updated = [...next, { role: "assistant", content: result.response }].slice(-MAX_HISTORY);
      setMessages(updated);
      setSuggestSupport(Boolean(result?.suggestSupport));
      sessionStorage.setItem(`${HISTORY_KEY}_${language}`, JSON.stringify(updated));
    } catch {
      setMessages((current) => [...current, { role: "error", content: text.error, retryMessage: message }].slice(-MAX_HISTORY));
      setSuggestSupport(true);
    } finally {
      setIsLoading(false);
    }
  };

  const send = () => sendMessage(input);

  const retry = (message) => {
    const baseMessages = messages.slice(0, -1);
    if (baseMessages.at(-1)?.role === "user" && baseMessages.at(-1)?.content === message) {
      baseMessages.pop();
    }
    setMessages(baseMessages);
    sendMessage(message, baseMessages);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  return (
    <div className="fixed bottom-5 z-[100]" style={{ [language === "ar" ? "left" : "right"]: "20px" }}>
      {isOpen && (
        <section
          aria-label={text.title}
          className="mb-3 flex h-[min(520px,68vh)] w-[min(360px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-status-border bg-surface shadow-2xl"
        >
          <header className="flex items-center justify-between bg-primary-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <RiRobot2Line size={22} aria-hidden="true" />
              <div>
                <h2 className="text-sm font-bold">{text.title}</h2>
                <p className="text-[11px] text-primary-100">{text.subtitle}</p>
              </div>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label={text.close} className="rounded-lg p-2 hover:bg-white/10">
              <RiCloseLine size={20} />
            </button>
          </header>

          <p className="border-b border-status-border bg-amber-50 px-4 py-2 text-[11px] text-amber-800" role="note">
            {text.disclosure}
          </p>

          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            <div className="max-w-[90%] rounded-xl bg-status-bg px-3 py-2 text-sm text-cell-primary">{text.greeting}</div>
            {messages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                dir="auto"
                className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${item.role === "user" ? "ms-auto bg-primary-600 text-white" : "bg-status-bg text-cell-primary"}`}
              >
                {item.role === "assistant" ? <MarkdownRenderer content={item.content} /> : item.content}
                {item.role === "error" && item.retryMessage && (
                  <button type="button" onClick={() => retry(item.retryMessage)} className="mt-2 block font-semibold text-primary-700 underline">
                    {text.retry}
                  </button>
                )}
              </div>
            ))}
            {isLoading && <p className="text-xs text-cell-secondary">{text.typing}</p>}
            {suggestSupport && (
              <div className="flex flex-wrap gap-2">
                <a href="mailto:support@anmat.com" className="rounded-lg border border-primary-300 px-3 py-2 text-xs text-primary-700">{text.support}</a>
                <Link href="/register/subscriber/email" className="rounded-lg bg-primary-600 px-3 py-2 text-xs text-white">{text.signup}</Link>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <footer className="border-t border-status-border p-3">
            <div className="flex gap-2">
              <textarea
                rows={1}
                maxLength={2000}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={text.placeholder}
                aria-label={text.placeholder}
                disabled={isLoading}
                className="min-h-11 flex-1 resize-none rounded-xl border border-status-border bg-status-bg px-3 py-2 text-sm text-cell-primary outline-none focus:border-primary-500"
              />
              <button type="button" onClick={send} disabled={!input.trim() || isLoading} aria-label={text.send} className="min-h-11 min-w-11 rounded-xl bg-primary-600 text-white disabled:opacity-50">
                <RiSendPlane2Line size={19} className="mx-auto" />
              </button>
            </div>
            <div className="mt-2 flex justify-center gap-4 text-[11px]">
              <Link href="/sign-in" className="text-cell-secondary hover:text-primary-600">{text.login}</Link>
              <Link href="/register/subscriber/email" className="text-primary-600">{text.signup}</Link>
            </div>
          </footer>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-label={isOpen ? text.close : text.open}
        aria-expanded={isOpen}
        className="ms-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-xl transition hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200"
      >
        {isOpen ? <RiCloseLine size={26} /> : <RiRobot2Line size={26} />}
      </button>
    </div>
  );
}
