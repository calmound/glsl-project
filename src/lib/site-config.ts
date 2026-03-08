import { getBaseUrl } from '@/lib/metadata-common';

export const siteConfig = {
  name: 'Shader Learn',
  legacyLocalizedName: 'GLSL 学习平台',
  legacyEnglishName: 'GLSL Learning Platform',
  descriptionZh: '专业的 GLSL 着色器编程学习平台，提供从基础到高级的完整学习路径',
  descriptionEn:
    'Professional GLSL shader programming learning platform with a complete path from fundamentals to advanced techniques.',
  ogImagePath: '/og-image.png',
  googleAnalyticsId: 'G-6X7J4WLHJ6',
};

export function getSiteUrl() {
  return getBaseUrl();
}

export function getSiteOgImageUrl() {
  return `${getSiteUrl()}${siteConfig.ogImagePath}`;
}
