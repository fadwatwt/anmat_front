"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import PropTypes from "prop-types";
import { Check, Copy } from "lucide-react";

function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* copy failed silently */ }
  };

  return (
    <div className="relative group my-2 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-[11px] text-gray-500 dark:text-gray-400">
        <span>{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-transparent border-none cursor-pointer text-[11px]"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="m-0 p-4 overflow-x-auto bg-gray-50 dark:bg-gray-900">
        <code className={`text-[13px] leading-relaxed ${language ? `language-${language}` : ""}`}>{code}</code>
      </pre>
    </div>
  );
}

CodeBlock.propTypes = {
  language: PropTypes.string,
  children: PropTypes.node,
};

export default function MarkdownRenderer({ content }) {
  return (
    <div className="markdown-body text-[13px] leading-relaxed text-gray-900 dark:text-gray-100">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;
            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-[12px] font-mono text-gray-900 dark:text-gray-100" {...props}>
                  {children}
                </code>
              );
            }
            return <CodeBlock language={match[1]}>{children}</CodeBlock>;
          },
          p({ children }) { return <p className="my-1.5 text-gray-900 dark:text-gray-100">{children}</p>; },
          ul({ children }) { return <ul className="list-disc pl-5 my-1.5 space-y-0.5 text-gray-900 dark:text-gray-100">{children}</ul>; },
          ol({ children }) { return <ol className="list-decimal pl-5 my-1.5 space-y-0.5 text-gray-900 dark:text-gray-100">{children}</ol>; },
          li({ children }) { return <li className="text-[13px] text-gray-900 dark:text-gray-100">{children}</li>; },
          strong({ children }) { return <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>; },
          a({ href, children }) { return <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600 underline">{children}</a>; },
          h1({ children }) { return <h1 className="text-base font-bold my-2 text-gray-900 dark:text-white">{children}</h1>; },
          h2({ children }) { return <h2 className="text-sm font-bold my-2 text-gray-900 dark:text-white">{children}</h2>; },
          h3({ children }) { return <h3 className="text-[13px] font-bold my-1.5 text-gray-900 dark:text-white">{children}</h3>; },
          blockquote({ children }) {
            return <blockquote className="border-l-3 border-primary-400 dark:border-primary-600 pl-3 my-1.5 text-gray-600 dark:text-gray-400 italic">{children}</blockquote>;
          },
          hr() { return <hr className="my-3 border-gray-200 dark:border-gray-700" />; },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-2">
                <table className="w-full text-[13px] border-collapse border border-gray-200 dark:border-gray-700">{children}</table>
              </div>
            );
          },
          th({ children }) { return <th className="border border-gray-200 dark:border-gray-700 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 font-medium text-left">{children}</th>; },
          td({ children }) { return <td className="border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-gray-900 dark:text-gray-100">{children}</td>; },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

MarkdownRenderer.propTypes = {
  content: PropTypes.string,
};
