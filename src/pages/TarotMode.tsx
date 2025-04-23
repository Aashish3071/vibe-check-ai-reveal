
import React from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import Sparkles from '@/components/Sparkles';

const TarotMode = () => {
  return (
    <div className="min-h-screen pb-20 pt-16 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
      <Header />
      <main className="container mx-auto px-4">
        <h2 className="text-2xl font-dancing text-center mb-2">Pull a Card on Them 🔮</h2>
        <p className="text-center text-muted-foreground mb-6">Mystical insights for your situation</p>
        
        <Card className="gradient-card border-white/30 dark:border-purple-800/30 shadow-lg max-w-md mx-auto p-6 text-center relative overflow-hidden">
          <Sparkles count={5} />
          <h3 className="text-lg mb-2">The stars are aligning! ✨</h3>
          <p>
            Our tarot readers are channeling cosmic energy. This feature will be available soon for all your mystic relationship needs!
          </p>
        </Card>
      </main>
      <Navigation />
    </div>
  );
};

export default TarotMode;
