
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
import { analyzePatterns, saveToProfile, PatternResult, RelationshipPattern } from "@/common/lib/api";
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
  onPatternDetected?: (result: PatternResult) => void;
}

const PatternInsight = ({
  pattern,
}: {
  pattern: RelationshipPattern;
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
  analysis: PatternResult | null;
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
            Save this analysis to your profile or share with others
          </DialogDescription>
        </DialogHeader>

        {analysis && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
              <p className="font-medium mb-2">Summary:</p>
              <p className="text-sm">{analysis.summary}</p>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Recommended Actions:</p>
              <ul className="list-disc pl-5 space-y-1">
                {analysis.recommendedActions.map((action, i) => (
                  <li key={i} className="text-sm">
                    {action}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Detected Patterns:</p>
              <ul className="list-disc pl-5 space-y-1">
                {analysis.detectedPatterns.map((pattern, i) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium">{pattern.name}:</span>{" "}
                    {pattern.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <DialogFooter className="flex sm:justify-between gap-2 flex-wrap">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex-1"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex-1"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
          <Button type="button" onClick={handleSave} size="sm" className="flex-1">
            <Save className="mr-2 h-4 w-4" />
            Save to Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const PatternRecognizer: React.FC<PatternRecognizerProps> = ({ 
  onPatternDetected 
}) => {
  const [conversation, setConversation] = useState("");
  const [result, setResult] = useState<PatternResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { user } = useAuth();

  const handleAnalyze = async () => {
    if (!conversation.trim()) {
      toast.error("Please enter a conversation to analyze");
      return;
    }

    setLoading(true);
    try {
      const analysis = await analyzePatterns(conversation);
      setResult(analysis);
      
      if (onPatternDetected) {
        onPatternDetected(analysis);
      }
    } catch (error) {
      console.error("Error analyzing patterns:", error);
      toast.error("Failed to analyze patterns");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setConversation("");
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {!result ? (
        <Card className="gradient-card border-white/50 dark:border-purple-900/30 shadow-lg overflow-hidden relative">
          <Sparkles count={3} />
          <CardHeader>
            <CardTitle>Relationship Pattern Recognizer</CardTitle>
            <CardDescription>
              Find recurring patterns in your communication and relationship
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste text messages or describe your relationship situation..."
              className="min-h-40 resize-none"
              value={conversation}
              onChange={(e) => setConversation(e.target.value)}
            />
            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
              onClick={handleAnalyze}
              disabled={loading || !conversation.trim()}
            >
              {loading ? "Analyzing..." : "Recognize Patterns"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="gradient-card border-white/50 dark:border-purple-900/30 shadow-lg overflow-hidden relative">
            <Sparkles count={3} />
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Pattern Analysis</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => setShareDialogOpen(true)}
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2"
                    onClick={handleReset}
                  >
                    <Repeat className="h-4 w-4 mr-1" />
                    New
                  </Button>
                </div>
              </div>
              <CardDescription>{result.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  <h3 className="font-medium">Recommended Actions</h3>
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  {result.recommendedActions.map((action, index) => (
                    <li key={index} className="text-sm">
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Detected Patterns</h3>
                <div className="space-y-4">
                  {result.detectedPatterns.map((pattern, index) => (
                    <PatternInsight key={index} pattern={pattern} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <ShareDialog
        analysis={result}
        isOpen={shareDialogOpen}
        setIsOpen={setShareDialogOpen}
      />
    </div>
  );
};

export default PatternRecognizer;
