import { supabase } from "@/common/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface QuizAnswer {
  questionId: string;
  answer: string | number | boolean | string[];
  timestamp: string;
}

export interface QuizResult {
  id: string;
  user_id: string;
  quiz_type: string;
  score: number;
  answers: QuizAnswer[];
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export const useQuizResults = (quizType?: string) => {
  const queryClient = useQueryClient();

  const { data: results, isLoading } = useQuery({
    queryKey: ["quizResults", quizType],
    queryFn: async () => {
      let query = supabase
        .from("quiz_results")
        .select("*")
        .order("completed_at", { ascending: false });

      if (quizType) {
        query = query.eq("quiz_type", quizType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as QuizResult[];
    },
  });

  const saveQuizResult = useMutation({
    mutationFn: async (
      result: Omit<QuizResult, "id" | "user_id" | "created_at" | "updated_at">
    ) => {
      const { data, error } = await supabase
        .from("quiz_results")
        .insert(result)
        .select()
        .single();

      if (error) throw error;
      return data as QuizResult;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["quizResults", data.quiz_type],
      });
    },
  });

  const deleteQuizResult = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("quiz_results")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizResults"] });
    },
  });

  return {
    results,
    isLoading,
    saveQuizResult,
    deleteQuizResult,
  };
};
