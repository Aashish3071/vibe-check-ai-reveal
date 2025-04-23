
import React from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import ConversationAnalyzer from '@/components/ConversationAnalyzer';

const DecodeVibe = () => {
  return (
    <div className="min-h-screen pb-20 pt-16 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
      <Header />
      <main className="container mx-auto">
        <ConversationAnalyzer />
      </main>
      <Navigation />
    </div>
  );
};

export default DecodeVibe;
