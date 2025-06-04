'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface TutorialStructuredDataProps {
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  datePublished?: string;
  dateModified?: string;
  keywords?: string[];
  language?: string;
  duration?: string; // 例如 'PT30M' 表示30分钟
}

export default function TutorialStructuredData({
  title,
  description,
  category,
  difficulty,
  datePublished = new Date().toISOString(),
  dateModified,
  keywords = [],
  language = 'zh-CN',
  duration = 'PT30M',
}: TutorialStructuredDataProps) {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';
  
  useEffect(() => {
    // 生成结构化数据
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: title,
      description,
      author: {
        '@type': 'Organization',
        name: 'GLSL Learning Platform',
        url: baseUrl
      },
      publisher: {
        '@type': 'Organization',
        name: 'GLSL Learning Platform',
        url: baseUrl
      },
      datePublished,
      dateModified: dateModified || datePublished,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${baseUrl}${pathname}`
      },
      image: `${baseUrl}/og-image.png?title=${encodeURIComponent(title)}&type=tutorial`,
      keywords: keywords.join(', '),
      inLanguage: language,
      about: {
        '@type': 'Thing',
        name: 'GLSL Programming'
      },
      teaches: keywords.join(', ') || 'GLSL, WebGL, Shader Programming',
      educationalLevel: difficulty === 'beginner' ? 'Beginner' : 
                        difficulty === 'intermediate' ? 'Intermediate' : 'Advanced',
      timeRequired: duration,
      // 添加课程结构
      isPartOf: {
        '@type': 'Course',
        name: `GLSL ${category} 教程`,
        description: `学习 GLSL 着色器编程中的 ${category} 相关知识和技巧`,
        provider: {
          '@type': 'Organization',
          name: 'GLSL Learning Platform',
          url: baseUrl
        }
      }
    };
    
    // 移除已存在的结构化数据
    const existingScript = document.querySelector('script[data-type="tutorial-structured-data"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    // 添加新的结构化数据
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    script.dataset.type = 'tutorial-structured-data';
    document.head.appendChild(script);
    
    // 清理函数
    return () => {
      const scriptToRemove = document.querySelector('script[data-type="tutorial-structured-data"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, category, difficulty, datePublished, dateModified, keywords, language, duration, pathname]);

  return null;
}