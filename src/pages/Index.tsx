import React from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, BrainCircuit, Lightbulb, Smile } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FeatureSection = ({
  emoji,
  title,
  description,
  animationDelay = 0,
}: {
  emoji: string;
  title: string;
  description: string;
  animationDelay?: number;
}) => (
  <div
    className="flex items-start gap-2 animate-fade-in"
    style={{ animationDelay: `${animationDelay}ms` }}
  >
    <span className="text-3xl">{emoji}</span>
    <div>
      <p className="font-semibold text-base text-purple-700 dark:text-pink-200">
        {title}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  </div>
);

const DatingModeFeatures = () => (
  <div className="flex flex-col gap-4 pt-5">
    <FeatureSection
      emoji="💌"
      title="Decode Vibe"
      description="Get instant analysis on conversations and understand the emotions behind the words."
    />
    <FeatureSection
      emoji="❤️"
      title="Intent Detector"
      description="Figure out if someone's truly interested in you or just playing games."
      animationDelay={100}
    />
    <FeatureSection
      emoji="🔄"
      title="Pattern Recognizer"
      description="Identify your recurring relationship patterns to break toxic cycles."
      animationDelay={180}
    />
    <FeatureSection
      emoji="✨"
      title="Tarot Mode"
      description="Get mystical insights about your romantic situation from the cards."
      animationDelay={260}
    />
    <FeatureSection
      emoji="📝"
      title="Love Journal"
      description="Track your emotional growth and relationship history over time."
      animationDelay={340}
    />
  </div>
);

const TherapistModeFeatures = () => (
  <div className="flex flex-col gap-4 pt-5">
    <FeatureSection
      emoji="😌"
      title="Mood Check-in"
      description="Daily reflection on your emotional state to build self-awareness."
    />
    <FeatureSection
      emoji="💡"
      title="Self-Coaching"
      description="Get gentle guidance for emotional challenges you're facing."
      animationDelay={100}
    />
    <FeatureSection
      emoji="📊"
      title="Pattern Tracker"
      description="Identify emotional and behavioral patterns to support your growth."
      animationDelay={180}
    />
    <FeatureSection
      emoji="📓"
      title="Prompted Journal"
      description="Guided journaling for self-discovery and emotional processing."
      animationDelay={260}
    />
    <FeatureSection
      emoji="⏱️"
      title="Timeline View"
      description="Track your emotional growth journey over time with insights."
      animationDelay={340}
    />
  </div>
);

const HomeFeaturesShowcase = () => (
  <section className="w-full max-w-sm mx-auto rounded-2xl relative bg-white/80 dark:bg-gray-900/60 p-6 pb-2 mt-12 shadow-xl gradient-card overflow-visible">
    <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 flex justify-center items-center bg-gradient-to-r from-pink-400 to-purple-400 h-12 w-12 rounded-full shadow-lg">
      <Sparkles className="text-white h-8 w-8 animate-fade-in" />
    </div>

    <Tabs defaultValue="dating" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="dating" className="flex items-center gap-1">
          <Heart className="h-4 w-4" /> Dating Bestie
        </TabsTrigger>
        <TabsTrigger value="therapist" className="flex items-center gap-1">
          <BrainCircuit className="h-4 w-4" /> Therapist Bestie
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dating" className="mt-0">
        <DatingModeFeatures />
      </TabsContent>

      <TabsContent value="therapist" className="mt-0">
        <TherapistModeFeatures />
      </TabsContent>
    </Tabs>

    <div className="flex items-center justify-center gap-1 mt-6 mb-2 text-lg font-bold text-purple-700 dark:text-pink-200 w-full">
      <span className="emoji-bounce">✨</span>
      <span>Ready to spill the tea?</span>
      <span className="emoji-bounce">✨</span>
    </div>
  </section>
);

const Index = () => {
  return (
    <div className="min-h-screen pb-20 pt-16 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 flex flex-col items-center relative overflow-x-hidden">
      <Header />
      <main className="flex flex-col flex-1 w-full justify-center items-center relative z-10">
        <div className="w-full px-4">
          <div className="text-center mt-10 mb-6">
            <h1 className="text-xl sm:text-2xl mb-3 animate-fade-in-fast tracking-tight text-purple-700 dark:text-pink-200">
              Your Digital BFF for Love Insights & Emotional Growth
              <span className="ml-2 text-xl align-top animate-bounce">✨</span>
            </h1>
            <p className="text-xl text-purple-600 dark:text-pink-300">
              Ready to spill the tea?
            </p>
          </div>
          <HomeFeaturesShowcase />
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-full max-w-xs px-4 z-20">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity w-full text-lg font-bold shadow-xl tracking-tight"
              onClick={() => (window.location.href = "/auth")}
            >
              Get Started ✨
            </Button>
          </div>
        </div>
      </main>
      {/* Navigation intentionally omitted on homepage */}
      {/* Sparkles/emoji stickers as effect */}
      <div className="pointer-events-none select-none fixed top-20 right-4 z-0 text-4xl opacity-30 animate-float">
        🪩
      </div>
      <div className="pointer-events-none select-none fixed top-[50%] left-3 z-0 text-3xl opacity-25 animate-bounce">
        💖
      </div>
      <div className="pointer-events-none select-none fixed bottom-10 right-10 z-0 text-4xl opacity-30 animate-fade-in">
        🔮
      </div>
    </div>
  );
};

export default Index;
