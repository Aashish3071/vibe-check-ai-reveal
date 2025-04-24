-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create schema for tables
-- Note: auth schema is already part of the Supabase setup

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users (id),
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  persona_type TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  streak_count INTEGER DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  conversation_text TEXT NOT NULL,
  analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_favorite BOOLEAN DEFAULT false,
  tags TEXT[]
);

-- Journal entries table
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  mood_score INTEGER,
  ai_insights JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  tags TEXT[]
);

-- Tarot readings table
CREATE TABLE tarot_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question TEXT,
  cards JSONB NOT NULL,
  interpretation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_favorite BOOLEAN DEFAULT false
);

-- Mood entries table
CREATE TABLE mood_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mood_score INTEGER NOT NULL,
  factors TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  date DATE NOT NULL
);

-- Patterns table
CREATE TABLE patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pattern_type TEXT NOT NULL,
  description TEXT NOT NULL,
  first_detected TIMESTAMP WITH TIME ZONE DEFAULT now(),
  frequency INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  insights JSONB
);

-- Setup Row Level Security (RLS)
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarot_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users table: users can only access their own data
CREATE POLICY "Users can view own data" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- Conversations policies
CREATE POLICY "Users can view own conversations" 
  ON conversations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" 
  ON conversations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" 
  ON conversations FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations" 
  ON conversations FOR DELETE 
  USING (auth.uid() = user_id);

-- Journal entries policies
CREATE POLICY "Users can view own journal entries" 
  ON journal_entries FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries" 
  ON journal_entries FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries" 
  ON journal_entries FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries" 
  ON journal_entries FOR DELETE 
  USING (auth.uid() = user_id);

-- Tarot readings policies
CREATE POLICY "Users can view own tarot readings" 
  ON tarot_readings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tarot readings" 
  ON tarot_readings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tarot readings" 
  ON tarot_readings FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tarot readings" 
  ON tarot_readings FOR DELETE 
  USING (auth.uid() = user_id);

-- Mood entries policies
CREATE POLICY "Users can view own mood entries" 
  ON mood_entries FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood entries" 
  ON mood_entries FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood entries" 
  ON mood_entries FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mood entries" 
  ON mood_entries FOR DELETE 
  USING (auth.uid() = user_id);

-- Patterns policies
CREATE POLICY "Users can view own patterns" 
  ON patterns FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own patterns" 
  ON patterns FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own patterns" 
  ON patterns FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own patterns" 
  ON patterns FOR DELETE 
  USING (auth.uid() = user_id);

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, full_name, avatar_url, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.created_at,
    NEW.created_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create a user record when a new auth user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update the "updated_at" field
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add modified timestamp triggers
CREATE TRIGGER update_users_modtime
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_conversations_modtime
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_journal_entries_modtime
  BEFORE UPDATE ON journal_entries
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column(); 