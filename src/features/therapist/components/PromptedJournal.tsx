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
import { useToast } from "@/common/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/common/lib/auth";
import { therapistService } from "../services/therapistService";

interface JournalPrompt {
  id: string;
  prompt: string;
  category: string;
}

const defaultPrompts: JournalPrompt[] = [
  {
    id: "1",
    prompt: "What are three things you're grateful for today?",
    category: "Gratitude",
  },
  {
    id: "2",
    prompt: "Describe a challenge you faced today and how you handled it.",
    category: "Reflection",
  },
  {
    id: "3",
    prompt:
      "What emotions did you experience today? How did they affect your actions?",
    category: "Emotional Awareness",
  },
  {
    id: "4",
    prompt: "What's one thing you'd like to improve about yourself?",
    category: "Personal Growth",
  },
];

export const PromptedJournal = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<JournalPrompt | null>(
    null
  );
  const [response, setResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [entries, setEntries] = useState<
    Array<{ prompt: JournalPrompt; response: string; date: Date }>
  >([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const loadEntries = async () => {
      if (!user) return;

      try {
        const journalEntries = await therapistService.getJournalEntries(
          user.id
        );
        const loadedEntries = journalEntries.map((entry) => ({
          prompt: {
            id: entry.prompt_id,
            prompt: entry.prompt,
            category: entry.category,
          },
          response: entry.response,
          date: new Date(entry.created_at),
        }));

        setEntries(loadedEntries);
      } catch (error) {
        console.error("Error loading journal entries:", error);
        toast({
          title: "Error",
          description: "Failed to load your journal entries.",
          variant: "destructive",
        });
      }
    };

    loadEntries();
  }, [user, toast]);

  const handleGeneratePrompt = () => {
    setIsGenerating(true);
    // Simulate AI generating a prompt
    setTimeout(() => {
      const randomPrompt =
        defaultPrompts[Math.floor(Math.random() * defaultPrompts.length)];
      setSelectedPrompt(randomPrompt);
      setIsGenerating(false);
    }, 1000);
  };

  const handleSubmit = async () => {
    if (!selectedPrompt || !response.trim()) {
      toast({
        title: "Missing Information",
        description: "Please write your response before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save journal entries.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await therapistService.saveJournalEntry({
        user_id: user.id,
        prompt_id: selectedPrompt.id,
        prompt: selectedPrompt.prompt,
        category: selectedPrompt.category,
        response: response.trim(),
      });

      const newEntry = {
        prompt: selectedPrompt,
        response: response.trim(),
        date: new Date(),
      };

      setEntries((prev) => [...prev, newEntry]);
      setResponse("");
      setSelectedPrompt(null);

      toast({
        title: "Entry Saved",
        description: "Your journal entry has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving journal entry:", error);
      toast({
        title: "Error",
        description: "Failed to save your journal entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Prompted Journal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {!selectedPrompt ? (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Click the button below to get a journaling prompt.
                </p>
                <Button onClick={handleGeneratePrompt} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Get a Prompt"
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Category: {selectedPrompt.category}
                  </Label>
                  <p className="text-lg font-medium mt-1">
                    {selectedPrompt.prompt}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="response">Your Response</Label>
                  <Textarea
                    id="response"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Write your thoughts here..."
                    className="min-h-[200px]"
                  />
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedPrompt(null);
                      setResponse("");
                    }}
                    disabled={isLoading}
                  >
                    Choose Different Prompt
                  </Button>
                  <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Entry"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {entries.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Previous Entries</h3>
                <div className="space-y-4">
                  {entries.map((entry, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                {entry.prompt.category}
                              </p>
                              <p className="font-medium">
                                {entry.prompt.prompt}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {entry.date.toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-muted-foreground">
                            {entry.response}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
