'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import ShaderCanvasNew from '@/components/common/shader-canvas-new';
import CodeEditor from '@/components/ui/code-editor';
import { parseShaderError } from '@/lib/shader-error-parser';
import { type Locale } from '@/lib/i18n';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

interface TutorialWorkspaceProps {
  category: string;
  locale: Locale;
  shaders: {
    fragment: string;
    vertex: string;
    exercise: string;
  };
  userCode: string;
  isSubmitted: boolean;
  isCorrect: boolean | null;
  hasAccess: boolean;
  compileError: string | null;
  isErrorDismissed: boolean;
  setIsErrorDismissed: (dismissed: boolean) => void;
  handleRunCode: () => void;
  handleResetCode: () => void;
  handleSubmitCode: () => void;
  handleUserCodeChange: (code: string) => void;
  handleEditorBlur: () => void;
  handleCompileError: (error: string | null) => void;
  prevTutorial: Tutorial | null;
  nextTutorial: Tutorial | null;
  handlePrevTutorial: () => void;
  handleNextTutorial: () => void;
  handleBack: () => void;
  t: (key: string, defaultValue?: string) => string;
}

export function TutorialWorkspace({
  category,
  locale,
  shaders,
  userCode,
  isSubmitted,
  isCorrect,
  hasAccess,
  compileError,
  isErrorDismissed,
  setIsErrorDismissed,
  handleRunCode,
  handleResetCode,
  handleSubmitCode,
  handleUserCodeChange,
  handleEditorBlur,
  handleCompileError,
  prevTutorial,
  nextTutorial,
  handlePrevTutorial,
  handleNextTutorial,
  handleBack,
  t,
}: TutorialWorkspaceProps) {
  return (
    <div className="w-3/5 flex flex-col bg-gray-50" style={{ height: 'calc(100vh - 61px)' }}>
      <div className="p-4 flex flex-col" style={{ height: 'calc(100vh - 61px - 280px)' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-md font-semibold">{t('tutorial.editor', 'GLSL 代码编辑器')}</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRunCode}>
              {t('tutorial.run', '运行')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleResetCode}>
              {t('tutorial.reset', '重置')}
            </Button>
            <Button
              variant={'default'}
              size="sm"
              onClick={handleSubmitCode}
              disabled={!hasAccess || !!(isSubmitted && isCorrect)}
            >
              {!hasAccess
                ? t('tutorial.login_to_submit', '登录后提交')
                : isSubmitted && isCorrect
                  ? t('tutorial.passed', '已通过')
                  : t('tutorial.submit', '提交')}
            </Button>
          </div>
        </div>

        <div className="flex-1 border rounded-lg overflow-hidden">
          <CodeEditor
            initialCode={userCode}
            onChange={handleUserCodeChange}
            onBlur={handleEditorBlur}
            readOnly={!hasAccess}
            category={category}
            locale={locale}
          />
        </div>

        {compileError && !isErrorDismissed && (
          <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-red-800">
                    {parseShaderError(compileError, locale).title}
                  </h4>
                  <button
                    onClick={() => setIsErrorDismissed(true)}
                    className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
                    aria-label="关闭"
                    type="button"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {parseShaderError(compileError, locale).hint && (
                  <p className="text-sm text-red-700 mb-2">
                    💡 {parseShaderError(compileError, locale).hint}
                  </p>
                )}
                <details className="text-xs text-red-600 mt-2">
                  <summary className="cursor-pointer hover:text-red-800 font-medium">
                    {t('tutorial.error_details', '查看详细错误')}
                  </summary>
                  <pre className="mt-2 p-2 bg-red-100 rounded overflow-x-auto text-xs font-mono">
                    {compileError}
                  </pre>
                </details>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t bg-white p-4" style={{ height: '320px' }}>
        <div className="flex gap-4 h-full flex-col">
          <div className="flex gap-4 flex-1">
            <div className="flex-1">
              <h4 className="text-sm font-medium mb-2 text-green-600">
                {t('tutorial.correct_preview', '正确代码预览')}
              </h4>
              <div className="border rounded-lg overflow-hidden h-full">
                <ShaderCanvasNew
                  fragmentShader={shaders.fragment}
                  vertexShader={shaders.vertex || undefined}
                  uniforms={{
                    u_time: 0.1,
                    u_resolution: [200, 200],
                  }}
                  width="100%"
                  height="100%"
                />
              </div>
            </div>

            <div className="flex-1">
              <h4 className="text-sm font-medium mb-2 text-blue-600">
                {t('tutorial.current_preview', '当前代码预览')}
              </h4>
              <div className="border rounded-lg overflow-hidden h-full">
                <ShaderCanvasNew
                  fragmentShader={userCode}
                  vertexShader={shaders.vertex || undefined}
                  uniforms={{
                    u_time: 0.1,
                    u_resolution: [200, 200],
                  }}
                  width="100%"
                  height="100%"
                  onCompileError={handleCompileError}
                />
              </div>
            </div>
          </div>

          {isCorrect && (
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-medium">✅ {t('tutorial.completed', '练习完成！')}</span>
                  {nextTutorial && (
                    <span className="text-sm text-gray-600">
                      {t('tutorial.ready_for_next', '准备挑战下一个教程吗？')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {prevTutorial && (
                    <Button variant="outline" size="sm" onClick={handlePrevTutorial}>
                      ← {prevTutorial.title}
                    </Button>
                  )}

                  {nextTutorial && (
                    <Button
                      onClick={handleNextTutorial}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      {nextTutorial.title} →
                    </Button>
                  )}

                  {!nextTutorial && (
                    <Button variant="outline" size="sm" onClick={handleBack}>
                      {t('tutorial.back_to_list', '返回列表')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
