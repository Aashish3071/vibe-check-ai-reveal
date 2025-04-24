
import React from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import IntentDetector from '@/components/IntentDetector';

const IntentDetectorPage = () => {
  return (
    <div className="min-h-screen pb-20 pt-16 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
      <Header />
      <main className="container mx-auto">
        <IntentDetector />
      </main>
      <Navigation />
    </div>
  );
};

export default IntentDetectorPage;
