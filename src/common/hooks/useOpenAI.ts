import { useState, useCallback } from "react";
import { aiModuleService } from "@/common/services/aiModuleService";
import { useToast } from "@/components/ui/use-toast";
import type { AIModule } from "@/common/services/aiModuleService";

export function useOpenAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateResponse = useCallback(
    async (prompt: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await aiModuleService.generateResponse(prompt);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const setModule = useCallback((module: AIModule) => {
    aiModuleService.setModule(module);
  }, []);

  const getCurrentModule = useCallback(() => {
    return aiModuleService.getCurrentModule();
  }, []);

  return {
    generateResponse,
    setModule,
    getCurrentModule,
    isLoading,
    error,
  };
}
