"use client";

import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import Page from "@/components/Page.jsx";
import { Mic, Paperclip, Copy, Edit2, Save, X } from "lucide-react";
import "./hide-scrollbar.css";
import ChatInput from "./ChatInput";

// Remove GeminiIcon if not used elsewhere

const suggestions = [
  "What should I work on next ?",
  "What are my urgent tasks?",
  "What tasks are created & closed by me ?"
];

const USER_AVATAR = "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

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
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [openImageUrl, setOpenImageUrl] = useState(null);
  const [stagedFiles, setStagedFiles] = useState([]); // New state for staged files

  const onRemoveStagedFile = (indexToRemove) => {
    setStagedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

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
      const newStagedFiles = Array.from(files).map(file => ({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
        file: file // Store the actual file object
      }));
      setStagedFiles(prev => [...prev, ...newStagedFiles]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && stagedFiles.length === 0) return; // Allow sending only files

    setHasStarted(true);

    const userMessage = { sender: "user", text: input };
    if (stagedFiles.length > 0) {
      userMessage.files = stagedFiles.map(f => ({ name: f.name, type: f.type, url: f.url }));
    }

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setStagedFiles([]); // Clear staged files after sending
    setLoading(true);
    setThinking(true);

    // Refocus input after sending message
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);

    // Simulate AI response with file/image demo
    setTimeout(() => {
      setThinking(false);
      setLoading(false);
      let aiMsg;
      const text = userMessage.text.toLowerCase();
      // Check if the message contains files or text related to files/images
      if (userMessage.files && userMessage.files.length > 0 || text.includes('agenda') || text.includes('file') || text.includes('document')) {
        aiMsg = {
          sender: "ai",
          text: "I received your file(s). How can I help you with them?",
          files: userMessage.files && userMessage.files.length > 0 ? userMessage.files : [{
            name: "Project kick off agenda.svg",
            type: "image/svg+xml",
            url: "/images/file.svg"
          }]
        };
      } else if (text.includes('image') || text.includes('picture') || text.includes('photo')) {
        aiMsg = {
          sender: "ai",
          text: "Here is the image you requested:",
          file: {
            name: "ai-image.png",
            type: "image/png",
            url: "/images/users/user1.png"
          }
        };
      } else if (text.includes('reference') || text.includes('link')) {
        aiMsg = {
          sender: "ai",
          text: "Here is your reference:",
          links: [
            { label: "View reference", url: "https://nextjs.org" }
          ]
        };
      } else if (text.includes('assignee') || text.includes('assigned') || text.includes('echo') || text.includes('voice command')) {
        aiMsg = {
          sender: "ai",
          text: 'Got it, the assignees of Echo "AI Assistant: Voice Command Setup" task is',
          assignees: [
            { name: "Ali Mohamed", avatar: "/images/users/user1.png", profileUrl: "#" },
            { name: "Ali Mohamed", avatar: "/images/users/user1.png", profileUrl: "#" },
            { name: "Ali Mohamed", avatar: "/images/users/user1.png", profileUrl: "#" }
          ],
          hasReference: true
        };
      } else if (text.includes('table') || text.includes('tasks')) {
        aiMsg = {
          sender: "ai",
          text: "Here is your task table:",
          table: {
            headers: ["Assigned to", "Manager", "Assigned - Due Date", "Priority", "Status"],
            rows: [
              ["Zainab Al-Hakim", "Fatma Ahmed Mohamed", "15 Nov, 2024 - 16 Jan, 2025", "Urgent", "Active"],
              ["Layla Al-Farsi", "Fatma Ahmed Mohamed", "15 Nov, 2024 - 16 Jan, 2025", "Low", "Inactive"],
              ["Sophia Williams", "James Brown", "15 Nov, 2024 - 16 Jan, 2025", "High", "Active"],
              ["Ali Mohamed", "Sophia Williams", "15 Nov, 2024 - 16 Jan, 2025", "Medium", "Delayed"]
            ]
          }
        };
      } else {
        aiMsg = {
          sender: "ai",
          thought: "Analyzing your request... lorem ipsum dummy text lorem ipsum dummy text lorem ipsum dummy text lorem ipsum dummy text. ",
          text: "Got it, lorem ipsum dummy text ."
        };
      }
      setMessages(prev => [
        ...prev,
        aiMsg
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

  // Audio recording logic
  const handleRecordToggle = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current.stop();
    } else {
      // Start recording
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
        alert("Microphone access denied or not available.");
      }
    }
  };

  useEffect(() => {
    if (!isRecording) setAudioChunks([]);
  }, [isRecording]);

  return (
      <Page isTitle={false}>
        <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col w-full max-w-3xl mx-auto h-[80vh] max-h-[700px]">
            <div className="flex-1 overflow-y-auto hide-scrollbar p-8 gap-8 flex flex-col" ref={chatContainerRef}>
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
                    <div className="flex flex-row gap-4 justify-center mt-8 mb-12 w-full">
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
                                          {msg.audio && (
                                            <audio controls src={msg.audio} className="mt-2" />
                                          )}
                                        {msg.files && msg.files.length > 0 && (
                                          <div className="mt-4 flex flex-col gap-2">
                                            {msg.files.map((file, fileIdx) => (
                                              file.type.startsWith('image') ? (
                                                  <img
                                                    key={fileIdx}
                                                    src={file.url}
                                                    alt={file.name}
                                                    className="max-w-full rounded-xl shadow border border-gray-100 cursor-pointer"
                                                    style={{ maxHeight: '400px' }}
                                                    onClick={() => setOpenImageUrl(file.url)}
                                                  />
                                              ) : (
                                                <div key={fileIdx} className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow flex items-center w-[492px] h-[68px] px-5 py-4 gap-2.5">
                                                  {/* Left icon */}
                                                  {isDocument(file.type, file.name) ? (
                                                    <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-50 rounded-lg">
                                                      <img src="/images/AiAssistant/document-text.svg" alt="Document" className="w-6 h-6" />
                                                    </span>
                                                  ) : (
                                                    <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-50 rounded-lg">
                                                      <img src="/images/AiAssistant/file.svg" alt="File" className="w-6 h-6" />
                                                    </span>
                                                  )}
                                                  {/* File name center */}
                                                  <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate">{file.name}</div>
                                                  </div>
                                                  {/* Download icon right */}
                                                  <a href={file.url} download={file.name} className="flex items-center justify-center text-primary-500 hover:text-primary-700" title="Download">
                                                    <img src="/images/AiAssistant/lucide_download.svg" alt="Download" className="w-6 h-6" style={{ width: 24, height: 24 }} />
                                                  </a>
                                                </div>
                                              )
                                            ))}
                                          </div>
                                        )}

                                          {msg.files && msg.files.length > 0 && (
                                            <div className="mt-4 flex flex-col gap-2">
                                              {msg.files.map((file, fileIdx) => (
                                                file.type.startsWith('image') ? (
                                                    <img
                                                      key={fileIdx}
                                                      src={file.url}
                                                      alt={file.name}
                                                      className="max-w-full rounded-xl shadow border border-gray-100 cursor-pointer"
                                                      style={{ maxHeight: '400px' }}
                                                      onClick={() => setOpenImageUrl(file.url)}
                                                    />
                                                ) : (
                                                  <div key={fileIdx} className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow flex items-center w-[492px] h-[68px] px-5 py-4 gap-2.5">
                                                    {/* Left icon */}
                                                    {isDocument(file.type, file.name) ? (
                                                      <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-50 rounded-lg">
                                                        <img src="/images/AiAssistant/document-text.svg" alt="Document" className="w-6 h-6" />
                                                      </span>
                                                    ) : (
                                                      <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-50 rounded-lg">
                                                        <img src="/images/AiAssistant/file.svg" alt="File" className="w-6 h-6" />
                                                      </span>
                                                    )}
                                                    {/* File name center */}
                                                    <div className="flex-1 min-w-0">
                                                      <div className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate">{file.name}</div>
                                                    </div>
                                                    {/* Download icon right */}
                                                    <a href={file.url} download={file.name} className="flex items-center justify-center text-primary-500 hover:text-primary-700" title="Download">
                                                      <img src="/images/AiAssistant/lucide_download.svg" alt="Download" className="w-6 h-6" style={{ width: 24, height: 24 }} />
                                                    </a>
                                                  </div>
                                                )
                                              ))}
                                            </div>
                                          )}

                                          {msg.links && Array.isArray(msg.links) && msg.links.length > 0 && (
                                            <div className="flex flex-row gap-3 mt-4">
                                              {msg.links.map((link, i) => (
                                                <a
                                                  key={i}
                                                  href={link.url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white font-semibold shadow hover:bg-primary-600 transition text-base"
                                                >
                                                  {/* Optionally add an icon here */}
                                                  {link.label}
                                                </a>
                                              ))}
                                            </div>
                                          )}
                                          {msg.table && (
                                            <div className="mt-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow overflow-x-auto">
                                              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-gray-800">
                                                  <tr>
                                                    {msg.table.headers.map((header, i) => (
                                                      <th key={i} className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">{header}</th>
                                                    ))}
                                                  </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                                  {msg.table.rows.map((row, i) => (
                                                    <tr key={i}>
                                                      {row.map((cell, j) => (
                                                        <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{cell}</td>
                                                      ))}
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>
                                            </div>
                                          )}
                                        </div>
                                        {(!msg.file && !msg.files) && (
                                          <div className="flex gap-2 mt-1">
                                            <button onClick={() => handleEdit(idx, msg.text)} title="Edit" className="text-gray-400 hover:text-primary-500"><img src="/images/AiAssistant/edit.svg" alt="Edit" className="w-5 h-5" /></button>
                                            <button onClick={() => handleCopy(msg.text)} title="Copy" className="text-gray-400 hover:text-primary-500"><img src="/images/AiAssistant/copy.svg" alt="Copy" className="w-5 h-5" /></button>
                                          </div>
                                        )}
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
                                            <div className="text-[#525866] text-[18px] mb-2 font-['Almarai'] font-[400] leading-[150%] tracking-[0%] text-left">
                                              {msg.thought}
                                            </div>
                                        )}
                                        {msg.thought && <hr className="my-2 border-gray-200" />}
                                        <div ref={el => aiEditRefs.current[idx] = el} className="text-[#525866] text-[18px] w-full font-['Almarai'] font-[400] leading-[150%] tracking-[0%] text-left" style={{wordBreak: 'break-word', gap: '12px'}}>
                                          {msg.text}
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
                                                  <span className="text-gray-900 font-medium">{assignee.name}</span>
                                                  <a
                                                    href={assignee.profileUrl}
                                                    className="text-primary-500 hover:text-primary-700 underline text-sm"
                                                  >
                                                    View profile
                                                  </a>
                                                </div>
                                              ))}
                                              {msg.hasReference && (
                                                <div className="mt-4 flex items-center justify-end">
                                                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white font-medium shadow hover:bg-primary-600 transition text-sm">
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                      <path d="M3 3h10v10H3V3zm1 1v8h8V4H4zm2 2h4v1H6V6zm0 2h3v1H6V8z" fill="currentColor"/>
                                                    </svg>
                                                    View reference
                                                  </button>
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex gap-2 mt-1">
                                          <button onClick={() => handleEdit(idx, msg.text)} title="Edit" className="text-gray-400 hover:text-primary-500"><img src="/images/AiAssistant/edit.svg" alt="Edit" className="w-5 h-5" /></button>
                                          <button onClick={() => handleCopy(msg.text)} title="Copy" className="text-gray-400 hover:text-primary-500"><img src="/images/AiAssistant/copy.svg" alt="Copy" className="w-5 h-5" /></button>
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
      />
          </div>
        </div>
        {/* Image Modal */}
        {openImageUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setOpenImageUrl(null)}>
            <div className="relative" onClick={e => e.stopPropagation()}>
              <img src={openImageUrl} alt="Preview" className="max-h-[80vh] max-w-[90vw] rounded-xl shadow-lg" />
              <button
                onClick={() => setOpenImageUrl(null)}
                className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 hover:bg-opacity-100 transition"
                title="Close"
              >
                <X size={24} className="text-gray-700" />
              </button>
            </div>
          </div>
        )}
      </Page>
  );
};

export default AssistantPage;