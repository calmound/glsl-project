import type { Metadata } from 'next';
import { getTranslationFunction } from '../lib/translations';
import HomePageClient from './[locale]/home-client';

// 生成元数据
export async function generateMetadata(): Promise<Metadata> {
  const t = getTranslationFunction('en');
  
  const title = t('home.title');
  const description = t('home.description');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';
  
  return {
    title,
    description,
    keywords: 'GLSL tutorial, WebGL programming, shader learning, graphics programming, fragment shader, vertex shader',
    openGraph: {
      title,
      description,
      type: 'website',
      url: baseUrl,
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
      canonical: '/',
      languages: {
        'en': '/',
        'zh': '/zh',
      },
    },
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
  };
}

export default function HomePage() {
  return <HomePageClient locale="en" />;
}