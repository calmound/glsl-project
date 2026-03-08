import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { getTranslationFunction } from '@/lib/translations';
import { buildLocaleAlternatesFor } from '@/lib/seo';
import { getBaseUrl, indexableRobots } from '@/lib/metadata-common';

const baseUrl = getBaseUrl();

export function buildHomeMetadata(locale: Locale, useLocalizedCopy = true): Metadata {
  if (!useLocalizedCopy && locale === 'en') {
    return {
      title:
        'Learn GLSL Shaders - Interactive WebGL Tutorial Platform | Shader Programming Course',
      description:
        'Master GLSL shader programming with interactive tutorials, live code editor, and hands-on exercises. Learn fragment shaders, vertex shaders, WebGL graphics programming from beginner to advanced. Free online courses with real-time preview and bilingual support (English/中文).',
      keywords:
        'GLSL tutorial, WebGL programming, shader learning, fragment shader, vertex shader, graphics programming, GPU programming, shader development, Three.js, shader editor, interactive tutorials, learn shaders, GLSL course, WebGL lessons, shader art, creative coding, computer graphics',
      authors: [{ name: 'Shader Learn' }],
      creator: 'Shader Learn',
      publisher: 'Shader Learn',
      robots: indexableRobots,
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
      alternates: buildLocaleAlternatesFor(locale, '/'),
      category: 'Education',
    };
  }

  const t = getTranslationFunction(locale);
  const title = t('home.title');
  const description = t('home.description');
  const url = locale === 'en' ? `${baseUrl}` : `${baseUrl}/${locale}`;

  return {
    title,
    description,
    keywords:
      locale === 'en'
        ? 'GLSL tutorial, WebGL programming, shader learning, fragment shader, vertex shader, graphics programming, GPU programming, shader development, Three.js, shader editor, interactive tutorials, learn shaders, GLSL course, WebGL lessons, shader art, creative coding, computer graphics'
        : 'GLSL教程, WebGL编程, 着色器学习, 片段着色器, 顶点着色器, 图形编程, GPU编程, 着色器开发, Three.js, 着色器编辑器, 交互式教程, 学习着色器, GLSL课程, WebGL课程, 着色器艺术, 创意编程, 计算机图形学',
    authors: [{ name: 'Shader Learn' }],
    creator: 'Shader Learn',
    publisher: 'Shader Learn',
    robots: indexableRobots,
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      siteName: 'Shader Learn',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: title,
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
    alternates: buildLocaleAlternatesFor(locale, '/'),
    category: 'Education',
  };
}

export function buildLearnMetadata(locale: Locale): Metadata {
  const t = getTranslationFunction(locale);
  const title = t('learn.title');
  const description = t('learn.description');
  const url = locale === 'en' ? `${baseUrl}/learn` : `${baseUrl}/zh/learn`;

  return {
    title: `${title} - ${t('header.title')}`,
    description,
    keywords:
      locale === 'en'
        ? 'GLSL tutorials, WebGL lessons, shader programming course, graphics programming learning, fragment shader tutorial, vertex shader course, GPU programming lessons, shader basics, advanced shader techniques, WebGL education, interactive shader learning, GLSL examples, shader exercises'
        : 'GLSL教程, WebGL课程, 着色器编程学习, 图形编程教学, 片段着色器教程, 顶点着色器课程, GPU编程课程, 着色器基础, 高级着色器技术, WebGL教育, 交互式着色器学习, GLSL示例, 着色器练习',
    authors: [{ name: 'Shader Learn' }],
    creator: 'Shader Learn',
    publisher: 'Shader Learn',
    robots: indexableRobots,
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      siteName: 'Shader Learn',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: title,
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
    alternates: buildLocaleAlternatesFor(locale, '/learn'),
    category: 'Education',
  };
}

