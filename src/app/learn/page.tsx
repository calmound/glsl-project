import { Metadata } from 'next';
import { getTranslationFunction } from '../../lib/translations';
import { getTutorials } from '../../lib/tutorials-server';
import MainLayout from '../../components/layout/main-layout';
import LearnPageClient from '../[locale]/learn/learn-client';

// 生成元数据
export async function generateMetadata(): Promise<Metadata> {
  const t = getTranslationFunction('en');
  
  const title = t('learn.title');
  const description = t('learn.description');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';
  
  return {
    title,
    description,
    keywords: 'GLSL tutorial, WebGL programming, shader learning, graphics programming, fragment shader, vertex shader, OpenGL',
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}/learn`,
      images: [{
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: title
      }],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.png`],
    },
    alternates: {
      canonical: '/learn',
      languages: {
        'en': '/learn',
        'zh': '/zh/learn',
      },
    },
  };
}

export default async function LearnPage() {
  // 服务端获取教程数据，使用默认语言 'en'
  const tutorials = await getTutorials('en');
  
  return (
    <MainLayout>
      <LearnPageClient 
        initialTutorials={tutorials}
        locale="en"
      />
    </MainLayout>
  );
}
