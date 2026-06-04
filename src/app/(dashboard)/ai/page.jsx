"use client";

import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import Page from "@/components/Page.jsx";
import { Copy, Edit2, Save, X, Check, AlertTriangle, Plus, Trash2, CreditCard, History, PanelLeftClose } from "lucide-react";
import "./hide-scrollbar.css";
import ChatInput from "./ChatInput";
import AiMessageContent from "./AiMessageContent";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import UserChatAvatar from "@/components/UserChatAvatar";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/auth/authSlice";
import { useTranslation } from "react-i18next";
import { DEFAULT_MODEL } from "@/config/aiModels";
import {
  useGetTokensBalanceQuery,
  useListConversationsQuery,
  useGetConversationMessagesQuery,
  useSendMessageMutation,
  useUploadAiFilesMutation,
  useConfirmPendingActionMutation,
  useCancelPendingActionMutation,
  useRenameConversationMutation,
  useDeleteConversationMutation,
  useConfirmTokenCheckoutMutation,
} from "@/redux/api/aiApi";

const suggestions = [
  "What should I work on next ?",
  "What are my urgent tasks?",
  "What tasks are created & closed by me ?"
];

// Helper to check if a file is a document
const isDocument = (type, name) => {
  const docTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];
  const docExts = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
  return docTypes.includes(type) || docExts.some(ext => name.toLowerCase().endsWith(ext));
};

const AssistantPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useSelector(selectUser);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // RTK Query hooks
  const { data: balanceData, isLoading: balanceLoading } = useGetTokensBalanceQuery();
  const { data: conversations, isLoading: loadingConversations } = useListConversationsQuery();
  const [sendMessageMutation] = useSendMessageMutation();
  const [uploadAiFiles] = useUploadAiFilesMutation();
  const [confirmPendingAction] = useConfirmPendingActionMutation();
  const [cancelPendingAction] = useCancelPendingActionMutation();
  const [renameConversation] = useRenameConversationMutation();
  const [deleteConversation] = useDeleteConversationMutation();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // Chat messages state
  const [loading, setLoading] = useState(false); // Loading state for AI response
  const [hasStarted, setHasStarted] = useState(false); // Track if user has sent a message
  const [editingIdx, setEditingIdx] = useState(null); // Index of message being edited
  const [editValue, setEditValue] = useState("");
  const fileInputRef = useRef(null);
  const userBubbleRef = useRef(null);
  const aiBubbleRef = useRef(null);
  const [userBubbleDims, setUserBubbleDims] = useState({ width: undefined, height: undefined });
  const [aiBubbleDims, setAiBubbleDims] = useState({ width: undefined, height: undefined });
  const userEditRefs = useRef({});
  const aiEditRefs = useRef({});
  const [editDims, setEditDims] = useState({});
  const [thinking, setThinking] = useState(false); // Track if AI is thinking
  const chatContainerRef = useRef(null); // Ref for chat container
  const inputRef = useRef(null); // Ref for input field
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [openImageUrl, setOpenImageUrl] = useState(null);
  const [stagedFiles, setStagedFiles] = useState([]); // New state for staged files
  const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });
  const [conversationId, setConversationId] = useState(null);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const typingTimeoutsRef = useRef([]);

  // Sidebar editing states
  const [editingConvId, setEditingConvId] = useState(null);
  const [editConvTitle, setEditConvTitle] = useState("");

  // Fetch and sync conversation messages
  const { data: fetchedMessagesData, isFetching: loadingMessages } = useGetConversationMessagesQuery(
    conversationId,
    { skip: !conversationId }
  );

  useEffect(() => {
    if (conversationId && fetchedMessagesData) {
      const mapped = fetchedMessagesData.messages
        .filter((m) => {
          // Skip empty assistant messages that only carried tool calls
          if (m.role === "assistant" && !m.content && !m.thought && !m.ui_payload) return false;
          return true;
        })
        .map((m) => {
          if (m.role === "user") {
            return {
              sender: "user",
              text: m.content || "",
              files: (m.attachments || []).map((att) => ({
                name: att.name,
                type: att.type,
                has_content: att.has_content,
                has_base64: att.has_base64,
              })),
            };
          } else {
            return buildAiMessageFromResponse(m);
          }
        });
      setMessages(mapped);
      setHasStarted(true);
    }
  }, [fetchedMessagesData, conversationId]);

  const onRemoveStagedFile = (indexToRemove) => {
    setStagedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const clearTypingAnimation = () => {
    typingTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    typingTimeoutsRef.current = [];
  };

  useLayoutEffect(() => {
    if (editingIdx === messages.length - 2 && userBubbleRef.current) {
      setUserBubbleDims({
        width: userBubbleRef.current.offsetWidth,
        height: userBubbleRef.current.offsetHeight
      });
    }
    if (editingIdx === messages.length - 1 && aiBubbleRef.current) {
      setAiBubbleDims({
        width: aiBubbleRef.current.offsetWidth,
        height: aiBubbleRef.current.offsetHeight
      });
    }
  }, [editingIdx]);

  // Auto-resize textarea height to fit content
  useLayoutEffect(() => {
    if (editingIdx !== null) {
      const ref = userEditRefs.current[editingIdx] || aiEditRefs.current[editingIdx];
      if (ref) {
        setEditDims({
          [editingIdx]: {
            width: ref.offsetWidth,
            height: ref.offsetHeight
          }
        });
      }
    }
  }, [editingIdx]);

  // Auto-scroll to bottom when new messages are added
  useLayoutEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Auto-focus input when component mounts
  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSuggestionClick = (text) => {
    setInput(text);
  };

  const handleMicClick = () => {
    console.log("mic clicked");
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newStagedFiles = Array.from(files).map(file => ({
        name: file.name,
        type: file.type,
        file: file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      }));
      setStagedFiles(prev => [...prev, ...newStagedFiles]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!input.trim() && stagedFiles.length === 0) return;

    setHasStarted(true);

    const userMessage = { sender: "user", text: input };
    if (stagedFiles.length > 0) {
      userMessage.files = stagedFiles.map(f => ({
        name: f.name,
        type: f.type,
        preview: f.preview,
      }));
    }

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setStagedFiles([]);
    setLoading(true);
    setThinking(true);

    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 0);

    try {
      let attachments = [];

      if (userMessage.files && userMessage.files.length > 0) {
        const rawFiles = stagedFiles.map(f => f.file).filter(Boolean);
        if (rawFiles.length > 0) {
          const uploadResult = await uploadAiFiles(rawFiles).unwrap();
          attachments = uploadResult?.data || uploadResult || [];
        }
      }

      const data = await sendMessageMutation({
        message: userMessage.text,
        conversation_id: conversationId || undefined,
        attachments: attachments.length > 0 ? attachments : undefined,
        model: selectedModel,
      }).unwrap();

      if (data?.conversation_id && !conversationId) {
        setConversationId(data.conversation_id);
      }

      const aiMsg = buildAiMessageFromResponse(data?.assistant_message);
      await animateAssistantMessage(aiMsg);
    } catch (err) {
      const message =
        err?.data?.message ||
        err?.message ||
        "AI assistant is unavailable right now.";
      setApiResponse({ isOpen: true, status: "error", message });
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: `Sorry, I couldn't process that: ${message}` },
      ]);
    } finally {
      setThinking(false);
      setLoading(false);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 0);
    }
  };

  const buildAiMessageFromResponse = (assistant) => {
    if (!assistant) {
      return { sender: "ai", text: "(empty response)" };
    }
    const base = {
      sender: "ai",
      messageId: assistant._id,
      text: assistant.content || "",
    };
    if (assistant.thought) {
      base.thought = assistant.thought;
    }
    if (assistant.pending_action) {
      base.pendingAction = { ...assistant.pending_action };
    }
    if (assistant.ui_payload?.table) base.table = assistant.ui_payload.table;
    if (assistant.ui_payload?.links) base.links = assistant.ui_payload.links;
    if (assistant.ui_payload?.assignees) base.assignees = assistant.ui_payload.assignees;
    return base;
  };

  const animateAssistantMessage = (finalMessage) =>
    new Promise((resolve) => {
      clearTypingAnimation();

      let placeholderIndex = -1;
      setMessages((prev) => {
        placeholderIndex = prev.length;
        return [...prev, { sender: "ai", text: "", isStreaming: true }];
      });

      const fullText = finalMessage?.text || "";
      if (!fullText) {
        updateMessageAt(placeholderIndex, () => ({ ...finalMessage, isStreaming: false }));
        resolve();
        return;
      }

      let cursor = 0;
      const chunkSize = Math.min(8, Math.max(2, Math.ceil(fullText.length / 40)));

      const typeNextChunk = () => {
        cursor = Math.min(fullText.length, cursor + chunkSize);

        updateMessageAt(placeholderIndex, () => ({
          ...finalMessage,
          text: fullText.slice(0, cursor),
          isStreaming: cursor < fullText.length,
        }));

        if (cursor >= fullText.length) {
          resolve();
          return;
        }

        const timeoutId = setTimeout(typeNextChunk, 22);
        typingTimeoutsRef.current.push(timeoutId);
      };

      const initialTimeoutId = setTimeout(typeNextChunk, 180);
      typingTimeoutsRef.current.push(initialTimeoutId);
    });

  const updateMessageAt = (idx, updater) => {
    setMessages((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, ...updater(m) } : m))
    );
  };

  const handleConfirmPending = async (idx, pendingActionId) => {
    updateMessageAt(idx, () => ({ pendingActionLoading: true }));
    setThinking(true);
    setLoading(true);
    try {
      const data = await confirmPendingAction({ pending_action_id: pendingActionId }).unwrap();
      updateMessageAt(idx, (m) => ({
        pendingActionLoading: false,
        pendingAction: { ...m.pendingAction, status: "confirmed" },
      }));
      const followUp = buildAiMessageFromResponse(data?.assistant_message);
      await animateAssistantMessage(followUp);
    } catch (err) {
      const message =
        err?.data?.message || err?.message || "Failed to execute the action.";
      setApiResponse({ isOpen: true, status: "error", message });
      updateMessageAt(idx, () => ({ pendingActionLoading: false }));
    } finally {
      setThinking(false);
      setLoading(false);
    }
  };

  const handleCancelPending = async (idx, pendingActionId) => {
    updateMessageAt(idx, () => ({ pendingActionLoading: true }));
    try {
      await cancelPendingAction({ pending_action_id: pendingActionId }).unwrap();
      updateMessageAt(idx, (m) => ({
        pendingActionLoading: false,
        pendingAction: { ...m.pendingAction, status: "cancelled" },
      }));
    } catch (err) {
      const message =
        err?.data?.message || err?.message || "Failed to cancel the action.";
      setApiResponse({ isOpen: true, status: "error", message });
      updateMessageAt(idx, () => ({ pendingActionLoading: false }));
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleEdit = (idx, text) => {
    setEditingIdx(idx);
    setEditValue(text);
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleEditSave = (idx) => {
    setMessages((prev) => prev.map((msg, i) => i === idx ? { ...msg, text: editValue } : msg));
    setEditingIdx(null);
    setEditValue("");
  };

  // Audio recording logic
  const handleRecordToggle = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new window.MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        setAudioChunks([]);
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) setAudioChunks((prev) => [...prev, e.data]);
        };
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          setMessages((prev) => [
            ...prev,
            { sender: "user", audio: URL.createObjectURL(audioBlob), audioBlob }
          ]);
          setIsRecording(false);
        };
        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        setApiResponse({
          isOpen: true,
          status: "error",
          message: t("Microphone access denied or not available."),
        });
      }
    }
  };

  useEffect(() => {
    if (!isRecording) setAudioChunks([]);
  }, [isRecording]);

  useEffect(() => () => clearTypingAnimation(), []);

  // Sidebar actions
  const handleNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setHasStarted(false);
    setInput("");
    setIsHistoryOpen(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSelectConversation = (id) => {
    setConversationId(id);
    setIsHistoryOpen(false);
  };

  const handleStartRename = (e, conv) => {
    e.stopPropagation();
    setEditingConvId(conv._id);
    setEditConvTitle(conv.title || t("Untitled Chat"));
  };

  const handleSaveRename = async (e, id) => {
    e.stopPropagation();
    if (!editConvTitle.trim()) return;
    try {
      await renameConversation({ id, title: editConvTitle.trim() }).unwrap();
      setEditingConvId(null);
    } catch (err) {
      setApiResponse({
        isOpen: true,
        status: "error",
        message: err?.data?.message || "Failed to rename conversation",
      });
    }
  };

  const handleDeleteConv = async (e, id) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this conversation?")) return;
    try {
      await deleteConversation(id).unwrap();
      if (conversationId === id) {
        handleNewChat();
      }
    } catch (err) {
      setApiResponse({
        isOpen: true,
        status: "error",
        message: err?.data?.message || "Failed to delete conversation",
      });
    }
  };

  // Group conversations chronologically
  const getGroupedConversations = () => {
    if (!conversations || conversations.length === 0) return {};
    const groups = {
      Today: [],
      Yesterday: [],
      "Last 7 Days": [],
      Older: [],
    };

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    conversations.forEach((c) => {
      const date = new Date(c.last_message_at || c.created_at || new Date());
      date.setHours(0, 0, 0, 0);

      if (date.getTime() === now.getTime()) {
        groups.Today.push(c);
      } else if (date.getTime() === yesterday.getTime()) {
        groups.Yesterday.push(c);
      } else if (date.getTime() >= sevenDaysAgo.getTime()) {
        groups["Last 7 Days"].push(c);
      } else {
        groups.Older.push(c);
      }
    });

    return Object.keys(groups).reduce((acc, key) => {
      if (groups[key].length > 0) acc[key] = groups[key];
      return acc;
    }, {});
  };

  const groupedConversations = getGroupedConversations();
  const hasUnlimitedAiAccess = Boolean(balanceData?.is_unlimited);
  const freeTokensRemaining = Math.max(
    0,
    (balanceData?.free_limit || 0) - (balanceData?.free_consumed || 0)
  );
  const paidTokensRemaining = Math.max(0, balanceData?.balance || 0);
  const isGated = balanceData
    ? !hasUnlimitedAiAccess && freeTokensRemaining <= 0 && paidTokensRemaining <= 0
    : false;
  const hasStreamingMessage = messages.some((msg) => msg.sender === "ai" && msg.isStreaming);

  const [confirmTokenCheckout] = useConfirmTokenCheckoutMutation();

  // Handle Stripe checkout callback
  useEffect(() => {
    const checkout = searchParams?.get("checkout");
    const sessionId = searchParams?.get("session_id");
    if (checkout === "success" && sessionId) {
      confirmTokenCheckout({ session_id: sessionId })
        .unwrap()
        .then((res) => {
          setApiResponse({ isOpen: true, status: "success", message: res?.message || "Tokens added to your account!" });
        })
        .catch((err) => {
          setApiResponse({ isOpen: true, status: "error", message: err?.data?.message || "Failed to confirm payment. Tokens will be added shortly." });
        });
    } else if (checkout === "cancelled") {
      setApiResponse({ isOpen: true, status: "info", message: "Payment was cancelled. You can try again anytime." });
    }
  }, [searchParams, confirmTokenCheckout]);

  return (
    <Page isTitle={false}>
      <div className="relative flex h-[calc(100vh-140px)] min-h-[550px] w-full bg-white dark:bg-gray-950 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">

        {/* Backdrop when history drawer is open (mobile) */}
        {isHistoryOpen && (
          <button
            type="button"
            aria-label={t("Close chat history")}
            className="absolute inset-0 z-20 bg-black/30 md:bg-black/10 md:pointer-events-none"
            onClick={() => setIsHistoryOpen(false)}
          />
        )}

        {/* Left Sidebar: Chat History & Token usage (hidden until toggled) */}
        <aside
          className={`absolute md:absolute inset-y-0 left-0 z-30 w-80 max-w-[85vw] flex-shrink-0 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl transition-transform duration-300 ease-out ${isHistoryOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
            }`}
        >

          {/* Sidebar header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">{t("Chat History")}</h2>
            <button
              type="button"
              onClick={() => setIsHistoryOpen(false)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              title={t("Close history")}
            >
              <PanelLeftClose size={18} />
            </button>
          </div>

          <div className="px-4 pb-3">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
            >
              <Plus size={18} />
              <span>{t("New Chat")}</span>
            </button>
          </div>

          {/* Chronological Chat List */}
          <div className="flex-1 overflow-y-auto hide-scrollbar p-3 space-y-4">
            {loadingConversations ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-primary-500 rounded-full animate-spin"></div>
              </div>
            ) : Object.keys(groupedConversations).length === 0 ? (
              <div className="text-center text-gray-400 py-8 text-sm">
                {t("No recent conversations")}
              </div>
            ) : (
              Object.entries(groupedConversations).map(([groupName, groupConvs]) => (
                <div key={groupName} className="space-y-1">
                  <h3 className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                    {groupName}
                  </h3>
                  {groupConvs.map((conv) => {
                    const isActive = conversationId === conv._id;
                    const isEditing = editingConvId === conv._id;

                    return (
                      <div
                        key={conv._id}
                        onClick={() => !isEditing && handleSelectConversation(conv._id)}
                        className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${isActive
                          ? "bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 font-medium"
                          : "hover:bg-gray-100/70 dark:hover:bg-gray-800/40 text-gray-700 dark:text-gray-300"
                          }`}
                      >
                        <div className="flex items-center gap-2.5 flex-1 min-w-0 pe-8">
                          <img
                            src="/images/AiAssistant/file.svg"
                            alt={t("Chat icon")}
                            className="w-4 h-4 opacity-60 shrink-0"
                          />
                          {isEditing ? (
                            <input
                              type="text"
                              value={editConvTitle}
                              onChange={(e) => setEditConvTitle(e.target.value)}
                              onBlur={(e) => handleSaveRename(e, conv._id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveRename(e, conv._id);
                                if (e.key === "Escape") setEditingConvId(null);
                              }}
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                              className="w-full text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-1.5 py-0.5 focus:outline-none focus:border-primary-500 text-gray-900 dark:text-white"
                            />
                          ) : (
                            <span className="text-sm truncate">
                              {conv.title || t("Untitled Chat")}
                            </span>
                          )}
                        </div>

                        {/* Inline Actions */}
                        {!isEditing && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                            <button
                              onClick={(e) => handleStartRename(e, conv)}
                              className="p-1 text-gray-400 hover:text-primary-500 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                              title={t("Rename")}
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteConv(e, conv._id)}
                              className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                              title={t("Delete")}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Bottom Card: Token Tracker */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/50">
            {balanceLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-primary-500 rounded-full animate-spin"></div>
              </div>
            ) : hasUnlimitedAiAccess ? (
              <div className="bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-4 flex flex-col gap-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t("AI Access")}</span>
                  <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{t("Unlimited")}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full w-full"></div>
                </div>
                <p className="text-[11px] text-gray-400">
                  {t("Admin accounts are not limited by token balance.")}
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t("Free Tokens Remaining")}</span>
                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                      {freeTokensRemaining.toLocaleString()}
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(0, (freeTokensRemaining / (balanceData?.free_limit || 5000)) * 100))}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>0</span>
                    <span>{t("Limit: ")}{balanceData?.free_limit?.toLocaleString() || "5,000"}</span>
                  </div>

                  {balanceData?.balance > 0 && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/60">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t("Paid Tokens")}</span>
                      <span className="text-xs font-bold text-green-600 dark:text-green-400">
                        {balanceData.balance.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => router.push("/ai/pricing")}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-sm transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-1.5"
                >
                  <CreditCard size={14} />
                  <span>{t("Buy Tokens")}</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Right Chat Panel */}
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900 relative min-w-0">

          {/* Active Chat Header */}
          <div className="px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => setIsHistoryOpen(true)}
                className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
                title={t("Chat history")}
              >
                <History size={20} />
              </button>
              <button
                type="button"
                onClick={handleNewChat}
                className="p-2 rounded-xl text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-colors shrink-0"
                title={t("New chat")}
              >
                <Plus size={20} />
              </button>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                {conversationId
                  ? (conversations?.find((c) => c._id === conversationId)?.title || t("Active Chat"))
                  : t("AI Assistant")}
              </h1>
            </div>

            {!isHistoryOpen && !balanceLoading && (
              <div className="flex items-center gap-2 shrink-0">
                {hasUnlimitedAiAccess ? (
                  <span className="hidden sm:inline text-xs font-semibold text-primary-600 dark:text-primary-400 px-2 py-1 rounded-lg bg-primary-50 dark:bg-primary-950/30">
                    {t("Unlimited")}
                  </span>
                ) : (
                  <span className="hidden sm:inline text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                    {freeTokensRemaining.toLocaleString()} {t("tokens")}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => router.push("/ai/pricing")}
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 px-2.5 py-1.5 rounded-lg border border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-colors"
                >
                  {t("Buy Tokens")}
                </button>
              </div>
            )}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto hide-scrollbar p-6 space-y-6 flex flex-col" ref={chatContainerRef}>
            {loadingMessages ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-700 border-t-primary-500 rounded-full animate-spin"></div>
                <span className="text-sm text-gray-500">{t("Loading conversation...")}</span>
              </div>
            ) : !hasStarted ? (
              <div className="flex flex-col items-center justify-center h-full max-w-xl mx-auto text-center gap-6">
                <img src="/images/AiAssistant/file.svg" alt={t("Assistant Logo")} style={{ width: '80px', height: '80px' }} className="" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {t("Welcome to AI Assistant")}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {t("Ask questions, check agenda templates, summarize points, or manage your company's tasks.")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5 justify-center w-full mt-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      className="bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-950/20 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-2.5 text-sm text-gray-700 dark:text-gray-300 shadow-sm transition font-medium"
                      onClick={() => handleSuggestionClick(s)}
                    >
                      {t(s)}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
                {messages.map((msg, idx) => (
                  <React.Fragment key={idx}>
                    {msg.sender === "user" ? (
                      <div className="flex justify-start items-start gap-3">
                        <UserChatAvatar user={user} size="40px" fontSize="text-sm" />
                        <div className="flex flex-col items-start w-full max-w-[70%]">
                          {editingIdx === idx ? (
                            <div className="flex flex-col w-full">
                              <textarea
                                className="text-base text-cell-primary w-full font-sans font-semibold leading-relaxed box-border text-start outline-none border-none mb-2 resize-none bg-transparent"
                                style={{
                                  wordBreak: 'break-word',
                                  width: editDims[idx]?.width ? editDims[idx].width + 'px' : '100%',
                                  height: editDims[idx]?.height ? editDims[idx].height + 'px' : 'auto',
                                  minHeight: editDims[idx]?.height ? editDims[idx].height + 'px' : 'auto',
                                  minWidth: editDims[idx]?.width ? editDims[idx].width + 'px' : '100%'
                                }}
                                value={editValue}
                                onChange={handleEditChange}
                                autoFocus
                                rows={1}
                              />
                              <div className="flex gap-2 mt-1">
                                <button onClick={() => handleCopy(editValue)} title={t("Copy")} className="text-gray-400 dark:text-gray-500 hover:text-primary-500"><Copy size={18} /></button>
                                <button onClick={() => handleEditSave(idx)} title={t("Save")} className="text-gray-400 dark:text-gray-500 hover:text-primary-500"><Save size={18} /></button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div ref={el => userEditRefs.current[idx] = el} className="text-base text-cell-primary w-full font-sans font-semibold leading-relaxed box-border text-start whitespace-pre-wrap" style={{ wordBreak: 'break-word' }} dir="auto">
                                {msg.text}
                                {msg.audio && (
                                  <audio controls src={msg.audio} className="mt-2" />
                                )}
                                {msg.files && msg.files.length > 0 && (
                                  <div className="mt-4 flex flex-col gap-2">
                                    {msg.files.map((file, fileIdx) => (
                                      file.preview ? (
                                        <img
                                          key={fileIdx}
                                          src={file.preview}
                                          alt={file.name}
                                          className="max-w-full rounded-xl shadow border border-gray-100 cursor-pointer"
                                          style={{ maxHeight: '400px' }}
                                          onClick={() => setOpenImageUrl(file.preview)}
                                        />
                                      ) : (
                                        <div key={fileIdx} className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow flex items-center w-full sm:w-[492px] h-[68px] px-5 py-4 gap-2.5">
                                          {isDocument(file.type, file.name) ? (
                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-50 dark:bg-primary-900/30 rounded-lg shrink-0">
                                              <img src="/images/AiAssistant/document-text.svg" alt={t("Document")} className="w-6 h-6 dark:invert dark:brightness-200" />
                                            </span>
                                          ) : file.type?.startsWith('image') ? (
                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-50 dark:bg-primary-900/30 rounded-lg shrink-0">
                                              <img src="/images/AiAssistant/file.svg" alt={t("Image")} className="w-6 h-6 dark:invert dark:brightness-200" />
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-50 dark:bg-primary-900/30 rounded-lg shrink-0">
                                              <img src="/images/AiAssistant/file.svg" alt={t("File")} className="w-6 h-6 dark:invert dark:brightness-200" />
                                            </span>
                                          )}
                                          <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate">{file.name}</div>
                                          </div>
                                        </div>
                                      )
                                    ))}
                                  </div>
                                )}
                              </div>
                              {(!msg.audio && !msg.files) && (
                                <div className="flex gap-2 mt-1">
                                  <button onClick={() => handleEdit(idx, msg.text)} title={t("Edit")} className="text-gray-400 dark:text-gray-500 hover:text-primary-500"><img src="/images/AiAssistant/edit.svg" alt={t("Edit")} className="w-5 h-5 dark:invert dark:brightness-200" /></button>
                                  <button onClick={() => handleCopy(msg.text)} title={t("Copy")} className="text-gray-400 dark:text-gray-500 hover:text-primary-500"><img src="/images/AiAssistant/copy.svg" alt={t("Copy")} className="w-5 h-5 dark:invert dark:brightness-200" /></button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-start items-start gap-3">
                        <span className="inline-block w-12 h-12 flex items-center justify-center shrink-0">
                          <svg width="48" height="48" viewBox="0 0 61 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_di_33_14814)">
                              <rect x="6" y="2" width="49" height="49" rx="24.5" fill="#375DFB" />
                              <rect x="6" y="2" width="49" height="49" rx="24.5" fill="white" fillOpacity="0.1" />
                              <path fillRule="evenodd" clipRule="evenodd" d="M27.125 18.0625C27.5017 18.0625 27.8328 18.3122 27.9363 18.6745L28.8511 21.8764C29.2516 23.2779 30.3471 24.3734 31.7486 24.7739L34.9505 25.6887C35.3128 25.7922 35.5625 26.1233 35.5625 26.5C35.5625 26.8767 35.3128 27.2078 34.9505 27.3113L31.7486 28.2261C30.3471 28.6266 29.2516 29.7221 28.8511 31.1236L27.9363 34.3255C27.8328 34.6878 27.5017 34.9375 27.125 34.9375C26.7483 34.9375 26.4172 34.6878 26.3137 34.3255L25.3989 31.1236C24.9984 29.7221 23.9029 28.6266 22.5014 28.2261L19.2995 27.3113C18.9372 27.2078 18.6875 26.8767 18.6875 26.5C18.6875 26.1233 18.9372 25.7922 19.2995 25.6887L22.5014 24.7739C23.9029 24.3734 24.9984 23.2779 25.3989 21.8764L26.3137 18.6745C26.4172 18.3122 26.7483 18.0625 27.125 18.0625Z" fill="url(#paint0_linear_33_14814)" />
                              <path fillRule="evenodd" clipRule="evenodd" d="M37.25 14.6875C37.6372 14.6875 37.9747 14.951 38.0686 15.3266L38.3598 16.4915C38.6243 17.5496 39.4504 18.3757 40.5085 18.6402L41.6734 18.9314C42.049 19.0253 42.3125 19.3628 42.3125 19.75C42.3125 20.1372 42.049 20.4747 41.6734 20.5686L40.5085 20.8598C39.4504 21.1243 38.6243 21.9504 38.3598 23.0085L38.0686 24.1734C37.9747 24.549 37.6372 24.8125 37.25 24.8125C36.8628 24.8125 36.5253 24.549 36.4314 24.1734L36.1402 23.0085C35.8757 21.9504 35.0496 21.1243 33.9915 20.8598L32.8266 20.5686C32.451 20.4747 32.1875 20.1372 32.1875 19.75C32.1875 19.3628 32.451 19.0253 32.8266 18.9314L33.9915 18.6402C35.2366 18.3757 36.0059 17.5496 36.1402 16.4915L36.4314 15.3266C36.5253 14.951 36.8628 14.6875 37.25 14.6875Z" fill="url(#paint1_linear_33_14814)" />
                              <path fillRule="evenodd" clipRule="evenodd" d="M35.5625 29.875C35.9257 29.875 36.2481 30.1074 36.363 30.4519L36.8065 31.7825C36.9744 32.2864 37.3699 32.6818 37.8737 32.8498L39.2043 33.2933C39.5489 33.4081 39.7812 33.7306 39.7812 34.0938C39.7812 34.4569 39.5489 34.7794 39.2043 34.8942L37.8737 35.3377C37.3699 35.5057 36.9744 35.9011 36.8065 36.405L36.363 37.7356C36.2481 38.0801 35.9257 38.3125 35.5625 38.3125C35.1993 38.3125 34.8769 38.0801 34.762 37.7356L34.3185 36.405C34.1506 35.9011 33.7552 35.5057 33.2513 35.3377L31.9207 34.8942C31.5761 34.7794 31.3438 34.4569 31.3438 34.0938C31.3438 33.7306 31.5761 33.4081 31.9207 33.2933L33.2513 32.8498C33.7552 32.6818 34.1506 32.2864 34.3185 31.7825L34.762 30.4519C34.8769 30.1074 35.1993 29.875 35.5625 29.875Z" fill="url(#paint2_linear_33_14814)" />
                            </g>
                            <defs>
                              <filter id="filter0_di_33_14814" x="0.2" y="-2" width="60.6" height="62.8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="4" />
                                <feGaussianBlur stdDeviation="2.9" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_33_14814" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_33_14814" result="shape" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="-4" />
                                <feGaussianBlur stdDeviation="4" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.64 0" />
                                <feBlend mode="normal" in2="shape" result="effect2_innerShadow_33_14814" />
                              </filter>
                              <linearGradient id="paint0_linear_33_14814" x1="30.5" y1="14.6875" x2="30.5" y2="38.3125" gradientUnits="userSpaceOnUse">
                                <stop stopColor="white" />
                                <stop offset="1" stopColor="white" stopOpacity="0.5" />
                              </linearGradient>
                              <linearGradient id="paint1_linear_33_14814" x1="30.5" y1="14.6875" x2="30.5" y2="38.3125" gradientUnits="userSpaceOnUse">
                                <stop stopColor="white" />
                                <stop offset="1" stopColor="white" stopOpacity="0.5" />
                              </linearGradient>
                              <linearGradient id="paint2_linear_33_14814" x1="30.5" y1="14.6875" x2="30.5" y2="38.3125" gradientUnits="userSpaceOnUse">
                                <stop stopColor="white" />
                                <stop offset="1" stopColor="white" stopOpacity="0.5" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </span>
                        <div className="flex flex-col items-start w-full max-w-[70%]">
                          {editingIdx === idx ? (
                            <div className="flex flex-col w-full">
                              {msg.thought && (
                                <div className="text-gray-400 text-sm mb-2 font-sans font-semibold text-start">
                                  {msg.thought}
                                </div>
                              )}
                              {msg.thought && <hr className="my-2 border-gray-200 dark:border-gray-700" />}
                              <textarea
                                className="text-base text-gray-900 dark:text-gray-100 w-full font-sans font-semibold leading-relaxed box-border text-start outline-none border-none mb-2 resize-none bg-transparent"
                                style={{
                                  wordBreak: 'break-word',
                                  width: editDims[idx]?.width ? editDims[idx].width + 'px' : '100%',
                                  height: editDims[idx]?.height ? editDims[idx].height + 'px' : 'auto',
                                  minHeight: editDims[idx]?.height ? editDims[idx].height + 'px' : 'auto',
                                  minWidth: editDims[idx]?.width ? editDims[idx].width + 'px' : '100%'
                                }}
                                value={editValue}
                                onChange={handleEditChange}
                                autoFocus
                                rows={1}
                              />
                              <div className="flex gap-2 mt-1">
                                <button onClick={() => handleCopy(editValue)} title={t("Copy")} className="text-gray-400 dark:text-gray-500 hover:text-primary-500"><Copy size={18} /></button>
                                <button onClick={() => handleEditSave(idx)} title={t("Save")} className="text-gray-400 dark:text-gray-500 hover:text-primary-500"><Save size={18} /></button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {msg.thought && (
                                <div className="text-cell-primary text-[18px] mb-2 font-['Almarai'] font-[400] leading-[150%] tracking-[0%] text-start">
                                  {msg.thought}
                                </div>
                              )}
                              {msg.thought && <hr className="my-2 border-gray-200 dark:border-gray-700" />}
                              <div ref={el => aiEditRefs.current[idx] = el} className="w-full text-start" style={{ wordBreak: 'break-word' }}>
                                {msg.isStreaming && !msg.text ? (
                                  <span className="inline-flex items-center gap-1.5 text-primary-500">
                                    <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.2s]"></span>
                                    <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.1s]"></span>
                                    <span className="w-2 h-2 rounded-full bg-current animate-bounce"></span>
                                  </span>
                                ) : (
                                  <>
                                    <AiMessageContent text={msg.text} />
                                    {msg.isStreaming && (
                                      <span className="inline-block w-0.5 h-5 ms-1 align-middle bg-primary-500 animate-pulse"></span>
                                    )}
                                  </>
                                )}
                                {msg.audio && (
                                  <audio controls src={msg.audio} className="mt-2" />
                                )}
                                {msg.assignees && (
                                  <div className="mt-4 space-y-3">
                                    {msg.assignees.map((assignee, i) => (
                                      <div key={i} className="flex items-center gap-3">
                                        <img
                                          src={assignee.avatar}
                                          alt={assignee.name}
                                          className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                        />
                                        <span className="text-cell-primary font-medium">{assignee.name}</span>
                                        <a
                                          href={assignee.profileUrl}
                                          className="text-primary-500 hover:text-primary-700 underline text-sm"
                                        >
                                          {t("View profile")}
                                        </a>
                                      </div>
                                    ))}
                                    {msg.hasReference && (
                                      <div className="mt-4 flex items-center justify-end">
                                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white font-medium shadow hover:bg-primary-600 transition text-sm">
                                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 3h10v10H3V3zm1 1v8h8V4H4zm2 2h4v1H6V6zm0 2h3v1H6V8z" fill="currentColor" />
                                          </svg>
                                          {t("View reference")}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              {msg.pendingAction && (
                                <div className="mt-4 w-full rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 p-4">
                                  <div className="flex items-start gap-3">
                                    <AlertTriangle className="text-amber-600 mt-0.5 shrink-0" size={20} />
                                    <div className="flex-1">
                                      <div className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
                                        Confirm action: {msg.pendingAction.tool_name}
                                      </div>
                                      <div className="text-sm text-amber-800 dark:text-amber-100 mb-3">
                                        <AiMessageContent text={msg.pendingAction.summary} />
                                      </div>
                                      {msg.pendingAction.status === "pending" && (
                                        <div className="flex gap-2">
                                          <button
                                            disabled={msg.pendingActionLoading}
                                            onClick={() => handleConfirmPending(idx, msg.pendingAction._id)}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-medium"
                                          >
                                            <Check size={16} />
                                            {t("Confirm")}
                                          </button>
                                          <button
                                            disabled={msg.pendingActionLoading}
                                            onClick={() => handleCancelPending(idx, msg.pendingAction._id)}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 text-gray-700 dark:text-gray-200 text-sm font-medium"
                                          >
                                            <X size={16} />
                                            {t("Cancel")}
                                          </button>
                                        </div>
                                      )}
                                      {msg.pendingAction.status === "confirmed" && (
                                        <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                                          {t("Action confirmed and executed.")}
                                        </div>
                                      )}
                                      {msg.pendingAction.status === "cancelled" && (
                                        <div className="text-xs text-gray-500 font-medium">
                                          {t("Action cancelled.")}
                                        </div>
                                      )}
                                      {msg.pendingAction.status === "failed" && (
                                        <div className="text-xs text-red-600 font-medium">
                                          {t("Action failed during execution.")}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {!msg.isStreaming && (
                                <div className="flex gap-2 mt-1">
                                  <button onClick={() => handleEdit(idx, msg.text)} title={t("Edit")} className="text-gray-400 dark:text-gray-500 hover:text-primary-500"><img src="/images/AiAssistant/edit.svg" alt={t("Edit")} className="w-5 h-5 dark:invert dark:brightness-200" /></button>
                                  <button onClick={() => handleCopy(msg.text)} title={t("Copy")} className="text-gray-400 dark:text-gray-500 hover:text-primary-500"><img src="/images/AiAssistant/copy.svg" alt={t("Copy")} className="w-5 h-5 dark:invert dark:brightness-200" /></button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    {msg.sender === "ai" && idx < messages.length - 1 && messages[idx + 1]?.sender === "ai" && (
                      <hr className="my-4 border-gray-200 dark:border-gray-700" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Thinking and answer bubbles */}
            {hasStarted && (loading || thinking) && !hasStreamingMessage && (
              <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 mb-4">
                <div className="flex justify-start items-start gap-3">
                  <span className="inline-block w-12 h-12 flex items-center justify-center shrink-0">
                    <svg width="48" height="48" viewBox="0 0 61 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g filter="url(#filter0_di_33_14814)">
                        <rect x="6" y="2" width="49" height="49" rx="24.5" fill="#375DFB" />
                        <rect x="6" y="2" width="49" height="49" rx="24.5" fill="white" fillOpacity="0.1" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M27.125 18.0625C27.5017 18.0625 27.8328 18.3122 27.9363 18.6745L28.8511 21.8764C29.2516 23.2779 30.3471 24.3734 31.7486 24.7739L34.9505 25.6887C35.3128 25.7922 35.5625 26.1233 35.5625 26.5C35.5625 26.8767 35.3128 27.2078 34.9505 27.3113L31.7486 28.2261C30.3471 28.6266 29.2516 29.7221 28.8511 31.1236L27.9363 34.3255C27.8328 34.6878 27.5017 34.9375 27.125 34.9375C26.7483 34.9375 26.4172 34.6878 26.3137 34.3255L25.3989 31.1236C24.9984 29.7221 23.9029 28.6266 22.5014 28.2261L19.2995 27.3113C18.9372 27.2078 18.6875 26.8767 18.6875 26.5C18.6875 26.1233 18.9372 25.7922 19.2995 25.6887L22.5014 24.7739C23.9029 24.3734 24.9984 23.2779 25.3989 21.8764L26.3137 18.6745C26.4172 18.3122 26.7483 18.0625 27.125 18.0625Z" fill="url(#paint0_linear_33_14814)" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M37.25 14.6875C37.6372 14.6875 37.9747 14.951 38.0686 15.3266L38.3598 16.4915C38.6243 17.5496 39.4504 18.3757 40.5085 18.6402L41.6734 18.9314C42.049 19.0253 42.3125 19.3628 42.3125 19.75C42.3125 20.1372 42.049 20.4747 41.6734 20.5686L40.5085 20.8598C39.4504 21.1243 38.6243 21.9504 38.3598 23.0085L38.0686 24.1734C37.9747 24.549 37.6372 24.8125 37.25 24.8125C36.8628 24.8125 36.5253 24.549 36.4314 24.1734L36.1402 23.0085C35.8757 21.9504 35.0496 21.1243 33.9915 20.8598L32.8266 20.5686C32.451 20.4747 32.1875 20.1372 32.1875 19.75C32.1875 19.3628 32.451 19.0253 32.8266 18.9314L33.9915 18.6402C35.2366 18.3757 36.0059 17.5496 36.1402 16.4915L36.4314 15.3266C36.5253 14.951 36.8628 14.6875 37.25 14.6875Z" fill="url(#paint1_linear_33_14814)" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M35.5625 29.875C35.9257 29.875 36.2481 30.1074 36.363 30.4519L36.8065 31.7825C36.9744 32.2864 37.3699 32.6818 37.8737 32.8498L39.2043 33.2933C39.5489 33.4081 39.7812 33.7306 39.7812 34.0938C39.7812 34.4569 39.5489 34.7794 39.2043 34.8942L37.8737 35.3377C37.3699 35.5057 36.9744 35.9011 36.8065 36.405L36.363 37.7356C36.2481 38.0801 35.9257 38.3125 35.5625 38.3125C35.1993 38.3125 34.8769 38.0801 34.762 37.7356L34.3185 36.405C34.1506 35.9011 33.7552 35.5057 33.2513 35.3377L31.9207 34.8942C31.5761 34.7794 31.3438 34.4569 31.3438 34.0938C31.3438 33.7306 31.5761 33.4081 31.9207 33.2933L33.2513 32.8498C33.7552 32.6818 34.1506 32.2864 34.3185 31.7825L34.762 30.4519C34.8769 30.1074 35.1993 29.875 35.5625 29.875Z" fill="url(#paint2_linear_33_14814)" />
                      </g>
                      <defs>
                        <filter id="filter0_di_33_14814" x="0.2" y="-2" width="60.6" height="62.8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                          <feFlood floodOpacity="0" result="BackgroundImageFix" />
                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                          <feOffset dy="4" />
                          <feGaussianBlur stdDeviation="2.9" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0" />
                          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_33_14814" />
                          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_33_14814" result="shape" />
                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                          <feOffset dy="-4" />
                          <feGaussianBlur stdDeviation="4" />
                          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.64 0" />
                          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_33_14814" />
                        </filter>
                        <linearGradient id="paint0_linear_33_14814" x1="30.5" y1="14.6875" x2="30.5" y2="38.3125" gradientUnits="userSpaceOnUse">
                          <stop stopColor="white" />
                          <stop offset="1" stopColor="white" stopOpacity="0.5" />
                        </linearGradient>
                        <linearGradient id="paint1_linear_33_14814" x1="30.5" y1="14.6875" x2="30.5" y2="38.3125" gradientUnits="userSpaceOnUse">
                          <stop stopColor="white" />
                          <stop offset="1" stopColor="white" stopOpacity="0.5" />
                        </linearGradient>
                        <linearGradient id="paint2_linear_33_14814" x1="30.5" y1="14.6875" x2="30.5" y2="38.3125" gradientUnits="userSpaceOnUse">
                          <stop stopColor="white" />
                          <stop offset="1" stopColor="white" stopOpacity="0.5" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                  <div className="rounded-xl px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800 shadow-sm shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-blue-700 dark:text-blue-300 font-medium">{t("Thinking...")}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Input container */}
          <ChatInput
            input={input}
            setInput={setInput}
            loading={loading}
            handleSubmit={handleSubmit}
            handleMicClick={handleMicClick}
            handleAttachmentClick={handleAttachmentClick}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
            inputRef={inputRef}
            isRecording={isRecording}
            onRecordToggle={handleRecordToggle}
            stagedFiles={stagedFiles}
            onRemoveStagedFile={onRemoveStagedFile}
            isGated={isGated}
            onUpgradeClick={() => router.push("/ai/pricing")}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
        </div>
      </div>

      {/* Image Modal */}
      {openImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/60 backdrop-blur-sm" onClick={() => setOpenImageUrl(null)}>
          <div className="relative" onClick={e => e.stopPropagation()}>
            <img src={openImageUrl} alt={t("Preview")} className="max-h-[80vh] max-w-[90vw] rounded-xl shadow-lg" />
            <button
              onClick={() => setOpenImageUrl(null)}
              className="absolute top-2 right-2 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 rounded-full p-1 hover:bg-opacity-100 dark:hover:bg-opacity-100 transition"
              title={t("Close")}
            >
              <X size={24} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      )}

      <ApiResponseAlert
        isOpen={apiResponse.isOpen}
        status={apiResponse.status}
        message={apiResponse.message}
        onClose={() => setApiResponse({ isOpen: false, status: "", message: "" })}
      />
    </Page>
  );
};

export default AssistantPage;
