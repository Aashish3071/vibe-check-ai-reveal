import { useState, useEffect, useCallback } from "react";
import {
  awardAchievement,
  getUserAchievements,
  recordDailyCheckIn,
} from "@/common/lib/achievements";
import { toast } from "sonner";

export function useAchievements() {
  const [loading, setLoading] = useState(false);
  const [userAchievements, setUserAchievements] = useState<string[]>([]);

  // Load user's achievements
  useEffect(() => {
    const loadAchievements = async () => {
      const { achievements, error } = await getUserAchievements();

      if (error) {
        console.error("Error loading achievements:", error);
      } else {
        // Create a list of achievement names the user has earned
        const achievementNames = achievements
          .map(
            (ua) =>
              // @ts-ignore - TypeScript doesn't know about the achievement property
              ua.achievement?.name || ""
          )
          .filter(Boolean);

        setUserAchievements(achievementNames);
      }
    };

    loadAchievements();
  }, []);

  // Check if user has a specific achievement
  const hasAchievement = useCallback(
    (achievementName: string) => {
      return userAchievements.includes(achievementName);
    },
    [userAchievements]
  );

  // Award an achievement if the user doesn't already have it
  const award = useCallback(
    async (achievementName: string) => {
      if (hasAchievement(achievementName)) {
        return { success: true, alreadyAwarded: true };
      }

      setLoading(true);
      const result = await awardAchievement(achievementName);
      setLoading(false);

      if (result.success && !result.alreadyAwarded) {
        // Update local state
        setUserAchievements((prev) => [...prev, achievementName]);
      }

      return result;
    },
    [hasAchievement]
  );

  // Record daily check-in
  const checkIn = useCallback(async () => {
    setLoading(true);
    const result = await recordDailyCheckIn();
    setLoading(false);

    if (result.success && !result.alreadyCheckedIn) {
      toast.success(`Day ${result.streakCount} completed! ✓`, {
        description: "Keep up the good work!",
      });
    }

    return result;
  }, []);

  // Track feature usage and award achievements
  const trackFeatureUsage = useCallback(
    async (feature: string) => {
      switch (feature) {
        case "conversation-analyzer":
          return award("Conversation Analyst");

        case "intent-detector":
          return award("Intent Detective");

        case "pattern-recognizer":
          return award("Pattern Pro");

        case "tarot-reading":
          return award("Tarot Novice");

        case "mood-check":
          return award("Mood Tracker");

        case "journal":
          return award("Journal Starter");

        case "profile-complete":
          return award("Profile Complete");

        case "avatar-generator":
          return award("Avatar Creator");

        case "personality-quiz":
          return award("Personality Quiz");

        default:
          return { success: false, error: "Unknown feature" };
      }
    },
    [award]
  );

  return {
    loading,
    userAchievements,
    hasAchievement,
    award,
    checkIn,
    trackFeatureUsage,
  };
}

// No default export needed since we're using named exports
