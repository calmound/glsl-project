-- Drop existing view
DROP VIEW IF EXISTS leaderboard_view;

-- Recreate view with name fallback logic
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT
  p.id as user_id,
  -- Use name if available, otherwise split email to get username
  COALESCE(
    NULLIF(p.name, ''), 
    split_part(p.email, '@', 1), 
    'Anonymous'
  ) as name,
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

-- Grant permissions (since we dropped and recreated)
GRANT SELECT ON leaderboard_view TO authenticated;
