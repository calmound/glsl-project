import React from 'react';

interface GlslifyStructuredDataProps {
  locale: 'en' | 'zh';
}

const GlslifyStructuredData: React.FC<GlslifyStructuredDataProps> = ({ locale }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';
  const pageUrl =
    locale === 'en' ? `${baseUrl}/glslify-guide` : `${baseUrl}/zh/glslify-guide`;

  // HowTo Schema
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: locale === 'zh' ? '如何使用 Glslify 管理 GLSL 代码' : 'How to Use Glslify for GLSL Code Management',
    description:
      locale === 'zh'
        ? '学习如何使用 Glslify 工具来模块化管理和重用 GLSL 着色器代码'
        : 'Learn how to use Glslify tool to modularize and reuse GLSL shader code',
    image: `${baseUrl}/og-image.png`,
    totalTime: 'PT15M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0',
    },
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Glslify',
      },
      {
        '@type': 'HowToTool',
        name: 'npm',
      },
    ],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: locale === 'zh' ? '安装 Glslify' : 'Install Glslify',
        text: locale === 'zh' ? '通过 npm 全局安装 Glslify 工具' : 'Install Glslify globally via npm',
        itemListElement: [
          {
            '@type': 'HowToDirection',
            text: 'npm install -g glslify',
          },
        ],
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: locale === 'zh' ? '创建 GLSL 模块' : 'Create GLSL Module',
        text:
          locale === 'zh'
            ? '创建可重用的 GLSL 函数模块'
            : 'Create reusable GLSL function modules',
        itemListElement: [
          {
            '@type': 'HowToDirection',
            text:
              locale === 'zh'
                ? '编写 GLSL 函数并使用 #pragma glslify: export 导出'
                : 'Write GLSL functions and export using #pragma glslify: export',
          },
        ],
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: locale === 'zh' ? '在项目中使用模块' : 'Use Modules in Project',
        text:
          locale === 'zh'
            ? '使用 require 语句导入并使用 GLSL 模块'
            : 'Import and use GLSL modules with require statement',
        itemListElement: [
          {
            '@type': 'HowToDirection',
            text: "#pragma glslify: random = require('./noise.glsl')",
          },
        ],
      },
    ],
  };

  // TechArticle Schema
  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'Glslify Guide - GLSL Library Management',
    description:
      locale === 'zh'
        ? 'Glslify 是一个 GLSL 模块化管理工具，帮助您组织和重用 GLSL 代码。'
        : 'Glslify is a GLSL module management tool that helps you organize and reuse GLSL code.',
    image: `${baseUrl}/og-image.png`,
    author: {
      '@type': 'Organization',
      name: 'Shader Learn',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Shader Learn',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en',
    about: [
      {
        '@type': 'Thing',
        name: 'Glslify',
      },
      {
        '@type': 'Thing',
        name: 'GLSL',
      },
      {
        '@type': 'Thing',
        name: 'WebGL',
      },
    ],
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
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Glslify Guide',
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
};

export default GlslifyStructuredData;
