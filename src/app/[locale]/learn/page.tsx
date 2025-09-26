import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MainLayout from '../../../components/layout/main-layout';
import LearnPageClient from './learn-client';
import { getValidLocale, type Locale, isValidLocale } from '../../../lib/i18n';
import { getTranslationFunction } from '../../../lib/translations';
import { getTutorials } from '../../../lib/tutorials-server';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

// 生成元数据
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam) as Locale;
  const t = getTranslationFunction(locale);
  
  const title = t('learn.title');
  const description = t('learn.description');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';
  
  const url = locale === 'en' ? `${baseUrl}/learn` : `${baseUrl}/zh/learn`;

  return {
    title: `${title} - ${t('header.title')}`,
    description,
    keywords: locale === 'en' 
      ? 'GLSL tutorials, WebGL lessons, shader programming course, graphics programming learning'
      : 'GLSL教程, WebGL课程, 着色器编程学习, 图形编程教学',
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      images: [{
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: title
      }],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.png`],
    },
    alternates: {
      canonical: locale === 'en' ? '/learn' : `/${locale}/learn`,
      languages: {
        'en': '/learn',
        'zh': '/zh/learn',
      },
    },
  };
}

// 服务端组件
export default async function LearnPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  
  // 验证语言参数
  if (!isValidLocale(localeParam)) {
    notFound();
  }
  
  const locale = localeParam as Locale;
  
  // 服务端获取教程数据
  const tutorials = await getTutorials(locale);
  
  return (
    <MainLayout>
      <LearnPageClient 
        initialTutorials={tutorials}
        locale={locale}
      />
    </MainLayout>
  );
}

// 生成静态参数
export function generateStaticParams() {
  return [
    { locale: 'zh' },
    { locale: 'en' },
  ];
}
