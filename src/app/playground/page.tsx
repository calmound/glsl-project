import { Metadata } from 'next';
import { getTranslationFunction } from '@/lib/translations';
import PlaygroundClient from '@/app/[locale]/playground/playground-client';
import MainLayout from '@/components/layout/main-layout';

// English Playground page at /playground (default locale, no redirect)
export async function generateMetadata(): Promise<Metadata> {
  const locale = 'en' as const;
  const t = getTranslationFunction(locale);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';

  const title = 'GLSL Playground - Online Shader Editor';
  const description =
    'Free online GLSL shader editor. Features real-time preview, Fragment/Vertex Shader editing, custom Uniforms, performance monitoring, and screenshot export. No installation required, start creating your shader art immediately.';

  return {
    title: `${title} - ${t('header.title')}`,
    description,
    keywords:
      'GLSL editor, shader online editor, WebGL editor, Fragment Shader, Vertex Shader, online code editor, live preview',
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}/playground`,
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.png`],
    },
    alternates: {
      canonical: '/playground',
      languages: {
        en: '/playground',
        zh: '/zh/playground',
      },
    },
  };
}

export default function PlaygroundPage() {
  return (
    <MainLayout>
      <PlaygroundClient locale="en" />
    </MainLayout>
  );
}
