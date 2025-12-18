import { Metadata } from 'next';
import { getValidLocale } from '../../lib/i18n';
import { getTranslationFunction } from '../../lib/translations';
import HomePageClient from './home-client';
import HomeStructuredData from '../../components/seo/home-structured-data';

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
  const url = locale === 'en' ? `${baseUrl}` : `${baseUrl}/${locale}`;
  
  return {
    title,
    description,
    keywords: locale === 'en'
      ? 'GLSL tutorial, WebGL programming, shader learning, fragment shader, vertex shader, graphics programming, GPU programming, shader development, Three.js, shader editor, interactive tutorials, learn shaders, GLSL course, WebGL lessons, shader art, creative coding, computer graphics'
      : 'GLSL教程, WebGL编程, 着色器学习, 片段着色器, 顶点着色器, 图形编程, GPU编程, 着色器开发, Three.js, 着色器编辑器, 交互式教程, 学习着色器, GLSL课程, WebGL课程, 着色器艺术, 创意编程, 计算机图形学',
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
      canonical: locale === 'en' ? '/' : `/${locale}`,
      languages: {
        'en': '/',
        'zh-CN': '/zh',
        'x-default': '/',
      },
    },
    category: 'Education',
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

  return (
    <>
      <HomeStructuredData locale={locale as 'en' | 'zh'} />
      <HomePageClient locale={locale} />
    </>
  );
}
