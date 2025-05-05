import { useState, useEffect } from "react";
import { Button } from "@/common/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import { Textarea } from "@/common/components/ui/textarea";
import { Label } from "@/common/components/ui/label";
import { Progress } from "@/common/components/ui/progress";
import { useToast } from "@/common/components/ui/use-toast";
import { useAuth } from "@/common/lib/auth";
import { therapistService } from "../services/therapistService";
import { Loader2 } from "lucide-react";

interface CoachingStep {
  id: number;
  question: string;
  description: string;
  placeholder: string;
}

const coachingSteps: CoachingStep[] = [
  {
    id: 1,
    question: "What's on your mind?",
    description:
      "Take a moment to reflect on what's currently occupying your thoughts.",
    placeholder: "I've been feeling...",
  },
  {
    id: 2,
    question: "How does this make you feel?",
    description: "Identify and describe your emotions about the situation.",
    placeholder: "I feel...",
  },
  {
    id: 3,
    question: "What would you like to change?",
    description:
      "Consider what aspects of the situation you'd like to improve.",
    placeholder: "I would like to...",
  },
  {
    id: 4,
    question: "What's one small step you can take?",
    description: "Think of a concrete action you can take to move forward.",
    placeholder: "I can...",
  },
];

export const SelfCoaching = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const loadPreviousResponses = async () => {
      if (!user) return;

      try {
        const entries = await therapistService.getSelfCoachingEntries(user.id);
        const loadedResponses = entries.reduce((acc, entry) => {
          acc[entry.step_id] = entry.response;
          return acc;
        }, {} as Record<number, string>);

        setResponses(loadedResponses);
      } catch (error) {
        console.error("Error loading previous responses:", error);
        toast({
          title: "Error",
          description: "Failed to load previous responses.",
          variant: "destructive",
        });
      }
    };

    loadPreviousResponses();
  }, [user, toast]);

  const handleResponseChange = (value: string) => {
    setResponses((prev) => ({
      ...prev,
      [currentStep]: value,
    }));
  };

  const handleNext = async () => {
    if (!responses[currentStep]) {
      toast({
        title: "Please provide a response",
        description: "Take a moment to reflect and write your thoughts.",
        variant: "destructive",
      });
      return;
    }

    if (user) {
      try {
        setIsLoading(true);
        await therapistService.saveSelfCoachingEntry({
          user_id: user.id,
          step_id: currentStep + 1,
          response: responses[currentStep],
        });
      } catch (error) {
        console.error("Error saving response:", error);
        toast({
          title: "Error",
          description: "Failed to save your response. Please try again.",
          variant: "destructive",
        });
        return;
      } finally {
        setIsLoading(false);
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, coachingSteps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleComplete = async () => {
    if (user) {
      try {
        setIsLoading(true);
        await therapistService.saveSelfCoachingEntry({
          user_id: user.id,
          step_id: currentStep + 1,
          response: responses[currentStep],
        });

        toast({
          title: "Great job!",
          description: "You've completed your self-coaching session.",
        });

        // Reset the form
        setCurrentStep(0);
        setResponses({});
      } catch (error) {
        console.error("Error saving final response:", error);
        toast({
          title: "Error",
          description: "Failed to save your response. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const progress = ((currentStep + 1) / coachingSteps.length) * 100;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Self-Coaching Journey</CardTitle>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {coachingSteps[currentStep].question}
              </h3>
              <p className="text-muted-foreground mb-4">
                {coachingSteps[currentStep].description}
              </p>
              <div className="space-y-2">
                <Label htmlFor="response">Your Response</Label>
                <Textarea
                  id="response"
                  value={responses[currentStep] || ""}
                  onChange={(e) => handleResponseChange(e.target.value)}
                  placeholder={coachingSteps[currentStep].placeholder}
                  className="min-h-[150px]"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0 || isLoading}
              >
                Previous
              </Button>
              {currentStep === coachingSteps.length - 1 ? (
                <Button onClick={handleComplete} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Complete Session"
                  )}
                </Button>
              ) : (
                <Button onClick={handleNext} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Next"
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
