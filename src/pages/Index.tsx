
import React from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen pb-20 pt-16 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 flex flex-col items-center">
      <Header />
      <main className="flex flex-col flex-1 w-full justify-center items-center">
        <div className="text-center w-full mt-32 px-6">
          <h1 className="text-4xl font-dancing font-bold mb-6 animate-fade-in tracking-tight text-purple-700 dark:text-pink-200">
            HeartCheck AI
            <span className="ml-2 text-xl align-top">✨</span>
          </h1>
          <p className="text-md mb-10 text-muted-foreground max-w-xs mx-auto">
            Your dreamy digital BFF for checking romantic vibes & emotional glow-ups. Ready to spill the tea?
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity w-full text-lg"
            onClick={() => window.location.href = '/auth'}
          >
            Get Started ✨
          </Button>
        </div>
      </main>
      {/* Navigation intentionally omitted on homepage */}
    </div>
  );
};

export default Index;
