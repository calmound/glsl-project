/**
 * 教程访问控制工具
 */

// 免费访问的分类（无需登录）
export const FREE_CATEGORIES = ['basic'];

// 需要登录的分类
export const PREMIUM_CATEGORIES = ['math', 'lighting', 'patterns', 'animation', 'noise'];

/**
 * 检查分类是否需要登录
 */
export function requiresAuth(category: string): boolean {
  return PREMIUM_CATEGORIES.includes(category);
}

/**
 * 检查分类是否免费
 */
export function isFreeCategory(category: string): boolean {
  return FREE_CATEGORIES.includes(category);
}

/**
 * 检查用户是否有权限访问该分类
 */
export function hasAccessToCategory(category: string, isAuthenticated: boolean): boolean {
  // 免费分类所有人都可以访问
  if (isFreeCategory(category)) {
    return true;
  }

  // 高级分类需要登录
  return isAuthenticated;
}
