import { useState, useEffect } from "react";
import { Button } from "@/common/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Textarea } from "@/common/components/ui/textarea";
import { Calendar } from "@/common/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/common/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/common/lib/utils";
import { useToast } from "@/common/components/ui/use-toast";
import { useAuth } from "@/common/lib/auth";
import { therapistService } from "../services/therapistService";

interface Pattern {
  id: string;
  date: Date;
  trigger: string;
  emotion: string;
  behavior: string;
  outcome: string;
}

export const PatternTracker = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [trigger, setTrigger] = useState("");
  const [emotion, setEmotion] = useState("");
  const [behavior, setBehavior] = useState("");
  const [outcome, setOutcome] = useState("");
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const loadPatterns = async () => {
      if (!user) return;

      try {
        const entries = await therapistService.getPatternEntries(user.id);
        const loadedPatterns = entries.map((entry) => ({
          id: entry.id,
          date: new Date(entry.date),
          trigger: entry.trigger,
          emotion: entry.emotion,
          behavior: entry.behavior,
          outcome: entry.outcome,
        }));

        setPatterns(loadedPatterns);
      } catch (error) {
        console.error("Error loading patterns:", error);
        toast({
          title: "Error",
          description: "Failed to load your patterns.",
          variant: "destructive",
        });
      }
    };

    loadPatterns();
  }, [user, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trigger || !emotion || !behavior || !outcome) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save patterns.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const newEntry = await therapistService.savePatternEntry({
        user_id: user.id,
        date: date.toISOString(),
        trigger,
        emotion,
        behavior,
        outcome,
      });

      const newPattern: Pattern = {
        id: newEntry.id,
        date,
        trigger,
        emotion,
        behavior,
        outcome,
      };

      setPatterns((prev) => [...prev, newPattern]);

      // Reset form
      setTrigger("");
      setEmotion("");
      setBehavior("");
      setOutcome("");

      toast({
        title: "Pattern Recorded",
        description: "Your pattern has been successfully recorded.",
      });
    } catch (error) {
      console.error("Error saving pattern:", error);
      toast({
        title: "Error",
        description: "Failed to save your pattern. Please try again.",
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
          <CardTitle>Pattern Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => newDate && setDate(newDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trigger">Trigger</Label>
                <Input
                  id="trigger"
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  placeholder="What triggered this pattern?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emotion">Emotion</Label>
                <Input
                  id="emotion"
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value)}
                  placeholder="What emotion did you feel?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="behavior">Behavior</Label>
                <Input
                  id="behavior"
                  value={behavior}
                  onChange={(e) => setBehavior(e.target.value)}
                  placeholder="How did you respond?"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="outcome">Outcome</Label>
              <Textarea
                id="outcome"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                placeholder="What was the result of your response?"
                className="min-h-[100px]"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Record Pattern"
              )}
            </Button>
          </form>

          {patterns.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Recorded Patterns</h3>
              <div className="space-y-4">
                {patterns.map((pattern) => (
                  <Card key={pattern.id}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p>{format(pattern.date, "PPP")}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Trigger
                          </p>
                          <p>{pattern.trigger}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Emotion
                          </p>
                          <p>{pattern.emotion}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Behavior
                          </p>
                          <p>{pattern.behavior}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-muted-foreground">
                            Outcome
                          </p>
                          <p>{pattern.outcome}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
