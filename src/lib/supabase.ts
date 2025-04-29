import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

// Define database types
export type User = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  persona_type: string | null;
  preferences: Record<string, any> | null;
  streak_count: number;
  last_active: string | null;
  created_at: string;
  updated_at: string;
};

export type Conversation = {
  id: string;
  user_id: string;
  title: string | null;
  conversation_text: string;
  analysis: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
  tags: string[] | null;
};

export type JournalEntry = {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  mood_score: number | null;
  ai_insights: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  tags: string[] | null;
};

export type TarotReading = {
  id: string;
  user_id: string;
  question: string | null;
  cards: Record<string, any>;
  interpretation: string;
  created_at: string;
  is_favorite: boolean;
};

export type MoodEntry = {
  id: string;
  user_id: string;
  mood_score: number;
  factors: string[] | null;
  notes: string | null;
  created_at: string;
  date: string;
};

export type Pattern = {
  id: string;
  user_id: string;
  pattern_type: string;
  description: string;
  first_detected: string;
  frequency: number;
  is_active: boolean;
  insights: Record<string, any> | null;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  created_at: string;
};

export type UserAchievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
};

export type StreakHistory = {
  id: string;
  user_id: string;
  check_in_date: string;
  created_at: string;
};

// Define Database interface
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<User, "id">>;
      };
      conversations: {
        Row: Conversation;
        Insert: Omit<Conversation, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Conversation, "id">>;
      };
      journal_entries: {
        Row: JournalEntry;
        Insert: Omit<JournalEntry, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<JournalEntry, "id">>;
      };
      tarot_readings: {
        Row: TarotReading;
        Insert: Omit<TarotReading, "id" | "created_at">;
        Update: Partial<Omit<TarotReading, "id">>;
      };
      mood_entries: {
        Row: MoodEntry;
        Insert: Omit<MoodEntry, "id" | "created_at">;
        Update: Partial<Omit<MoodEntry, "id">>;
      };
      patterns: {
        Row: Pattern;
        Insert: Omit<Pattern, "id" | "first_detected">;
        Update: Partial<Omit<Pattern, "id">>;
      };
      achievements: {
        Row: Achievement;
        Insert: Omit<Achievement, "id" | "created_at">;
        Update: Partial<Omit<Achievement, "id">>;
      };
      user_achievements: {
        Row: UserAchievement;
        Insert: Omit<UserAchievement, "id" | "earned_at">;
        Update: Partial<Omit<UserAchievement, "id">>;
      };
      streak_history: {
        Row: StreakHistory;
        Insert: Omit<StreakHistory, "id" | "created_at">;
        Update: Partial<Omit<StreakHistory, "id">>;
      };
    };
  };
}

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Check if we're using a mock Supabase client (when URLs aren't properly set)
export const isMockSupabase = supabaseUrl === "" || supabaseKey === "";

// Auth functions
export async function signUp(
  email: string,
  password: string,
  userData: {
    username: string;
    full_name?: string;
  }
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (error) {
      toast.error("Sign up failed", { description: error.message });
      return { data: null, error };
    }

    toast.success("Verification email sent!", {
      description: "Please check your email to confirm your account",
    });

    return { data, error: null };
  } catch (err) {
    const error = err as Error;
    toast.error("Unexpected error", { description: error.message });
    return { data: null, error };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Sign in failed", { description: error.message });
      return { data: null, error };
    }

    toast.success("Signed in successfully!");
    return { data, error: null };
  } catch (err) {
    const error = err as Error;
    toast.error("Unexpected error", { description: error.message });
    return { data: null, error };
  }
}

export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error("Google sign in failed", { description: error.message });
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    const error = err as Error;
    toast.error("Unexpected error", { description: error.message });
    return { data: null, error };
  }
}

