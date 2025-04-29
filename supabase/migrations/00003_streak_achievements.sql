-- Create achievements table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_achievements table to track which achievements users have earned
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create streak_history table to track daily check-ins
CREATE TABLE streak_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, check_in_date)
);

-- Add RLS policies
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_history ENABLE ROW LEVEL SECURITY;

-- Achievements are viewable by all authenticated users
CREATE POLICY "Achievements are viewable by all authenticated users" 
  ON achievements FOR SELECT 
  USING (auth.role() = 'authenticated');

-- User achievements are only viewable by the user who earned them
CREATE POLICY "Users can view own achievements" 
  ON user_achievements FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" 
  ON user_achievements FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Streak history is only viewable by the user who owns it
CREATE POLICY "Users can view own streak history" 
  ON streak_history FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streak history" 
  ON streak_history FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Insert default achievements
INSERT INTO achievements (name, description, icon, category, points) VALUES
-- Streak achievements
('First Check-in', 'Complete your first daily check-in', '✅', 'streak', 5),
('Week Streak', 'Check in for 7 consecutive days', '🔥', 'streak', 10),
('Two Week Streak', 'Check in for 14 consecutive days', '🔥🔥', 'streak', 20),
('Month Streak', 'Check in for 30 consecutive days', '🔥🔥🔥', 'streak', 50),
('Streak Master', 'Check in for 100 consecutive days', '👑', 'streak', 200),

-- Dating Bestie achievements
('Conversation Analyst', 'Analyze your first conversation', '💬', 'dating', 5),
('Intent Detective', 'Use the intent detector 5 times', '🔍', 'dating', 15),
('Pattern Pro', 'Identify 3 different relationship patterns', '📊', 'dating', 20),
('Tarot Novice', 'Complete your first tarot reading', '🔮', 'dating', 5),
('Tarot Master', 'Complete 10 tarot readings', '✨', 'dating', 25),

-- Therapist Bestie achievements
('Mood Tracker', 'Complete your first mood check-in', '😊', 'therapist', 5),
('Mood Streak', 'Complete mood check-ins for 5 consecutive days', '📈', 'therapist', 15),
('Journal Starter', 'Write your first journal entry', '📓', 'therapist', 5),
('Reflection Pro', 'Write 10 journal entries', '✍️', 'therapist', 25),
('Self-Care Champion', 'Use all therapist features at least once', '🧠', 'therapist', 30),

-- Profile achievements
('Profile Complete', 'Complete your user profile', '👤', 'profile', 10),
('Avatar Creator', 'Generate your AI avatar', '🖼️', 'profile', 15),
('Personality Quiz', 'Complete the personality quiz', '❓', 'profile', 10);

-- Function to update user streak count
CREATE OR REPLACE FUNCTION update_streak_count()
RETURNS TRIGGER AS $$
DECLARE
  last_check_in DATE;
  current_streak INTEGER;
BEGIN
  -- Get the date of the user's last check-in before today
  SELECT check_in_date INTO last_check_in
  FROM streak_history
  WHERE user_id = NEW.user_id
    AND check_in_date < NEW.check_in_date
  ORDER BY check_in_date DESC
  LIMIT 1;
  
  -- Get current streak count
  SELECT streak_count INTO current_streak
  FROM users
  WHERE id = NEW.user_id;
  
  -- If this is the first check-in or the last check-in was yesterday, increment streak
  IF last_check_in IS NULL OR last_check_in = NEW.check_in_date - INTERVAL '1 day' THEN
    UPDATE users
    SET streak_count = COALESCE(streak_count, 0) + 1,
        last_active = NOW()
    WHERE id = NEW.user_id;
  -- If the last check-in was more than a day ago, reset streak to 1
  ELSIF last_check_in < NEW.check_in_date - INTERVAL '1 day' THEN
    UPDATE users
    SET streak_count = 1,
        last_active = NOW()
    WHERE id = NEW.user_id;
  -- Otherwise, just update last_active
  ELSE
    UPDATE users
    SET last_active = NOW()
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update streak count when a new streak_history record is inserted
CREATE TRIGGER on_streak_history_inserted
  AFTER INSERT ON streak_history
  FOR EACH ROW EXECUTE PROCEDURE update_streak_count();

-- Function to award streak achievements
CREATE OR REPLACE FUNCTION award_streak_achievements()
RETURNS TRIGGER AS $$
DECLARE
  achievement_id UUID;
BEGIN
  -- First check-in achievement
  IF NEW.streak_count = 1 THEN
    SELECT id INTO achievement_id FROM achievements WHERE name = 'First Check-in';
    IF achievement_id IS NOT NULL THEN
      INSERT INTO user_achievements (user_id, achievement_id)
      VALUES (NEW.id, achievement_id)
      ON CONFLICT (user_id, achievement_id) DO NOTHING;
    END IF;
  END IF;
  
  -- Week streak achievement
  IF NEW.streak_count = 7 THEN
    SELECT id INTO achievement_id FROM achievements WHERE name = 'Week Streak';
    IF achievement_id IS NOT NULL THEN
      INSERT INTO user_achievements (user_id, achievement_id)
      VALUES (NEW.id, achievement_id)
      ON CONFLICT (user_id, achievement_id) DO NOTHING;
    END IF;
  END IF;
  
  -- Two week streak achievement
  IF NEW.streak_count = 14 THEN
    SELECT id INTO achievement_id FROM achievements WHERE name = 'Two Week Streak';
    IF achievement_id IS NOT NULL THEN
      INSERT INTO user_achievements (user_id, achievement_id)
      VALUES (NEW.id, achievement_id)
      ON CONFLICT (user_id, achievement_id) DO NOTHING;
    END IF;
  END IF;
  
  -- Month streak achievement
  IF NEW.streak_count = 30 THEN
    SELECT id INTO achievement_id FROM achievements WHERE name = 'Month Streak';
    IF achievement_id IS NOT NULL THEN
      INSERT INTO user_achievements (user_id, achievement_id)
      VALUES (NEW.id, achievement_id)
      ON CONFLICT (user_id, achievement_id) DO NOTHING;
    END IF;
  END IF;
  
  -- Streak master achievement
  IF NEW.streak_count = 100 THEN
    SELECT id INTO achievement_id FROM achievements WHERE name = 'Streak Master';
    IF achievement_id IS NOT NULL THEN
      INSERT INTO user_achievements (user_id, achievement_id)
      VALUES (NEW.id, achievement_id)
      ON CONFLICT (user_id, achievement_id) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to award streak achievements when streak_count is updated
CREATE TRIGGER on_streak_count_updated
  AFTER UPDATE OF streak_count ON users
  FOR EACH ROW
  WHEN (NEW.streak_count <> OLD.streak_count)
  EXECUTE PROCEDURE award_streak_achievements();