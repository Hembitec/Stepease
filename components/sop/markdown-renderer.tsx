"use client"

import ReactMarkdown from "react-markdown"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-gray max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">{children}</h3>,
          h4: ({ children }) => <h4 className="text-lg font-semibold text-gray-700 mt-4 mb-2">{children}</h4>,
          p: ({ children }) => <p className="text-gray-700 leading-relaxed mb-4">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-4 text-gray-700">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-700">{children}</ol>,
          li: ({ children }) => <li className="text-gray-700">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
          hr: () => <hr className="my-6 border-gray-200" />,
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-gray-200 divide-y divide-gray-200">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>,
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => <td className="px-4 py-3 text-sm text-gray-700">{children}</td>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4">{children}</blockquote>
          ),
          code: ({ children }) => (
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-gray-800 font-mono">{children}</code>
          ),
          pre: ({ children }) => (
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
