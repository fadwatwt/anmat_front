import React from "react";
import { X } from "lucide-react";

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
  onRemoveStagedFile
}) => (
  <div className="w-full bg-transparent p-4 flex-shrink-0">
    <form className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg px-4 py-3 border border-gray-200 dark:border-gray-600 max-w-3xl mx-auto" onSubmit={handleSubmit}>
      <button
        type="button"
        className={`text-gray-400 hover:text-primary-500 p-2 transition-colors relative ${isRecording ? 'text-red-500' : ''}`}
        onClick={onRecordToggle}
        title={isRecording ? 'Stop recording' : 'Start recording'}
      >
        <img src="/images/AiAssistant/IconSet.svg" alt="Mic" className="w-5 h-5" />
        {isRecording && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        )}
      </button>
      <button type="button" className="text-gray-400 hover:text-primary-500 p-2 transition-colors" onClick={handleAttachmentClick}>
        <img src="/images/AiAssistant/ic_outline-attachment.svg" alt="Attach" className="w-5 h-5" />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        multiple
      />
      <div className="flex-1 flex flex-col">
        <input
          type="text"
          ref={inputRef}
          className="flex-1 rounded-lg border-none bg-transparent px-4 py-2 focus:outline-none focus:ring-0 dark:bg-transparent dark:text-white text-gray-900 placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        {stagedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 px-4">
            {stagedFiles.map((file, index) => (
              <div key={index} className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full pl-3 pr-2 py-1 text-sm text-gray-700 dark:text-gray-300">
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => onRemoveStagedFile(index)}
                  className="ml-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
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
        className={`p-2 rounded-lg transition-colors ${((input.trim() || stagedFiles.length > 0) && !loading) ? 'text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900' : 'text-gray-300'}`}
        disabled={loading || (!input.trim() && stagedFiles.length === 0)}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
        ) : input.trim() ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.1564 9.44375L3.40636 2.56875C3.29859 2.51486 3.17754 2.49326 3.05778 2.50657C2.93803 2.51988 2.82467 2.56752 2.73136 2.64375C2.64225 2.71844 2.57574 2.8165 2.5393 2.92691C2.50287 3.03732 2.49795 3.1557 2.52511 3.26875L4.18136 9.375H11.2501V10.625H4.18136L2.50011 16.7125C2.47463 16.8069 2.47165 16.906 2.49143 17.0018C2.5112 17.0975 2.55317 17.1873 2.61396 17.2639C2.67475 17.3405 2.75267 17.4018 2.84144 17.4428C2.93022 17.4838 3.02738 17.5034 3.12511 17.5C3.22295 17.4994 3.31928 17.4759 3.40636 17.4313L17.1564 10.5563C17.2587 10.5038 17.3447 10.4241 17.4046 10.326C17.4646 10.2278 17.4964 10.115 17.4964 10C17.4964 9.88497 17.4646 9.77218 17.4046 9.67403C17.3447 9.57589 17.2587 9.4962 17.1564 9.44375Z" fill="#375DFB"/>
          </svg>
        ) : (
          <img src="/images/AiAssistant/PaperPlaneRight.svg" alt="Send" className="w-5 h-5" />
        )}
      </button>
    </form>
  </div>
);

export default ChatInput;