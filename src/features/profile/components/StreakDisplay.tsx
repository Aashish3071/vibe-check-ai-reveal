import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import { Progress } from "@/common/components/ui/progress";
import { Flame, CheckCircle, Calendar } from "lucide-react";
import { getUserStreak, recordDailyCheckIn } from "@/common/lib/achievements";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/common/components/ui/button";

const StreakDisplay = () => {
  const [streakCount, setStreakCount] = useState(0);
  const [lastActive, setLastActive] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedInToday, setCheckedInToday] = useState(false);

  // Function to check if the user has checked in today
  const hasCheckedInToday = (lastActiveDate: string | null) => {
    if (!lastActiveDate) return false;

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const lastActiveDay = new Date(lastActiveDate).toISOString().split("T")[0];

    return today === lastActiveDay;
  };

  // Load streak data
  useEffect(() => {
    const loadStreakData = async () => {
      setLoading(true);
      const {
        streakCount: count,
        lastActive: lastActiveDate,
        error,
      } = await getUserStreak();

      if (error) {
        toast.error("Failed to load streak data");
        console.error("Error loading streak data:", error);
      } else {
        setStreakCount(count);
        setLastActive(lastActiveDate);
        setCheckedInToday(hasCheckedInToday(lastActiveDate));
      }

      setLoading(false);
    };

    loadStreakData();
  }, []);

  // Handle check-in
  const handleCheckIn = async () => {
    if (checkedInToday) {
      toast.info("You've already checked in today!");
      return;
    }

    setLoading(true);
    const {
      success,
      streakCount: newStreakCount,
      error,
      alreadyCheckedIn,
    } = await recordDailyCheckIn();

    if (error) {
      toast.error("Failed to record check-in");
      console.error("Error recording check-in:", error);
    } else if (alreadyCheckedIn) {
      toast.info("You've already checked in today!");
      setCheckedInToday(true);
    } else if (success) {
      toast.success(`Day ${newStreakCount} completed! ✓`, {
        description: "Keep up the good work!",
      });
      setStreakCount(newStreakCount || streakCount + 1);
      setCheckedInToday(true);
      setLastActive(new Date().toISOString());
    }

    setLoading(false);
  };

  // Calculate streak milestone
  const getNextMilestone = () => {
    if (streakCount < 7)
      return { target: 7, progress: (streakCount / 7) * 100 };
    if (streakCount < 14)
      return { target: 14, progress: ((streakCount - 7) / 7) * 100 };
    if (streakCount < 30)
      return { target: 30, progress: ((streakCount - 14) / 16) * 100 };
    if (streakCount < 100)
      return { target: 100, progress: ((streakCount - 30) / 70) * 100 };
    return { target: streakCount + 10, progress: 100 };
  };

  const nextMilestone = getNextMilestone();

  return (
    <Card className="border-green-100 dark:border-green-900/30 shadow-lg overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-green-500" />
          Daily Check-in
        </CardTitle>
        <CardDescription>Track your daily progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-4">
          <motion.div
            className="relative"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900/40 dark:to-green-700/40 flex items-center justify-center">
              <motion.div
                className="text-3xl font-bold text-green-600 dark:text-green-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {streakCount}
              </motion.div>
            </div>
            {streakCount > 0 && (
              <motion.div
                className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <CheckCircle className="h-5 w-5" />
              </motion.div>
            )}
          </motion.div>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {streakCount === 0
                ? "Start tracking your progress today!"
                : `You've checked in ${streakCount} day${
                    streakCount === 1 ? "" : "s"
                  } in a row!`}
            </p>
          </div>

          <div className="w-full mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Current: {streakCount}</span>
              <span>Goal: {nextMilestone.target} days</span>
            </div>
            <Progress value={nextMilestone.progress} className="h-2" />
          </div>

          <Button
            onClick={handleCheckIn}
            disabled={loading || checkedInToday}
            className="mt-6 bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-90 transition-opacity"
          >
            {checkedInToday
              ? "Checked in today ✓"
              : loading
              ? "Loading..."
              : "Check in for today ✓"}
          </Button>

          {lastActive && (
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                Last active: {new Date(lastActive).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakDisplay;
