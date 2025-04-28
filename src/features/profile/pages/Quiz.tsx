
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/common/components/ui/button";
import { useAppMode, VibePersona } from "@/common/lib/appMode";
import { useSetQuizCompleted, useSetUserTags } from "@/common/lib/auth";
import { toast } from "sonner";

const quizSections = [
  {
    title: "Vibe Check Basics",
    questions: [
      {
        key: "current_mood",
        text: "How are you feeling today, bestie?",
        options: ["😫 Anxious", "😍 In love", "😐 Meh", "🧘‍♀️ Chillin'"],
      },
      {
        key: "talking_to_someone",
        text: "Are you currently talking to someone?",
        options: ["Yes", "Kinda", "No", "It's complicated"],
      },
      {
        key: "relationship_goal",
        text: "What's your relationship goal right now?",
        options: [
          "Just healing 🧘‍♀️",
          "Looking for love 💘",
          "Situationship drama 😵‍💫",
          "Self-growth era ✨",
        ],
      },
    ],
  },
  {
    title: "Emotional Personality",
    questions: [
      {
        key: "toxic_trait",
        text: "Pick your toxic trait 💀 (no judgment, promise)",
        options: [
          "Ghosting",
          "Love bombing",
          "Overthinking everything",
          "Trust issues",
        ],
      },
      {
        key: "conflict_response",
        text: "How do you deal with conflict?",
        options: [
          "Shut down 🧊",
          "Talk it out 💬",
          "Blow up 💥",
          "Avoid it 😶",
        ],
      },
    ],
  },
  {
    title: "Attachment Style (Situational)",
    questions: [
      {
        key: "reply_response",
        text: "If someone takes hours to reply, you...",
        options: [
          "Panic and spiral 🫠",
          "Wait but feel hurt 😞",
          "Don't really care 🤷",
          "Start detaching emotionally 🧍‍♂️",
        ],
      },
      {
        key: "emotional_intensity_response",
        text: "When things get too emotionally intense, you...",
        options: [
          "Crave more closeness 🥺",
          "Need space ASAP 🏃‍♀️",
          "Feel unsure 🌀",
          "Go numb 🚪",
        ],
      },
    ],
  },
];

const determineVibePersona = (responses: {
  [key: string]: string;
}): VibePersona => {
  // Logic to determine vibe persona based on quiz responses
  if (
    responses.toxic_trait === "Overthinking everything" ||
    responses.reply_response === "Panic and spiral 🫠"
  ) {
    return "cautious";
  } else if (
    responses.relationship_goal === "Just healing 🧘‍♀️" ||
    responses.emotional_intensity_response === "Need space ASAP 🏃‍♀️"
  ) {
    return "reflective";
  } else if (
    responses.conflict_response === "Talk it out 💬" ||
    responses.relationship_goal === "Self-growth era ✨"
  ) {
    return "balanced";
  } else if (
    responses.toxic_trait === "Trust issues" ||
    responses.emotional_intensity_response === "Go numb 🚪"
  ) {
    return "analytical";
  } else {
    return "hopeful";
  }
};

const determineDefaultMode = (responses: { [key: string]: string }) => {
  // Logic to determine default mode based on quiz responses
  const therapistIndicators = [
    responses.relationship_goal === "Just healing 🧘‍♀️",
    responses.relationship_goal === "Self-growth era ✨",
    responses.conflict_response === "Shut down 🧊",
    responses.toxic_trait === "Trust issues",
  ];

  // If more than 2 therapist indicators, default to therapist mode
  return therapistIndicators.filter(Boolean).length >= 2
    ? "therapist"
    : "dating";
};

