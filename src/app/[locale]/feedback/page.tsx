import { Metadata } from 'next';
import { getValidLocale } from '@/lib/i18n';
import { getTranslationFunction } from '@/lib/translations';
import FeedbackClient from './feedback-client';

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
      ? ['反馈', '用户意见', '建议', 'Bug反馈', 'GLSL学习']
      : ['feedback', 'user feedback', 'suggestions', 'bug report', 'GLSL learning'],
    openGraph: {
      title: `${title} - ${t('site.name')}`,
      description: description,
      url: `${baseUrl}/${validLocale === 'en' ? '' : validLocale + '/'}feedback`,
      siteName: t('site.name'),
      locale: validLocale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${title} - ${t('site.name')}`,
      description: description,
    },
  };
}

export default async function FeedbackPage({ params }: FeedbackPageProps) {
  const { locale } = await params;
  const validLocale = getValidLocale(locale);

  return <FeedbackClient locale={validLocale} />;
}
