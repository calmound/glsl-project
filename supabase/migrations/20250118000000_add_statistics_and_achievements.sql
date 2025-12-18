-- 创建用户统计表
CREATE TABLE IF NOT EXISTS user_statistics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 学习统计
  total_tutorials_completed INT DEFAULT 0,
  total_exercises_passed INT DEFAULT 0,
  total_exercises_attempted INT DEFAULT 0,
  total_learning_time_minutes INT DEFAULT 0,

  -- 活跃度统计
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_login_days INT DEFAULT 0,
  current_streak_days INT DEFAULT 0,
  longest_streak_days INT DEFAULT 0,

  -- 综合评分
  overall_score INT DEFAULT 0,

  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

-- 创建用户学习会话表
CREATE TABLE IF NOT EXISTS user_learning_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 会话信息
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INT DEFAULT 0,

  -- 学习内容
  tutorial_id TEXT,
  page_path TEXT,

  -- 索引
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户成就表
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 成就信息
  achievement_id TEXT NOT NULL,
  achievement_type TEXT NOT NULL, -- 'tutorial_completion', 'streak', 'skill_level', etc.
  level INT DEFAULT 1, -- 成就等级

  -- 获得时间
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, achievement_id)
);

-- 创建用户每日活跃记录表
CREATE TABLE IF NOT EXISTS user_daily_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- 活跃指标
  tutorials_completed INT DEFAULT 0,
  exercises_attempted INT DEFAULT 0,
  exercises_passed INT DEFAULT 0,
  learning_time_minutes INT DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, activity_date)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_statistics_user_id ON user_statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_statistics_overall_score ON user_statistics(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_user_learning_sessions_user_id ON user_learning_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_sessions_started_at ON user_learning_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_activity_user_id ON user_daily_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_activity_date ON user_daily_activity(activity_date DESC);

-- 创建更新时间戳的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为统计表添加自动更新触发器
CREATE TRIGGER update_user_statistics_updated_at
BEFORE UPDATE ON user_statistics
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_daily_activity_updated_at
BEFORE UPDATE ON user_daily_activity
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 创建或更新用户统计的函数
CREATE OR REPLACE FUNCTION update_user_statistics(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_completed_count INT;
  v_passed_count INT;
  v_attempted_count INT;
  v_overall_score INT;
BEGIN
  -- 统计完成的教程数
  SELECT COUNT(DISTINCT form_id)
  INTO v_completed_count
  FROM user_form_status
  WHERE user_id = p_user_id AND is_passed = true;

  -- 统计通过的练习数
  SELECT COUNT(*)
  INTO v_passed_count
  FROM user_form_status
  WHERE user_id = p_user_id AND is_passed = true;

  -- 统计尝试的练习数
  SELECT COUNT(*)
  INTO v_attempted_count
  FROM user_form_status
  WHERE user_id = p_user_id AND has_submitted = true;

  -- 计算综合评分
  v_overall_score := (v_completed_count * 100) + (v_passed_count * 50) + (v_attempted_count * 10);

  -- 插入或更新统计数据
  INSERT INTO user_statistics (
    user_id,
    total_tutorials_completed,
    total_exercises_passed,
    total_exercises_attempted,
    overall_score,
    last_active_at
  ) VALUES (
    p_user_id,
    v_completed_count,
    v_passed_count,
    v_attempted_count,
    v_overall_score,
    NOW()
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    total_tutorials_completed = EXCLUDED.total_tutorials_completed,
    total_exercises_passed = EXCLUDED.total_exercises_passed,
    total_exercises_attempted = EXCLUDED.total_exercises_attempted,
    overall_score = EXCLUDED.overall_score,
    last_active_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- 授予权限
ALTER TABLE user_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_activity ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的统计数据
CREATE POLICY "Users can view their own statistics"
  ON user_statistics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own sessions"
  ON user_learning_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own daily activity"
  ON user_daily_activity FOR SELECT
  USING (auth.uid() = user_id);

-- 系统可以插入和更新统计数据（通过 service_role）
CREATE POLICY "Service role can manage statistics"
  ON user_statistics FOR ALL
  USING (true);

CREATE POLICY "Service role can manage sessions"
  ON user_learning_sessions FOR ALL
  USING (true);

CREATE POLICY "Service role can manage achievements"
  ON user_achievements FOR ALL
  USING (true);

CREATE POLICY "Service role can manage daily activity"
  ON user_daily_activity FOR ALL
  USING (true);

-- 创建视图：排行榜数据
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT
  p.id as user_id,
  p.name,
  p.avatar_url,
  us.total_tutorials_completed,
  us.total_exercises_passed,
  us.total_exercises_attempted,
  us.overall_score,
  us.current_streak_days,
  us.total_learning_time_minutes,
  us.last_active_at,
  ROW_NUMBER() OVER (ORDER BY us.overall_score DESC, us.total_tutorials_completed DESC) as rank
FROM profiles p
INNER JOIN user_statistics us ON p.id = us.user_id
WHERE us.overall_score > 0
ORDER BY us.overall_score DESC, us.total_tutorials_completed DESC;

-- 授予视图查询权限
GRANT SELECT ON leaderboard_view TO authenticated;
