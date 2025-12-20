'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { addLocaleToPathname } from '../../lib/i18n';

interface SubscriptionPromptProps {
    onClose?: () => void;
    title?: string;
    description?: string;
}

export default function SubscriptionPrompt({ onClose, title, description }: SubscriptionPromptProps) {
    const { t, language } = useLanguage();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        const existingRoot = document.querySelector('[data-subscription-prompt-root="true"]');
        if (existingRoot instanceof HTMLElement) {
            setPortalRoot(existingRoot);
            return;
        }

        const root = document.createElement('div');
        root.setAttribute('data-subscription-prompt-root', 'true');
        document.body.appendChild(root);
        setPortalRoot(root);
    }, []);

    const handleSubscribe = () => {
        router.push(addLocaleToPathname('/pricing', language));
    };

    if (!mounted || !portalRoot) return null;

    const modalContent = (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100">

                {/* Header with Pro Badge */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2-1-2-1-2 1 2 1zm0-3.5L6.5 7 12 9.5 17.5 7 12 5.5z" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 relative z-10">
                        {title || t('pricing.title') || '升级到 Pro 会员'}
                    </h3>
                    <p className="text-blue-100 text-sm relative z-10">
                        {description || t('pricing.subtitle') || '解锁所有高级教程，开启完整学习之旅'}
                    </p>

                    {onClose && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center text-gray-700">
                            <div className="bg-green-100 p-1.5 rounded-full mr-3 text-green-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <span>{t('pricing.features.all_access') || '解锁所有高级教程'}</span>
                        </li>
                        <li className="flex items-center text-gray-700">
                            <div className="bg-green-100 p-1.5 rounded-full mr-3 text-green-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <span>{t('pricing.features.feedback') || '提交作业获得即时反馈'}</span>
                        </li>
                        <li className="flex items-center text-gray-700">
                            <div className="bg-green-100 p-1.5 rounded-full mr-3 text-green-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <span>{t('pricing.features.tracking') || '学习进度跟踪与成就系统'}</span>
                        </li>
                    </ul>

                    <div className="space-y-3">
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 shadow-lg shadow-blue-200"
                            onClick={handleSubscribe}
                        >
                            {t('pricing.cta') || '立即订阅'} - {t('pricing.price') || '$9.99'}
                        </Button>

                        <p className="text-center text-xs text-gray-400">
                            {t('pricing.secure_payment') || '安全支付 · 即时生效'}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 text-center">
                    <p className="text-sm text-gray-500">
                        {t('pricing.plan_desc') || '一次付费，畅享 90 天所有高级权益'}
                    </p>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, portalRoot);
}
