-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  provider VARCHAR(50) NOT NULL DEFAULT 'email',
  subscription_type VARCHAR(20) DEFAULT 'free', -- free, premium, pro
  subscription_status VARCHAR(20) DEFAULT 'active', -- active, cancelled, expired
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户学习进度表
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tutorial_id VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'not_started', -- not_started, in_progress, completed
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tutorial_id)
);

-- 用户项目表
CREATE TABLE IF NOT EXISTS user_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  shader_code TEXT NOT NULL,
  vertex_shader TEXT,
  fragment_shader TEXT,
  uniforms JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  fork_count INTEGER DEFAULT 0,
  forked_from UUID REFERENCES user_projects(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 项目点赞表
CREATE TABLE IF NOT EXISTS project_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES user_projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- 项目评论表
CREATE TABLE IF NOT EXISTS project_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES user_projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES project_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户关注表
CREATE TABLE IF NOT EXISTS user_follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK(follower_id != following_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_tutorial_id ON user_progress(tutorial_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_progress(status);

CREATE INDEX IF NOT EXISTS idx_user_projects_user_id ON user_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_projects_is_public ON user_projects(is_public);
CREATE INDEX IF NOT EXISTS idx_user_projects_is_featured ON user_projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_user_projects_created_at ON user_projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_projects_tags ON user_projects USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_project_likes_user_id ON project_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_project_likes_project_id ON project_likes(project_id);

CREATE INDEX IF NOT EXISTS idx_project_comments_project_id ON project_comments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_user_id ON project_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_parent_id ON project_comments(parent_id);

CREATE INDEX IF NOT EXISTS idx_user_follows_follower_id ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following_id ON user_follows(following_id);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表创建更新时间触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_projects_updated_at BEFORE UPDATE ON user_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_comments_updated_at BEFORE UPDATE ON project_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全策略 (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

-- 用户表的 RLS 策略
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- 学习进度表的 RLS 策略
CREATE POLICY "Users can view their own progress" ON user_progress
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own progress" ON user_progress
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- 项目表的 RLS 策略
CREATE POLICY "Users can view public projects" ON user_projects
    FOR SELECT USING (is_public = true OR auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own projects" ON user_projects
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own projects" ON user_projects
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own projects" ON user_projects
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- 项目点赞表的 RLS 策略
CREATE POLICY "Users can view all likes" ON project_likes
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own likes" ON project_likes
    FOR ALL USING (auth.uid()::text = user_id::text);

-- 项目评论表的 RLS 策略
CREATE POLICY "Users can view all comments" ON project_comments
    FOR SELECT USING (true);

CREATE POLICY "Users can insert comments" ON project_comments
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own comments" ON project_comments
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own comments" ON project_comments
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- 用户关注表的 RLS 策略
CREATE POLICY "Users can view all follows" ON user_follows
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own follows" ON user_follows
    FOR ALL USING (auth.uid()::text = follower_id::text);