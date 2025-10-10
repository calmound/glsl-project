// 数据库类型定义

export interface UserFormCode {
  id: string;
  user_id: string;
  form_id: string;
  code_content: string;
  language?: string;
  is_draft: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface UserFormStatus {
  id: string;
  user_id: string;
  form_id: string;
  has_submitted: boolean;
  is_passed: boolean;
  attempts: number;
  last_submitted_at?: string;
  first_passed_at?: string;
  last_result?: {
    message: string;
    timestamp: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export interface SubmitFormResponse {
  passed: boolean;
  attempts: number;
  lastResult: {
    message: string;
    timestamp: string;
  };
  firstPassedAt: string | null;
  isPassed: boolean;
}
