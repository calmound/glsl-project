import { Metadata } from 'next';
import { getValidLocale } from '../../../lib/i18n';
import PricingClient from './pricing-client';

interface PricingPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export async function generateMetadata({ params }: PricingPageProps): Promise<Metadata> {
    const { locale: localeParam } = await params;
    const locale = getValidLocale(localeParam);

    const title =
        locale === 'zh' ? '订阅 Pro 会员 - Shader Learn' : 'Subscribe to Pro - Shader Learn';
    const description =
        locale === 'zh'
            ? '解锁所有 GLSL 教程内容，享受完整的学习体验。3个月仅需 $9.99！'
            : 'Unlock all GLSL tutorial content and enjoy the complete learning experience. Only $9.99 for 3 months!';

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';

    return {
        title,
        description,
        keywords:
            locale === 'zh'
                ? 'GLSL订阅, Pro会员, 付费教程, Shader学习, WebGL教程, 图形编程'
                : 'GLSL subscription, Pro membership, premium tutorials, shader learning, WebGL tutorials, graphics programming',
        authors: [{ name: 'Shader Learn' }],
        creator: 'Shader Learn',
        publisher: 'Shader Learn',
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        openGraph: {
            title,
            description,
            type: 'website',
            url: locale === 'en' ? `${baseUrl}/pricing` : `${baseUrl}/${locale}/pricing`,
            siteName: 'Shader Learn',
            images: [
                {
                    url: `${baseUrl}/og-image.png`,
                    width: 1200,
                    height: 630,
                    alt: 'Shader Learn Pro Subscription',
                },
            ],
            locale: locale === 'zh' ? 'zh_CN' : 'en_US',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [`${baseUrl}/og-image.png`],
            creator: '@ShaderLearn',
            site: '@ShaderLearn',
        },
        alternates: {
            canonical: locale === 'en' ? '/pricing' : `/${locale}/pricing`,
            languages: {
                'en': '/pricing',
                'zh-CN': '/zh/pricing',
                'x-default': '/pricing',
            },
        },
        category: 'Education',
    };
}

export default async function PricingPage({ params }: PricingPageProps) {
    const { locale: localeParam } = await params;
    const locale = getValidLocale(localeParam);

    return <PricingClient locale={locale} />;
}
