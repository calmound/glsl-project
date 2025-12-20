import { Metadata } from 'next';
import { getValidLocale } from '@/lib/i18n';
import { getTranslationFunction } from '@/lib/translations';
import FeedbackClient from './feedback-client';
import MainLayout from '../../../components/layout/main-layout';

interface FeedbackPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: FeedbackPageProps): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = getValidLocale(locale);
  const t = getTranslationFunction(validLocale);

  const title = t('feedback.title');
  const description = t('feedback.subtitle');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';

  return {
    title: `${title} - ${t('site.name')}`,
    description: description,
    keywords: validLocale === 'zh'
      ? '反馈, 用户意见, 建议, Bug反馈, GLSL学习, 问题报告, 功能建议, 用户体验反馈'
      : 'feedback, user feedback, suggestions, bug report, GLSL learning, issue report, feature request, user experience feedback',
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
      title: `${title} - ${t('site.name')}`,
      description: description,
      url: `${baseUrl}/${validLocale === 'en' ? '' : validLocale + '/'}feedback`,
      siteName: t('site.name'),
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Shader Learn Feedback',
        },
      ],
      locale: validLocale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - ${t('site.name')}`,
      description: description,
      images: [`${baseUrl}/og-image.png`],
      creator: '@ShaderLearn',
      site: '@ShaderLearn',
    },
    alternates: {
      canonical: validLocale === 'en' ? '/feedback' : `/${validLocale}/feedback`,
      languages: {
        'en': '/feedback',
        'zh-CN': '/zh/feedback',
        'x-default': '/feedback',
      },
    },
    category: 'Education',
  };
}

export default async function FeedbackPage({ params }: FeedbackPageProps) {
  const { locale } = await params;
  const validLocale = getValidLocale(locale);

  return (
    <MainLayout>
      <FeedbackClient locale={validLocale} />
    </MainLayout>
  );
}
