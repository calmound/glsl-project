'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreemCheckout } from '@creem_io/nextjs';
import MainLayout from '../../../components/layout/main-layout';
import { useLanguage } from '../../../contexts/LanguageContext';
import { addLocaleToPathname } from '../../../lib/i18n';
import { useAuth } from '../../../contexts/AuthContext';
import { Locale } from '../../../lib/i18n';
import { Button, buttonVariants } from '@/components/ui/button';
import Card from '@/components/ui/card';

interface PricingClientProps {
    locale: Locale;
}

export default function PricingClient({ locale }: PricingClientProps) {
    const { t } = useLanguage();
    const router = useRouter();
    const { user, entitlement } = useAuth();
    const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

    const productId3m = process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID;
    const productId1y =
        process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_YEARLY || 'prod_3MotYDNXslvvlqsbk3m3Uw';

    // 根据 locale 设置不同的价格和支付方式
    // 从环境变量读取中文站价格（方便测试）
    const price3Months = parseFloat(process.env.NEXT_PUBLIC_ZPAY_PRICE_3MONTHS || '49');
    const price1Year = parseFloat(process.env.NEXT_PUBLIC_ZPAY_PRICE_1YEAR || '149');

    const plans = locale === 'zh'
        ? [
            // 中文站 - ZPAY 支付
            {
                key: 'pro_3months',
                productId: null, // 中文站不使用 Creem
                title: 'Pro · 3 个月',
                price: `¥${price3Months.toFixed(2)}`,
                period: '/ 3个月',
                description: '适合所有阶段的学习者，一次付费，畅享 90 天所有高级权益。',
                highlight: true,
            },
            {
                key: 'pro_1year',
                productId: null,
                title: 'Pro · 1 年',
                price: `¥${price1Year.toFixed(2)}`,
                period: '/ 1年',
                description: `年度会员更划算，全年访问所有高级课程与练习。${price1Year >= 100 ? '月均仅 ¥' + (price1Year / 12).toFixed(1) + '！' : ''}`,
                highlight: false,
            },
        ]
        : [
            // 英文站 - Creem 支付
            {
                key: 'pro_3m',
                productId: productId3m,
                title: 'Pro · 3 Months',
                price: '$9.99',
                period: '/ 3 months',
                description: 'One-time payment for 90 days of premium access.',
                highlight: true,
            },
            {
                key: 'pro_1y',
                productId: productId1y,
                title: 'Pro · 1 Year',
                price: '$29.99',
                period: '/ 1 year',
                description: 'Best value for a full year of premium access.',
                highlight: false,
            },
        ];

    const isProActive =
        !!entitlement &&
        entitlement.status === 'active' &&
        new Date(entitlement.end_date) > new Date();
    const rawPlanType = entitlement?.plan_type;
    // 统一映射套餐类型
    const normalizedPlanType =
        rawPlanType === 'pro_90days' ? (locale === 'zh' ? 'pro_3months' : 'pro_3m') :
        rawPlanType === 'pro_3months' ? (locale === 'zh' ? 'pro_3months' : 'pro_3m') :
        rawPlanType === 'pro_1year' ? 'pro_1year' :
        rawPlanType === 'pro_3m' ? (locale === 'zh' ? 'pro_3months' : 'pro_3m') :
        rawPlanType;
    const activePlanKey = isProActive ? normalizedPlanType : null;
    const activePlanLabel = plans.find(plan => plan.key === activePlanKey)?.title;
    const activePlanEnd = entitlement?.end_date
        ? new Date(entitlement.end_date).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')
        : null;

    // ZPAY 支付处理函数（仅中文站）
    const handleZPayCheckout = async (planKey: string) => {
        if (!user) return;

        setCheckoutLoading(planKey);
        try {
            const response = await fetch('/api/checkout-zpay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: planKey }),
            });

            const data = await response.json();

            if (data.success && data.checkout_url) {
                // 跳转到 ZPAY 支付页面
                window.location.href = data.checkout_url;
            } else {
                alert(data.message || '创建支付失败，请稍后重试');
                setCheckoutLoading(null);
            }
        } catch (error) {
            console.error('ZPAY checkout error:', error);
            alert('网络错误，请稍后重试');
            setCheckoutLoading(null);
        }
    };

    const features = [
        {
            icon: (
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
            text: t('pricing.features.all_access') || '解锁所有高级教程',
        },
        {
            icon: (
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
            text: t('pricing.features.feedback') || '提交作业获得即时反馈',
        },
        {
            icon: (
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
            text: t('pricing.features.tracking') || '学习进度跟踪与成就系统',
        },
        {
            icon: (
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
            text: t('pricing.features.new_content') || '优先体验新课程内容',
        },
        {
            icon: (
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
            text: t('pricing.features.support') || '优先获得技术支持',
        },
    ];

    const faqs = [
        {
            question: t('pricing.faq.refund.q') || '支持退款吗？',
            answer: t('pricing.faq.refund.a') || '由于数字产品的特殊性，我们原则上不支持退款。建议您先体验免费的基础教程。',
        },
        {
            question: t('pricing.faq.cancel.q') || '如何取消订阅？',
            answer: t('pricing.faq.cancel.a') || '目前是一次性付费 3 个月，无需手动取消，到期后自动结束。',
        },
    ];

    return (
        <MainLayout>
            <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen pb-20">
                {/* Header */}
                <div className="text-center py-20 px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        {t('pricing.title') || '升级到 Pro 会员'}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        {t('pricing.subtitle') || '以极低的价格解锁所有高级内容，开启您的图形编程进阶之旅'}
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="container mx-auto px-4 mb-20">
                    <div className="max-w-5xl mx-auto mb-6 text-center">
                        {user && isProActive ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm text-green-700">
                                    <span>✅</span>
                                    <span>{t('pricing.pro_active') || '您已开通 Pro 订阅'}</span>
                                    {activePlanLabel && (
                                        <span className="font-semibold">{activePlanLabel}</span>
                                    )}
                                    {activePlanEnd && (
                                        <span className="text-green-600">
                                            {t('pricing.current_until') || '有效期至'} {activePlanEnd}
                                        </span>
                                    )}
                                </div>
                                {entitlement?.creem_customer_id && (
                                    <Button
                                        variant="outline"
                                        href={`/portal?customerId=${entitlement.creem_customer_id}`}
                                    >
                                        {t('pricing.manage_subscription') || '管理订阅'}
                                    </Button>
                                )}
                                <p className="text-xs text-gray-500">
                                    {t('pricing.manage_hint') || '如需更改方案或取消订阅，请前往管理订阅。'}
                                </p>
                            </div>
                        ) : user ? (
                            <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600">
                                {t('pricing.pro_inactive') || '当前为免费账号'}
                            </div>
                        ) : null}
                    </div>
                    <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
                        {plans.map(plan => (
                            <div
                                key={plan.key}
                                className="transform hover:-translate-y-1 transition-transform duration-300"
                            >
                                <Card
                                    className={`shadow-2xl overflow-hidden relative h-full ${
                                        isProActive && activePlanKey === plan.key
                                            ? 'border-2 border-green-500'
                                            : plan.highlight && !isProActive
                                                ? 'border-2 border-blue-500'
                                                : 'border border-gray-200'
                                    }`}
                                >
                                    {plan.highlight && !isProActive && (
                                        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                                            PRO VALUE
                                        </div>
                                    )}

                                    {isProActive && activePlanKey === plan.key && (
                                        <div className="absolute top-0 left-0 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg uppercase tracking-wider">
                                            {t('pricing.current_badge') || '当前方案'}
                                        </div>
                                    )}

                                    <div className="p-8 md:p-10 flex h-full flex-col">
                                        <div className="text-sm uppercase tracking-widest text-gray-400 text-center mb-3">
                                            {plan.title}
                                        </div>
                                        <div className="flex justify-center items-baseline mb-8">
                                            <span className="text-5xl font-extrabold text-gray-900 tracking-tight">
                                                {plan.price}
                                            </span>
                                            <span className="text-xl text-gray-500 ml-2">{plan.period}</span>
                                        </div>

                                        <p className="text-center text-gray-600 mb-8 border-b border-gray-100 pb-8 min-h-[24px] whitespace-nowrap overflow-hidden text-ellipsis">
                                            {plan.description}
                                        </p>

                                        <ul className="space-y-4 mb-8 text-left">
                                            {features.map((feature, index) => (
                                                <li key={index} className="flex items-start">
                                                    <div className="flex-shrink-0 mt-1 mr-3">
                                                        {feature.icon}
                                                    </div>
                                                    <span className="text-gray-700 font-medium">{feature.text}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-auto">
                                            {!user ? (
                                                <Button
                                                    size="lg"
                                                    className="w-full text-lg h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                                                    onClick={() =>
                                                        router.push(
                                                            `/signin?redirect=${encodeURIComponent(
                                                                addLocaleToPathname('/pricing', locale)
                                                            )}`
                                                        )
                                                    }
                                                >
                                                    {t('pricing.login_required') || '需要先登录才能订阅'}
                                                </Button>
                                            ) : isProActive ? (
                                                <Button
                                                    size="lg"
                                                    className="w-full text-lg h-14 bg-gray-200 text-gray-500 cursor-not-allowed"
                                                    disabled
                                                >
                                                    {activePlanKey === plan.key
                                                        ? t('pricing.current_button') || '当前方案'
                                                        : t('pricing.change_in_portal') || '请在管理订阅中更改'}
                                                </Button>
                                            ) : locale === 'zh' ? (
                                                // 中文站 - ZPAY 微信支付
                                                <Button
                                                    size="lg"
                                                    className="w-full text-lg h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
                                                    onClick={() => handleZPayCheckout(plan.key)}
                                                    disabled={checkoutLoading === plan.key}
                                                >
                                                    {checkoutLoading === plan.key ? (
                                                        <span className="flex items-center gap-2">
                                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            跳转中...
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center justify-center gap-2">
                                                            💚 微信支付
                                                        </span>
                                                    )}
                                                </Button>
                                            ) : plan.productId ? (
                                                // 英文站 - Creem 信用卡支付
                                                <CreemCheckout
                                                    productId={plan.productId}
                                                    referenceId={user.id}
                                                    successUrl={addLocaleToPathname('/payment/success', locale)}
                                                    metadata={{
                                                        plan: plan.key,
                                                        userEmail: user.email || '',
                                                        source: 'web',
                                                    }}
                                                >
                                                    <span
                                                        className={buttonVariants({
                                                            size: 'lg',
                                                            className:
                                                                'w-full text-lg h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg inline-flex justify-center',
                                                        })}
                                                    >
                                                        {t('pricing.cta') || 'Subscribe Now'}
                                                    </span>
                                                </CreemCheckout>
                                            ) : (
                                                <Button
                                                    size="lg"
                                                    className="w-full text-lg h-14 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg opacity-60 cursor-not-allowed"
                                                    disabled
                                                >
                                                    {t('pricing.unavailable') || '支付暂不可用'}
                                                </Button>
                                            )}

                                            <div className="text-center mt-4 space-y-1">
                                                <p className="text-xs text-gray-400">
                                                    {user ? (
                                                        locale === 'zh' ? (
                                                            '🔒 微信安全支付 · 一次性购买 · 即时生效'
                                                        ) : (
                                                            '🔒 Secure payment · Auto-renewable · Instant access'
                                                        )
                                                    ) : (
                                                        t('pricing.login_required') || '需要先登录才能订阅'
                                                    )}
                                                </p>
                                                {user && locale === 'zh' && (
                                                    <>
                                                        <p className="text-xs text-amber-600">
                                                            💡 如无法打开支付页面，请尝试关闭网络代理
                                                        </p>
                                                        <p className="text-xs text-blue-600">
                                                            📧 如付费后未生效，请邮件联系，24小时内解决
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        {t('pricing.faq.title') || '常见问题'}
                    </h2>
                    <div className="space-y-8">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
                                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
