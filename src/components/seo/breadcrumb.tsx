'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEffect } from 'react';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';
  
  // 自动生成面包屑
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;
    
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // 添加首页
    breadcrumbs.push({
      name: t('nav.home'),
      href: `/${language}`
    });
    
    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      // 跳过语言代码
      if (index === 0 && (segment === 'zh' || segment === 'en')) {
        currentPath = `/${segment}`;
        return;
      }
      
      currentPath += `/${segment}`;
      
      let name = segment;
      
      // 根据路径段生成名称
      switch (segment) {
        case 'learn':
          name = t('nav.learn');
          break;
        case 'about':
          name = t('nav.about');
          break;
        case 'examples':
          name = t('nav.examples');
          break;
        case 'glslify-guide':
          name = 'Glslify 指南';
          break;
        default:
          // 对于动态路由，保持原始名称或进行格式化
          name = segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
      
      breadcrumbs.push({
        name,
        href: currentPath
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  // 生成结构化数据
  useEffect(() => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${baseUrl}${item.href}`
      }))
    };
    
    // 移除已存在的面包屑结构化数据
    const existingScript = document.querySelector('script[data-type="breadcrumb-structured-data"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    // 添加新的结构化数据
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    script.dataset.type = 'breadcrumb-structured-data';
    document.head.appendChild(script);
    
    // 清理函数
    return () => {
      const scriptToRemove = document.querySelector('script[data-type="breadcrumb-structured-data"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [breadcrumbs, baseUrl]);
  
  if (breadcrumbs.length <= 1) {
    return null;
  }
  
  return (
    <nav 
      className={`flex items-center space-x-2 text-sm text-gray-600 mb-4 ${className}`}
      aria-label="面包屑导航"
    >
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && (
            <svg 
              className="w-4 h-4 mx-2 text-gray-400" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path 
                fillRule="evenodd" 
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
          )}
          
          {index === breadcrumbs.length - 1 ? (
            <span 
              className="font-medium text-gray-900"
              aria-current="page"
            >
              {item.name}
            </span>
          ) : (
            <Link 
              href={item.href}
              className="hover:text-blue-600 transition-colors duration-200"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}