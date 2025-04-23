import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSetQuizCompleted, useSetUserAvatar, UserAvatar } from "@/lib/auth";
import { useAppMode } from "@/lib/appMode";
import { Sparkles as SparklesIcon } from "lucide-react";
import { toast } from "sonner";
import Sparkles from "@/components/Sparkles";

// Personas based on quiz data
const avatarPersonas: UserAvatar[] = [
  {
    type: "soft-boundaries",
    emoji: "✨",
    name: "Soft Boundaries Bestie",
    bio: "Always ready with a tissue and a truth bomb.",
    tags: ["empathetic", "direct", "supportive"],
  },
  {
    type: "situationship-sleuth",
    emoji: "🔍",
    name: "Situationship Sleuth",
    bio: "Analyzing mixed signals since your first crush.",
    tags: ["analytical", "observant", "honest"],
  },
  {
    type: "deep-feelings-oracle",
    emoji: "🔮",
    name: "Deep-Feelings Oracle",
    bio: "Vibes with your spiritual side while keeping it real.",
    tags: ["intuitive", "spiritual", "perceptive"],
  },
  {
    type: "tough-love-confidant",
    emoji: "💪",
    name: "Tough Love Confidant",
    bio: "Here to push you beyond excuses and into growth.",
    tags: ["straightforward", "motivating", "blunt"],
  },
  {
    type: "healing-hype-squad",
    emoji: "🌱",
    name: "Healing Hype Squad",
    bio: "Your recovery journey deserves a cheer section.",
    tags: ["encouraging", "compassionate", "positive"],
  },
];

// Generate a random persona
const getRandomPersona = (): UserAvatar => {
  const randomIndex = Math.floor(Math.random() * avatarPersonas.length);
  return avatarPersonas[randomIndex];
};

const AvatarGenerator = () => {
  const navigate = useNavigate();
  const setQuizCompleted = useSetQuizCompleted();
  const setUserAvatar = useSetUserAvatar();
  const { mode } = useAppMode();
  const [generatedAvatar, setGeneratedAvatar] = useState<UserAvatar | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(true);

  // Simulate generating the avatar
  useEffect(() => {
    const timer = setTimeout(() => {
      const avatar = getRandomPersona();
      setGeneratedAvatar(avatar);
      setIsGenerating(false);
    }, 2500); // Simulate some generation time for effect

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    if (generatedAvatar) {
      // Save avatar to user profile
      setUserAvatar(generatedAvatar);

      // Mark quiz as completed
      setQuizCompleted(true);

      // Show success message
      toast.success(`Your avatar is ready! Welcome, ${generatedAvatar.name}!`, {
        description:
          "Your journey begins now. Let's explore your emotions together.",
      });

      // Navigate to the dashboard based on mode
      const destination = mode === "dating" ? "/decode-vibe" : "/mood-check";
      navigate(destination, { replace: true });
    }
  };

  const handleRegenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const avatar = getRandomPersona();
      setGeneratedAvatar(avatar);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-10 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 flex flex-col items-center relative">
      <div className="container px-4 mx-auto max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2 text-purple-700 dark:text-pink-200">
          Creating Your Vibe Avatar
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          Based on your unique emotional style
        </p>

        {isGenerating ? (
          <Card className="w-full relative overflow-hidden">
            <Sparkles count={10} />
            <CardHeader className="text-center">
              <CardTitle>Generating your avatar...</CardTitle>
              <CardDescription>
                Analyzing your emotional patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-10">
              <div className="animate-spin h-16 w-16 rounded-full border-b-2 border-purple-600"></div>
            </CardContent>
          </Card>
        ) : (
          generatedAvatar && (
            <Card className="w-full relative overflow-hidden animate-fade-in">
              <Sparkles count={5} />
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-4xl">
                  {generatedAvatar.emoji}
                </div>
                <CardTitle className="text-2xl">
                  {generatedAvatar.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  Your personalized AI bestie
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="italic text-muted-foreground mb-4">
                  "{generatedAvatar.bio}"
                </p>

                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {generatedAvatar.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-100 dark:bg-purple-900/40 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={handleRegenerate}
                  className="border-purple-300 dark:border-purple-700"
                >
                  Regenerate
                </Button>
                <Button onClick={handleContinue}>
                  Continue with this avatar
                </Button>
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </div>
  );
};

export default AvatarGenerator;
