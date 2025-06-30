"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  const components: Components = {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const isInline = !match && !className?.includes("language-");

      return !isInline && match ? (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          className="rounded-md"
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code
          className={`${className} bg-gray-200 px-1 py-0.5 rounded text-sm font-mono`}
          {...props}
        >
          {children}
        </code>
      );
    },
    h1: ({ children }) => (
      <h1 className="text-xl font-bold mb-3 text-gray-900">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-lg font-semibold mb-2 text-gray-800">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-base font-medium mb-2 text-gray-800">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-sm font-medium mb-2 text-gray-700">{children}</h4>
    ),
    p: ({ children }) => (
      <p className="mb-3 leading-relaxed text-gray-700">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc  mb-3 ml-6 space-y-1 text-gray-700">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal  mb-3 ml-6 space-y-1 text-gray-700">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-300 pl-4 italic my-3 bg-blue-50 py-2 rounded-r">
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-gray-800">{children}</em>,
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border border-gray-300 rounded-lg">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="border-b border-gray-200">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-2 text-left font-semibold text-gray-900">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2 text-gray-700">{children}</td>
    ),
    hr: () => <hr className="my-6 border-gray-300" />,
  };

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
