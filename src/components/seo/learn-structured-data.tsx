import React from 'react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
}

interface LearnStructuredDataProps {
  locale: 'en' | 'zh';
  tutorials: Tutorial[];
}

const LearnStructuredData: React.FC<LearnStructuredDataProps> = ({ locale, tutorials }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';
  const pageUrl = locale === 'en' ? `${baseUrl}/learn` : `${baseUrl}/zh/learn`;

  // ItemList Schema for tutorials
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: locale === 'zh' ? 'GLSL 教程列表' : 'GLSL Tutorials',
    description:
      locale === 'zh'
        ? '浏览我们的 GLSL 着色器编程教程，从基础到高级，涵盖所有主题'
        : 'Browse our GLSL shader programming tutorials, from beginner to advanced, covering all topics',
    url: pageUrl,
    numberOfItems: tutorials.length,
    itemListElement: tutorials.slice(0, 20).map((tutorial, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Course',
        name: tutorial.title,
        description: tutorial.description,
        url: `${pageUrl}/${tutorial.category}/${tutorial.id}`,
        educationalLevel: tutorial.difficulty,
        inLanguage: locale === 'zh' ? 'zh-CN' : 'en',
        provider: {
          '@type': 'Organization',
          name: 'Shader Learn',
          url: baseUrl,
        },
      },
    })),
  };

  // Course Schema (general)
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: locale === 'zh' ? 'GLSL 着色器编程课程' : 'GLSL Shader Programming Course',
    description:
      locale === 'zh'
        ? '从基础到高级的完整 GLSL 着色器编程课程，包含交互式教程和实践练习'
        : 'Complete GLSL shader programming course from beginner to advanced, with interactive tutorials and hands-on exercises',
    provider: {
      '@type': 'Organization',
      name: 'Shader Learn',
      url: baseUrl,
    },
    educationalLevel: 'Beginner to Advanced',
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en',
    url: pageUrl,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT20H',
    },
    occupationalCredentialAwarded: locale === 'zh' ? 'GLSL 着色器编程技能' : 'GLSL Shader Programming Skills',
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
        name: locale === 'zh' ? '教程' : 'Learn',
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
};

export default LearnStructuredData;
