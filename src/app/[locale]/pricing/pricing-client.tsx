'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CreemCheckout } from '@creem_io/nextjs';
import MainLayout from '../../../components/layout/main-layout';
import { useLanguage } from '../../../contexts/LanguageContext';
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

    const productId3m = process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID;
    const productId1y =
        process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_YEARLY || 'prod_3MotYDNXslvvlqsbk3m3Uw';

    const plans = [
        {
            key: 'pro_3m',
            productId: productId3m,
            title: t('pricing.plan_3m_title') || 'Pro · 3 个月',
            price: t('pricing.plan_3m_price') || '$9.99',
            period: t('pricing.period_3m') || '/ 3个月',
            description:
                t('pricing.plan_3m_desc') ||
                '适合所有阶段的学习者，一次付费，畅享 90 天所有高级权益。',
            highlight: true,
        },
        {
            key: 'pro_1y',
            productId: productId1y,
            title: t('pricing.plan_1y_title') || 'Pro · 1 年',
            price: t('pricing.plan_1y_price') || '$29.99',
            period: t('pricing.period_1y') || '/ 1年',
            description:
                t('pricing.plan_1y_desc') ||
                '年度订阅更划算，全年访问所有高级课程与练习。',
            highlight: false,
        },
    ];

    const isProActive =
        !!entitlement &&
        entitlement.status === 'active' &&
        new Date(entitlement.end_date) > new Date();
    const rawPlanType = entitlement?.plan_type;
    const normalizedPlanType = rawPlanType === 'pro_90days' ? 'pro_3m' : rawPlanType;
    const activePlanKey = isProActive ? normalizedPlanType : null;
    const activePlanLabel = plans.find(plan => plan.key === activePlanKey)?.title;
    const activePlanEnd = entitlement?.end_date
        ? new Date(entitlement.end_date).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')
        : null;

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
        {
            question: t('pricing.faq.team.q') || '有团队版吗？',
            answer: t('pricing.faq.team.a') || '如需团队采购，请通过邮件联系我们获取企业版报价。',
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
                                                    onClick={() => router.push(`/${locale}/signin?redirect=/pricing`)}
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
                                            ) : plan.productId ? (
                                                <CreemCheckout
                                                    productId={plan.productId}
                                                    referenceId={user.id}
                                                    successUrl={`/${locale}/payment/success`}
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
                                                        {t('pricing.cta') || '立即订阅'}
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

                                            <p className="text-center text-xs text-gray-400 mt-4">
                                                {user ? (
                                                    t('pricing.secure_payment') || '安全支付 · 即时生效'
                                                ) : (
                                                    t('pricing.login_required') || '需要先登录才能订阅'
                                                )}
                                            </p>
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
