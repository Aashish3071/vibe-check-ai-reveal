import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/common/components/ui/card";
import { Textarea } from "@/common/components/ui/textarea";
import { Button } from "@/common/components/ui/button";
import { Progress } from "@/common/components/ui/progress";
import {
  Brain,
  Lightbulb,
  Sparkles as SparklesIcon,
  Share2,
  Repeat,
  Save,
  Copy,
} from "lucide-react";
import Sparkles from "@/common/components/Sparkles";
import { useAuth } from "@/common/lib/auth";
import { analyzePatterns, saveToProfile, PatternAnalysis } from "@/common/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/common/components/ui/dialog";

interface PatternRecognizerProps {
  onPatternDetected?: (result: PatternAnalysis) => void;
}

const PatternInsight = ({
  pattern,
}: {
  pattern: {
    name: string;
    description: string;
    impact: "positive" | "negative" | "neutral";
    frequency: number;
  };
}) => (
  <Card className="gradient-card border-white/50 dark:border-purple-900/30 shadow-lg mb-4 overflow-hidden relative">
    <Sparkles count={3} />
    <CardHeader className="pb-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <CardTitle className="text-lg">{pattern.name}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm mb-3">{pattern.description}</p>

      <div className="space-y-1 mb-3">
        <p className="text-xs font-medium">Pattern Frequency:</p>
        <Progress value={pattern.frequency} className="h-3" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Rare</span>
          <span>Common</span>
        </div>
      </div>

      <div
        className={`p-3 rounded-lg ${
          pattern.impact === "positive"
            ? "bg-green-100 dark:bg-green-900/40"
            : pattern.impact === "negative"
            ? "bg-red-100 dark:bg-red-900/40"
            : "bg-blue-100 dark:bg-blue-900/40"
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <SparklesIcon className="w-4 h-4 text-purple-500" />
          <p className="text-sm font-medium">Impact: {pattern.impact}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ShareDialog = ({
  analysis,
  isOpen,
  setIsOpen,
}: {
  analysis: PatternAnalysis | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const { user } = useAuth();

  const handleSave = async () => {
    if (!analysis) return;

    try {
      const success = await saveToProfile("pattern", analysis);
      if (success) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error saving analysis:", error);
    }
  };

  const handleCopy = () => {
    if (!analysis) return;

    const text = `
HeartCheck AI Pattern Analysis:

${analysis.detectedPatterns
  .map((p) => `• ${p.name}: ${p.description} (${p.impact})`)
  .join("\n")}

Summary: ${analysis.summary}

Recommended Actions:
${analysis.recommendedActions.map((a) => `• ${a}`).join("\n")}
    `.trim();

    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleShare = async () => {
    if (!analysis) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "HeartCheck AI Pattern Analysis",
          text: `Check out my relationship pattern analysis from HeartCheck AI: ${analysis.summary}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      handleCopy();
      toast.info("Web Share API not available, copied to clipboard instead.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Analysis</DialogTitle>
          <DialogDescription>
            Save this analysis to your profile or share it with friends
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {user ? (
            <Button onClick={handleSave} className="w-full" variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save to Profile
            </Button>
          ) : (
            <Button
              onClick={() => toast.info("Sign in to save analysis")}
              className="w-full"
              variant="outline"
              disabled
            >
              <Save className="mr-2 h-4 w-4" />
              Sign in to Save
            </Button>
          )}
          <Button onClick={handleCopy} className="w-full" variant="outline">
            <Copy className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
          <Button onClick={handleShare} className="w-full">
            <Share2 className="mr-2 h-4 w-4" />
            Share Analysis
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PatternRecognizer: React.FC<PatternRecognizerProps> = ({
  onPatternDetected,
}) => {
  const [conversationText, setConversationText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PatternAnalysis | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const handleAnalyze = async () => {
    if (!conversationText.trim()) {
      toast.error("Please enter some conversation text to analyze");
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await analyzePatterns(conversationText);
      setAnalysis(result);
      if (onPatternDetected) {
        onPatternDetected(result);
      }
    } catch (error) {
      console.error("Error analyzing patterns:", error);
      toast.error("Failed to analyze patterns. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setConversationText("");
    setAnalysis(null);
  };

  return (
    <div className="w-full space-y-4">
      <Card className="border-white/50 dark:border-purple-900/30 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Repeat className="w-5 h-5 text-purple-500" />
            Pattern Recognizer
          </CardTitle>
          <CardDescription>
            Paste a conversation to identify recurring patterns in your
            relationship
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste your conversation here..."
            className="min-h-[150px] mb-4"
            value={conversationText}
            onChange={(e) => setConversationText(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleAnalyze}
              className="w-full"
              disabled={isAnalyzing || !conversationText.trim()}
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Patterns"}
            </Button>
            {analysis && (
              <Button
                variant="outline"
                className="px-3"
                onClick={() => setShareDialogOpen(true)}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-4">
          <Card className="gradient-card border-white/50 dark:border-purple-900/30 shadow-lg overflow-hidden relative">
            <Sparkles count={5} />
            <CardContent className="pt-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                <Repeat className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">
                Pattern Analysis
              </h3>
              <p className="text-sm mb-6 text-center">{analysis.summary}</p>

              <div className="space-y-1 mb-6">
                <p className="text-xs font-medium mb-2">Recommended Actions:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.recommendedActions.map((action, index) => (
                    <li key={index} className="text-sm">
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="pb-6 flex justify-center">
              <Button variant="secondary" size="sm" onClick={handleClear}>
                Analyze Another Conversation
              </Button>
            </CardFooter>
          </Card>

          <h3 className="text-lg font-semibold mt-6 mb-2">Detected Patterns</h3>
          {analysis.detectedPatterns.map((pattern, index) => (
            <PatternInsight key={index} pattern={pattern} />
          ))}
        </div>
      )}

      <ShareDialog
        analysis={analysis}
        isOpen={shareDialogOpen}
        setIsOpen={setShareDialogOpen}
      />
    </div>
  );
};

export default PatternRecognizer;
