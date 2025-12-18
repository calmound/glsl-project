import React from 'react';

interface HomeStructuredDataProps {
  locale: 'en' | 'zh';
}

const HomeStructuredData: React.FC<HomeStructuredDataProps> = ({ locale }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';

  // WebSite Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Shader Learn',
    alternateName: locale === 'zh' ? 'GLSL 学习平台' : 'GLSL Learning Platform',
    url: baseUrl,
    description:
      locale === 'zh'
        ? '免费的 GLSL 着色器编程学习平台，提供交互式教程、在线编辑器和实践练习'
        : 'Free GLSL shader programming learning platform with interactive tutorials, online editor and hands-on exercises',
    inLanguage: [
      { '@type': 'Language', name: 'English', alternateName: 'en' },
      { '@type': 'Language', name: 'Chinese', alternateName: 'zh' },
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/learn?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Shader Learn',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      locale === 'zh'
        ? '致力于为开发者提供最全面、最易懂的着色器编程学习资源'
        : 'Dedicated to providing developers with the most comprehensive and accessible shader programming learning resources',
    email: 'shaderlearn@hotmail.com',
    sameAs: ['https://twitter.com/ShaderLearn', 'https://github.com/shader-learn'],
    knowsAbout: [
      'GLSL',
      'WebGL',
      'Shader Programming',
      'Graphics Programming',
      'Fragment Shaders',
      'Vertex Shaders',
    ],
  };

  // EducationalOrganization Schema
  const educationalOrgSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Shader Learn',
    url: baseUrl,
    description:
      locale === 'zh'
        ? '提供免费的 GLSL 和 WebGL 图形编程教育'
        : 'Providing free GLSL and WebGL graphics programming education',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: locale === 'zh' ? 'GLSL 课程目录' : 'GLSL Course Catalog',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: locale === 'zh' ? 'GLSL 基础教程' : 'GLSL Basics',
            description:
              locale === 'zh'
                ? '学习 GLSL 着色器编程基础知识'
                : 'Learn GLSL shader programming fundamentals',
            provider: {
              '@type': 'Organization',
              name: 'Shader Learn',
            },
          },
          price: '0',
          priceCurrency: 'USD',
        },
      ],
    },
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'zh' ? '首页' : 'Home',
        item: baseUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalOrgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
};

export default HomeStructuredData;
