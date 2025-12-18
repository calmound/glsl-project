import { Metadata } from 'next';
import HomePageClient from '@/app/[locale]/home-client';
import HomeStructuredData from '@/components/seo/home-structured-data';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';

export const metadata: Metadata = {
  title: 'Learn GLSL Shaders - Interactive WebGL Tutorial Platform | Shader Programming Course',
  description:
    'Master GLSL shader programming with interactive tutorials, live code editor, and hands-on exercises. Learn fragment shaders, vertex shaders, WebGL graphics programming from beginner to advanced. Free online courses with real-time preview and bilingual support (English/中文).',
  keywords:
    'GLSL tutorial, WebGL programming, shader learning, fragment shader, vertex shader, graphics programming, GPU programming, shader development, Three.js, shader editor, interactive tutorials, learn shaders, GLSL course, WebGL lessons, shader art, creative coding, computer graphics',
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
    title: 'Learn GLSL Shaders - Interactive WebGL Tutorial Platform',
    description:
      'Master GLSL shader programming with interactive tutorials, live code editor, and hands-on exercises. Free online courses with real-time preview.',
    type: 'website',
    url: baseUrl,
    siteName: 'Shader Learn',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Shader Learn - Interactive GLSL Learning Platform',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learn GLSL Shaders - Interactive WebGL Tutorial Platform',
    description:
      'Master GLSL shader programming with interactive tutorials and live code editor. Free online courses.',
    images: [`${baseUrl}/og-image.png`],
    creator: '@ShaderLearn',
    site: '@ShaderLearn',
  },
  alternates: {
    canonical: '/',
    languages: {
      'en': '/',
      'zh-CN': '/zh',
      'x-default': '/',
    },
  },
  category: 'Education',
};

export default function RootPage() {
  // Serve English content at the root without redirect (SEO-friendly)
  return (
    <>
      <HomeStructuredData locale="en" />
      <HomePageClient locale="en" />
    </>
  );
}
