/**
 * 教程访问控制工具（基于订阅系统）
 */

// 访问检查结果类型
export type AccessCheckResult = {
  canAccess: boolean;
  reason?: 'free_access' | 'not_logged_in' | 'subscription_required';
};

/**
 * 检查用户是否可以访问某个教程
 * @param isFree 教程是否免费（从 config.json 的 isFree 字段读取）
 * @param hasActiveSubscription 用户是否有有效订阅（从 entitlements 表查询）
 * @param isAuthenticated 用户是否已登录
 * @returns 访问检查结果
 */
export function canAccessTutorial(
  isFree: boolean,
  hasActiveSubscription: boolean,
  isAuthenticated: boolean
): AccessCheckResult {
  // 免费教程所有人都可以访问
  if (isFree) {
    return { canAccess: true, reason: 'free_access' };
  }

  // 付费教程需要登录
  if (!isAuthenticated) {
    return { canAccess: false, reason: 'not_logged_in' };
  }

  // 付费教程需要有效订阅
  if (!hasActiveSubscription) {
    return { canAccess: false, reason: 'subscription_required' };
  }

  return { canAccess: true };
}

// ========== 以下是向后兼容的旧逻辑（仅用于分类级别判断） ==========

// 免费访问的分类（无需登录）
export const FREE_CATEGORIES = ['basic'];

// 需要订阅的分类
export const PREMIUM_CATEGORIES = ['math', 'lighting', 'patterns', 'animation', 'noise'];

/**
 * 检查分类是否需要登录（向后兼容）
 */
export function requiresAuth(category: string): boolean {
  return PREMIUM_CATEGORIES.includes(category);
}

/**
 * 检查分类是否免费（向后兼容）
 */
export function isFreeCategory(category: string): boolean {
  return FREE_CATEGORIES.includes(category);
}

/**
 * 检查用户是否有权限访问该分类（向后兼容）
 */
export function hasAccessToCategory(category: string, isAuthenticated: boolean): boolean {
  // 免费分类所有人都可以访问
  if (isFreeCategory(category)) {
    return true;
  }

  // 高级分类需要登录
  return isAuthenticated;
}
