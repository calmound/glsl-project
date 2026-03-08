import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { getBaseUrl, indexableRobots } from '@/lib/metadata-common';
import { buildLocaleAlternatesFor } from '@/lib/seo';
import { getTranslationFunction } from '@/lib/translations';

export function buildAboutMetadata(locale: Locale): Metadata {
  const title = locale === 'zh' ? '关于我们 - GLSL 学习平台' : 'About Us - GLSL Learning Platform';
  const description =
    locale === 'zh'
      ? '了解 GLSL 学习平台的使命和愿景。我们致力于为开发者提供最好的着色器编程学习体验，让图形编程变得更加简单易懂。'
      : 'Learn about the mission and vision of GLSL Learning Platform. We are committed to providing developers with the best shader programming learning experience, making graphics programming more accessible and understandable.';
  const baseUrl = getBaseUrl();

  return {
    title,
    description,
    keywords:
      locale === 'zh'
        ? '关于我们, GLSL平台, 着色器学习, 图形编程教育, WebGL教程, Shader Learn使命, 在线着色器编辑器, 免费GLSL课程, 图形编程社区, WebGL学习资源'
        : 'about us, GLSL platform, shader learning, graphics programming education, WebGL tutorials, Shader Learn mission, online shader editor, free GLSL courses, graphics programming community, WebGL learning resources',
    authors: [{ name: 'Shader Learn' }],
    creator: 'Shader Learn',
    publisher: 'Shader Learn',
    robots: indexableRobots,
    openGraph: {
      title,
      description,
      type: 'website',
      url: locale === 'en' ? `${baseUrl}/about` : `${baseUrl}/${locale}/about`,
      siteName: 'Shader Learn',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'About Shader Learn',
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
    alternates: buildLocaleAlternatesFor(locale, '/about'),
    category: 'Education',
  };
}

export function buildContactMetadata(locale: Locale): Metadata {
  const baseUrl = getBaseUrl();
  const t = getTranslationFunction(locale);
  const title = t('contact.title');
  const description = t('contact.description');

  return {
    title,
    description,
    keywords:
      locale === 'zh'
        ? '联系我们, 联系Shader Learn, GLSL问题咨询, 着色器学习支持, WebGL帮助, 技术支持邮箱'
        : 'contact us, contact Shader Learn, GLSL support, shader learning help, WebGL assistance, technical support email',
    authors: [{ name: 'Shader Learn' }],
    creator: 'Shader Learn',
    publisher: 'Shader Learn',
    robots: indexableRobots,
    alternates: buildLocaleAlternatesFor(locale, '/contact'),
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}${locale === 'en' ? '/contact' : `/${locale}/contact`}`,
      siteName: 'Shader Learn',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Contact Shader Learn',
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
    category: 'Education',
  };
}

export function buildExamplesMetadata(locale: Locale): Metadata {
  const title =
    locale === 'zh' ? 'GLSL 示例 - 着色器编程实例' : 'GLSL Examples - Shader Programming Samples';
  const description =
    locale === 'zh'
      ? '浏览各种 GLSL 着色器示例，包括基础几何、动画效果、光照和材质等。每个示例都包含完整的代码和详细解释。'
      : 'Browse various GLSL shader examples, including basic geometry, animation effects, lighting and materials. Each example includes complete code and detailed explanations.';
  const baseUrl = getBaseUrl();
  const url = locale === 'en' ? `${baseUrl}/examples` : `${baseUrl}/${locale}/examples`;

  return {
    title,
    description,
    keywords:
      locale === 'zh'
        ? 'GLSL示例, 着色器示例, WebGL示例, 图形编程, 视觉效果, 着色器代码, 片段着色器示例, 顶点着色器示例, 动画效果, 光照示例, 材质示例, 噪声纹理, 后处理效果, 颜色渐变'
        : 'GLSL examples, shader examples, WebGL examples, graphics programming, visual effects, shader code, fragment shader examples, vertex shader examples, animation effects, lighting examples, material examples, noise textures, post-processing effects, color gradients',
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
          alt: 'GLSL Shader Examples',
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
    alternates: buildLocaleAlternatesFor(locale, '/examples'),
    category: 'Technology',
  };
}

export function buildFeedbackMetadata(locale: Locale): Metadata {
  const t = getTranslationFunction(locale);
  const title = t('feedback.title');
  const description = t('feedback.subtitle');
  const baseUrl = getBaseUrl();
  const siteName = 'Shader Learn';

  return {
    title: `${title} - ${siteName}`,
    description,
    keywords:
      locale === 'zh'
        ? '反馈, 用户意见, 建议, Bug反馈, GLSL学习, 问题报告, 功能建议, 用户体验反馈'
        : 'feedback, user feedback, suggestions, bug report, GLSL learning, issue report, feature request, user experience feedback',
    authors: [{ name: 'Shader Learn' }],
    creator: 'Shader Learn',
    publisher: 'Shader Learn',
    robots: indexableRobots,
    openGraph: {
      title: `${title} - ${siteName}`,
      description,
      url: `${baseUrl}/${locale === 'en' ? '' : `${locale}/`}feedback`,
      siteName,
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Shader Learn Feedback',
        },
      ],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - ${siteName}`,
      description,
      images: [`${baseUrl}/og-image.png`],
      creator: '@ShaderLearn',
      site: '@ShaderLearn',
    },
    alternates: buildLocaleAlternatesFor(locale, '/feedback'),
    category: 'Education',
  };
}

