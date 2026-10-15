import  { useState } from "react";
import { FiPaperclip } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import { MdMic } from "react-icons/md";
import { IoSendSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { ImSpinner2 } from "react-icons/im"; // Loader spinner
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";

function CommentInput({ onSend, isLoading, initialValue = "", onCancel }) {
    const [message, setMessage] = useState(initialValue);
    const [showEmojis, setShowEmojis] = useState(false);
    const {t} = useTranslation()

    const emojiList = ["😊", "😂", "😍", "👍", "🙏"]; // قائمة الإيموجيات

    const handleEmojiClick = (emoji) => {
        setMessage((prevMessage) => prevMessage + emoji);
        setShowEmojis(false); // إخفاء قائمة الإيموجيات بعد اختيار إيموجي
    };

    const handleFileUpload = () => {
        // Hook for an upload pipeline; no user feedback needed at selection time.
    };

    const handleSend = async () => {
        if (message.trim() && onSend) {
            try {
                await onSend(message);
                if (!initialValue) {
                    setMessage("");
                }
            } catch {
                // The parent shows the API error; retain the message for retry.
            }
        }
    };

    return (
        <div className="w-full flex items-center gap-2 dark:bg-veryWeak-500 p-4 pt-3">
            {/* الحقل النصي مع الأيقونات */}
            <div className="relative flex items-center py-1 border rounded-xl bg-surface shadow-sm flex-1 border-status-border">
                {/* أيقونة الإيموجي */}
                <button
                    className="absolute left-4 text-cell-secondary hover:text-blue-500"
                    onClick={() => setShowEmojis(!showEmojis)}
                >
                    <BsEmojiSmile className={"dark:text-gray-200"} size={20} />
                </button>

                {/* قائمة الإيموجيات */}
                {showEmojis && (
                    <div className="absolute bottom-10 left-4 bg-surface border rounded shadow p-2">
                        <div className="flex gap-2">
                            {emojiList.map((emoji, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleEmojiClick(emoji)}
                                    className="text-lg hover:bg-status-bg p-1 rounded"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("Type a message...")}
                    className="max-w-full w-full pl-10 pr-20 py-2 box-border text-sm border-none outline-none rounded-xl"
                />

                <label className="absolute right-12 text-cell-secondary hover:text-blue-500 cursor-pointer">
                    <FiPaperclip className={"dark:text-gray-300"} size={20} />
                    <input
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                </label>

                {/* أيقونة الميكروفون */}
                <button className="absolute right-4 text-cell-secondary hover:text-blue-500">
                    <MdMic className={"dark:text-gray-300"} size={20} />
                </button>
            </div>

            {/* زر الإرسال / التحميل */}
            <button
                className={`p-2 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
                onClick={handleSend}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ImSpinner2 className="animate-spin text-primary-base dark:text-primary-200" size={20} />
                ) : (
                    <IoSendSharp className="text-primary-base dark:text-primary-200" size={20} />
                )}
            </button>
            {onCancel && (
                <button
                    className="p-2 text-cell-secondary hover:text-red-500 transition-all font-bold"
                    onClick={onCancel}
                    disabled={isLoading}
                    title={t("Cancel edit")}
                >
                    <MdClose size={20} />
                </button>
            )}
        </div>
    );
}

CommentInput.propTypes = {
    onSend: PropTypes.func,
    isLoading: PropTypes.bool,
    initialValue: PropTypes.string,
    onCancel: PropTypes.func,
};

export default CommentInput;
