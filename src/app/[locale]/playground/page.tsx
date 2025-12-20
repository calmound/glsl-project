import { Metadata } from 'next';
import { getValidLocale } from '../../../lib/i18n';
import PlaygroundClient from './playground-client';
import PlaygroundStructuredData from '../../../components/seo/playground-structured-data';
import MainLayout from '../../../components/layout/main-layout';

interface PlaygroundPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PlaygroundPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);

  const title =
    locale === 'zh'
      ? 'GLSL Playground - 免费在线 WebGL 着色器编辑器 | Shader 代码实时预览'
      : 'GLSL Playground - Free Online WebGL Shader Editor | Live Preview';
  const description =
    locale === 'zh'
      ? '专业的在线 GLSL 着色器编辑器，支持 Fragment Shader 和 Vertex Shader 实时编辑。内置纹理上传、时间控制、性能监控、代码自动补全。适合 WebGL 开发者、图形编程学习者、Shader 艺术创作者。免费使用，无需注册，支持截图导出。'
      : 'Professional online GLSL shader editor with real-time Fragment and Vertex Shader editing. Built-in texture upload, time control, performance monitoring, and code autocomplete. Perfect for WebGL developers, graphics programming learners, and shader artists. Free to use, no registration required, screenshot export supported.';

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';

  return {
    title,
    description,
    keywords:
      locale === 'zh'
        ? 'GLSL编辑器, WebGL编辑器, 在线着色器编辑, Fragment Shader, Vertex Shader, Shader代码, 图形编程, GPU编程, 着色器开发, 实时预览, 代码编辑器, Three.js, 纹理编辑, 着色器艺术, 创意编程, 可视化编程, GLSL Playground, Shadertoy, WebGL工具'
        : 'GLSL editor, WebGL editor, online shader editor, Fragment Shader, Vertex Shader, shader code, graphics programming, GPU programming, shader development, live preview, code editor, Three.js, texture editor, shader art, creative coding, visual programming, GLSL Playground, Shadertoy, WebGL tools',
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
      url: locale === 'en' ? `${baseUrl}/playground` : `${baseUrl}/${locale}/playground`,
      siteName: 'Shader Learn',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'GLSL Playground - Online Shader Editor',
        },
      ],
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
      canonical: locale === 'en' ? '/playground' : `/${locale}/playground`,
      languages: {
        'en': '/playground',
        'zh-CN': '/zh/playground',
        'x-default': '/playground',
      },
    },
    category: 'Technology',
  };
}

export default async function PlaygroundPage({ params }: PlaygroundPageProps) {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);

  return (
    <MainLayout>
      <PlaygroundStructuredData locale={locale as 'en' | 'zh'} />
      <PlaygroundClient locale={locale} />
    </MainLayout>
  );
}
