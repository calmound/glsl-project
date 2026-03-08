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
