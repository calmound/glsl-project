/**
 * 教程系统类型定义
 * 提供类型安全和代码提示
 */

import { type Locale } from '../lib/i18n';

/**
 * 本地化字符串类型
 */
export type LocalizedString = {
  zh: string;
  en: string;
};

/**
 * 本地化字符串数组类型
 */
export type LocalizedStringArray = {
  zh: string[];
  en: string[];
};

/**
 * 教程难度级别
 */
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * 教程分类
 */
export type Category = 'basic' | 'math' | 'patterns' | 'animation' | 'noise' | 'lighting';

/**
 * 教程配置接口（完整版）
 */
export interface TutorialConfig {
  id: string;
  title: LocalizedString | string; // 支持旧格式和新格式
  title_en?: string; // 向后兼容
  description: LocalizedString | string;
  description_en?: string; // 向后兼容
  difficulty: Difficulty;
  category: Category | string; // 允许扩展分类
  tags?: string[];
  estimatedTime?: number; // 预计完成时间（分钟）
  prerequisites?: string[]; // 前置教程 ID
  learningObjectives?: LocalizedStringArray; // 学习目标
  uniforms?: Record<string, number | number[] | boolean | string>; // Shader uniforms
  isPremium?: boolean; // 是否为付费内容
  preview?: string; // 预览图片路径
}

/**
 * 教程基本信息（用于列表展示）
 */
export interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
}

/**
 * 教程着色器代码
 */
export interface TutorialShaders {
  fragment: string; // 完整的片段着色器
  vertex: string; // 顶点着色器
  exercise: string; // 练习模板
}

/**
 * 用户进度信息
 */
export interface UserProgress {
  user_id: string;
  form_id: string; // 教程 ID
  has_submitted: boolean; // 是否已提交
  is_passed: boolean; // 是否通过
  attempts: number; // 尝试次数
  last_submitted_at: string | null; // 最后提交时间
  first_passed_at?: string | null; // 首次通过时间
  last_result?: ValidationResult | null; // 最后一次验证结果
  created_at?: string;
  updated_at?: string;
}

/**
 * 用户代码保存记录
 */
export interface UserCode {
  user_id: string;
  form_id: string;
  code: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * 验证结果
 */
export interface ValidationResult {
  isValid: boolean; // 是否验证通过
  passed?: boolean; // 向后兼容
  message: string; // 验证消息
  errors?: string[]; // 错误列表
  details?: {
    expectedHash?: string;
    actualHash?: string;
    similarity?: number;
  };
}

/**
 * 编译错误信息
 */
export interface CompileError {
  title: string; // 错误标题
  hint: string | null; // 修复提示
  raw: string; // 原始错误信息
  line?: number; // 错误行号
}

/**
 * Toast 通知类型
 */
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

/**
 * 代码片段
 */
export interface CodeSnippet {
  id: string;
  title: LocalizedString;
  description?: LocalizedString;
  code: string;
  category?: Category | string;
}

/**
 * 教程元数据（数据库表）
 */
export interface TutorialMetadata {
  id: string;
  category: string;
  title_en: string;
  title_zh: string;
  description_en: string | null;
  description_zh: string | null;
  difficulty: Difficulty;
  estimated_time: number | null;
  tags: string[] | null;
  is_premium: boolean;
  prerequisites: string[] | null;
  order_index: number | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * 用户进度统计（视图）
 */
export interface UserProgressSummary {
  user_id: string;
  total_tutorials: number;
  passed_count: number;
  submitted_count: number;
  total_attempts: number;
  completion_percentage: number;
  last_activity_at: string | null;
}

/**
 * Shader Canvas 属性
 */
export interface ShaderCanvasProps {
  fragmentShader: string;
  vertexShader?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  timeScale?: number;
  uniforms?: Record<string, number | boolean | number[] | string>;
  onCompileError?: (error: string | null) => void;
}

/**
 * 代码编辑器属性
 */
export interface CodeEditorProps {
  initialCode?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  height?: string;
  readOnly?: boolean;
}

/**
 * 学习路径节点
 */
export interface LearningPathNode {
  tutorial: Tutorial;
  progress?: UserProgress;
  index: number;
  isCompleted: boolean;
  isInProgress: boolean;
  isLocked: boolean;
}

/**
 * 获取本地化字符串的辅助函数类型
 */
export type GetLocalizedString = (
  value: LocalizedString | string,
  locale: Locale,
  fallbackKey?: string
) => string;

/**
 * 导出所有类型
 */
export type {
  Locale,
};
