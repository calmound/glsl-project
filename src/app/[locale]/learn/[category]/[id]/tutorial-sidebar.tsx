'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

interface TutorialSidebarProps {
  tutorial: Tutorial;
  readme: string;
  activeTab: 'tutorial' | 'answer';
  setActiveTab: (tab: 'tutorial' | 'answer') => void;
  currentIndex: number;
  totalTutorials: number;
  prevTutorial: Tutorial | null;
  nextTutorial: Tutorial | null;
  handleBack: () => void;
  handlePrevTutorial: () => void;
  handleNextTutorial: () => void;
  openSubscriptionPrompt: () => void;
  t: (key: string, defaultValue?: string) => string;
  answerCode: string;
}

export function TutorialSidebar({
  tutorial,
  readme,
  activeTab,
  setActiveTab,
  currentIndex,
  totalTutorials,
  prevTutorial,
  nextTutorial,
  handleBack,
  handlePrevTutorial,
  handleNextTutorial,
  openSubscriptionPrompt,
  t,
  answerCode,
}: TutorialSidebarProps) {
  return (
    <div
      style={{ height: 'calc(100vh - 61px)' }}
      className="w-2/5 border-r bg-white flex flex-col"
    >
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleBack}>
            {t('common.back', '返回')}
          </Button>
          <h1 className="text-lg font-semibold">{tutorial.title}</h1>
          <button
            onClick={openSubscriptionPrompt}
            className="ml-2 px-2 py-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded shadow hover:shadow-md transition-shadow animate-pulse"
          >
            PRO
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevTutorial}
            disabled={!prevTutorial}
            className="flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('tutorial.prev', '上一个')}
          </Button>

          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {totalTutorials}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextTutorial}
            disabled={!nextTutorial}
            className="flex items-center gap-1"
          >
            {t('tutorial.next', '下一个')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab('tutorial')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'tutorial'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            📚 {t('tutorial.tab.tutorial', '教程介绍')}
          </button>
          <button
            onClick={() => setActiveTab('answer')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'answer'
                ? 'border-green-500 text-green-600 bg-green-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            💡 {t('tutorial.tab.answer', '参考答案')}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'tutorial' ? (
          <>
            <div className="mb-6">
              <h2 className="text-md font-semibold mb-3 text-blue-600">
                📝 {t('tutorial.exercise_goal', '练习目标')}
              </h2>
              <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                {tutorial.description}
              </div>
            </div>

            {readme && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-md font-semibold text-green-600">
                    💡 {t('tutorial.content', '教程内容')}
                  </h2>
                </div>
                <div className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: () => null,
                      h2: ({ children }) => (
                        <h3 className="font-semibold text-green-700 mt-4 mb-2">{children}</h3>
                      ),
                      h3: ({ children }) => (
                        <h4 className="font-medium text-green-600 mt-3 mb-1">{children}</h4>
                      ),
                      p: ({ children }) => <p className="mb-2">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-5 mb-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-5 mb-2">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      code: ({
                        inline,
                        className,
                        children,
                      }: {
                        inline?: boolean;
                        className?: string;
                        children?: React.ReactNode;
                      }) => {
                        const codeText = Array.isArray(children) ? children.join('') : String(children);
                        const isInline =
                          inline ?? (!className && !codeText.includes('\n') && !codeText.includes('\r'));
                        return isInline ? (
                          <code className="bg-slate-200 text-slate-900 px-1.5 py-0.5 rounded text-[0.85em]">
                            {children}
                          </code>
                        ) : (
                          <code className="block font-mono text-slate-100">{children}</code>
                        );
                      },
                      pre: ({ children }) => (
                        <pre className="bg-slate-900 text-slate-100 p-4 rounded-md overflow-auto text-sm leading-relaxed">
                          {children}
                        </pre>
                      ),
                      a: ({ children, href }) => (
                        <a className="text-blue-600 underline" href={href}>
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {readme}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {!readme && (
              <div className="mb-6">
                <h2 className="text-md font-semibold mb-3 text-green-600">
                  💡 {t('tutorial.knowledge_points', '知识点')}
                </h2>
                <div className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg">
                  <p className="mb-2">
                    {t('tutorial.default_knowledge_1', '在GLSL中，gl_FragColor 是片段着色器的输出变量。')}
                  </p>
                  <p className="mb-2">
                    {t('tutorial.default_knowledge_2', '它是一个 vec4 类型，表示RGBA颜色值。')}
                  </p>
                  <p>
                    {t('tutorial.default_knowledge_3', '每个分量的取值范围是 0.0 到 1.0。')}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-md font-semibold mb-3 text-green-600">
                ✅ {t('tutorial.answer.title', '参考答案')}
              </h2>
              <div className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg mb-4">
                <p className="mb-2">
                  {t(
                    'tutorial.answer.description',
                    '以下是本练习的完整解决方案，你可以参考这个代码来理解正确的实现方式。'
                  )}
                </p>
                <p className="text-amber-600">
                  {t('tutorial.answer.tip', '💡 建议先尝试自己完成，遇到困难时再查看答案。')}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">
                {t('tutorial.answer.code', 'GLSL 代码:')}
              </h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-xs font-mono">
                <pre className="whitespace-pre-wrap">{answerCode}</pre>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">
                {t('tutorial.answer.explanation', '代码说明:')}
              </h3>
              <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                <p className="mb-2">
                  {t('tutorial.answer.explanation_1', '• 这段代码展示了如何正确实现本练习的要求')}
                </p>
                <p className="mb-2">
                  {t('tutorial.answer.explanation_2', '• 注意变量的声明和使用方式')}
                </p>
                <p>
                  {t('tutorial.answer.explanation_3', '• 观察输出结果与预期效果的对应关系')}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">
                {t('tutorial.answer.tips', '学习建议:')}
              </h3>
              <div className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg">
                <p className="mb-2">{t('tutorial.answer.tip_1', '1. 尝试理解每一行代码的作用')}</p>
                <p className="mb-2">{t('tutorial.answer.tip_2', '2. 可以修改参数值观察效果变化')}</p>
                <p className="mb-2">
                  {t('tutorial.answer.tip_3', '3. 将答案代码复制到编辑器中运行验证')}
                </p>
                <p>{t('tutorial.answer.tip_4', '4. 基于答案代码尝试创造自己的变化')}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
