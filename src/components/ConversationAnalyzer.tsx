
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Eye, Flag, Smartphone } from 'lucide-react';
import Sparkles from './Sparkles';
import { toast } from 'sonner';

const ConversationAnalyzer = () => {
  const [conversation, setConversation] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<null | {
    vibe: string;
    intentions: string;
    flags: string;
    nextMove: string;
  }>(null);

  const handleAnalyze = () => {
    if (!conversation.trim()) {
      toast.error("You need to paste a convo first, bestie! ✨");
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setResults({
        vibe: "This convo is giving major soft-ghosting energy with a side of breadcrumbs. 🍞👻 They're texting like someone who wants to keep you interested but isn't fully committing.",
        intentions: "They're *def* keeping options open. The slow replies + non-committal energy = someone who's not all in, but doesn't want you moving on either.",
        flags: "🚩 Inconsistent reply times\n🚩 Changes subject when you ask to meet\n✅ Still remembers details about you\n✅ Asks questions sometimes",
        nextMove: "Match their energy, bestie! Pull back a bit and see if they come forward. No double texting! If they're interested, they'll make it clear. 💅"
      });
      setIsAnalyzing(false);
      toast.success("Vibe check complete! ✨", {
        description: "Got the tea on this situation",
      });
    }, 2000);
  };

  const clearResults = () => {
    setResults(null);
    setConversation('');
  };

  const ResultCard = ({ icon: Icon, title, content, color }: { icon: any, title: string, content: string, color: string }) => (
    <Card className="gradient-card border-2 border-white/50 dark:border-purple-900/30 shadow-lg relative overflow-hidden">
      <Sparkles count={3} />
      <CardHeader className="pb-2">
        <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center mb-2 shadow-md`}>
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

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h2 className="text-2xl font-dancing text-center mb-2">Decode the Vibe ✨</h2>
      <p className="text-center text-muted-foreground mb-6">Paste your texts and get the real tea</p>
      
      {!results ? (
        <>
          <Textarea 
            value={conversation}
            onChange={(e) => setConversation(e.target.value)}
            placeholder="Paste your convo here... (like 'they said hey wyd and I waited 3 hrs to say nm u?')"
            className="dreamy-input min-h-[200px] text-sm mb-4"
          />
          
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity"
          >
            {isAnalyzing ? 'Reading the tea leaves...' : 'Decode This Convo ✨'}
          </Button>
        </>
      ) : (
        <div className="space-y-4">
          <ResultCard 
            icon={MessageCircle} 
            title="✨ Vibe Check"
            content={results.vibe}
            color="bg-purple-500"
          />
          
          <ResultCard 
            icon={Eye} 
            title="👁️ What's Their Deal"
            content={results.intentions}
            color="bg-pink-500"
          />
          
          <ResultCard 
            icon={Flag} 
            title="🚩 Flags & Greenlights"
            content={results.flags}
            color="bg-purple-500"
          />
          
          <ResultCard 
            icon={Smartphone} 
            title="📱 Your Next Move"
            content={results.nextMove}
            color="bg-pink-500"
          />
          
          <Button 
            onClick={clearResults} 
            variant="outline"
            className="w-full border-2 border-purple-300 dark:border-purple-700"
          >
            Analyze Another Convo
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConversationAnalyzer;
