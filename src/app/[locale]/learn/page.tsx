import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MainLayout from '../../../components/layout/main-layout';
import LearnPageClient from './learn-client';
import LearnStructuredData from '../../../components/seo/learn-structured-data';
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
      ? 'GLSL tutorials, WebGL lessons, shader programming course, graphics programming learning, fragment shader tutorial, vertex shader course, GPU programming lessons, shader basics, advanced shader techniques, WebGL education, interactive shader learning, GLSL examples, shader exercises'
      : 'GLSL教程, WebGL课程, 着色器编程学习, 图形编程教学, 片段着色器教程, 顶点着色器课程, GPU编程课程, 着色器基础, 高级着色器技术, WebGL教育, 交互式着色器学习, GLSL示例, 着色器练习',
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
      url,
      siteName: 'Shader Learn',
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
      creator: '@ShaderLearn',
      site: '@ShaderLearn',
    },
    alternates: {
      canonical: locale === 'en' ? '/learn' : `/${locale}/learn`,
      languages: {
        'en': '/learn',
        'zh-CN': '/zh/learn',
        'x-default': '/learn',
      },
    },
    category: 'Education',
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
      <LearnStructuredData locale={locale as 'en' | 'zh'} tutorials={tutorials} />
      <LearnPageClient
        initialTutorials={tutorials}
        locale={locale}
      />
    </MainLayout>
  );
}

// 生成静态参数
export function generateStaticParams() {
  return [{ locale: 'zh' }];
}
