
import React from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const HomeOnboardingTeaser = () => (
  <section className="w-full max-w-sm mx-auto rounded-2xl relative bg-white/80 dark:bg-gray-900/60 p-6 pb-2 mt-20 shadow-xl gradient-card overflow-visible">
    <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 flex justify-center items-center bg-gradient-to-r from-pink-400 to-purple-400 h-12 w-12 rounded-full shadow-lg">
      <Sparkles className="text-white h-8 w-8 animate-fade-in" />
    </div>
    <div className="flex flex-col gap-4 pt-7">
      <div className="flex items-start gap-2 animate-fade-in">
        <span className="text-3xl">💌</span>
        <div>
          <p className="font-semibold text-base text-purple-700 dark:text-pink-200">Get instant vibes on ANY romantic saga!</p>
          <p className="text-xs text-muted-foreground mt-1">"Does he love me or is it just the ick? I'll tell you, bestie."</p>
        </div>
      </div>
      <div className="flex items-start gap-2 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <span className="text-3xl">🔥</span>
        <div>
          <p className="font-semibold text-base text-pink-600 dark:text-purple-100">Tea spilled, drama decoded, hearts analyzed.</p>
          <p className="text-xs text-muted-foreground mt-1">Emotional patterns, heartbreaks, ghosting—nothing gets past me.</p>
        </div>
      </div>
      <div className="flex items-start gap-2 animate-fade-in" style={{ animationDelay: '180ms' }}>
        <span className="text-3xl">🦋</span>
        <div>
          <p className="font-semibold text-base text-purple-700 dark:text-pink-200">Cosmic glow-up, your way.</p>
          <p className="text-xs text-muted-foreground mt-1">Tarot modes, mood journals, and soft healing prompts for your self-love journey.</p>
        </div>
      </div>
      <div className="flex items-start gap-2 animate-fade-in" style={{ animationDelay: '260ms' }}>
        <span className="text-3xl">🫶</span>
        <div>
          <p className="font-semibold text-base text-pink-600 dark:text-purple-100">No judgment zone, ever.</p>
          <p className="text-xs text-muted-foreground mt-1">I'm your digital BFF AND your therapist, minus the fees or ghosting. Switching is just a toggle away!</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-1 mt-6 mb-2 text-lg font-bold text-purple-700 dark:text-pink-200 w-full">
        <span className="emoji-bounce">✨</span>
        <span>Ready to spill the tea together?</span>
        <span className="emoji-bounce">✨</span>
      </div>
    </div>
  </section>
);

const Index = () => {
  return (
    <div className="min-h-screen pb-20 pt-16 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 flex flex-col items-center relative overflow-x-hidden">
      <Header />
      <main className="flex flex-col flex-1 w-full justify-center items-center relative z-10">
        <div className="w-full px-4">
          <h1 className="text-4xl sm:text-5xl font-dancing font-bold mb-2 animate-fade-in-fast tracking-tight text-purple-700 dark:text-pink-200 text-center mt-16">
            Your dreamy digital BFF for checking romantic vibes & emotional glow-ups.
            <span className="ml-2 text-xl align-top animate-bounce">✨</span>
          </h1>
          <p className="text-md mb-6 text-muted-foreground max-w-xs mx-auto text-center emoji-bounce">
            Ready to spill the tea?
          </p>
          <HomeOnboardingTeaser />
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-full max-w-xs px-4 z-20">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity w-full text-lg font-bold shadow-xl tracking-tight"
              onClick={() => window.location.href = '/auth'}
            >
              Get Started ✨
            </Button>
          </div>
        </div>
      </main>
      {/* Navigation intentionally omitted on homepage */}
      {/* Sparkles/emoji stickers as effect */}
      <div className="pointer-events-none select-none fixed top-20 right-4 z-0 text-4xl opacity-30 animate-float">🪩</div>
      <div className="pointer-events-none select-none fixed top-[50%] left-3 z-0 text-3xl opacity-25 animate-bounce">💖</div>
      <div className="pointer-events-none select-none fixed bottom-10 right-10 z-0 text-4xl opacity-30 animate-fade-in">🔮</div>
    </div>
  );
};

export default Index;

