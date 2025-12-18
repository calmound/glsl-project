import React from 'react';

interface PlaygroundStructuredDataProps {
  locale: 'en' | 'zh';
}

const PlaygroundStructuredData: React.FC<PlaygroundStructuredDataProps> = ({ locale }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';
  const url = locale === 'en' ? `${baseUrl}/playground` : `${baseUrl}/zh/playground`;

  const title =
    locale === 'zh'
      ? 'GLSL Playground - 免费在线 WebGL 着色器编辑器'
      : 'GLSL Playground - Free Online WebGL Shader Editor';

  const description =
    locale === 'zh'
      ? '专业的在线 GLSL 着色器编辑器，支持 Fragment Shader 和 Vertex Shader 实时编辑。'
      : 'Professional online GLSL shader editor with real-time Fragment and Vertex Shader editing.';

  // WebApplication Schema
  const webApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title,
    description,
    url,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Real-time GLSL shader editing',
      'Fragment and Vertex Shader support',
      'Texture upload',
      'Time control',
      'Performance monitoring',
      'Code autocomplete',
      'Screenshot export',
    ],
    screenshot: `${baseUrl}/og-image.png`,
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
  };

  // SoftwareApplication Schema
  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: title,
    description,
    applicationCategory: 'DevelopmentTool',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
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
      {
        '@type': 'ListItem',
        position: 2,
        name: locale === 'zh' ? '在线编辑器' : 'Playground',
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
};

export default PlaygroundStructuredData;
