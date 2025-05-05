import { supabase } from "@/common/lib/supabase";

export interface SelfCoachingEntry {
  id?: string;
  user_id: string;
  step_id: number;
  response: string;
  created_at?: string;
}

export interface PatternEntry {
  id?: string;
  user_id: string;
  date: string;
  trigger: string;
  emotion: string;
  behavior: string;
  outcome: string;
  created_at?: string;
}

export interface JournalEntry {
  id?: string;
  user_id: string;
  prompt_id: string;
  prompt: string;
  category: string;
  response: string;
  created_at?: string;
}

export const therapistService = {
  // Self Coaching
  async saveSelfCoachingEntry(entry: SelfCoachingEntry) {
    const { data, error } = await supabase
      .from("self_coaching_entries")
      .insert([entry])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSelfCoachingEntries(userId: string) {
    const { data, error } = await supabase
      .from("self_coaching_entries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Pattern Tracker
  async savePatternEntry(entry: PatternEntry) {
    const { data, error } = await supabase
      .from("pattern_entries")
      .insert([entry])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getPatternEntries(userId: string) {
    const { data, error } = await supabase
      .from("pattern_entries")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Journal
  async saveJournalEntry(entry: JournalEntry) {
    const { data, error } = await supabase
      .from("journal_entries")
      .insert([entry])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getJournalEntries(userId: string) {
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },
};
