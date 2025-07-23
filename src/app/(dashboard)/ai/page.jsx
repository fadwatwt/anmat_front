"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import Page from "@/components/Page.jsx";
import { Mic, Paperclip, Copy, Edit2, Save } from "lucide-react";

// Remove GeminiIcon if not used elsewhere

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
                      <img src="/images/AiAssistant/file.svg" alt="Assistant Logo" style={{ width: '96px', height: '96px' }} />
                      <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mt-2">
                        Welcome <span className="text-primary-500 font-bold">Mai Haggag</span>,<br/>
                        <span className="font-normal">Start your journey with <span className="font-semibold">AI Assistant</span></span>
                      </h2>
                      <p className="text-gray-400 text-center text-base max-w-xl">Lorem ipsum dummy text Lorem ipsum dummy text</p>
                    </div>
                    <div className="flex flex-row gap-4 justify-center mt-8 mb-8 w-full">
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-6 py-3 text-gray-900 dark:text-gray-200 shadow-sm hover:bg-primary-50 dark:hover:bg-primary-900 transition text-base font-medium"
                          onClick={() => setInput(s)}
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
                        <span className="inline-block w-12 h-12 flex items-center justify-center">
                          <svg width="48" height="48" viewBox="0 0 61 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_di_33_14814)">
                              <rect x="6" y="2" width="49" height="49" rx="24.5" fill="#375DFB"/>
                              <rect x="6" y="2" width="49" height="49" rx="24.5" fill="white" fillOpacity="0.1"/>
                              <path fillRule="evenodd" clipRule="evenodd" d="M27.125 18.0625C27.5017 18.0625 27.8328 18.3122 27.9363 18.6745L28.8511 21.8764C29.2516 23.2779 30.3471 24.3734 31.7486 24.7739L34.9505 25.6887C35.3128 25.7922 35.5625 26.1233 35.5625 26.5C35.5625 26.8767 35.3128 27.2078 34.9505 27.3113L31.7486 28.2261C30.3471 28.6266 29.2516 29.7221 28.8511 31.1236L27.9363 34.3255C27.8328 34.6878 27.5017 34.9375 27.125 34.9375C26.7483 34.9375 26.4172 34.6878 26.3137 34.3255L25.3989 31.1236C24.9984 29.7221 23.9029 28.6266 22.5014 28.2261L19.2995 27.3113C18.9372 27.2078 18.6875 26.8767 18.6875 26.5C18.6875 26.1233 18.9372 25.7922 19.2995 25.6887L22.5014 24.7739C23.9029 24.3734 24.9984 23.2779 25.3989 21.8764L26.3137 18.6745C26.4172 18.3122 26.7483 18.0625 27.125 18.0625Z" fill="url(#paint0_linear_33_14814)"/>
                              <path fillRule="evenodd" clipRule="evenodd" d="M37.25 14.6875C37.6372 14.6875 37.9747 14.951 38.0686 15.3266L38.3598 16.4915C38.6243 17.5496 39.4504 18.3757 40.5085 18.6402L41.6734 18.9314C42.049 19.0253 42.3125 19.3628 42.3125 19.75C42.3125 20.1372 42.049 20.4747 41.6734 20.5686L40.5085 20.8598C39.4504 21.1243 38.6243 21.9504 38.3598 23.0085L38.0686 24.1734C37.9747 24.549 37.6372 24.8125 37.25 24.8125C36.8628 24.8125 36.5253 24.549 36.4314 24.1734L36.1402 23.0085C35.8757 21.9504 35.0496 21.1243 33.9915 20.8598L32.8266 20.5686C32.451 20.4747 32.1875 20.1372 32.1875 19.75C32.1875 19.3628 32.451 19.0253 32.8266 18.9314L33.9915 18.6402C35.2366 18.3757 36.0059 17.5496 36.1402 16.4915L36.4314 15.3266C36.5253 14.951 36.8628 14.6875 37.25 14.6875Z" fill="url(#paint1_linear_33_14814)"/>
                              <path fillRule="evenodd" clipRule="evenodd" d="M35.5625 29.875C35.9257 29.875 36.2481 30.1074 36.363 30.4519L36.8065 31.7825C36.9744 32.2864 37.3699 32.6818 37.8737 32.8498L39.2043 33.2933C39.5489 33.4081 39.7812 33.7306 39.7812 34.0938C39.7812 34.4569 39.5489 34.7794 39.2043 34.8942L37.8737 35.3377C37.3699 35.5057 36.9744 35.9011 36.8065 36.405L36.363 37.7356C36.2481 38.0801 35.9257 38.3125 35.5625 38.3125C35.1993 38.3125 34.8769 38.0801 34.762 37.7356L34.3185 36.405C34.1506 35.9011 33.7552 35.5057 33.2513 35.3377L31.9207 34.8942C31.5761 34.7794 31.3438 34.4569 31.3438 34.0938C31.3438 33.7306 31.5761 33.4081 31.9207 33.2933L33.2513 32.8498C33.7552 32.6818 34.1506 32.2864 34.3185 31.7825L34.762 30.4519C34.8769 30.1074 35.1993 29.875 35.5625 29.875Z" fill="url(#paint2_linear_33_14814)"/>
                            </g>
                            <defs>
                              <filter id="filter0_di_33_14814" x="0.2" y="-2" width="60.6" height="62.8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                <feOffset dy="4"/>
                                <feGaussianBlur stdDeviation="2.9"/>
                                <feComposite in2="hardAlpha" operator="out"/>
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0"/>
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_33_14814"/>
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_33_14814" result="shape"/>
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                <feOffset dy="-4"/>
                                <feGaussianBlur stdDeviation="4"/>
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.64 0"/>
                                <feBlend mode="normal" in2="shape" result="effect2_innerShadow_33_14814"/>
                              </filter>
                              <linearGradient id="paint0_linear_33_14814" x1="30.5" y1="14.6875" x2="30.5" y2="38.3125" gradientUnits="userSpaceOnUse">
                                <stop stopColor="white"/>
                                <stop offset="1" stopColor="white" stopOpacity="0.5"/>
                              </linearGradient>
                              <linearGradient id="paint1_linear_33_14814" x1="30.5" y1="14.6875" x2="30.5" y2="38.3125" gradientUnits="userSpaceOnUse">
                                <stop stopColor="white"/>
                                <stop offset="1" stopColor="white" stopOpacity="0.5"/>
                              </linearGradient>
                              <linearGradient id="paint2_linear_33_14814" x1="30.5" y1="14.6875" x2="30.5" y2="38.3125" gradientUnits="userSpaceOnUse">
                                <stop stopColor="white"/>
                                <stop offset="1" stopColor="white" stopOpacity="0.5"/>
                              </linearGradient>
                            </defs>
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
                  <span className="inline-block w-12 h-12 flex items-center justify-center">
                    <svg width="48" height="48" viewBox="0 0 61 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g filter="url(#filter0_di_33_14814)">
                        <rect x="6" y="2" width="49" height="49" rx="24.5" fill="#375DFB"/>
                        <rect x="6" y="2" width="49" height="49" rx="24.5" fill="white" fillOpacity="0.1"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M27.125 18.0625C27.5017 18.0625 27.8328 18.3122 27.9363 18.6745L28.8511 21.8764C29.2516 23.2779 30.3471 24.3734 31.7486 24.7739L34.9505 25.6887C35.3128 25.7922 35.5625 26.1233 35.5625 26.5C35.5625 26.8767 35.3128 27.2078 34.9505 27.3113L31.7486 28.2261C30.3471 28.6266 29.2516 29.7221 28.8511 31.1236L27.9363 34.3255C27.8328 34.6878 27.5017 34.9375 27.125 34.9375C26.7483 34.9375 26.4172 34.6878 26.3137 34.3255L25.3989 31.1236C24.9984 29.7221 23.9029 28.6266 22.5014 28.2261L19.2995 27.3113C18.9372 27.2078 18.6875 26.8767 18.6875 26.5C18.6875 26.1233 18.9372 25.7922 19.2995 25.6887L22.5014 24.7739C23.9029 24.3734 24.9984 23.2779 25.3989 21.8764L26.3137 18.6745C26.4172 18.3122 26.7483 18.0625 27.125 18.0625Z" fill="url(#paint0_linear_33_14814)"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M37.25 14.6875C37.6372 14.6875 37.9747 14.951 38.0686 15.3266L38.3598 16.4915C38.6243 17.5496 39.4504 18.3757 40.5085 18.6402L41.6734 18.9314C42.049 19.0253 42.3125 19.3628 42.3125 19.75C42.3125 20.1372 42.049 20.4747 41.6734 20.5686L40.5085 20.8598C39.4504 21.1243 38.6243 21.9504 38.3598 23.0085L38.0686 24.1734C37.9747 24.549 37.6372 24.8125 37.25 24.8125C36.8628 24.8125 36.5253 24.549 36.4314 24.1734L36.1402 23.0085C35.8757 21.9504 35.0496 21.1243 33.9915 20.8598L32.8266 20.5686C32.451 20.4747 32.1875 20.1372 32.1875 19.75C32.1875 19.3628 32.451 19.0253 32.8266 18.9314L33.9915 18.6402C35.2366 18.3757 36.0059 17.5496 36.1402 16.4915L36.4314 15.3266C36.5253 14.951 36.8628 14.6875 37.25 14.6875Z" fill="url(#paint1_linear_33_14814)"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M35.5625 29.875C35.9257 29.875 36.2481 30.1074 36.363 30.4519L36.8065 31.7825C36.9744 32.2864 37.3699 32.6818 37.8737 32.8498L39.2043 33.2933C39.5489 33.4081 39.7812 33.7306 39.7812 34.0938C39.7812 34.4569 39.5489 34.7794 39.2043 34.8942L37.8737 35.3377C37.3699 35.5057 36.9744 35.9011 36.8065 36.405L36.363 37.7356C36.2481 38.0801 35.9257 38.3125 35.5625 38.3125C35.1993 38.3125 34.8769 38.0801 34.762 37.7356L34.3185 36.405C34.1506 35.9011 33.7552 35.5057 33.2513 35.3377L31.9207 34.8942C31.5761 34.7794 31.3438 34.4569 31.3438 34.0938C31.3438 33.7306 31.5761 33.4081 31.9207 33.2933L33.2513 32.8498C33.7552 32.6818 34.1506 32.2864 34.3185 31.7825L34.762 30.4519C34.8769 30.1074 35.1993 29.875 35.5625 29.875Z" fill="url(#paint2_linear_33_14814)"/>
                      </g>
                      <defs>
                        <filter id="filter0_di_33_14814" x="0.2" y="-2" width="60.6" height="62.8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                          <feOffset dy="4"/>
                          <feGaussianBlur stdDeviation="2.9"/>
                          <feComposite in2="hardAlpha" operator="out"/>
                          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0"/>
                          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_33_14814"/>
                          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_33_14814" result="shape"/>
                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                          <feOffset dy="-4"/>
                          <feGaussianBlur stdDeviation="4"/>
                          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.64 0"/>
                          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_33_14814"/>
                        </filter>
                        <linearGradient id="paint0_linear_33_14814" x1="30.5" y1="14.6875" x2="30.5" y2="38.3125" gradientUnits="userSpaceOnUse">
                          <stop stopColor="white"/>
                          <stop offset="1" stopColor="white" stopOpacity="0.5"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear_33_14814" x1="30.5" y1="14.6875" x2="30.5" y2="38.3125" gradientUnits="userSpaceOnUse">
                          <stop stopColor="white"/>
                          <stop offset="1" stopColor="white" stopOpacity="0.5"/>
                        </linearGradient>
                        <linearGradient id="paint2_linear_33_14814" x1="30.5" y1="14.6875" x2="30.5" y2="38.3125" gradientUnits="userSpaceOnUse">
                          <stop stopColor="white"/>
                          <stop offset="1" stopColor="white" stopOpacity="0.5"/>
                        </linearGradient>
                      </defs>
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
                <button type="button" className="text-gray-400 hover:text-primary-500 p-2 transition-colors" onClick={handleMicClick}>
                  <img src="/images/AiAssistant/IconSet.svg" alt="Mic" className="w-5 h-5" />
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
          </div>
        </div>
      </Page>
  );
};

export default AssistantPage;