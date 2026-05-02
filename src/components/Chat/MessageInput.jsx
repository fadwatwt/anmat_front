"use client";
import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { useUploadFileMutation } from "@/redux/conversations/conversationsAPI";
import { Send, Paperclip, Smile, Edit3, X, BarChart2, FileIcon, ImageIcon } from "lucide-react";

const MessageInput = ({ onSendMessage, onTyping, editMessageData, onCancelEdit, onEditMessage, onOpenPoll, activeChatId }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [uploadFile] = useUploadFileMutation();
  
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (editMessageData) {
      setMessage(editMessageData.content || "");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [editMessageData]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
    // Reset input value so same file can be selected again
    e.target.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() || selectedFile) {
      let attachmentUrl = "";
      
      if (selectedFile) {
        setIsUploading(true);
        try {
          const result = await uploadFile({ chatId: activeChatId, file: selectedFile }).unwrap();
          attachmentUrl = result.data.url;
        } catch (error) {
          console.error("Upload failed:", error);
          setIsUploading(false);
          return;
        }
      }

      if (editMessageData) {
        onEditMessage(editMessageData._id, message);
        onCancelEdit();
      } else {
        onSendMessage(message, attachmentUrl);
      }
      
      setMessage("");
      setSelectedFile(null);
      setIsUploading(false);
      handleTyping(false);
    }
  };

  const handleTyping = (typing) => {
    if (isTyping !== typing) {
      setIsTyping(typing);
      onTyping(typing);
    }

    if (typing) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        handleTyping(false);
      }, 3000);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    handleTyping(true);
  };

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    // Keep focus on input after adding emoji
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="flex flex-col bg-surface border-t border-status-border">
      {editMessageData && (
        <div className="flex items-center justify-between px-4 py-2 bg-weak-50 border-b border-status-border">
          <div className="flex items-center gap-2 text-sm text-sub-500">
            <Edit3 size={14} />
            <span>Editing message</span>
          </div>
          <button onClick={onCancelEdit} className="p-1 text-sub-500 hover:text-red-500 transition-colors">
            <X size={14} />
          </button>
        </div>
      )}

      {selectedFile && (
        <div className="flex items-center gap-3 p-3 mx-4 mt-4 bg-weak-50 rounded-xl border border-status-border animate-in slide-in-from-bottom-2 duration-200">
          <div className="p-2 bg-main rounded-lg text-primary-500">
            {selectedFile.type.startsWith('image/') ? <ImageIcon size={20} /> : <FileIcon size={20} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-cell-primary truncate">{selectedFile.name}</p>
            <p className="text-xs text-sub-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button 
            type="button"
            onClick={() => setSelectedFile(null)}
            className="p-1.5 text-sub-500 hover:text-red-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileSelect}
        />
        <button
          type="button"
          onClick={onOpenPoll}
          title="Create Poll"
          className="p-2 transition-colors rounded-full text-sub-500 hover:bg-weak-100"
        >
          <BarChart2 size={20} />
        </button>
        <button
          type="button"
          title="Attach file"
          onClick={() => fileInputRef.current?.click()}
          className={`p-2 transition-colors rounded-full ${selectedFile ? 'text-primary-500 bg-primary-50' : 'text-sub-500 hover:bg-weak-100'}`}
        >
          <Paperclip size={20} />
        </button>
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            placeholder={editMessageData ? "Edit your message..." : "Type a message..."}
            className="w-full px-4 py-3 bg-main border-none rounded-2xl text-sm text-cell-primary focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
            value={message}
            onChange={handleChange}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2" ref={emojiPickerRef}>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`transition-colors ${showEmojiPicker ? 'text-primary-500' : 'text-sub-500 hover:text-primary-500'}`}
            >
              <Smile size={18} />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
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
          disabled={(!message.trim() && !selectedFile) || isUploading}
          className={`p-3 rounded-2xl transition-all ${
            (message.trim() || selectedFile) && !isUploading
              ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-100 hover:scale-105 active:scale-95"
              : "bg-main text-sub-500 scale-100"
          }`}
        >
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Send size={20} />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
