'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { createBrowserSupabase } from '@/lib/supabase';
import { type Locale, addLocaleToPathname } from '@/lib/i18n';

type ToastType = 'success' | 'error' | 'info';

interface UseTutorialSubmissionOptions {
  tutorialId: string;
  category: string;
  locale: Locale;
  userCode: string;
  correctCode: string;
  nextTutorialTitle?: string;
  validateShaderWithWebGL: (code: string) => { isValid: boolean; errors: string[] };
  compareCanvasOutput: (userCode: string, correctCode: string) => Promise<boolean>;
  persistPendingCode: (tutorialId: string, code: string) => void;
  addToast: (message: string, type: ToastType, duration?: number) => void;
  setIsSubmitted: (value: boolean) => void;
  setIsCorrect: (value: boolean) => void;
  t: (key: string, defaultValue?: string) => string;
}

export function useTutorialSubmission({
  tutorialId,
  category,
  locale,
  userCode,
  correctCode,
  nextTutorialTitle,
  validateShaderWithWebGL,
  compareCanvasOutput,
  persistPendingCode,
  addToast,
  setIsSubmitted,
  setIsCorrect,
  t,
}: UseTutorialSubmissionOptions) {
  const router = useRouter();
  const supabase = createBrowserSupabase();

  return useCallback(async () => {
    const validation = validateShaderWithWebGL(userCode);

    if (!validation.isValid) {
      validation.errors.forEach((error, index) => {
        setTimeout(() => {
          addToast(error, 'error', 5000);
        }, index * 200);
      });
      return;
    }

    setIsSubmitted(true);

    try {
      const isRenderingCorrect = await compareCanvasOutput(userCode, correctCode);
      setIsCorrect(isRenderingCorrect);

      if (!isRenderingCorrect) {
        addToast(
          t('tutorial.incorrect_toast', '渲染效果与预期不符，请检查代码逻辑'),
          'error'
        );
        return;
      }

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        persistPendingCode(tutorialId, userCode);

        const returnUrl = addLocaleToPathname(`/learn/${category}/${tutorialId}`, locale);
        addToast(
          `⚠️ ${t('tutorial.login_required', '请先登录后再提交代码，您的代码已保存')}`,
          'info',
          5000
        );

        setTimeout(() => {
          router.push(`/signin?redirect=${encodeURIComponent(returnUrl)}`);
        }, 1500);
        return;
      }

      try {
        const response = await supabase.functions.invoke('submit_form', {
          body: {
            formId: tutorialId,
            passed: true,
          },
        });

        if (response.error) {
          const is401Error =
            response.error instanceof FunctionsHttpError &&
            response.error.context.status === 401;

          if (is401Error) {
            addToast(
              `🔒 ${t('tutorial.session_expired', '登录已过期，请重新登录')}`,
              'error',
              5000
            );
            setTimeout(() => {
              router.push('/signin');
            }, 1500);
            return;
          }

          addToast(`❌ ${t('tutorial.submit_failed', '提交失败，请重试')}`, 'error', 4000);
          return;
        }

        addToast(
          `🎉 ${t('tutorial.success_toast', '恭喜！渲染效果正确，代码通过验证！')}`,
          'success',
          4000
        );

        if (nextTutorialTitle) {
          setTimeout(() => {
            addToast(
              `✨ ${t('tutorial.next_tutorial_hint', '准备好了吗？')} "${nextTutorialTitle}" ${t(
                'tutorial.next_tutorial_action',
                '等你来挑战！'
              )}`,
              'info',
              6000
            );
          }, 2000);
        }
      } catch (error) {
        console.error('调用 Edge Function 失败:', error);
        addToast(`❌ ${t('tutorial.submit_error', '提交过程中出现错误')}`, 'error', 4000);
      }
    } catch (error) {
      console.error('验证渲染效果时出错:', error);
      setIsCorrect(false);
      addToast(t('tutorial.error_toast', '验证过程中出现错误，请重试'), 'error');
    }
  }, [
    addToast,
    category,
    compareCanvasOutput,
    correctCode,
    locale,
    nextTutorialTitle,
    persistPendingCode,
    router,
    setIsCorrect,
    setIsSubmitted,
    supabase,
    t,
    tutorialId,
    userCode,
    validateShaderWithWebGL,
  ]);
}
