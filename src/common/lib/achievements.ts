import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// Achievement types
export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "streak" | "dating" | "therapist" | "profile";
  points: number;
  created_at: string;
};

export type UserAchievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement; // For joined queries
};

export type StreakHistory = {
  id: string;
  user_id: string;
  check_in_date: string;
  created_at: string;
};

// Function to record a daily check-in and update streak
export async function recordDailyCheckIn() {
  try {
    const { data: session } = await supabase.auth.getSession();

    if (!session.session?.user) {
      console.error("No authenticated user");
      return { success: false, error: "Not authenticated" };
    }

    const userId = session.session.user.id;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    // Check if user already checked in today
    const { data: existingCheckIn, error: checkError } = await supabase
      .from("streak_history")
      .select("*")
      .eq("user_id", userId)
      .eq("check_in_date", today)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" error
      console.error("Error checking existing check-in:", checkError);
      return { success: false, error: checkError.message };
    }

    // If already checked in today, return early
    if (existingCheckIn) {
      return { success: true, alreadyCheckedIn: true };
    }

    // Record new check-in
    const { data, error } = await supabase
      .from("streak_history")
      .insert({
        user_id: userId,
        check_in_date: today,
      })
      .select()
      .single();

    if (error) {
      console.error("Error recording check-in:", error);
      return { success: false, error: error.message };
    }

    // Get updated user data with new streak count
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("streak_count")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Error fetching updated user data:", userError);
      return { success: false, error: userError.message };
    }

    return {
      success: true,
      streakCount: userData.streak_count,
      checkIn: data,
    };
  } catch (err) {
    const error = err as Error;
    console.error("Unexpected error in recordDailyCheckIn:", error);
    return { success: false, error: error.message };
  }
}

// Function to get user's current streak
export async function getUserStreak() {
  try {
    const { data: session } = await supabase.auth.getSession();

    if (!session.session?.user) {
      console.error("No authenticated user");
      return { streakCount: 0, error: "Not authenticated" };
    }

    const userId = session.session.user.id;

    const { data, error } = await supabase
      .from("users")
      .select("streak_count, last_active")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user streak:", error);
      return { streakCount: 0, error: error.message };
    }

    return {
      streakCount: data.streak_count || 0,
      lastActive: data.last_active,
      error: null,
    };
  } catch (err) {
    const error = err as Error;
    console.error("Unexpected error in getUserStreak:", error);
    return { streakCount: 0, error: error.message };
  }
}

// Function to get user's streak history
export async function getStreakHistory(limit = 30) {
  try {
    const { data: session } = await supabase.auth.getSession();

    if (!session.session?.user) {
      console.error("No authenticated user");
      return { history: [], error: "Not authenticated" };
    }

    const userId = session.session.user.id;

    const { data, error } = await supabase
      .from("streak_history")
      .select("*")
      .eq("user_id", userId)
      .order("check_in_date", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching streak history:", error);
      return { history: [], error: error.message };
    }

    return { history: data, error: null };
  } catch (err) {
    const error = err as Error;
    console.error("Unexpected error in getStreakHistory:", error);
    return { history: [], error: error.message };
  }
}

// Function to get all available achievements
export async function getAchievements() {
  try {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("category")
      .order("points");

    if (error) {
      console.error("Error fetching achievements:", error);
      return { achievements: [], error: error.message };
    }

    return { achievements: data, error: null };
  } catch (err) {
    const error = err as Error;
    console.error("Unexpected error in getAchievements:", error);
    return { achievements: [], error: error.message };
  }
}

