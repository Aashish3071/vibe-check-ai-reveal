
import React from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen pb-20 pt-16 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 flex flex-col">
      <Header />
      <main className="container px-4 mx-auto flex flex-col items-center justify-center flex-1">
        <div className="text-center mb-8 relative">
          <h1 className="text-4xl font-dancing font-bold mb-2 relative inline-block">
            HeartCheck AI
            <div className="absolute -top-1 -right-3 text-lg">✨</div>
          </h1>
          <p className="text-lg mb-6">Decode your relationship drama</p>
          <div className="relative mt-6 mb-10">
            <div className="bg-gradient-to-r from-purple-100/80 to-pink-100/80 dark:from-purple-900/40 dark:to-pink-900/40 p-6 rounded-xl border border-white/50 dark:border-purple-800/30 shadow-lg max-w-md mx-auto relative overflow-hidden">
              <div className="text-2xl mb-4">👋 Hey bestie!</div>
              <p className="text-sm mb-3">
                Wondering if they're into you? Upload your texts and I'll spill the tea on what they're <i>really</i> thinking.
              </p>
              <Button
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity w-full"
                size="lg"
                onClick={() => window.location.href = '/auth'}
              >
                Get Started ✨
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Navigation />
    </div>
  );
};

export default Index;