const Quiz = () => {
  const navigate = useNavigate();
  const [sectionIdx, setSectionIdx] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const { setVibePersona, setMode } = useAppMode();
  const setUserTags = useSetUserTags();
  const setQuizCompleted = useSetQuizCompleted();
  const [loading, setLoading] = useState(true);

  // Add enhanced debugging and initialization
  useEffect(() => {
    console.log("Quiz component mounted");
    // Give time for auth state to initialize - helps with dev mode
    const timer = setTimeout(() => {
      setLoading(false);
      console.log("Quiz initial loading set to false");
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const section = quizSections[sectionIdx];

  const handleOption = (questionKey: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionKey]: value,
    }));
  };

  const sectionDone = section?.questions.every((q) => responses[q.key]) || false;

  const handleNext = () => {
    console.log("handleNext called, current sectionIdx:", sectionIdx);
    
    if (sectionIdx < quizSections.length - 1) {
      setSectionIdx(sectionIdx + 1);
    } else {
      console.log("Quiz completed, processing results");
      
      // Determine vibe persona and default mode
      const persona = determineVibePersona(responses);
      const defaultMode = determineDefaultMode(responses);
      console.log("Determined persona:", persona, "and mode:", defaultMode);

      // Set app mode preferences
      setVibePersona(persona);
      setMode(defaultMode);

      // Set user tags based on quiz responses
      const attachmentStyle = determineAttachmentStyle(responses);
      const tonePreference = determineTonePreference(responses);
      
      console.log("Setting user tags:", {
        emotionalVibe: persona,
        attachmentStyle,
        tonePref: tonePreference
      });
      
      if (setUserTags) {
        setUserTags({
          emotionalVibe: persona,
          attachmentStyle,
          tonePref: tonePreference,
        });
      } else {
        console.error("setUserTags function is undefined!");
      }

      // Save quiz answers to session storage for reference
      window.sessionStorage.setItem("hcQuizResults", JSON.stringify(responses));

      // Mark quiz as completed
      console.log("Setting quiz completed to true");
      if (setQuizCompleted) {
        setQuizCompleted(true);
      } else {
        console.error("setQuizCompleted function is undefined!");
      }

      // Show success message
      toast.success(`Your quiz is complete! ✨`, {
        description: "Now let's create your personalized avatar!",
      });

      // Navigate to avatar generator
      console.log("Navigating to avatar generator");
      navigate("/generate-avatar", { replace: true });
    }
  };

  // Helper function to determine attachment style
  const determineAttachmentStyle = (responses: {
    [key: string]: string;
  }): string => {
    if (responses.reply_response?.includes("Panic")) {
      return "anxious";
    } else if (responses.emotional_intensity_response?.includes("Need space")) {
      return "avoidant";
    } else if (responses.conflict_response?.includes("Talk it out")) {
      return "secure";
    } else {
      return "complex";
    }
  };

  // Helper function to determine tone preference
  const determineTonePreference = (responses: {
    [key: string]: string;
  }): string => {
    if (responses.toxic_trait?.includes("Overthinking")) {
      return "gentle";
    } else if (responses.conflict_response?.includes("Blow up")) {
      return "direct";
    } else if (responses.relationship_goal?.includes("Self-growth")) {
      return "motivational";
    } else {
      return "balanced";
    }
  };

  // Show loading state while initializing
  if (loading) {
    return (
      <div className="min-h-screen pb-20 pt-16 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading your vibe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-16 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 flex flex-col">
      <div className="container px-4 mx-auto max-w-md flex-1 flex flex-col items-center">
        <div className="bg-white/80 dark:bg-gray-900/60 p-8 mt-6 rounded-xl shadow-lg w-full animate-fade-in">
          <h2 className="text-xl font-bold mb-2">{section?.title}</h2>
          <div className="space-y-7">
            {section?.questions.map((q) => (
              <div key={q.key}>
                <p className="font-semibold mb-2">{q.text}</p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      className={`rounded-lg py-2 px-2 text-base bg-gradient-to-r
                        ${
                          responses[q.key] === opt
                            ? "from-purple-400 to-pink-400 text-white font-bold border-2 border-purple-600"
                            : "from-purple-100 to-pink-100 text-black/80 dark:from-purple-900/50 dark:to-pink-900/50 dark:text-white/80"
                        }
                        hover:scale-105 transition-all duration-100`}
                      onClick={() => handleOption(q.key, opt)}
                      type="button"
                    >
                      {opt}
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
              {sectionIdx < quizSections.length - 1
                ? "Next"
                : "Create My Avatar ✨"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
