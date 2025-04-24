import React, { useState } from "react";
import { Button } from "@/common/components/ui/button";
import { Textarea } from "@/common/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import {
  Heart,
  Brain,
  MessageCircle,
  Eye,
  Share2,
  Download,
  Copy,
} from "lucide-react";
import Sparkles from "@/common/components/Sparkles";
import { toast } from "sonner";
import { Progress } from "@/common/components/ui/progress";
import { analyzeIntent, IntentAnalysis } from "@/common/lib/api";
import { useAuth } from "@/common/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/common/components/ui/dialog";

const IntentDetector = () => {
  const { user } = useAuth();
  const [conversation, setConversation] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<IntentAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!conversation.trim()) {
      toast.error("Bestie, I need some texts to analyze! ✨");
      return;
    }

    setIsAnalyzing(true);

    try {
      const analysis = await analyzeIntent(conversation);
      setResults(analysis);
      toast.success("Analysis complete! 💖", {
        description: "Decoded their true feelings!",
      });
    } catch (error) {
      toast.error("Oops, something went wrong with the analysis! ✨", {
        description: "Please try again in a moment",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearResults = () => {
    setResults(null);
    setConversation("");
  };

  const saveAnalysis = () => {
    if (!user) {
      toast.error("Sign in to save your analysis! ✨");
      return;
    }

    // In a real app, this would save to a database
    toast.success("Analysis saved to your profile! ✨", {
      description: "You can access it anytime in your journal",
    });
  };

  const copyToClipboard = () => {
    if (!results) return;

    const textToShare = `
✨ HeartCheck AI Intent Analysis ✨

Interest Score: ${results.interestScore}%
Game Playing Level: ${results.gameLevel}

Real Talk Breakdown:
${results.breakdown}

Watch Out For This:
${results.signals}

✨ Analysis by HeartCheck AI ✨
`;

    navigator.clipboard.writeText(textToShare).then(
      () => {
        toast.success("Copied to clipboard! ✨");
      },
      () => {
        toast.error("Couldn't copy to clipboard");
      }
    );
  };

  const shareAnalysis = async () => {
    if (!results) return;

    const shareData = {
      title: "HeartCheck AI Analysis",
      text: `Check out my interest score from HeartCheck AI! They're ${results.interestScore}% into me! ✨`,
      url: "https://heartcheck.ai", // This would be your actual website URL
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        toast.success("Thanks for sharing! ✨");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      copyToClipboard();
    }
  };

  const getInterestColor = (score: number) => {
    if (score < 40) return "bg-red-500";
    if (score < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const ShareDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" /> Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share your intent analysis</DialogTitle>
          <DialogDescription>
            Let your besties know the interest level!
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button
            variant="outline"
            className="flex flex-col h-24 items-center justify-center gap-2"
            onClick={saveAnalysis}
          >
            <Download className="h-8 w-8" />
            <span>Save to Profile</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col h-24 items-center justify-center gap-2"
            onClick={copyToClipboard}
          >
            <Copy className="h-8 w-8" />
            <span>Copy Text</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col h-24 items-center justify-center gap-2 col-span-2"
            onClick={shareAnalysis}
          >
            <Share2 className="h-8 w-8" />
            <span>Share Analysis</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h2 className="text-2xl font-dancing text-center mb-2">
        Do They Even Like Me? 👀
      </h2>
      <p className="text-center text-muted-foreground mb-6">
        Let's decode their true feelings
      </p>

      {!results ? (
        <>
          <Textarea
            value={conversation}
            onChange={(e) => setConversation(e.target.value)}
            placeholder="Paste your convo or describe the situation..."
            className="dreamy-input min-h-[200px] text-sm mb-4"
          />

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity"
          >
            {isAnalyzing
              ? "Reading between the lines..."
              : "Analyze Their Feelings 💭"}
          </Button>
        </>
      ) : (
        <div className="space-y-4">
          <Card className="gradient-card border-2 border-white/50 dark:border-purple-900/30 shadow-lg relative overflow-hidden">
            <Sparkles count={3} />
            <CardHeader className="pb-2">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mb-2 shadow-md">
                <Heart className="text-white w-4 h-4" />
              </div>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                ❤️‍🔥 Interest Score
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full ${getInterestColor(
                    results.interestScore
                  )} transition-all duration-1000 ease-out`}
                  style={{ width: `${results.interestScore}%` }}
                ></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-white">
                  {results.interestScore}%
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span>🟥 Not interested</span>
                <span>🟩 Very into you</span>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-2 border-white/50 dark:border-purple-900/30 shadow-lg relative overflow-hidden">
            <Sparkles count={3} />
            <CardHeader className="pb-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mb-2 shadow-md">
                <Brain className="text-white w-4 h-4" />
              </div>
              <CardTitle className="text-lg font-medium">
                🧩 Game Playing Level
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xl font-medium text-center my-2">
                {results.gameLevel}
              </p>
              <div className="flex justify-between items-center text-xs mt-2">
                <span>💀 Dead end</span>
                <span>🧩 Mixed signals</span>
                <span>🧠 Smart flirt</span>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-2 border-white/50 dark:border-purple-900/30 shadow-lg relative overflow-hidden">
            <Sparkles count={3} />
            <CardHeader className="pb-2">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mb-2 shadow-md">
                <MessageCircle className="text-white w-4 h-4" />
              </div>
              <CardTitle className="text-lg font-medium">
                💬 Real Talk Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm">{results.breakdown}</p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-2 border-white/50 dark:border-purple-900/30 shadow-lg relative overflow-hidden">
            <Sparkles count={3} />
            <CardHeader className="pb-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mb-2 shadow-md">
                <Eye className="text-white w-4 h-4" />
              </div>
              <CardTitle className="text-lg font-medium">
                💌 Watch Out For This
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm">{results.signals}</p>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              onClick={clearResults}
              variant="outline"
              className="flex-1 border-2 border-purple-300 dark:border-purple-700"
            >
              Analyze Another Situation
            </Button>

            <ShareDialog />
          </div>
        </div>
      )}
    </div>
  );
};

export default IntentDetector;
