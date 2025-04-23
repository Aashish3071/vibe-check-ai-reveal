
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";

const quizSections = [
  {
    title: "Vibe Check Basics",
    questions: [
      {
        text: "How are you feeling today?",
        options: [
          { label: "😫 Anxious", value: "anxious" },
          { label: "😍 In love", value: "in-love" },
          { label: "😐 Meh", value: "meh" },
          { label: "🧘‍♀️ Chillin’", value: "chillin" },
        ],
      },
      {
        text: "Are you currently talking to someone?",
        options: [
          { label: "Yes", value: "yes" },
          { label: "Kinda", value: "kinda" },
          { label: "No", value: "no" },
          { label: "It’s complicated", value: "complicated" },
        ],
      },
      {
        text: "What’s your relationship goal right now?",
        options: [
          { label: "Just healing 🧘‍♀️", value: "healing" },
          { label: "Looking for love 💘", value: "love" },
          { label: "Situationship drama 😵‍💫", value: "drama" },
          { label: "Self-growth era ✨", value: "self-growth" },
        ],
      },
    ],
  },
  {
    title: "Emotional Personality",
    questions: [
      {
        text: "Pick your toxic trait 💀 (we all got one)",
        options: [
          { label: "Ghosting", value: "ghosting" },
          { label: "Love bombing", value: "love-bombing" },
          { label: "Overthinking everything", value: "overthinking" },
          { label: "Trust issues", value: "trust-issues" },
        ],
      },
      {
        text: "How do you usually deal with conflict?",
        options: [
          { label: "Shut down 🧊", value: "shut-down" },
          { label: "Talk it out 💬", value: "talk-it-out" },
          { label: "Blow up 💥", value: "blow-up" },
          { label: "Avoid it 😶", value: "avoid" },
        ],
      },
    ],
  },
  {
    title: "Attachment Style (Quick Vibe-Based)",
    questions: [
      {
        text: "What would you do if your crush left you on read for 24h?",
        options: [
          { label: "👀 Overanalyze every word", value: "anxious" },
          { label: "😂 Pretend not to care", value: "avoidant" },
          { label: "🤗 Send a meme, keep it cute", value: "secure" },
          { label: "👌 Ghost back", value: "avoidant-2" },
        ],
      },
      {
        text: "They say they’re 'emotionally unavailable' but keep texting. You:",
        options: [
          { label: "Beg for clarity 😅", value: "anxious" },
          { label: "Keep chatting, no pressure 😎", value: "secure" },
          { label: "Dip out 👋", value: "avoidant" },
          { label: "Read but do nothing", value: "avoidant-2" },
        ],
      },
    ],
  },
];

const Quiz = () => {
  const navigate = useNavigate();
  const [sectionIdx, setSectionIdx] = useState(0);
  const [responses, setResponses] = useState<{ [section: number]: { [question: number]: string } }>({});

  const section = quizSections[sectionIdx];

  const handleOption = (qIdx: number, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [sectionIdx]: { ...prev[sectionIdx], [qIdx]: value },
    }));
  };

  const sectionDone = section.questions.every(
    (q, i) => responses[sectionIdx]?.[i]
  );

  const handleNext = () => {
    if (sectionIdx < quizSections.length - 1) {
      setSectionIdx(sectionIdx + 1);
    } else {
      setTimeout(() => {
        navigate("/decode-vibe");
      }, 500);
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-16 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 flex flex-col">
      <Header />
      <main className="container px-4 mx-auto max-w-md flex-1 flex flex-col items-center">
        <div className="bg-white/80 dark:bg-gray-900/60 p-8 mt-6 rounded-xl shadow-lg w-full animate-fade-in">
          <h2 className="text-xl font-dancing font-bold mb-2">{section.title}</h2>
          <div className="space-y-7">
            {section.questions.map((q, i) => (
              <div key={q.text}>
                <p className="font-semibold mb-2">{q.text}</p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt.value}
                      className={`rounded-lg py-2 px-2 text-base bg-gradient-to-r
                        ${
                          responses[sectionIdx]?.[i] === opt.value
                            ? "from-purple-400 to-pink-400 text-white font-bold border-2 border-purple-600"
                            : "from-purple-100 to-pink-100 text-black/80"
                        }
                        hover:scale-105 transition-all duration-100`}
                      onClick={() => handleOption(i, opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              size="lg"
              disabled={!sectionDone}
              onClick={handleNext}
              className={`${
                sectionDone
                  ? "bg-gradient-to-r from-pink-400 to-purple-400"
                  : "bg-gray-300 dark:bg-gray-700"
              } text-white`}
            >
              {sectionIdx < quizSections.length - 1 ? "Next" : "Reveal my vibe ✨"}
            </Button>
          </div>
        </div>
      </main>
      <Navigation />
    </div>
  );
};
export default Quiz;
