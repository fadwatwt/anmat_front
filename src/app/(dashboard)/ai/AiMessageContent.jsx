import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function AiMessageContent({ text, className = "" }) {
  if (!text) return null;

  return (
    <div
      dir="auto"
      className={`text-[15px] sm:text-base text-gray-900 dark:text-gray-100 leading-relaxed ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children, ...props }) => (
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-5 mb-3" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2" {...props}>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-3 mb-1" {...props}>
              {children}
            </h4>
          ),
          p: ({ children, ...props }) => (
            <p className="leading-relaxed mb-3 last:mb-0" {...props}>
              {children}
            </p>
          ),
          strong: ({ children, ...props }) => (
            <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props}>
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em {...props}>{children}</em>
          ),
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside space-y-1.5 my-3 ps-1" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside space-y-1.5 my-3 ps-1" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="leading-relaxed" {...props}>
              {children}
            </li>
          ),
          hr: ({ ...props }) => (
            <hr className="my-4 border-gray-200 dark:border-gray-700" {...props} />
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote className="border-l-4 border-primary-400 pl-4 my-3 text-gray-600 dark:text-gray-400 italic" {...props}>
              {children}
            </blockquote>
          ),
          code: ({ children, inline, ...props }) =>
            inline ? (
              <code
                className="bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400 px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            ) : (
              <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 my-3 overflow-x-auto text-sm text-gray-900 dark:text-gray-200">
                <code className="font-mono" {...props}>
                  {children}
                </code>
              </pre>
            ),
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-3">
              <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700 text-sm" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
              {children}
            </thead>
          ),
          th: ({ children, ...props }) => (
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-gray-300" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-200" {...props}>
              {children}
            </td>
          ),
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-700 underline"
              {...props}
            >
              {children}
            </a>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

AiMessageContent.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
};

export default AiMessageContent;
