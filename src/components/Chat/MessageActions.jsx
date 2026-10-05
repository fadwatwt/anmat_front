"use client";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import PropTypes from "prop-types";
import { MoreHorizontal, Edit2, Trash2, MessageSquareQuote, Smile, X } from "lucide-react";

const EMOJI_LIST = ["👍", "❤️", "😂", "😮", "😢", "👏"];

const MessageActions = ({ isMe, onEdit, onDelete, onReply, onReact }) => {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);

  const toggleMenu = () => {
    setShowMenu((open) => !open);
    setShowEmojis(false);
  };

  const openEmojiPicker = () => {
    setShowMenu(false);
    setShowEmojis(true);
  };

  const isOpen = showMenu || showEmojis;

  return (
    <div className={`absolute top-1 end-1 z-10 flex flex-col items-center gap-1 transition-opacity ${isOpen ? "opacity-100" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"}`}>
      <button 
        type="button"
        onClick={toggleMenu}
        className="p-1.5 bg-surface border border-status-border rounded-full shadow-sm text-sub-500 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
        aria-label={t("Message actions")}
        aria-expanded={showMenu}
      >
        <MoreHorizontal size={14} />
      </button>

      {/* Action Menu */}
      {showMenu && (
        <div className="absolute top-0 end-8 bg-surface border border-status-border rounded-lg shadow-lg py-1 min-w-[120px] z-20">
          <button 
            type="button"
            onClick={openEmojiPicker}
            className="w-full text-start px-3 py-1.5 text-xs text-cell-primary hover:bg-weak-100 flex items-center gap-2"
          >
            <Smile size={12} /> {t("React")}
          </button>
          
          <button 
            type="button"
            onClick={() => { onReply(); setShowMenu(false); }}
            className="w-full text-start px-3 py-1.5 text-xs text-cell-primary hover:bg-weak-100 flex items-center gap-2"
          >
            <MessageSquareQuote size={12} /> {t("Reply")}
          </button>

          {isMe && (
            <>
              <button 
                type="button"
                onClick={() => { onEdit(); setShowMenu(false); }}
                className="w-full text-start px-3 py-1.5 text-xs text-cell-primary hover:bg-weak-100 flex items-center gap-2"
              >
                <Edit2 size={12} /> {t("Edit")}
              </button>
              <button 
                type="button"
                onClick={() => { onDelete(); setShowMenu(false); }}
                className="w-full text-start px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2 dark:hover:bg-red-900/20"
              >
                <Trash2 size={12} /> {t("Delete")}
              </button>
            </>
          )}
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojis && (
        <div className="absolute top-8 end-0 bg-surface border border-status-border rounded-lg shadow-lg p-2 flex gap-1 z-30">
          {EMOJI_LIST.map((emoji) => (
            <button
              type="button"
              key={emoji}
              onClick={() => { onReact(emoji); setShowEmojis(false); setShowMenu(false); }}
              className="w-6 h-6 flex items-center justify-center hover:bg-weak-100 rounded text-sm transition-colors"
              aria-label={`${t("React")} ${emoji}`}
            >
              {emoji}
            </button>
          ))}
          <button
              type="button"
              onClick={() => setShowEmojis(false)}
              className="w-6 h-6 flex items-center justify-center hover:bg-red-50 text-red-500 rounded text-sm transition-colors ms-1 border-s border-status-border dark:hover:bg-red-900/20"
              aria-label={t("Close")}
            >
              <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageActions;

MessageActions.propTypes = {
  isMe: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onReply: PropTypes.func.isRequired,
  onReact: PropTypes.func.isRequired,
};
