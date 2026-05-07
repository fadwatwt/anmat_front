"use client";

import { useParams } from "next/navigation";
import Page from "@/components/Page.jsx";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import {
    useGetSupportTicketDetailsQuery,
    useGetSupportTicketMessagesQuery,
    useAddSupportTicketMessageMutation,
    useUpdateSupportTicketStatusMutation
} from "@/redux/support-tickets/supportTicketsApi";
import Status from "@/app/(dashboard)/projects/_components/TableInfo/Status.jsx";
import { translateDate } from "@/functions/Days";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/auth/authSlice";
import { format } from "date-fns";
import EmojiPicker from "emoji-picker-react";
import { Send, Paperclip, Smile, X, FileIcon, ImageIcon } from "lucide-react";
import { RootRoute } from "@/Root.Route";

function SupportTicketDetailsPage() {
    const { t } = useTranslation();
    const { id } = useParams();
    const user = useSelector(selectUser);

    const { data: ticketRes, isLoading: isLoadingTicket } = useGetSupportTicketDetailsQuery(id, { skip: !id });
    const { data: messagesRes, isLoading: isLoadingMessages } = useGetSupportTicketMessagesQuery(id, { skip: !id, pollingInterval: 10000 });
    const [addMessage, { isLoading: isSending }] = useAddSupportTicketMessageMutation();
    const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateSupportTicketStatusMutation();

    const isAdmin = user?.type === 'Admin';

    const [messageText, setMessageText] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const scrollRef = useRef(null);
    const fileInputRef = useRef(null);
    const emojiPickerRef = useRef(null);

    const ticket = ticketRes?.data;
    const messages = messagesRes?.data || [];
    // Admins can still reply on resolved tickets; subscribers cannot
    const isClosed = ticket?.status === 'closed' || (!isAdmin && ticket?.status === 'resolved');

    const getAttachmentUrl = (url) => {
        if (!url) return "";
        // If the URL is already absolute (from backend), use it directly
        if (url.startsWith("http")) {
            // Replace the host part with RootRoute to handle any env differences
            try {
                const parsed = new URL(url);
                const rootParsed = new URL(RootRoute);
                parsed.hostname = rootParsed.hostname;
                parsed.port = rootParsed.port;
                parsed.protocol = rootParsed.protocol;
                return parsed.toString();
            } catch {
                return url;
            }
        }
        // Relative path - prepend backend root
        return `${RootRoute}${url}`;
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText.trim() && selectedFiles.length === 0) return;

        try {
            const formData = new FormData();
            formData.append("message", messageText);
            selectedFiles.forEach(file => formData.append("attachments", file));
            await addMessage({ id, data: formData }).unwrap();
            setMessageText("");
            setSelectedFiles([]);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) setSelectedFiles(prev => [...prev, ...files]);
        e.target.value = null;
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await updateStatus({ id, status: newStatus }).unwrap();
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    if (isLoadingTicket) {
        return <Page title={t("Support Ticket")}><div className="p-8 text-center">{t("Loading...")}</div></Page>;
    }

    if (!ticket) {
        return <Page title={t("Support Ticket")}><div className="p-8 text-center">{t("Ticket not found")}</div></Page>;
    }

    return (
        <Page
            title={t("Ticket Details")}
            isBreadcrumbs={true}
            breadcrumbs={[
                { title: t("Support Tickets"), link: "/support-tickets" },
                { title: ticket.title, link: "" }
            ]}
        >
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">

                {/* Ticket Info Sidebar */}
                <div className="w-full lg:w-1/3 flex flex-col gap-4">
                    <div className="bg-surface rounded-2xl p-6 border border-status-border flex flex-col gap-4">
                        <h2 className="text-xl font-bold text-cell-primary">{ticket.title}</h2>

                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-cell-secondary">{t("Status")}</span>
                                {isAdmin ? (
                                    <select
                                        value={ticket.status}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        disabled={isUpdatingStatus}
                                        className="text-sm bg-surface border border-status-border rounded-lg px-2 py-1 outline-none focus:border-primary-500 font-semibold"
                                    >
                                        <option value="open">{t("open")}</option>
                                        <option value="in-progress">{t("in-progress")}</option>
                                        <option value="resolved">{t("resolved")}</option>
                                        <option value="closed">{t("closed")}</option>
                                    </select>
                                ) : (
                                    <Status type={ticket.status} title={t(ticket.status)} />
                                )}
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-cell-secondary">{t("Priority")}</span>
                                <span className="font-semibold text-sm text-cell-primary">{t(ticket.priority || 'LOW')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-cell-secondary">{t("Created At")}</span>
                                <span className="text-sm text-cell-primary">{translateDate(ticket.created_at)}</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h3 className="text-sm font-semibold text-cell-primary mb-2">{t("Description")}</h3>
                            <p className="text-sm text-cell-secondary whitespace-pre-wrap">{ticket.description}</p>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="w-full lg:w-2/3 bg-surface rounded-2xl border border-status-border flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="p-4 border-b border-status-border" style={{ backgroundColor: 'var(--bg-main)' }}>
                        <h3 className="font-semibold text-cell-primary">{t("Conversation")}</h3>
                    </div>

                    {/* Messages */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
                        style={{ backgroundColor: 'var(--bg-main)' }}
                    >
                        {isLoadingMessages ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-sub-300">
                                <p className="text-sm">{t("No messages yet. Start the conversation!")}</p>
                            </div>
                        ) : (
                            messages.map((msg, idx) => {
                                // sender_id is populated as object: { _id, name, email, type }
                                const senderId = (msg.sender_id?._id || msg.sender_id)?.toString();
                                const isMe = senderId === user?._id?.toString();
                                const prevSenderId = idx > 0
                                    ? (messages[idx - 1]?.sender_id?._id || messages[idx - 1]?.sender_id)?.toString()
                                    : null;
                                const showAvatar = idx === 0 || prevSenderId !== senderId;
                                const senderName = msg.sender_id?.name || msg.sender?.name;

                                return (
                                    <div
                                        key={msg._id || idx}
                                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                                    >
                                        <div className={`flex items-end gap-2 max-w-[80%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>

                                            {/* Avatar */}
                                            {!isMe && (
                                                <div
                                                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${showAvatar ? "opacity-100" : "opacity-0"}`}
                                                    style={{ backgroundColor: 'var(--bg-main)' }}
                                                >
                                                    <span className="text-cell-secondary">{senderName?.charAt(0) || "U"}</span>
                                                </div>
                                            )}

                                            <div className="flex flex-col">
                                                {!isMe && showAvatar && senderName && (
                                                    <span className="text-[10px] text-sub-500 mb-1 ml-1">{senderName}</span>
                                                )}

                                                {/* Bubble */}
                                                <div
                                                    className={`px-4 py-2 rounded-2xl text-sm shadow-sm border ${
                                                        isMe
                                                            ? "bg-primary-500 text-white rounded-tr-none border-transparent"
                                                            : "rounded-tl-none text-cell-primary"
                                                    }`}
                                                    style={{
                                                        borderColor: isMe ? 'transparent' : 'var(--status-border)',
                                                        backgroundColor: isMe ? undefined : 'var(--color-blue-ebf1ff)',
                                                    }}
                                                >
                                                    {msg.message && (
                                                        <div style={{ color: isMe ? '#ffffff' : 'inherit' }}>
                                                            {msg.message}
                                                        </div>
                                                    )}

                                                    {/* Attachments */}
                                                    {msg.attachments && msg.attachments.length > 0 && (
                                                        <div className={`${msg.message ? 'mt-2' : ''} flex flex-col gap-2`}>
                                                            {msg.attachments.map((att) => {
                                                                const isImage = att.type?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(att.name || att.url || '');
                                                                return (
                                                                    <div key={att._id} className="rounded-lg overflow-hidden border border-status-border bg-weak-50">
                                                                        {isImage ? (
                                                                            <img
                                                                                src={getAttachmentUrl(att.url)}
                                                                                alt={att.name}
                                                                                className="max-w-full h-auto max-h-[300px] object-contain cursor-pointer hover:opacity-90 transition-opacity"
                                                                                onClick={() => window.open(getAttachmentUrl(att.url), '_blank')}
                                                                            />
                                                                        ) : (
                                                                            <a
                                                                                href={getAttachmentUrl(att.url)}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="flex items-center gap-3 p-3 hover:bg-weak-100 transition-colors no-underline"
                                                                            >
                                                                                <div className="p-2 bg-primary-50 text-primary-500 rounded-lg">
                                                                                    <Paperclip size={20} />
                                                                                </div>
                                                                                <div className="flex-1 min-w-0">
                                                                                    <p className={`text-sm font-medium truncate ${isMe ? 'text-white' : 'text-cell-primary'}`}>
                                                                                        {att.name}
                                                                                    </p>
                                                                                    <p className="text-[10px] text-sub-500">{t("Click to download")}</p>
                                                                                </div>
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Timestamp */}
                                                <span className={`text-[9px] text-sub-300 mt-1 ${isMe ? "text-right mr-1" : "ml-1"}`}>
                                                    {format(new Date(msg.created_at || Date.now()), "HH:mm")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="flex flex-col bg-surface border-t border-status-border">
                        {/* Selected Files Preview */}
                        {selectedFiles.length > 0 && (
                            <div className="flex flex-wrap gap-2 px-4 pt-3">
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-weak-50 rounded-xl border border-status-border animate-in slide-in-from-bottom-2 duration-200">
                                        <div className="p-2 bg-main rounded-lg text-primary-500">
                                            {file.type.startsWith('image/') ? <ImageIcon size={20} /> : <FileIcon size={20} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-cell-primary truncate max-w-[120px]">{file.name}</p>
                                            <p className="text-xs text-sub-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="p-1.5 text-sub-500 hover:text-red-500 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-4">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                multiple
                                onChange={handleFileSelect}
                            />
                            <button
                                type="button"
                                title={t("Attach file")}
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isClosed}
                                className={`p-2 transition-colors rounded-full disabled:opacity-40 ${
                                    selectedFiles.length > 0 ? 'text-primary-500 bg-primary-50' : 'text-sub-500 hover:bg-weak-100'
                                }`}
                            >
                                <Paperclip size={20} />
                            </button>

                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder={
                                        isClosed
                                            ? (ticket?.status === 'resolved' ? t("This ticket has been resolved") : t("This ticket is closed"))
                                            : t("Type a message...")
                                    }
                                    disabled={isSending || isClosed}
                                    className="w-full px-4 py-3 bg-main border-none rounded-2xl text-sm text-cell-primary focus:ring-2 focus:ring-primary-500/50 outline-none transition-all disabled:opacity-50"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2" ref={emojiPickerRef}>
                                    <button
                                        type="button"
                                        disabled={isClosed}
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        className={`transition-colors disabled:opacity-40 ${showEmojiPicker ? 'text-primary-500' : 'text-sub-500 hover:text-primary-500'}`}
                                    >
                                        <Smile size={18} />
                                    </button>
                                    {showEmojiPicker && (
                                        <div className="absolute bottom-full right-0 mb-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                            <EmojiPicker
                                                onEmojiClick={(emojiData) => setMessageText(prev => prev + emojiData.emoji)}
                                                autoFocusSearch={false}
                                                theme="light"
                                                width={300}
                                                height={400}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={(!messageText.trim() && selectedFiles.length === 0) || isSending || isClosed}
                                className={`p-3 rounded-2xl transition-all ${
                                    (messageText.trim() || selectedFiles.length > 0) && !isSending && !isClosed
                                        ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30 hover:scale-105 active:scale-95"
                                        : "bg-main text-sub-500"
                                }`}
                            >
                                {isSending ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <Send size={20} />
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Page>
    );
}

export default SupportTicketDetailsPage;
