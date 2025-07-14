"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import Page from "@/components/Page.jsx";
import { Mic, Paperclip, Copy, Edit2, Save } from "lucide-react";

// Gemini/Bard-style logo (sidebar style)
const GeminiIcon = () => (
  <span className="ai-assistant-icon group relative inline-block align-middle">
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" className="ai-assistant-bg" />
      <path className="ai-assistant-star ai-assistant-star-large" d="M27 13l4.5 9 9 4.5-9 4.5-4.5 9-4.5-9-9-4.5 9-4.5 4.5-9z" />
      <path className="ai-assistant-star ai-assistant-star-medium" d="M47 36l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" />
      <path className="ai-assistant-star ai-assistant-star-small" d="M32 52l1.2 2.4L36 56l-2.4 1.2L32 60l-1.2-2.4L28 56l2.4-1.2L32 52z" />
    </svg>
  </span>
);

const suggestions = [
  "What should I work on next ?",
  "What are my urgent tasks?",
  "What tasks are created & closed by me ?"
];

const USER_AVATAR = "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

const AssistantPage = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // Chat messages state
  const [loading, setLoading] = useState(false); // Loading state for AI response
  const [hasStarted, setHasStarted] = useState(false); // Track if user has sent a message
  const [editingIdx, setEditingIdx] = useState(null); // Index of message being edited
  const [editValue, setEditValue] = useState("");
  const fileInputRef = useRef(null);
  // const navigate = useNavigate(); // Not used in Next.js
  const userBubbleRef = useRef(null);
  const aiBubbleRef = useRef(null);
  const [userBubbleDims, setUserBubbleDims] = useState({ width: undefined, height: undefined });
  const [aiBubbleDims, setAiBubbleDims] = useState({ width: undefined, height: undefined });
  const userEditRefs = useRef({});
  const aiEditRefs = useRef({});
  const [editDims, setEditDims] = useState({});
  const [thinking, setThinking] = useState(false); // Track if AI is thinking
  const [thinkingBubbles, setThinkingBubbles] = useState([]); // Track thinking bubbles for display
  const chatContainerRef = useRef(null); // Ref for chat container
  const inputRef = useRef(null); // Ref for input field

  const aiThoughts = [
    'Analyzing your request...',
    'Checking agenda templates...',
    'Summarizing points...',
    'Almost ready...'
  ];

  useLayoutEffect(() => {
    if (editingIdx === messages.length-2 && userBubbleRef.current) {
      setUserBubbleDims({
        width: userBubbleRef.current.offsetWidth,
        height: userBubbleRef.current.offsetHeight
      });
    }
    if (editingIdx === messages.length-1 && aiBubbleRef.current) {
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
    // Placeholder for mic functionality
    console.log("mic clicked");
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log("Selected files:", files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setHasStarted(true);
    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setThinking(true);
    
    // Refocus input after sending message
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
    
    // Simulate AI response with two-part message
    setTimeout(() => {
      setThinking(false);
      setLoading(false);
      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          thought: "Analyzing your request... lorem ipsum dummy text lorem ipsum dummy text lorem ipsum dummy text lorem ipsum dummy text. ",
          text: "Got it, lorem ipsum dummy text lorem ipsum dummy text lorem ipsum dummy text lorem ipsum dummy text."
        }
      ]);
      
      // Refocus input after AI response
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }, 1200);
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

  return (
    <Page isTitle={false}>
      <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-900">
        {/* Main content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col items-center justify-center w-full min-h-full gap-8 p-8 pb-32">
            {/* Hide welcome and suggestions after chat starts */}
            {!hasStarted && (
              <>
                <div className="flex flex-col items-center gap-4 mt-12">
                  <GeminiIcon />
                  <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mt-2">
                    Welcome <span className="text-primary-500 font-bold">Mai Haggag</span>,<br/>
                    <span className="font-normal">Start your journey with <span className="font-semibold">AI Assistant</span></span>
                  </h2>
                  <p className="text-gray-400 text-center text-base max-w-xl">Lorem ipsum dummy text Lorem ipsum dummy text</p>
                </div>
                <div className="flex flex-row gap-4 mt-2 mb-8">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-6 py-3 text-gray-900 dark:text-gray-200 shadow-sm hover:bg-primary-50 dark:hover:bg-primary-900 transition"
                      onClick={() => handleSuggestionClick(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}
            {/* Chat message list, only show after chat starts */}
            {hasStarted && messages.length > 0 && (
              <div className="w-full max-w-3xl flex flex-col gap-6">
                {/* Show all chat bubbles in order */}
                {messages.map((msg, idx) => (
                  <React.Fragment key={idx}>
                    {msg.sender === "user" ? (
                      <div className="flex justify-start items-start gap-3">
                        <img
                          src={USER_AVATAR}
                          alt="User"
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                        <div className="flex flex-col items-start w-full max-w-[70%]">
                          {editingIdx === idx ? (
                            <div className="flex flex-col w-full">
                              <textarea
                                className="text-base text-gray-900 w-full font-sans font-semibold leading-relaxed box-border text-left outline-none border-none mb-2 resize-none"
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
                                <button onClick={() => handleCopy(editValue)} title="Copy" className="text-gray-400 hover:text-primary-500"><Copy size={18} /></button>
                                <button onClick={() => handleEditSave(idx)} title="Save" className="text-gray-400 hover:text-primary-500"><Save size={18} /></button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div ref={el => userEditRefs.current[idx] = el} className="text-base text-gray-900 w-full font-sans font-semibold leading-relaxed box-border text-left" style={{wordBreak: 'break-word'}}>
                                {msg.text}
                              </div>
                              <div className="flex gap-2 mt-1">
                                <button onClick={() => handleCopy(msg.text)} title="Copy" className="text-gray-400 hover:text-primary-500"><Copy size={18} /></button>
                                <button onClick={() => handleEdit(idx, msg.text)} title="Edit" className="text-gray-400 hover:text-primary-500"><Edit2 size={18} /></button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-start items-start gap-3">
                        <span className="inline-block w-12 h-12 rounded-full bg-[#4F8CFF] flex items-center justify-center shadow-lg">
                          <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="32" cy="32" r="28" fill="#4F8CFF" />
                            <path d="M27 13l4.5 9 9 4.5-9 4.5-4.5 9-4.5-9-9-4.5 9-4.5 4.5-9z" fill="#fff"/>
                            <path d="M47 36l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" fill="#fff"/>
                            <path d="M32 52l1.2 2.4L36 56l-2.4 1.2L32 60l-1.2-2.4L28 56l2.4-1.2L32 52z" fill="#fff"/>
                          </svg>
                        </span>
                        <div className="flex flex-col items-start w-full max-w-[70%]">
                          {editingIdx === idx ? (
                            <div className="flex flex-col w-full">
                              {msg.thought && (
                                <div className="text-gray-400 text-sm mb-2 font-sans font-semibold text-left">
                                  {msg.thought}
                                </div>
                              )}
                              {msg.thought && <hr className="my-2 border-gray-200" />}
                              <textarea
                                className="text-base text-gray-900 w-full font-sans font-semibold leading-relaxed box-border text-left outline-none border-none mb-2 resize-none"
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
                                <button onClick={() => handleCopy(editValue)} title="Copy" className="text-gray-400 hover:text-primary-500"><Copy size={18} /></button>
                                <button onClick={() => handleEditSave(idx)} title="Save" className="text-gray-400 hover:text-primary-500"><Save size={18} /></button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {msg.thought && (
                                <div className="text-gray-400 text-sm mb-2 font-sans font-semibold text-left">
                                  {msg.thought}
                                </div>
                              )}
                              {msg.thought && <hr className="my-2 border-gray-200" />}
                              <div ref={el => aiEditRefs.current[idx] = el} className="text-base text-gray-900 w-full font-sans font-semibold leading-relaxed box-border text-left" style={{wordBreak: 'break-word'}}>
                                {msg.text}
                              </div>
                              <div className="flex gap-2 mt-1">
                                <button onClick={() => handleCopy(msg.text)} title="Copy" className="text-gray-400 hover:text-primary-500"><Copy size={18} /></button>
                                <button onClick={() => handleEdit(idx, msg.text)} title="Edit" className="text-gray-400 hover:text-primary-500"><Edit2 size={18} /></button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    {/* Add line between AI messages */}
                    {msg.sender === "ai" && idx < messages.length - 1 && messages[idx + 1]?.sender === "ai" && (
                      <hr className="my-4 border-gray-200 dark:border-gray-700" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
            {/* Thinking and answer bubbles */}
            {hasStarted && (loading || thinkingBubbles.length > 0) && (
              <div className="w-full max-w-3xl flex flex-col gap-6 mb-4">
                {/* AI thinking bubble with modern animation */}
                <div className="flex justify-start items-start gap-3">
                  <span className="inline-block w-12 h-12 rounded-full bg-[#4F8CFF] flex items-center justify-center shadow-lg">
                    <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="32" cy="32" r="28" fill="#4F8CFF" />
                      <path d="M27 13l4.5 9 9 4.5-9 4.5-4.5 9-4.5-9-9-4.5 9-4.5 4.5-9z" fill="#fff"/>
                      <path d="M47 36l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" fill="#fff"/>
                      <path d="M32 52l1.2 2.4L36 56l-2.4 1.2L32 60l-1.2-2.4L28 56l2.4-1.2L32 52z" fill="#fff"/>
                    </svg>
                  </span>
                  <div className="rounded-xl px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-blue-700 font-medium">Thinking...</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                      <span>Processing your request</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Fixed input at bottom */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-3xl mx-auto p-4">
            <form className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg px-4 py-3 border border-gray-200 dark:border-gray-600" onSubmit={handleSubmit}>
              <button type="button" className="text-gray-400 hover:text-primary-500 p-2 transition-colors" onClick={handleAttachmentClick}>
                <Paperclip size={20} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                multiple
              />
              <button type="button" className="text-gray-400 hover:text-primary-500 p-2 transition-colors" onClick={handleMicClick}>
                <Mic size={20} />
              </button>
              <input
                type="text"
                ref={inputRef}
                className="flex-1 rounded-lg border-none bg-transparent px-4 py-2 focus:outline-none focus:ring-0 dark:bg-transparent dark:text-white text-gray-900 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
              />
              <button 
                type="submit" 
                className={`p-2 rounded-lg transition-colors ${input.trim() && !loading ? 'text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900' : 'text-gray-300'}`} 
                disabled={loading || !input.trim()}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
                ) : (
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 2L11 13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default AssistantPage;