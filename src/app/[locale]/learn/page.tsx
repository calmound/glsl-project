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
  
  return {
    title: getTranslationFunction(locale)('learn.title') + ' - ' + getTranslationFunction(locale)('header.title'),
    description: getTranslationFunction(locale)('learn.description'),
    alternates: {
      languages: {
        'zh': '/zh/learn',
        'en': '/en/learn',
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