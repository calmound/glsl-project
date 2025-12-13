/**
 * 类型工具函数
 * 提供类型安全的辅助函数
 */

import type { LocalizedString, Locale, Difficulty, Category } from '../types';

/**
 * 获取本地化字符串
 */
export function getLocalizedString(
  value: LocalizedString | string,
  locale: Locale,
  fallbackKey: keyof LocalizedString = 'zh'
): string {
  if (typeof value === 'string') {
    return value;
  }
  return value[locale] || value[fallbackKey] || '';
}

/**
 * 获取本地化字符串数组
 */
export function getLocalizedStringArray(
  value: { zh: string[]; en: string[] } | string[],
  locale: Locale
): string[] {
  if (Array.isArray(value)) {
    return value;
  }
  return value[locale] || value.zh || [];
}

/**
 * 验证教程 ID 格式
 */
export function isValidTutorialId(id: string): boolean {
  return /^[a-z0-9-]+$/.test(id);
}

/**
 * 验证难度级别
 */
export function isValidDifficulty(difficulty: string): difficulty is Difficulty {
  return ['beginner', 'intermediate', 'advanced'].includes(difficulty);
}

/**
 * 验证分类
 */
export function isValidCategory(category: string): category is Category {
  return ['basic', 'math', 'patterns', 'animation', 'noise', 'lighting'].includes(category);
}

/**
 * 获取难度级别的本地化名称
 */
export function getDifficultyLabel(difficulty: Difficulty, locale: Locale): string {
  const labels: Record<Difficulty, LocalizedString> = {
    beginner: { zh: '初级', en: 'Beginner' },
    intermediate: { zh: '中级', en: 'Intermediate' },
    advanced: { zh: '高级', en: 'Advanced' }
  };
  return getLocalizedString(labels[difficulty], locale);
}

/**
 * 获取分类的本地化名称
 */
export function getCategoryLabel(category: Category | string, locale: Locale): string {
  const labels: Record<string, LocalizedString> = {
    basic: { zh: '基础入门', en: 'Basic' },
    math: { zh: '数学公式', en: 'Math' },
    patterns: { zh: '图案纹理', en: 'Patterns' },
    animation: { zh: '动画交互', en: 'Animation' },
    noise: { zh: '噪声函数', en: 'Noise' },
    lighting: { zh: '光照渲染', en: 'Lighting' }
  };
  return labels[category] ? getLocalizedString(labels[category], locale) : category;
}

/**
 * 格式化时间（分钟）
 */
export function formatEstimatedTime(minutes: number, locale: Locale): string {
  if (minutes < 60) {
    return locale === 'zh' ? `${minutes} 分钟` : `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (locale === 'zh') {
    return mins > 0 ? `${hours} 小时 ${mins} 分钟` : `${hours} 小时`;
  }
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

/**
 * 计算完成百分比
 */
export function calculateCompletionPercentage(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * 类型守卫：检查是否为本地化字符串
 */
export function isLocalizedString(value: any): value is LocalizedString {
  return (
    typeof value === 'object' &&
    value !== null &&
    'zh' in value &&
    'en' in value &&
    typeof value.zh === 'string' &&
    typeof value.en === 'string'
  );
}

/**
 * 安全地解析 JSON
 */
export function safeJSONParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * 格式化日期时间
 */
export function formatDateTime(dateString: string | null, locale: Locale): string {
  if (!dateString) return locale === 'zh' ? '从未' : 'Never';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return locale === 'zh' ? '无效日期' : 'Invalid Date';

  if (locale === 'zh') {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * 获取相对时间描述
 */
export function getRelativeTime(dateString: string | null, locale: Locale): string {
  if (!dateString) return locale === 'zh' ? '从未' : 'Never';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return locale === 'zh' ? '刚刚' : 'Just now';
  } else if (diffMins < 60) {
    return locale === 'zh' ? `${diffMins} 分钟前` : `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return locale === 'zh' ? `${diffHours} 小时前` : `${diffHours}h ago`;
  } else if (diffDays < 30) {
    return locale === 'zh' ? `${diffDays} 天前` : `${diffDays}d ago`;
  }

  return formatDateTime(dateString, locale);
}