export async function signInWithApple() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error("Apple sign in failed", { description: error.message });
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    const error = err as Error;
    toast.error("Unexpected error", { description: error.message });
    return { data: null, error };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Sign out failed", { description: error.message });
      return { error };
    }

    toast.success("Signed out successfully");
    return { error: null };
  } catch (err) {
    const error = err as Error;
    toast.error("Unexpected error", { description: error.message });
    return { error };
  }
}

export async function resetPassword(email: string) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error("Password reset failed", { description: error.message });
      return { data: null, error };
    }

    toast.success("Password reset email sent!", {
      description: "Please check your email to reset your password",
    });

    return { data, error: null };
  } catch (err) {
    const error = err as Error;
    toast.error("Unexpected error", { description: error.message });
    return { data: null, error };
  }
}

// User session helper
export async function getUserSession() {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", error.message);
      return { session: null, error };
    }

    return { session: data.session, error: null };
  } catch (err) {
    const error = err as Error;
    console.error("Unexpected error:", error.message);
    return { session: null, error };
  }
}

// User profile functions
export async function getUserProfile() {
  try {
    // Mock data for development when using mock Supabase
    if (isMockSupabase) {
      console.log("Development mode: Simulating getUserProfile");
      const mockProfile = {
        id: "dev-user-123",
        username: "dev_user",
        full_name: "Development User",
        avatar_url: null,
        persona_type: "dating",
        preferences: { theme: "dark" },
        streak_count: 5,
        last_active: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return { profile: mockProfile as User, error: null };
    }

    const { data: session } = await supabase.auth.getSession();

    if (!session.session?.user) {
      return { profile: null, error: "Not authenticated" };
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.session.user.id)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return { profile: null, error: error.message };
    }

    return { profile: data as User };
  } catch (err) {
    const error = err as Error;
    console.error("Unexpected error:", error.message);
    return { profile: null, error: error.message };
  }
}

export async function updateUserProfile(profile: Partial<User>) {
  const { data: session } = await supabase.auth.getSession();

  if (!session.session?.user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("profiles")
    .update(profile)
    .eq("id", session.session.user.id);

  if (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function uploadAvatar(file: File) {
  try {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
      toast.error("Authentication error", {
        description: "Please sign in again",
      });
      return {
        data: null,
        error: sessionError || new Error("No active session"),
      };
    }

    const userId = sessionData.session.user.id;
    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}/${Date.now()}.${fileExt}`;

    // Upload the file
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (error) {
      toast.error("Failed to upload avatar", { description: error.message });
      return { data: null, error };
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(data.path);

    // Update the user profile with the new avatar URL
    const { data: userData, error: userError } = await supabase
      .from("users")
      .update({ avatar_url: publicUrl })
      .eq("id", userId)
      .select()
      .single();

    if (userError) {
      toast.error("Failed to update profile with new avatar", {
        description: userError.message,
      });
      return { data: null, error: userError };
    }

    toast.success("Avatar uploaded successfully!");
    return { data: userData, error: null };
  } catch (err) {
    const error = err as Error;
    toast.error("Unexpected error", { description: error.message });
    return { data: null, error };
  }
}

// Conversations functions
export async function getConversations() {
  try {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error.message);
      return { conversations: null, error };
    }

    return { conversations: data, error: null };
  } catch (err) {
    const error = err as Error;
    console.error("Unexpected error:", error.message);
    return { conversations: null, error };
  }
}

export async function getConversation(id: string) {
  try {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching conversation ${id}:`, error.message);
      return { conversation: null, error };
    }

    return { conversation: data, error: null };
  } catch (err) {
    const error = err as Error;
    console.error("Unexpected error:", error.message);
    return { conversation: null, error };
  }
}

export async function saveConversation(
  conversation: Database["public"]["Tables"]["conversations"]["Insert"]
) {
  try {
    const { data, error } = await supabase
      .from("conversations")
      .insert(conversation)
      .select()
      .single();

    if (error) {
      toast.error("Failed to save conversation", {
        description: error.message,
      });
      return { data: null, error };
    }

    toast.success("Conversation saved!");
    return { data, error: null };
  } catch (err) {
    const error = err as Error;
    toast.error("Unexpected error", { description: error.message });
    return { data: null, error };
  }
}

