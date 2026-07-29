import React, { useState, useEffect, useRef } from "react";
import { X, Play, Square, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const quickActions = [
  { label: "My tasks", icon: "tasks" },
  { label: "Create task", icon: "plus" },
  { label: "My reminders", icon: "reminder" },
];

const ChatInput = ({
  input,
  setInput,
  loading,
  handleSubmit,
  handleMicClick,
  handleAttachmentClick,
  fileInputRef,
  handleFileChange,
  inputRef,
  isRecording,
  onRecordToggle,
  stagedFiles,
  onRemoveStagedFile,
  isGated,
  onUpgradeClick,
  pendingAudio,
  onCancelAudio,
}) => {
  const { t } = useTranslation();
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      intervalRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRecording]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handlePlayPreview = () => {
    if (!pendingAudio) return;
    if (isPlayingPreview) {
      audioRef.current?.pause();
      setIsPlayingPreview(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(pendingAudio.url);
        audioRef.current.onended = () => setIsPlayingPreview(false);
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlayingPreview(true);
    }
  };

  const hasContent = input.trim() || stagedFiles.length > 0 || pendingAudio;

  return (
    <div className="w-full bg-transparent p-4 flex-shrink-0 relative">
      {isGated ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl shadow-lg px-6 py-4 max-w-3xl mx-auto backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-red-500 shrink-0 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-gray-900 dark:text-gray-100 font-medium text-sm sm:text-base text-center sm:text-start">
              {t("You have depleted your tokens balance. Upgrade to continue.")}
            </span>
          </div>
          <button
            type="button"
            onClick={onUpgradeClick}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold text-sm shadow-sm transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            {t("Buy Tokens")}
          </button>
        </div>
      ) : (
        <form className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg px-4 py-3 border border-gray-200 dark:border-gray-600 max-w-3xl mx-auto" onSubmit={handleSubmit}>
          {isRecording ? (
            /* Recording in progress — show timer + stop button */
            <div className="flex items-center gap-3 w-full">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-500 font-mono text-lg font-bold">{formatTime(recordingSeconds)}</span>
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full animate-pulse" style={{ width: `${Math.min(recordingSeconds * 5, 100)}%` }} />
              </div>
              <button type="button" onClick={onRecordToggle} className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors" title={t("Stop recording")}>
                <Square size={16} />
              </button>
            </div>
          ) : pendingAudio ? (
            /* Post-recording: preview with play, send, cancel */
            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={handlePlayPreview}
                className="p-2 rounded-full bg-primary-500 hover:bg-primary-600 text-white transition-colors"
                title={isPlayingPreview ? t("Stop") : t("Play")}
              >
                {isPlayingPreview ? <Square size={16} /> : <Play size={16} />}
              </button>
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full" style={{ width: '100%' }} />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">{formatTime(recordingSeconds)}</span>
              <button
                type="button"
                onClick={onCancelAudio}
                className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title={t("Cancel")}
              >
                <Trash2 size={16} />
              </button>
              <button
                type="submit"
                className="p-2 rounded-lg text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors"
                title={t("Send")}
              >
                <img src="/images/AiAssistant/PaperPlaneRight.svg" alt={t("Send")} className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                className={`text-gray-400 dark:text-gray-500 hover:text-primary-500 p-2 transition-colors relative ${isRecording ? 'text-red-500' : ''}`}
                onClick={onRecordToggle}
                title={isRecording ? t('Stop recording') : t('Start recording')}
              >
                <img src="/images/AiAssistant/IconSet.svg" alt={t("Mic")} className="w-5 h-5 dark:invert dark:brightness-200" />
                {isRecording && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
              <button type="button" className="text-gray-400 dark:text-gray-500 hover:text-primary-500 p-2 transition-colors" onClick={handleAttachmentClick}>
                <img src="/images/AiAssistant/ic_outline-attachment.svg" alt={t("Attach")} className="w-5 h-5 dark:invert dark:brightness-200" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.json,.xml,.md,.js,.ts,.py,.java,.html,.css"
              />
              <div className="flex-1 flex flex-col">
                <input
                  type="text"
                  ref={inputRef}
                  className="flex-1 rounded-lg border-none bg-transparent px-4 py-2 focus:outline-none focus:ring-0 dark:bg-transparent dark:text-white text-gray-900 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder={t("Type your message...")}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={loading}
                />
                {stagedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 px-4">
                    {stagedFiles.map((file, index) => (
                      <div key={index} className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full pl-3 pr-2 py-1 text-sm text-gray-700 dark:text-gray-300">
                        {file.preview && (
                          <img src={file.preview} alt={file.name} className="w-5 h-5 rounded mr-2 object-cover" />
                        )}
                        <span>{file.name}</span>
                        <button
                          type="button"
                          onClick={() => onRemoveStagedFile(index)}
                          className="ms-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className={`p-2 rounded-lg transition-colors ${hasContent && !loading ? 'text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900' : 'text-gray-300'}`}
                disabled={loading || !hasContent}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
                ) : input.trim() ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.1564 9.44375L3.40636 2.56875C3.29859 2.51486 3.17754 2.49326 3.05778 2.50657C2.93803 2.51988 2.82467 2.56752 2.73136 2.64375C2.64225 2.71844 2.57574 2.8165 2.5393 2.92691C2.50287 3.03732 2.49795 3.1557 2.52511 3.26875L4.18136 9.375H11.2501V10.625H4.18136L2.50011 16.7125C2.47463 16.8069 2.47165 16.906 2.49143 17.0018C2.5112 17.0975 2.55317 17.1873 2.61396 17.2639C2.67475 17.3405 2.75267 17.4018 2.84144 17.4428C2.93022 17.4838 3.02738 17.5034 3.12511 17.5C3.22295 17.4994 3.31928 17.4759 3.40636 17.4313L17.1564 10.5563C17.2587 10.5038 17.3447 10.4241 17.4046 10.326C17.4646 10.2278 17.4964 10.115 17.4964 10C17.4964 9.88497 17.4646 9.77218 17.4046 9.67403C17.3447 9.57589 17.2587 9.4962 17.1564 9.44375Z" fill="#375DFB" />
                  </svg>
                ) : (
                  <img src="/images/AiAssistant/PaperPlaneRight.svg" alt={t("Send")} className="w-5 h-5" />
                )}
              </button>
            </>
          )}
        </form>
      )}
      {!isGated && !loading && !isRecording && !pendingAudio && (
        <div className="flex items-center justify-center gap-2 mt-2 max-w-3xl mx-auto">
          {quickActions.map((qa, i) => (
            <button
              key={i}
              type="button"
              className="text-xs text-gray-400 dark:text-gray-500 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 transition-colors"
              onClick={() => setInput(t(qa.label))}
            >
              {t(qa.label)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatInput;
