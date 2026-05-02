"use client";
import React, { useState } from "react";
import { MoreHorizontal, Edit2, Trash2, MessageSquareQuote, Smile, X } from "lucide-react";

const EMOJI_LIST = ["👍", "❤️", "😂", "😮", "😢", "👏"];

const MessageActions = ({ message, isMe, onEdit, onDelete, onReply, onReact }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);

  return (
    <div className={`absolute top-0 ${isMe ? "-left-12" : "-right-12"} opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col items-center gap-1`}>
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className="p-1.5 bg-surface border border-status-border rounded-full shadow-sm text-sub-500 hover:text-primary transition-colors"
      >
        <MoreHorizontal size={14} />
      </button>

      {/* Action Menu */}
      {showMenu && (
        <div className={`absolute top-0 ${isMe ? "right-10" : "left-10"} bg-surface border border-status-border rounded-lg shadow-lg py-1 min-w-[120px] z-20`}>
          <button 
            onClick={() => { setShowEmojis(!showEmojis); }}
            className="w-full text-left px-3 py-1.5 text-xs text-cell-primary hover:bg-weak-100 flex items-center gap-2"
          >
            <Smile size={12} /> React
          </button>
          
          <button 
            onClick={() => { onReply(); setShowMenu(false); }}
            className="w-full text-left px-3 py-1.5 text-xs text-cell-primary hover:bg-weak-100 flex items-center gap-2"
          >
            <MessageSquareQuote size={12} /> Reply
          </button>

          {isMe && (
            <>
              <button 
                onClick={() => { onEdit(); setShowMenu(false); }}
                className="w-full text-left px-3 py-1.5 text-xs text-cell-primary hover:bg-weak-100 flex items-center gap-2"
              >
                <Edit2 size={12} /> Edit
              </button>
              <button 
                onClick={() => { onDelete(); setShowMenu(false); }}
                className="w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={12} /> Delete
              </button>
            </>
          )}
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojis && (
        <div className={`absolute top-8 ${isMe ? "right-10" : "left-10"} bg-surface border border-status-border rounded-lg shadow-lg p-2 flex gap-1 z-30`}>
          {EMOJI_LIST.map((emoji) => (
            <button
              key={emoji}
              onClick={() => { onReact(emoji); setShowEmojis(false); setShowMenu(false); }}
              className="w-6 h-6 flex items-center justify-center hover:bg-weak-100 rounded text-sm transition-colors"
            >
              {emoji}
            </button>
          ))}
          <button
              onClick={() => setShowEmojis(false)}
              className="w-6 h-6 flex items-center justify-center hover:bg-red-50 text-red-500 rounded text-sm transition-colors ml-1 border-l border-status-border"
            >
              <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageActions;
