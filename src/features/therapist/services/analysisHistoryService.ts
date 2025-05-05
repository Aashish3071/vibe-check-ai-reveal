import { supabase } from "@/common/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface AnalysisHistory {
  id: string;
  user_id: string;
  analysis_type: string;
  input_data: Record<string, unknown>;
  results: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export const useAnalysisHistory = (analysisType?: string) => {
  const queryClient = useQueryClient();

  const { data: history, isLoading } = useQuery({
    queryKey: ["analysisHistory", analysisType],
    queryFn: async () => {
      let query = supabase
        .from("analysis_history")
        .select("*")
        .order("created_at", { ascending: false });

      if (analysisType) {
        query = query.eq("analysis_type", analysisType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as AnalysisHistory[];
    },
  });

  const saveAnalysis = useMutation({
    mutationFn: async (
      analysis: Omit<
        AnalysisHistory,
        "id" | "user_id" | "created_at" | "updated_at"
      >
    ) => {
      const { data, error } = await supabase
        .from("analysis_history")
        .insert(analysis)
        .select()
        .single();

      if (error) throw error;
      return data as AnalysisHistory;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["analysisHistory", data.analysis_type],
      });
    },
  });

  const deleteAnalysis = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("analysis_history")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analysisHistory"] });
    },
  });

  return {
    history,
    isLoading,
    saveAnalysis,
    deleteAnalysis,
  };
};
