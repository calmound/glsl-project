import { Metadata } from 'next';
import { getValidLocale } from '../../../lib/i18n';
import { getTranslationFunction } from '../../../lib/translations';
import PlaygroundClient from './playground-client';

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
      ? 'GLSL Playground - 在线着色器编辑器'
      : 'GLSL Playground - Online Shader Editor';
  const description =
    locale === 'zh'
      ? '免费的在线 GLSL 着色器编辑器。支持实时预览、Fragment/Vertex Shader 编辑、自定义 Uniforms、性能监控和截图导出。无需安装，立即开始创作你的着色器作品。'
      : 'Free online GLSL shader editor. Features real-time preview, Fragment/Vertex Shader editing, custom Uniforms, performance monitoring, and screenshot export. No installation required, start creating your shader art immediately.';

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';

  return {
    title,
    description,
    keywords:
      locale === 'zh'
        ? 'GLSL编辑器, 着色器在线编辑, WebGL编辑器, Fragment Shader, Vertex Shader, 在线代码编辑器, 实时预览'
        : 'GLSL editor, shader online editor, WebGL editor, Fragment Shader, Vertex Shader, online code editor, live preview',
    openGraph: {
      title,
      description,
      type: 'website',
      url: locale === 'en' ? `${baseUrl}/playground` : `${baseUrl}/${locale}/playground`,
      images: [`${baseUrl}/og-image.png`],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.png`],
    },
    alternates: {
      canonical: locale === 'en' ? '/playground' : `/${locale}/playground`,
      languages: {
        en: '/playground',
        zh: '/zh/playground',
      },
    },
  };
}

export default async function PlaygroundPage({ params }: PlaygroundPageProps) {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);

  return <PlaygroundClient locale={locale} />;
}
