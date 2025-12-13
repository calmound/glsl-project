'use client';

import React, { useState } from 'react';
import { type Locale } from '../../lib/i18n';
import { getSnippetsByCategory, getSnippetTitle, getSnippetDescription } from '../../lib/code-snippets';

interface SnippetSelectorProps {
  category: string;
  onInsert: (code: string) => void;
  locale: Locale;
}

export function SnippetSelector({ category, onInsert, locale }: SnippetSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const snippets = getSnippetsByCategory(category);

  if (snippets.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        {locale === 'zh' ? '插入代码片段' : 'Insert Snippet'}
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* 片段列表 */}
          <div className="absolute left-0 z-20 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            <div className="p-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">
                {locale === 'zh' ? '代码片段' : 'Code Snippets'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {locale === 'zh' ? '点击插入到编辑器' : 'Click to insert into editor'}
              </p>
            </div>

            <div className="p-2">
              {snippets.map((snippet) => {
                const title = getSnippetTitle(snippet, locale);
                const description = getSnippetDescription(snippet, locale);

                return (
                  <button
                    key={snippet.id}
                    onClick={() => {
                      onInsert(snippet.code);
                      setIsOpen(false);
                    }}
                    className="w-full text-left p-3 rounded-md hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                          {title}
                        </h4>
                        {description && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {description}
                          </p>
                        )}
                        <pre className="text-xs text-gray-400 mt-1 overflow-x-auto whitespace-pre-wrap break-all">
                          {snippet.code.slice(0, 60)}...
                        </pre>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
