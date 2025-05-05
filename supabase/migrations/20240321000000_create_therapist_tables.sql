-- Create self_coaching_entries table
CREATE TABLE IF NOT EXISTS public.self_coaching_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    step INTEGER NOT NULL CHECK (step >= 1 AND step <= 5),
    response TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create pattern_entries table
CREATE TABLE IF NOT EXISTS public.pattern_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    trigger TEXT NOT NULL,
    emotion TEXT NOT NULL,
    behavior TEXT NOT NULL,
    outcome TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create journal_entries table
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    mood TEXT NOT NULL CHECK (mood IN ('great', 'good', 'neutral', 'sad', 'bad')),
    flags JSONB DEFAULT '[]'::jsonb,
    reflections TEXT,
    growth_score INTEGER CHECK (growth_score >= 0 AND growth_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_self_coaching_entries_user_id ON public.self_coaching_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_self_coaching_entries_created_at ON public.self_coaching_entries(created_at);

CREATE INDEX IF NOT EXISTS idx_pattern_entries_user_id ON public.pattern_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_pattern_entries_date ON public.pattern_entries(date);
CREATE INDEX IF NOT EXISTS idx_pattern_entries_created_at ON public.pattern_entries(created_at);

CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON public.journal_entries(date);
CREATE INDEX IF NOT EXISTS idx_journal_entries_mood ON public.journal_entries(mood);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON public.journal_entries(created_at);

-- Create RLS policies
ALTER TABLE public.self_coaching_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pattern_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for self_coaching_entries
CREATE POLICY "Users can view their own self coaching entries"
    ON public.self_coaching_entries
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own self coaching entries"
    ON public.self_coaching_entries
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own self coaching entries"
    ON public.self_coaching_entries
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own self coaching entries"
    ON public.self_coaching_entries
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for pattern_entries
CREATE POLICY "Users can view their own pattern entries"
    ON public.pattern_entries
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pattern entries"
    ON public.pattern_entries
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pattern entries"
    ON public.pattern_entries
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pattern entries"
    ON public.pattern_entries
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for journal_entries
CREATE POLICY "Users can view their own journal entries"
    ON public.journal_entries
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journal entries"
    ON public.journal_entries
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
    ON public.journal_entries
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
    ON public.journal_entries
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_self_coaching_entries_updated_at
    BEFORE UPDATE ON public.self_coaching_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pattern_entries_updated_at
    BEFORE UPDATE ON public.pattern_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
    BEFORE UPDATE ON public.journal_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 