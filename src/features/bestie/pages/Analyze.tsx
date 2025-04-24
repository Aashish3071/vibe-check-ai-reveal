import React, { useMemo } from "react";
import Header from "@/common/components/Header";
import Navigation from "@/common/components/Navigation";

function getSummary(responses: { [key: string]: string }) {
  // Extremely simple, playful logic. Replace with AI/LLM later.
  const mood = responses.current_mood;
  const trait = responses.toxic_trait;
  const attach = responses.reply_response;
  let vibeType = "";
  let modules = [];
  if (trait && trait.toLowerCase().includes("trust")) {
    vibeType = "Loyal Lover with trust issues";
    modules = ["Tarot Mode", "Journal"];
  } else if (trait && trait.toLowerCase().includes("bombing")) {
    vibeType = "Spicy Romantic (watch that intensity!)";
    modules = ["Intent Detector", "Journal"];
  } else if (attach && attach.toLowerCase().includes("panic")) {
    vibeType = "Anxious Overthinker";
    modules = ["Decode", "Journal"];
  } else {
    vibeType = "Mystic Dreamer on a glow-up arc";
    modules = ["Tarot Mode", "Decode"];
  }
  return { vibeType, modules };
}

const encouragement = [
  "Ready to level up your love aura? We’re SO here for it! 💖",
  "Remember: healing isn’t linear but your glow is unstoppable. ⭐",
  "You’re about to unlock main character energy! 🚀",
  "Take a deep breath and tap into your intuition – you got this. 🌙",
];

const Analyze = () => {
  // Read responses from sessionStorage
  const quizResultsRaw = window.sessionStorage.getItem("hcQuizResults");
  const quizResults = quizResultsRaw ? JSON.parse(quizResultsRaw) : {};

  const { vibeType, modules } = useMemo(
    () => getSummary(quizResults),
    [quizResults]
  );

  // Pick random encouragement
  const msg = React.useMemo(
    () => encouragement[Math.floor(Math.random() * encouragement.length)],
    []
  );

  return (
    <div className="min-h-screen pb-20 pt-16 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 flex flex-col">
      <Header />
      <main className="container px-4 mx-auto flex flex-col items-center flex-1">
        <div className="bg-white/80 dark:bg-gray-900/70 p-8 mt-6 rounded-xl shadow-lg w-full max-w-md animate-fade-in text-center">
          <div className="mb-5 text-3xl font-bold font-dancing text-purple-700 dark:text-pink-300">
            Your Emotional Profile
          </div>
          <p className="mb-4 text-lg">
            <span className="font-semibold">Vibe Type:</span> {vibeType}
          </p>
          <p className="mb-4 text-base">
            <span className="font-semibold">Suggested modules:</span>{" "}
            {modules.join(" + ")} will be your healing duo.
          </p>
          <div className="mb-6 px-3 py-4 bg-gradient-to-r from-pink-100/70 to-purple-100/60 rounded-lg text-purple-700 dark:text-pink-200 shadow animate-fade-in">
            {msg}
          </div>
          <div className="text-sm text-muted-foreground mb-1">
            Prompts are now tailored to your emotional lens. Switch modules
            below anytime.
          </div>
        </div>
      </main>
      <Navigation />
    </div>
  );
};

export default Analyze;
