'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type Locale, addLocaleToPathname } from '../../lib/i18n';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import SubscriptionPrompt from '../subscription/subscription-prompt';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  isFree?: boolean;
}

interface UserProgress {
  form_id: string;
  is_passed: boolean;
  has_submitted: boolean;
  attempts: number;
  last_submitted_at: string | null;
}

interface LearningPathProps {
  tutorials: Tutorial[];
  userProgress: Record<string, UserProgress>;
  locale: Locale;
}

export function LearningPath({ tutorials, userProgress, locale }: LearningPathProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { hasActiveSubscription } = useAuth();
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);

  // 处理教程点击
  const handleTutorialClick = (tutorial: Tutorial) => {
    const isFree = tutorial.isFree ?? false;
    const needsSubscription = !isFree && !hasActiveSubscription;

    if (needsSubscription) {
      // 付费教程且无订阅，显示订阅提示
      setShowSubscriptionPrompt(true);
    } else {
      // 免费教程或已订阅，直接跳转
      router.push(addLocaleToPathname(`/learn/${tutorial.category}/${tutorial.id}`, locale));
    }
  };

  return (
    <>
      {/* 订阅提示弹窗 */}
      {showSubscriptionPrompt && (
        <SubscriptionPrompt
          onClose={() => setShowSubscriptionPrompt(false)}
        />
      )}

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-6 text-gray-900">{t('learn.path.learning_path')}</h3>
        <div className="space-y-1">
          {tutorials.map((tutorial, index) => {
            const progress = userProgress[tutorial.id];
            const isCompleted = progress?.is_passed || false;
            const isFree = tutorial.isFree ?? false;
            const needsSubscription = !isFree && !hasActiveSubscription;

            return (
              <div key={tutorial.id}>
                {/* 教程节点 */}
                <div
                  className={`
                    flex items-center gap-4 p-3 rounded-lg transition-colors
                    ${needsSubscription ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}
                  `}
                  onClick={() => handleTutorialClick(tutorial)}
                >
                {/* 序号节点 */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0
                    ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                {/* 教程信息 */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{tutorial.title}</h4>
                  <p className="text-xs text-gray-500 truncate">{tutorial.description}</p>
                  {progress && progress.attempts > 0 && (
                    <p className="text-xs text-gray-400 mt-1">{progress.attempts} {t('learn.attempts')}</p>
                  )}
                </div>

                {/* 付费/免费标记 */}
                <div className="flex items-center gap-2 shrink-0">
                  {!isFree && (
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium bg-yellow-100 text-yellow-800">
                      {needsSubscription ? '🔒' : '💎'}
                      {needsSubscription ? t('learn.pro_required', 'Pro') : t('learn.pro', 'Pro')}
                    </span>
                  )}
                  {/* 难度标签 */}
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      tutorial.difficulty === 'beginner'
                        ? 'bg-green-100 text-green-800'
                        : tutorial.difficulty === 'intermediate'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {t(`learn.difficulty.${tutorial.difficulty}`)}
                  </span>
                </div>
              </div>

              {/* 连接线 */}
              {index < tutorials.length - 1 && (
                <div className="flex items-center ml-5">
                  <div
                    className={`w-0.5 h-6 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}
