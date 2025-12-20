'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreemPortal } from '@creem_io/nextjs';
import MainLayout from '@/components/layout/main-layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Locale } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

interface PaymentSuccessClientProps {
  locale: Locale;
  sessionId?: string;
}

export default function PaymentSuccessClient({ locale, sessionId }: PaymentSuccessClientProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const { refreshEntitlement } = useAuth();
  const [countdown, setCountdown] = useState(60); // 60秒倒计时
  const [checking, setChecking] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 20; // 最多检查约 60 秒

    const checkSubscription = async () => {
      try {
        const response = await fetch('/api/subscription/status', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Subscription status check failed');
        }

        const data = await response.json();
        if (data?.entitlement?.creem_customer_id) {
          setCustomerId(data.entitlement.creem_customer_id);
        }

        if (data?.hasActiveSubscription) {
          setIsActive(true);
          setChecking(false);
          setTimedOut(false);
          await refreshEntitlement();
          return true;
        }
      } catch (error) {
        console.error('❌ [PaymentSuccess] 查询订阅状态失败:', error);
      }

      attempts += 1;
      if (attempts >= maxAttempts) {
        setChecking(false);
        setTimedOut(true);
        return true;
      }

      return false;
    };

    const timer = setInterval(async () => {
      const done = await checkSubscription();
      if (done) {
        clearInterval(timer);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [refreshEntitlement]);

  // 倒计时
  useEffect(() => {
    if (!isActive) return;
    if (countdown <= 0) {
      router.push(`/${locale}/learn`);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isActive, locale, router]);

  const handleGoToLearning = () => {
    router.push(`/${locale}/learn`);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          {/* 成功图标 */}
          <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('payment.success.title') || '🎉 支付成功！'}
            </h1>

            <p className="text-xl text-gray-600 mb-2">
              {t('payment.success.subtitle') || '欢迎加入 Shader Learn Pro 会员！'}
            </p>

            {sessionId && (
              <p className="text-sm text-gray-400">
                {t('payment.success.session_id') || '订单号'}: {sessionId}
              </p>
            )}
          </div>

          {/* 状态卡片 */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            {checking ? (
              <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">
                {t('payment.success.checking') || '正在确认您的订阅状态...'}
              </p>
            </div>
            ) : timedOut ? (
              <div className="text-center py-8">
                <p className="text-gray-700 mb-4">
                  {t('payment.success.delayed') || '订阅确认可能稍有延迟，请稍后刷新页面或联系客服。'}
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={() => window.location.reload()}
                >
                  {t('payment.success.retry') || '重新检查'}
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                  {t('payment.success.activated') || '✨ 您已获得以下权益'}
                </h2>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {t('payment.success.benefit1') || '解锁所有高级教程'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {t('payment.success.benefit1_desc') || '访问所有分类下的付费课程内容'}
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {t('payment.success.benefit2') || '提交作业并获得反馈'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {t('payment.success.benefit2_desc') || '练习题可提交并查看结果'}
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {t('payment.success.benefit3') || '90 天有效期'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {t('payment.success.benefit3_desc') || '从今天起畅享 3 个月学习时光'}
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-900 text-center">
                    💡 {t('payment.success.tip') || '建议按照推荐的学习路径循序渐进，坚持每天练习效果最佳！'}
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    onClick={handleGoToLearning}
                  >
                    {t('payment.success.start_learning') || '开始学习'} ({countdown}s)
                  </Button>
                </div>

                {customerId && (
                  <div className="mt-4 text-center">
                    <CreemPortal
                      customerId={customerId}
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {t('pricing.manage_subscription') || '管理订阅'}
                    </CreemPortal>
                  </div>
                )}
              </>
            )}
          </div>

          {/* 帮助信息 */}
          <div className="text-center text-sm text-gray-500">
            <p>
              {t('payment.success.help') || '如有任何问题，请联系客服'}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
