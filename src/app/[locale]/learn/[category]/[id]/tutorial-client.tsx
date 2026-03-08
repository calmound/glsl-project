'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer } from '@/components/ui/toast';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { useAuth } from '../../../../../contexts/AuthContext';
import { type Locale, addLocaleToPathname } from '../../../../../lib/i18n';
import { useTutorialAccess } from '../../../../../hooks/use-tutorial-access';
import { useTutorialCodePersistence } from '../../../../../hooks/use-tutorial-code-persistence';
import { useShaderValidation } from '../../../../../hooks/use-shader-validation';
import { useTutorialSubmission } from '../../../../../hooks/use-tutorial-submission';
import LoginPromptOverlay from '../../../../../components/auth/login-prompt-overlay';
import SubscriptionPrompt from '../../../../../components/subscription/subscription-prompt';
import { TutorialSidebar } from './tutorial-sidebar';
import { TutorialWorkspace } from './tutorial-workspace';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

interface TutorialPageClientProps {
  tutorial: Tutorial;
  readme: string;
  shaders: {
    fragment: string;
    vertex: string;
    exercise: string;
  };
  locale: Locale;
  category: string;
  tutorialId: string;
  categoryTutorials: Tutorial[];
  initialCode?: string; // 从服务端预取的用户代码
  isFree: boolean; // 是否免费教程
}

export default function TutorialPageClient({
  tutorial,
  readme,
  shaders,
  locale,
  category,
  tutorialId,
  categoryTutorials,
  initialCode: serverInitialCode,
  isFree,
}: TutorialPageClientProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, hasActiveSubscription } = useAuth();

  // 优先使用服务端预取的代码，其次是练习代码
  const exerciseCode = serverInitialCode || shaders.exercise || shaders.fragment;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'tutorial' | 'answer'>('tutorial');
  const [compileError, setCompileError] = useState<string | null>(null);
  const [isErrorDismissed, setIsErrorDismissed] = useState(false);
  const [toasts, setToasts] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
  }>>([]);

  // Toast 管理函数
  const addToast = (message: string, type: 'success' | 'error' | 'info', duration = 3000) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // 处理编译错误
  const handleCompileError = useCallback((error: string | null) => {
    setCompileError(error);
  }, []);

  const {
    hasAccess,
    showLoginPrompt,
    setShowLoginPrompt,
    showSubscriptionPrompt,
    setShowSubscriptionPrompt,
  } = useTutorialAccess({
    isFree,
    isAuthenticated: !!user,
    hasActiveSubscription,
  });
  const { userCode, setUserCode, initialCode, handleEditorBlur, persistPendingCode } =
    useTutorialCodePersistence({
      tutorialId,
      exerciseCode,
      user,
      restoreMessage: t('tutorial.code_restored', '已恢复您之前编辑的代码'),
      addToast,
    });
  const { validateShaderWithWebGL, compareCanvasOutput, showValidationErrors } =
    useShaderValidation({
      addToast,
    });

  // 处理用户代码变化
  const handleUserCodeChange = (code: string) => {
    setUserCode(code);
    setIsSubmitted(false);
    setIsCorrect(null);
    setIsErrorDismissed(false); // 代码改变时重新显示错误
  };

  // 运行用户代码
  const handleRunCode = () => {
    setIsErrorDismissed(false); // 运行时重新显示错误

    const validation = validateShaderWithWebGL(userCode);

    if (!validation.isValid) {
      showValidationErrors(validation.errors);
      return;
    }

    addToast(t('tutorial.compile_success'), 'success');
  };

  // 重置代码到初始状态（练习代码）
  const handleResetCode = () => {
    setUserCode(initialCode);
    setIsSubmitted(false);
    setIsCorrect(null);
  };

  // 获取当前教程在列表中的位置
  const currentIndex = categoryTutorials.findIndex(t => t.id === tutorialId);
  const prevTutorial = currentIndex > 0 ? categoryTutorials[currentIndex - 1] : null;
  const nextTutorial = currentIndex < categoryTutorials.length - 1 ? categoryTutorials[currentIndex + 1] : null;
  const handleSubmitCode = useTutorialSubmission({
    tutorialId,
    category,
    locale,
    userCode,
    correctCode: shaders.fragment,
    nextTutorialTitle: nextTutorial?.title,
    validateShaderWithWebGL,
    compareCanvasOutput,
    persistPendingCode,
    addToast,
    setIsSubmitted,
    setIsCorrect,
    t,
  });

  // 返回列表页
  const handleBack = () => {
    router.push(addLocaleToPathname('/learn', locale));
  };

  // 导航到上一个教程
  const handlePrevTutorial = () => {
    if (prevTutorial) {
      router.push(addLocaleToPathname(`/learn/${category}/${prevTutorial.id}`, locale));
    }
  };

  // 导航到下一个教程
  const handleNextTutorial = () => {
    if (nextTutorial) {
      router.push(addLocaleToPathname(`/learn/${category}/${nextTutorial.id}`, locale));
    }
  };

  return (
    <>
      {/* 登录提示遮罩 */}
      {showLoginPrompt && (
        <LoginPromptOverlay
          onClose={() => setShowLoginPrompt(false)}
        />
      )}

      {showSubscriptionPrompt && (
        <SubscriptionPrompt
          onClose={() => setShowSubscriptionPrompt(false)}
        />
      )}

      {/* Toast 容器 */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      <div className="flex overflow-hidden">
        <TutorialSidebar
          tutorial={tutorial}
          readme={readme}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentIndex={currentIndex}
          totalTutorials={categoryTutorials.length}
          prevTutorial={prevTutorial}
          nextTutorial={nextTutorial}
          handleBack={handleBack}
          handlePrevTutorial={handlePrevTutorial}
          handleNextTutorial={handleNextTutorial}
          openSubscriptionPrompt={() => setShowSubscriptionPrompt(true)}
          t={t}
          answerCode={shaders.fragment}
        />

        <TutorialWorkspace
          category={category}
          locale={locale}
          shaders={shaders}
          userCode={userCode}
          isSubmitted={isSubmitted}
          isCorrect={isCorrect}
          hasAccess={hasAccess}
          compileError={compileError}
          isErrorDismissed={isErrorDismissed}
          setIsErrorDismissed={setIsErrorDismissed}
          handleRunCode={handleRunCode}
          handleResetCode={handleResetCode}
          handleSubmitCode={handleSubmitCode}
          handleUserCodeChange={handleUserCodeChange}
          handleEditorBlur={handleEditorBlur}
          handleCompileError={handleCompileError}
          prevTutorial={prevTutorial}
          nextTutorial={nextTutorial}
          handlePrevTutorial={handlePrevTutorial}
          handleNextTutorial={handleNextTutorial}
          handleBack={handleBack}
          t={t}
        />
      </div>
    </>
  );
}
