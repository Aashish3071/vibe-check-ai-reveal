
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, MessageCircle, Eye } from 'lucide-react';
import Sparkles from './Sparkles';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const IntentDetector = () => {
  const [conversation, setConversation] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<null | {
    interestScore: number;
    gameLevel: string;
    breakdown: string;
    signals: string;
  }>(null);

  const handleAnalyze = () => {
    if (!conversation.trim()) {
      toast.error("Bestie, I need some texts to analyze! ✨");
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setResults({
        interestScore: 72,
        gameLevel: "🧠 smart flirt",
        breakdown: "They're definitely into you but playing it cool. The way they remember small details and always reply (even if it takes time) shows genuine interest.",
        signals: "Watch for: increasing emoji usage, more personal questions, and suggestions to meet up - those are all green lights!"
      });
      setIsAnalyzing(false);
      toast.success("Analysis complete! 💖", {
        description: "Decoded their true feelings!",
      });
    }, 2000);
  };

  const clearResults = () => {
    setResults(null);
    setConversation('');
  };
  
  const getInterestColor = (score: number) => {
    if (score < 40) return "bg-red-500";
    if (score < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h2 className="text-2xl font-dancing text-center mb-2">Do They Even Like Me? 👀</h2>
      <p className="text-center text-muted-foreground mb-6">Let's decode their true feelings</p>
      
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
            {isAnalyzing ? 'Reading between the lines...' : 'Analyze Their Feelings 💭'}
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
                  className={`h-full ${getInterestColor(results.interestScore)} transition-all duration-1000 ease-out`}
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
              <p className="text-xl font-medium text-center my-2">{results.gameLevel}</p>
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
          
          <Button 
            onClick={clearResults} 
            variant="outline"
            className="w-full border-2 border-purple-300 dark:border-purple-700"
          >
            Analyze Another Situation
          </Button>
        </div>
      )}
    </div>
  );
};

export default IntentDetector;
