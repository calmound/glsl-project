import { Metadata } from 'next';
import { getValidLocale } from '../../lib/i18n';
import { getTranslationFunction } from '../../lib/translations';
import HomePageClient from './home-client';

interface HomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

// 生成元数据
export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);
  const t = getTranslationFunction(locale);
  
  const title = t('home.title');
  const description = t('home.description');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';
  
  return {
    title,
    description,
    keywords: locale === 'en' 
      ? 'GLSL tutorial, WebGL programming, shader learning, graphics programming, fragment shader, vertex shader'
      : 'GLSL教程, WebGL编程, 着色器学习, 图形编程, 片段着色器, 顶点着色器',
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}/${locale}`,
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
      canonical: locale === 'en' ? '/' : `/${locale}`,
      languages: {
        'en': '/',
        'zh': '/zh',
      },
    },
  };
}

// 生成静态参数
export async function generateStaticParams() {
  return [
    { locale: 'zh' },
    { locale: 'en' },
  ];
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);
  
  return <HomePageClient locale={locale} />;
}