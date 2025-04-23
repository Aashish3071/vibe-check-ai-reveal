
import React from 'react';
import { Heart, MessageCircle, TrendingUp, CircleX, BookHeart } from 'lucide-react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import FeatureCard from '@/components/FeatureCard';
import { Button } from '@/components/ui/button';
import Sparkles from '@/components/Sparkles';

const Index = () => {
  const features = [
    {
      title: "Decode the Vibe",
      description: "Analyze texts to reveal true intentions, red flags & next steps",
      icon: MessageCircle,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      path: "/decode-vibe",
      emoji: "💬"
    },
    {
      title: "Intent Detector",
      description: "Discover if they're really into you or just wasting your time",
      icon: Heart,
      color: "bg-gradient-to-r from-pink-500 to-pink-600",
      path: "/intent-detector",
      emoji: "📈"
    },
    {
      title: "Pattern Recognizer",
      description: "Identify toxic loops and cycles in your relationships",
      icon: TrendingUp,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      path: "/pattern-recognizer",
      emoji: "🔁"
    },
    {
      title: "Tarot Mode",
      description: "Get a mystical reading on your relationship situation",
      icon: CircleX,
      color: "bg-gradient-to-r from-pink-500 to-pink-600",
      path: "/tarot-mode",
      emoji: "🔮"
    },
    {
      title: "Love Journal",
      description: "Track your growth, reflect on lessons & celebrate wins",
      icon: BookHeart,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      path: "/journal",
      emoji: "📔"
    }
  ];

  return (
    <div className="min-h-screen pb-20 pt-16 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
      <Header />
      
      <main className="container px-4 mx-auto">
        <div className="text-center mb-8 relative">
          <h1 className="text-4xl font-dancing font-bold mb-2 relative inline-block">
            HeartCheck AI
            <div className="absolute -top-1 -right-3 text-lg">✨</div>
          </h1>
          <p className="text-lg mb-3">Decode your relationship drama</p>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Your digital bestie for analyzing texts, decoding intentions & spotting red flags in situationships
          </p>
          
          <div className="relative mt-6 mb-10">
            <div className="bg-gradient-to-r from-purple-100/80 to-pink-100/80 dark:from-purple-900/40 dark:to-pink-900/40 p-6 rounded-xl border border-white/50 dark:border-purple-800/30 shadow-lg max-w-md mx-auto relative overflow-hidden">
              <Sparkles count={5} />
              <div className="text-2xl mb-4">👋 Hey bestie!</div>
              <p className="text-sm mb-3">
                Wondering if they're into you? Upload your texts and I'll spill the tea on what they're <i>really</i> thinking.
              </p>
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity"
                size="lg"
              >
                Get Started ✨
              </Button>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-dancing font-bold mb-4 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default Index;