export async function updateConversation(
  id: string,
  updates: Database["public"]["Tables"]["conversations"]["Update"]
) {
  try {
    const { data, error } = await supabase
      .from("conversations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      toast.error("Failed to update conversation", {
        description: error.message,
      });
      return { data: null, error };
    }

    toast.success("Conversation updated!");
    return { data, error: null };
  } catch (err) {
    const error = err as Error;
    toast.error("Unexpected error", { description: error.message });
    return { data: null, error };
  }
}

export async function deleteConversation(id: string) {
  try {
    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete conversation", {
        description: error.message,
      });
      return { error };
    }

    toast.success("Conversation deleted!");
    return { error: null };
  } catch (err) {
    const error = err as Error;
    toast.error("Unexpected error", { description: error.message });
    return { error };
  }
}

// Journal entries functions
export async function getJournalEntries() {
  try {
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching journal entries:", error.message);
      return { entries: null, error };
    }

    return { entries: data, error: null };
  } catch (err) {
    const error = err as Error;
    console.error("Unexpected error:", error.message);
    return { entries: null, error };
  }
}

export async function getJournalEntry(id: string) {
  try {
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching journal entry ${id}:`, error.message);
      return { entry: null, error };
    }

    return { entry: data, error: null };
  } catch (err) {
    const error = err as Error;
    console.error("Unexpected error:", error.message);
    return { entry: null, error };
  }
}

export async function saveJournalEntry(
  entry: Database["public"]["Tables"]["journal_entries"]["Insert"]
) {
  try {
    const { data, error } = await supabase
      .from("journal_entries")
      .insert(entry)
      .select()
      .single();

    if (error) {
      toast.error("Failed to save journal entry", {
        description: error.message,
      });
      return { data: null, error };
    }

    toast.success("Journal entry saved!");
    return { data, error: null };
  } catch (err) {
    const error = err as Error;
    toast.error("Unexpected error", { description: error.message });
    return { data: null, error };
  }
}

export async function updateJournalEntry(
  id: string,
  updates: Database["public"]["Tables"]["journal_entries"]["Update"]
) {
  try {
    const { data, error } = await supabase
      .from("journal_entries")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      toast.error("Failed to update journal entry", {
        description: error.message,
      });
      return { data: null, error };
    }

    toast.success("Journal entry updated!");
    return { data, error: null };
  } catch (err) {
    const error = err as Error;
    toast.error("Unexpected error", { description: error.message });
    return { data: null, error };
  }
}

export async function deleteJournalEntry(id: string) {
  try {
    const { error } = await supabase
      .from("journal_entries")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete journal entry", {
        description: error.message,
      });
      return { error };
    }

    toast.success("Journal entry deleted!");
    return { error: null };
  } catch (err) {
    const error = err as Error;
    toast.error("Unexpected error", { description: error.message });
    return { error };
  }
}

// Tarot readings functions
export async function getTarotReadings() {
  try {
    const { data, error } = await supabase
      .from("tarot_readings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tarot readings:", error.message);
      return { readings: null, error };
    }

    return { readings: data, error: null };
  } catch (err) {
    const error = err as Error;
    console.error("Unexpected error:", error.message);
    return { readings: null, error };
  }
}

export async function saveTarotReading(
  reading: Database["public"]["Tables"]["tarot_readings"]["Insert"]
) {
  try {
    const { data, error } = await supabase
      .from("tarot_readings")
      .insert(reading)
      .select()
      .single();

    if (error) {
      toast.error("Failed to save tarot reading", {
        description: error.message,
      });
      return { data: null, error };
    }

    toast.success("Tarot reading saved!");
    return { data, error: null };
  } catch (err) {
    const error = err as Error;
    toast.error("Unexpected error", { description: error.message });
    return { data: null, error };
  }
}

// Mood entries functions
export async function getMoodEntries() {
  try {
    const { data, error } = await supabase
      .from("mood_entries")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching mood entries:", error.message);
      return { entries: null, error };
    }

    return { entries: data, error: null };
  } catch (err) {
    const error = err as Error;
    console.error("Unexpected error:", error.message);
    return { entries: null, error };
  }
}

export async function saveMoodEntry(
  entry: Database["public"]["Tables"]["mood_entries"]["Insert"]
) {
  try {
    const { data, error } = await supabase
      .from("mood_entries")
      .insert(entry)
      .select()
      .single();

    if (error) {
      toast.error("Failed to save mood entry", { description: error.message });
      return { data: null, error };
    }

    toast.success("Mood entry saved!");
    return { data, error: null };
  } catch (err) {
    const error = err as Error;
    toast.error("Unexpected error", { description: error.message });
    return { data: null, error };
  }
}

// Patterns functions
export async function getPatterns() {
  try {
    const { data, error } = await supabase
      .from("patterns")
      .select("*")
      .order("first_detected", { ascending: false });

    if (error) {
      console.error("Error fetching patterns:", error.message);
      return { patterns: null, error };
    }

    return { patterns: data, error: null };
  } catch (err) {
    const error = err as Error;
    console.error("Unexpected error:", error.message);
    return { patterns: null, error };
  }
}

export async function savePattern(
  pattern: Database["public"]["Tables"]["patterns"]["Insert"]
) {
  try {
    const { data, error } = await supabase
      .from("patterns")
      .insert(pattern)
      .select()
      .single();

    if (error) {
      toast.error("Failed to save pattern", { description: error.message });
      return { data: null, error };
    }

    toast.success("Pattern saved!");
    return { data, error: null };
  } catch (err) {
    const error = err as Error;
    toast.error("Unexpected error", { description: error.message });
    return { data: null, error };
  }
}

// Realtime subscriptions
export function subscribeToConversations(callback: (payload: any) => void) {
  return supabase
    .channel("conversations-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "conversations",
      },
      callback
    )
    .subscribe();
}

export function subscribeToJournalEntries(callback: (payload: any) => void) {
  return supabase
    .channel("journal-entries-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "journal_entries",
      },
      callback
    )
    .subscribe();
}

export function subscribeToMoodEntries(callback: (payload: any) => void) {
  return supabase
    .channel("mood-entries-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "mood_entries",
      },
      callback
    )
    .subscribe();
}

// Add interface for analysis content types
export interface AnalysisContent {
  vibeScore?: number;
  intentScore?: number;
  patterns?: string[];
  messages?: string[];
  summary?: string;
  advice?: string[];
  tarotCards?: string[];
  interpretation?: string;
  [key: string]: any; // Allow for additional properties
}

// Add interface for analysis history item
export interface AnalysisHistoryItem {
  id: string;
  user_id: string;
  type: string;
  content: AnalysisContent;
  created_at: string;
}

export async function saveAnalysisToHistory(
  type: string,
  content: AnalysisContent
) {
  const { data: session } = await supabase.auth.getSession();

  if (!session.session?.user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase.from("analysis_history").insert({
    user_id: session.session.user.id,
    type,
    content,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error saving analysis:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Get user analysis history
export async function getUserAnalysisHistory(): Promise<{
  history: AnalysisHistoryItem[];
}> {
  const { data: session } = await supabase.auth.getSession();

  if (!session.session?.user) {
    return { history: [] };
  }

  const { data, error } = await supabase
    .from("analysis_history")
    .select("*")
    .eq("user_id", session.session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching analysis history:", error);
    return { history: [] };
  }

  return { history: (data as AnalysisHistoryItem[]) || [] };
}
