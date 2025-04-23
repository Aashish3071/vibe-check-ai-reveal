import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Smile, Heart, Frown, Meh, Clock } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

type Mood = "great" | "good" | "neutral" | "sad" | "bad";

const MoodEmoji = ({
  mood,
  selected,
  onClick,
}: {
  mood: Mood;
  selected: boolean;
  onClick: () => void;
}) => {
  const getEmoji = () => {
    switch (mood) {
      case "great":
        return <Smile className="h-6 w-6 text-green-500" />;
      case "good":
        return <Heart className="h-6 w-6 text-teal-500" />;
      case "neutral":
        return <Meh className="h-6 w-6 text-blue-500" />;
      case "sad":
        return <Frown className="h-6 w-6 text-purple-500" />;
      case "bad":
        return <Frown className="h-6 w-6 text-red-500" />;
    }
  };

  const getMoodText = () => {
    switch (mood) {
      case "great":
        return "Great";
      case "good":
        return "Good";
      case "neutral":
        return "Neutral";
      case "sad":
        return "Sad";
      case "bad":
        return "Struggling";
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
        selected
          ? "bg-green-100 dark:bg-green-900/40 border-2 border-green-500"
          : "bg-gray-100 dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20"
      }`}
    >
      {getEmoji()}
      <span className="mt-1 text-sm">{getMoodText()}</span>
    </motion.button>
  );
};

const MoodCheck = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [reflection, setReflection] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedMood) {
      toast.error("Please select a mood");
      return;
    }

    // In a real app, save to user's mood history
    toast.success("Mood check-in saved", {
      description: "Your reflection has been recorded",
    });
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setSelectedMood(null);
    setReflection("");
    setIsSubmitted(false);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h2 className="text-2xl font-medium text-center mb-2">
        How are you feeling today?
      </h2>
      <p className="text-center text-muted-foreground mb-6">
        Take a moment to check in with yourself
      </p>

      {!isSubmitted ? (
        <Card className="border-green-100 dark:border-green-900/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Mood Check-in</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2 mb-6">
              {(["great", "good", "neutral", "sad", "bad"] as Mood[]).map(
                (mood) => (
                  <MoodEmoji
                    key={mood}
                    mood={mood}
                    selected={selectedMood === mood}
                    onClick={() => setSelectedMood(mood)}
                  />
                )
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Reflection (optional)
              </label>
              <Textarea
                placeholder="What's on your mind today? How are you really feeling?"
                className="min-h-[120px]"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-90"
            >
              Save Check-in
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="border-green-100 dark:border-green-900/30 shadow-lg text-center">
          <CardHeader>
            <CardTitle>Thank you for checking in</CardTitle>
            <CardDescription>
              Regular reflection helps build emotional awareness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center my-4">
              {selectedMood === "great" && (
                <Smile className="h-20 w-20 text-green-500" />
              )}
              {selectedMood === "good" && (
                <Heart className="h-20 w-20 text-teal-500" />
              )}
              {selectedMood === "neutral" && (
                <Meh className="h-20 w-20 text-blue-500" />
              )}
              {selectedMood === "sad" && (
                <Frown className="h-20 w-20 text-purple-500" />
              )}
              {selectedMood === "bad" && (
                <Frown className="h-20 w-20 text-red-500" />
              )}
            </div>

            {reflection && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-left">
                <p className="italic text-sm">{reflection}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-center">
            <Button
              onClick={resetForm}
              variant="outline"
              className="border-green-200 dark:border-green-800"
            >
              New Check-in
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default MoodCheck;
