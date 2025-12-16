/**
 * 代码本地存储工具
 * 用于在用户登录前保存代码，登录后恢复
 */

const STORAGE_KEY_PREFIX = 'tutorial_code_';

/**
 * 保存待提交的代码到 localStorage
 */
export function savePendingCode(tutorialId: string, code: string): void {
  try {
    const key = STORAGE_KEY_PREFIX + tutorialId;
    localStorage.setItem(key, code);
    console.log('✅ 代码已保存到 localStorage:', { tutorialId, codeLength: code.length });
  } catch (error) {
    console.error('❌ 保存代码到 localStorage 失败:', error);
  }
}

/**
 * 从 localStorage 获取指定教程的代码
 */
export function getPendingCode(tutorialId: string): string | null {
  try {
    const key = STORAGE_KEY_PREFIX + tutorialId;
    const code = localStorage.getItem(key);

    if (code) {
      console.log('✅ 从 localStorage 恢复代码:', { tutorialId, codeLength: code.length });
    }

    return code;
  } catch (error) {
    console.error('❌ 从 localStorage 读取代码失败:', error);
    return null;
  }
}

/**
 * 清除 localStorage 中保存的指定教程代码
 */
export function clearPendingCode(tutorialId: string): void {
  try {
    const key = STORAGE_KEY_PREFIX + tutorialId;
    localStorage.removeItem(key);
    console.log('✅ 已清除 localStorage 中的代码:', { tutorialId });
  } catch (error) {
    console.error('❌ 清除 localStorage 失败:', error);
  }
}