// Function to get user's earned achievements
export async function getUserAchievements() {
  try {
    const { data: session } = await supabase.auth.getSession();

    if (!session.session?.user) {
      console.error("No authenticated user");
      return { achievements: [], error: "Not authenticated" };
    }

    const userId = session.session.user.id;

    const { data, error } = await supabase
      .from("user_achievements")
      .select(
        `
        *,
        achievement:achievement_id(*)
      `
      )
      .eq("user_id", userId)
      .order("earned_at", { ascending: false });

    if (error) {
      console.error("Error fetching user achievements:", error);
      return { achievements: [], error: error.message };
    }

    return { achievements: data, error: null };
  } catch (err) {
    const error = err as Error;
    console.error("Unexpected error in getUserAchievements:", error);
    return { achievements: [], error: error.message };
  }
}

// Function to manually award an achievement (for non-streak achievements)
export async function awardAchievement(achievementName: string) {
  try {
    const { data: session } = await supabase.auth.getSession();

    if (!session.session?.user) {
      console.error("No authenticated user");
      return { success: false, error: "Not authenticated" };
    }

    const userId = session.session.user.id;

    // First, get the achievement ID
    const { data: achievement, error: achievementError } = await supabase
      .from("achievements")
      .select("id, name, icon")
      .eq("name", achievementName)
      .single();

    if (achievementError) {
      console.error("Error finding achievement:", achievementError);
      return { success: false, error: achievementError.message };
    }

    // Check if user already has this achievement
    const { data: existingAchievement, error: checkError } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", userId)
      .eq("achievement_id", achievement.id)
      .single();

    if (!checkError && existingAchievement) {
      // User already has this achievement
      return { success: true, alreadyAwarded: true };
    }

    // Award the achievement
    const { data, error } = await supabase
      .from("user_achievements")
      .insert({
        user_id: userId,
        achievement_id: achievement.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error awarding achievement:", error);
      return { success: false, error: error.message };
    }

    // Show a toast notification
    toast.success(`Achievement Unlocked: ${achievement.name}`, {
      description: `${achievement.icon} You've earned a new achievement!`,
      duration: 5000,
    });

    return { success: true, achievement: data };
  } catch (err) {
    const error = err as Error;
    console.error("Unexpected error in awardAchievement:", error);
    return { success: false, error: error.message };
  }
}

// Function to get user's achievement progress
export async function getAchievementProgress() {
  try {
    const { achievements: allAchievements, error: allError } =
      await getAchievements();
    const { achievements: userAchievements, error: userError } =
      await getUserAchievements();

    if (allError) {
      return { progress: null, error: allError };
    }

    if (userError) {
      return { progress: null, error: userError };
    }

    const totalAchievements = allAchievements.length;
    const earnedAchievements = userAchievements.length;

    // Calculate total points
    const totalPoints = allAchievements.reduce(
      (sum, achievement) => sum + achievement.points,
      0
    );

    // Calculate earned points
    const earnedPoints = userAchievements.reduce((sum, userAchievement) => {
      const achievement = userAchievement.achievement as Achievement;
      return sum + (achievement?.points || 0);
    }, 0);

    // Calculate progress by category
    const categories = ["streak", "dating", "therapist", "profile"];
    const categoryProgress = categories.map((category) => {
      const categoryAchievements = allAchievements.filter(
        (a) => a.category === category
      );
      const earnedCategoryAchievements = userAchievements.filter(
        (ua) => (ua.achievement as Achievement)?.category === category
      );

      return {
        category,
        total: categoryAchievements.length,
        earned: earnedCategoryAchievements.length,
        percentage:
          categoryAchievements.length > 0
            ? Math.round(
                (earnedCategoryAchievements.length /
                  categoryAchievements.length) *
                  100
              )
            : 0,
      };
    });

    return {
      progress: {
        totalAchievements,
        earnedAchievements,
        percentage: Math.round((earnedAchievements / totalAchievements) * 100),
        totalPoints,
        earnedPoints,
        pointsPercentage: Math.round((earnedPoints / totalPoints) * 100),
        categoryProgress,
      },
      error: null,
    };
  } catch (err) {
    const error = err as Error;
    console.error("Unexpected error in getAchievementProgress:", error);
    return { progress: null, error: error.message };
  }
}
