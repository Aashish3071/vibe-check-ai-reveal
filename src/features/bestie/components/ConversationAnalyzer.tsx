import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MessageCircle,
  Eye,
  Flag,
  Smartphone,
  Share2,
  Download,
  Copy,
} from "lucide-react";
import Sparkles from "@/components/Sparkles";
import { toast } from "sonner";
import { analyzeConversation, VibeAnalysis } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";

const ConversationAnalyzer = () => {
  const { user } = useAuth();
  const [conversation, setConversation] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<VibeAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!conversation.trim()) {
      toast.error("You need to paste a convo first, bestie! ✨");
      return;
    }

    setIsAnalyzing(true);

    try {
      const analysis = await analyzeConversation(conversation);
      setResults(analysis);
      toast.success("Vibe check complete! ✨", {
        description: "Got the tea on this situation",
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
✨ HeartCheck AI Vibe Analysis ✨

Vibe Check:
${results.vibe}

What's Their Deal:
${results.intentions}

Flags & Greenlights:
${results.flags}

My Next Move:
${results.nextMove}

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
      text: `Check out my relationship vibe analysis from HeartCheck AI! ✨\n\n${results.vibe}`,
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

  const ResultCard = ({
    icon: Icon,
    title,
    content,
    color,
  }: {
    icon: any;
    title: string;
    content: string;
    color: string;
  }) => (
    <Card className="gradient-card border-2 border-white/50 dark:border-purple-900/30 shadow-lg relative overflow-hidden">
      <Sparkles count={3} />
      <CardHeader className="pb-2">
        <div
          className={`w-8 h-8 ${color} rounded-full flex items-center justify-center mb-2 shadow-md`}
        >
          <Icon className="text-white w-4 h-4" />
        </div>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm">{content}</p>
      </CardContent>
    </Card>
  );

  const ShareDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" /> Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share your vibe analysis</DialogTitle>
          <DialogDescription>
            Let your besties know what HeartCheck AI thinks!
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
    <div className="max-w-md mx-auto pt-4">
      {!results ? (
        <Card className="gradient-card border-white/50 dark:border-purple-900/30 shadow-lg mt-2">
          <CardHeader>
            <CardTitle>Decode the Vibe</CardTitle>
            <CardDescription>
              Paste a conversation to analyze the emotions and intentions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your text messages, DMs, or conversation here..."
              value={conversation}
              onChange={(e) => setConversation(e.target.value)}
              rows={10}
              className="resize-none mb-4"
            />
            <div className="text-xs text-muted-foreground mb-2">
              <p>
                All conversations are analyzed privately and confidentially.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !conversation.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
            >
              {isAnalyzing ? "Analyzing..." : "Decode This Conversation"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-4 pb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Your Analysis</h2>
            <div className="flex gap-2">
              <ShareDialog />
              <Button
                variant="outline"
                size="sm"
                onClick={clearResults}
                className="gap-1"
              >
                New Analysis
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <ResultCard
              icon={Eye}
              title="Overall Vibe Check"
              content={results.vibe}
              color="bg-purple-500"
            />

            <ResultCard
              icon={MessageCircle}
              title="What's Their Deal"
              content={results.intentions}
              color="bg-pink-500"
            />

            <ResultCard
              icon={Flag}
              title="Flags & Greenlights"
              content={results.flags}
              color="bg-red-500"
            />

            <ResultCard
              icon={Smartphone}
              title="Your Next Move"
              content={results.nextMove}
              color="bg-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationAnalyzer;
