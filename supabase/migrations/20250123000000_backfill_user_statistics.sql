-- update_user_statistics function to accept a custom last_active_at timestamp
CREATE OR REPLACE FUNCTION update_user_statistics(p_user_id UUID, p_last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW())
RETURNS VOID AS $$
DECLARE
  v_completed_count INT;
  v_passed_count INT;
  v_attempted_count INT;
  v_overall_score INT;
BEGIN
  -- Count completed tutorials
  SELECT COUNT(DISTINCT form_id)
  INTO v_completed_count
  FROM user_form_status
  WHERE user_id = p_user_id AND is_passed = true;

  -- Count passed exercises
  SELECT COUNT(*)
  INTO v_passed_count
  FROM user_form_status
  WHERE user_id = p_user_id AND is_passed = true;

  -- Count attempted exercises
  SELECT COUNT(*)
  INTO v_attempted_count
  FROM user_form_status
  WHERE user_id = p_user_id AND has_submitted = true;

  -- Calculate overall score
  v_overall_score := (v_completed_count * 100) + (v_passed_count * 50) + (v_attempted_count * 10);

  -- Insert or update statistics
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
    p_last_active_at
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    total_tutorials_completed = EXCLUDED.total_tutorials_completed,
    total_exercises_passed = EXCLUDED.total_exercises_passed,
    total_exercises_attempted = EXCLUDED.total_exercises_attempted,
    overall_score = EXCLUDED.overall_score,
    -- Only update last_active_at if the new value is more recent than the existing one
    last_active_at = GREATEST(user_statistics.last_active_at, EXCLUDED.last_active_at);
END;
$$ LANGUAGE plpgsql;

-- Backfill process
DO $$
DECLARE
  r RECORD;
  v_last_submitted TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Loop through all users who have form status but might be missing statistics or have outdated ones
  FOR r IN SELECT DISTINCT user_id FROM user_form_status
  LOOP
    -- Get the most recent submission time for this user to use as last_active_at
    SELECT MAX(last_submitted_at)
    INTO v_last_submitted
    FROM user_form_status
    WHERE user_id = r.user_id;

    -- If last_submitted_at is null, try updated_at, then created_at, then NOW()
    IF v_last_submitted IS NULL THEN
        SELECT MAX(updated_at) INTO v_last_submitted FROM user_form_status WHERE user_id = r.user_id;
    END IF;
    
    IF v_last_submitted IS NULL THEN
        SELECT MAX(created_at) INTO v_last_submitted FROM user_form_status WHERE user_id = r.user_id;
    END IF;

    IF v_last_submitted IS NULL THEN
        v_last_submitted := NOW();
    END IF;

    -- Update stats for this user
    PERFORM update_user_statistics(r.user_id, v_last_submitted);
    
    RAISE NOTICE 'Updated statistics for userByKey %', r.user_id;
  END LOOP;
END;
$$;