export function buildPrivacyMetadata(locale: Locale): Metadata {
  const baseUrl = getBaseUrl();
  const title = locale === 'zh' ? '隐私政策 - Shader Learn' : 'Privacy Policy - Shader Learn';
  const description =
    locale === 'zh'
      ? 'Shader Learn 隐私政策，说明我们如何收集、使用与保护你的个人信息。'
      : 'Shader Learn Privacy Policy describing how we collect, use, and protect your information.';

  return {
    title,
    description,
    alternates: buildLocaleAlternatesFor(locale, '/legal/privacy'),
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}${locale === 'en' ? '/legal/privacy' : `/${locale}/legal/privacy`}`,
      siteName: 'Shader Learn',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Shader Learn Privacy Policy',
        },
      ],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
  };
}

export function buildTermsMetadata(locale: Locale): Metadata {
  const baseUrl = getBaseUrl();
  const title = locale === 'zh' ? '服务条款 - Shader Learn' : 'Terms of Service - Shader Learn';
  const description =
    locale === 'zh'
      ? 'Shader Learn 平台服务条款，包含使用规则、付费与权限说明、责任限制等内容。'
      : 'Shader Learn Terms of Service, including usage rules, payment/access terms, and limitation of liability.';

  return {
    title,
    description,
    alternates: buildLocaleAlternatesFor(locale, '/legal/terms'),
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}${locale === 'en' ? '/legal/terms' : `/${locale}/legal/terms`}`,
      siteName: 'Shader Learn',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Shader Learn Terms of Service',
        },
      ],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
  };
}

export function buildRefundMetadata(locale: Locale): Metadata {
  const baseUrl = getBaseUrl();
  const title = locale === 'zh' ? '退款政策 - Shader Learn' : 'Refund Policy - Shader Learn';
  const description =
    locale === 'zh'
      ? 'Shader Learn 退款政策，说明数字内容与订阅的退款规则。'
      : 'Shader Learn Refund Policy, including rules for digital content and subscriptions.';

  return {
    title,
    description,
    alternates: buildLocaleAlternatesFor(locale, '/legal/refund'),
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}${locale === 'en' ? '/legal/refund' : `/${locale}/legal/refund`}`,
      siteName: 'Shader Learn',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Shader Learn Refund Policy',
        },
      ],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
  };
}
