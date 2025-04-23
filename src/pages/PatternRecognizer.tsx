
import React from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import Sparkles from '@/components/Sparkles';

const PatternRecognizer = () => {
  return (
    <div className="min-h-screen pb-20 pt-16 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
      <Header />
      <main className="container mx-auto px-4">
        <h2 className="text-2xl font-dancing text-center mb-2">Am I In a Loop? 🔁</h2>
        <p className="text-center text-muted-foreground mb-6">Identify your relationship patterns</p>
        
        <Card className="gradient-card border-white/30 dark:border-purple-800/30 shadow-lg max-w-md mx-auto p-6 text-center relative overflow-hidden">
          <Sparkles count={5} />
          <h3 className="text-lg mb-2">Coming Soon! ✨</h3>
          <p>
            This feature is brewing like a love potion! Check back soon to discover your relationship patterns and break free from toxic cycles.
          </p>
        </Card>
      </main>
      <Navigation />
    </div>
  );
};

export default PatternRecognizer;
