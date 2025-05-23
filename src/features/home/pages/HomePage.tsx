import React from "react";
import Header from "@/common/components/Header";
import { Button } from "@/common/components/ui/button";
import { Sparkles, Heart, BrainCircuit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/common/components/ui/tabs";
import FeatureSection from "./FeatureSection";

const TherapistModeFeatures = () => (
  <div className="flex flex-col gap-4 pt-5">
    <FeatureSection
      emoji="😌"
      title="Mood Check-In"
      description="How's your mind and body really feeling today? Let's notice neutrally."
    />
    <FeatureSection
      emoji="❤️"
      title="Intent Reality Check"
      description="Is their behavior matching their words? Honesty first."
      animationDelay={100}
    />
    <FeatureSection
      emoji="🔍"
      title="Cognitive Distortion Finder"
      description="Are you catastrophizing, mind-reading, etc? Let's catch it gently."
      animationDelay={180}
    />
    <FeatureSection
      emoji="🔄"
      title="Pattern Recognizer"
      description="Deep dive: Your emotional cycles, attachment wounds, healing arcs."
      animationDelay={260}
    />
    <FeatureSection
      emoji="📔"
      title="Growth Journal"
      description="Reflect on your behaviors, not just your feelings in therapy mode."
      animationDelay={340}
    />
    <FeatureSection
      emoji="🧘"
      title="Grounding Exercises"
      description="Mini mental reset when emotions spike."
      animationDelay={420}
    />
  </div>
);

const DatingModeFeatures = () => (
  <div className="flex flex-col gap-4 pt-5">
    <FeatureSection
      emoji="💬"
      title="Decode the Vibe"
      description="Girl, this convo is giving 🚩 vibes — protect your peace!"
    />
    <FeatureSection
      emoji="❤️"
      title="Intent Detector"
      description="Are they obsessed with you or playing games? Real talk only."
      animationDelay={100}
    />
    <FeatureSection
      emoji="👯‍♀️"
      title="Hype Check"
      description="Reminder of your worth when people act shady."
      animationDelay={180}
    />
    <FeatureSection
      emoji="✨"
      title="Tarot Mode"
      description="Fun, fictional card pull to gas you up or warn you."
      animationDelay={260}
    />
    <FeatureSection
      emoji="📔"
      title="Love Journal"
      description="Rant, rave, spill — Bestie keeps it safe."
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
            <h1 className="text-xl sm:text-2xl mb-3 tracking-tight text-purple-700 dark:text-pink-200 relative">
              <span
                className="animate-fade-in-down inline-block"
                style={{ animationDelay: "0ms" }}
              >
                Your
              </span>
              <span
                className="animate-fade-in-down inline-block"
                style={{ animationDelay: "100ms" }}
              >
                {" "}
                Digital
              </span>
              <span
                className="animate-fade-in-down inline-block"
                style={{ animationDelay: "200ms" }}
              >
                {" "}
                BFF
              </span>
              <span
                className="animate-fade-in-down inline-block"
                style={{ animationDelay: "300ms" }}
              >
                {" "}
                for
              </span>
              <br />
              <span
                className="animate-fade-in-down inline-block"
                style={{ animationDelay: "400ms" }}
              >
                Love
              </span>
              <span
                className="animate-fade-in-down inline-block"
                style={{ animationDelay: "500ms" }}
              >
                {" "}
                Insights
              </span>
              <span
                className="animate-pulse animate-infinite inline-block mx-1"
                style={{ animationDelay: "600ms" }}
              >
                &
              </span>
              <span
                className="animate-fade-in-down inline-block"
                style={{ animationDelay: "700ms" }}
              >
                Emotional
              </span>
              <span
                className="animate-fade-in-down inline-block"
                style={{ animationDelay: "800ms" }}
              >
                {" "}
                Growth
              </span>
              <span className="ml-2 text-xl align-top animate-bounce">✨</span>
            </h1>
            <p className="text-xl text-purple-600 dark:text-pink-300 animate-fade-in-up">
              <span className="animate-pulse inline-block">Ready</span> to{" "}
              <span className="animate-pulse inline-block delay-300">
                spill
              </span>{" "}
              the{" "}
              <span className="animate-pulse inline-block delay-600">tea</span>?
            </p>
          </div>
          <HomeFeaturesShowcase />
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-full max-w-xs px-4 z-20">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity w-full text-lg font-bold shadow-xl tracking-tight animate-pulse-soft"
              onClick={() => (window.location.href = "/auth")}
            >
              Decode Your Vibe ✨
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
