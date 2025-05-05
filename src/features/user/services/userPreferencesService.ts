import { supabase } from "@/common/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: "light" | "dark" | "system";
  notifications_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  preferred_language: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export const useUserPreferences = () => {
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ["userPreferences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .single();

      if (error) throw error;
      return data as UserPreferences;
    },
  });

  const updatePreferences = useMutation({
    mutationFn: async (newPreferences: Partial<UserPreferences>) => {
      const { data, error } = await supabase
        .from("user_preferences")
        .upsert(newPreferences)
        .select()
        .single();

      if (error) throw error;
      return data as UserPreferences;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["userPreferences"], data);
    },
  });

  return {
    preferences,
    isLoading,
    updatePreferences,
  };
};
