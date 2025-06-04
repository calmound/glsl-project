'use client';

import { useEffect } from 'react';

interface StructuredDataProps {
  type: 'website' | 'article' | 'course' | 'tutorial' | 'organization';
  data: {
    name?: string;
    description?: string;
    url?: string;
    image?: string;
    author?: string;
    datePublished?: string;
    dateModified?: string;
    keywords?: string[];
    difficulty?: string;
    duration?: string;
    category?: string;
    language?: string;
  };
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    const generateStructuredData = () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';
      
      switch (type) {
        case 'website':
          return {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: data.name || 'GLSL 学习平台',
            description: data.description || '专业的 GLSL 着色器编程学习平台',
            url: baseUrl,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${baseUrl}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string'
            },
            publisher: {
              '@type': 'Organization',
              name: 'GLSL Learning Platform',
              url: baseUrl
            }
          };
          
        case 'organization':
          return {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'GLSL Learning Platform',
            url: baseUrl,
            description: 'Professional GLSL shader programming learning platform',
            sameAs: [
              // 可以添加社交媒体链接
            ]
          };
          
        case 'course':
          return {
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: data.name,
            description: data.description,
            provider: {
              '@type': 'Organization',
              name: 'GLSL Learning Platform',
              url: baseUrl
            },
            educationalLevel: data.difficulty || 'Beginner',
            teaches: data.keywords?.join(', ') || 'GLSL, WebGL, Shader Programming',
            inLanguage: data.language || 'zh-CN',
            url: data.url
          };
          
        case 'tutorial':
        case 'article':
          return {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: data.name,
            description: data.description,
            author: {
              '@type': 'Organization',
              name: data.author || 'GLSL Learning Platform'
            },
            publisher: {
              '@type': 'Organization',
              name: 'GLSL Learning Platform',
              url: baseUrl
            },
            datePublished: data.datePublished,
            dateModified: data.dateModified || data.datePublished,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': data.url
            },
            image: data.image || `${baseUrl}/og-image.png`,
            keywords: data.keywords?.join(', '),
            inLanguage: data.language || 'zh-CN',
            about: {
              '@type': 'Thing',
              name: 'GLSL Programming'
            },
            teaches: data.keywords?.join(', ') || 'GLSL, WebGL, Shader Programming',
            educationalLevel: data.difficulty || 'Beginner',
            timeRequired: data.duration || 'PT30M'
          };
          
        default:
          return null;
      }
    };

    const structuredData = generateStructuredData();
    
    if (structuredData) {
      // 移除已存在的结构化数据
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      // 添加新的结构化数据
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
      
      // 清理函数
      return () => {
        const scriptToRemove = document.querySelector('script[type="application/ld+json"]');
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      };
    }
  }, [type, data]);

  return null;
}