export function buildPricingMetadata(locale: Locale): Metadata {
  const title = locale === 'zh' ? '订阅 Pro 会员 - Shader Learn' : 'Subscribe to Pro - Shader Learn';
  const description =
    locale === 'zh'
      ? '解锁所有 GLSL 教程内容，享受完整的学习体验。3个月仅需 $9.99！'
      : 'Unlock all GLSL tutorial content and enjoy the complete learning experience. Only $9.99 for 3 months!';

  return {
    title,
    description,
    keywords:
      locale === 'zh'
        ? 'GLSL订阅, Pro会员, 付费教程, Shader学习, WebGL教程, 图形编程'
        : 'GLSL subscription, Pro membership, premium tutorials, shader learning, WebGL tutorials, graphics programming',
    authors: [{ name: 'Shader Learn' }],
    creator: 'Shader Learn',
    publisher: 'Shader Learn',
    robots: indexableRobots,
    openGraph: {
      title,
      description,
      type: 'website',
      url: locale === 'en' ? `${baseUrl}/pricing` : `${baseUrl}/${locale}/pricing`,
      siteName: 'Shader Learn',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Shader Learn Pro Subscription',
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
    alternates: buildLocaleAlternatesFor(locale, '/pricing'),
    category: 'Education',
  };
}

export function buildPlaygroundMetadata(locale: Locale): Metadata {
  const t = getTranslationFunction(locale);
  const title =
    locale === 'zh'
      ? 'GLSL Playground - 免费在线 WebGL 着色器编辑器 | Shader 代码实时预览'
      : 'GLSL Playground - Free Online WebGL Shader Editor | Live Preview';
  const description =
    locale === 'zh'
      ? '专业的在线 GLSL 着色器编辑器，支持 Fragment Shader 和 Vertex Shader 实时编辑。内置纹理上传、时间控制、性能监控、代码自动补全。适合 WebGL 开发者、图形编程学习者、Shader 艺术创作者。免费使用，无需注册，支持截图导出。'
      : 'Professional online GLSL shader editor with real-time Fragment and Vertex Shader editing. Built-in texture upload, time control, performance monitoring, and code autocomplete. Perfect for WebGL developers, graphics programming learners, and shader artists. Free to use, no registration required, screenshot export supported.';

  if (locale === 'en') {
    return {
      title: `${'GLSL Playground - Online Shader Editor'} - ${t('header.title')}`,
      description:
        'Free online GLSL shader editor. Features real-time preview, Fragment/Vertex Shader editing, custom Uniforms, performance monitoring, and screenshot export. No installation required, start creating your shader art immediately.',
      keywords:
        'GLSL editor, shader online editor, WebGL editor, Fragment Shader, Vertex Shader, online code editor, live preview',
      openGraph: {
        title: 'GLSL Playground - Online Shader Editor',
        description:
          'Free online GLSL shader editor. Features real-time preview, Fragment/Vertex Shader editing, custom Uniforms, performance monitoring, and screenshot export. No installation required, start creating your shader art immediately.',
        type: 'website',
        url: `${baseUrl}/playground`,
        images: [
          {
            url: `${baseUrl}/og-image.png`,
            width: 1200,
            height: 630,
            alt: 'GLSL Playground - Online Shader Editor',
          },
        ],
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'GLSL Playground - Online Shader Editor',
        description:
          'Free online GLSL shader editor. Features real-time preview, Fragment/Vertex Shader editing, custom Uniforms, performance monitoring, and screenshot export. No installation required, start creating your shader art immediately.',
        images: [`${baseUrl}/og-image.png`],
      },
      alternates: buildLocaleAlternatesFor(locale, '/playground'),
    };
  }

  return {
    title,
    description,
    keywords:
      'GLSL编辑器, WebGL编辑器, 在线着色器编辑, Fragment Shader, Vertex Shader, Shader代码, 图形编程, GPU编程, 着色器开发, 实时预览, 代码编辑器, Three.js, 纹理编辑, 着色器艺术, 创意编程, 可视化编程, GLSL Playground, Shadertoy, WebGL工具',
    authors: [{ name: 'Shader Learn' }],
    creator: 'Shader Learn',
    publisher: 'Shader Learn',
    robots: indexableRobots,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}/${locale}/playground`,
      siteName: 'Shader Learn',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'GLSL Playground - Online Shader Editor',
        },
      ],
      locale: 'zh_CN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.png`],
      creator: '@ShaderLearn',
      site: '@ShaderLearn',
    },
    alternates: buildLocaleAlternatesFor(locale, '/playground'),
    category: 'Technology',
  };
}
