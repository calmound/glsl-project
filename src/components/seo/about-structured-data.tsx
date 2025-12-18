import React from 'react';

interface AboutStructuredDataProps {
  locale: 'en' | 'zh';
}

const AboutStructuredData: React.FC<AboutStructuredDataProps> = ({ locale }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Shader Learn',
    alternateName: locale === 'zh' ? 'GLSL 学习平台' : 'GLSL Learning Platform',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      locale === 'zh'
        ? '致力于为开发者提供最全面、最易懂的着色器编程学习资源'
        : 'Dedicated to providing developers with the most comprehensive and accessible shader programming learning resources',
    email: 'shaderlearn@hotmail.com',
    foundingDate: '2024',
    sameAs: [
      'https://twitter.com/ShaderLearn',
      'https://github.com/shader-learn',
    ],
    knowsAbout: [
      'GLSL',
      'WebGL',
      'Shader Programming',
      'Graphics Programming',
      'GPU Programming',
      'Fragment Shaders',
      'Vertex Shaders',
    ],
  };

  // AboutPage Schema
  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: locale === 'zh' ? '关于我们' : 'About Us',
    description:
      locale === 'zh'
        ? '了解 GLSL 学习平台的使命和愿景。我们致力于为开发者提供最好的着色器编程学习体验。'
        : 'Learn about the mission and vision of GLSL Learning Platform. We are committed to providing developers with the best shader programming learning experience.',
    url: locale === 'en' ? `${baseUrl}/about` : `${baseUrl}/zh/about`,
    mainEntity: {
      '@type': 'Organization',
      '@id': baseUrl,
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
        name: locale === 'zh' ? '关于我们' : 'About',
        item: locale === 'en' ? `${baseUrl}/about` : `${baseUrl}/zh/about`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
};

export default AboutStructuredData;
