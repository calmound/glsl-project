import { DefaultSession } from 'next-auth'

// 扩展 NextAuth 的 Session 类型
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      subscription_type?: string
      subscription_status?: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
    subscription_type?: string
    subscription_status?: string
  }
}

// 数据库类型定义
export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  bio?: string
  provider: string
  subscription_type: 'free' | 'premium' | 'pro'
  subscription_status: 'active' | 'cancelled' | 'expired'
  subscription_expires_at?: string
  created_at: string
  updated_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  tutorial_id: string
  category: string
  status: 'not_started' | 'in_progress' | 'completed'
  completion_percentage: number
  last_accessed_at: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface UserProject {
  id: string
  user_id: string
  title: string
  description?: string
  shader_code: string
  vertex_shader?: string
  fragment_shader?: string
  uniforms: Record<string, any>
  is_public: boolean
  is_featured: boolean
  tags: string[]
  view_count: number
  like_count: number
  fork_count: number
  forked_from?: string
  created_at: string
  updated_at: string
}

export interface ProjectLike {
  id: string
  user_id: string
  project_id: string
  created_at: string
}

export interface ProjectComment {
  id: string
  user_id: string
  project_id: string
  content: string
  parent_id?: string
  created_at: string
  updated_at: string
  user?: {
    name?: string
    avatar_url?: string
  }
  replies?: ProjectComment[]
}

export interface UserFollow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}