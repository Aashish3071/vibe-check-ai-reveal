import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs";
import { Progress } from "@/common/components/ui/progress";
import { Award, Calendar, CheckCircle, Lock } from "lucide-react";
import {
  getAchievements,
  getUserAchievements,
  getAchievementProgress,
} from "@/common/lib/achievements";
import { Achievement, UserAchievement } from "@/common/lib/achievements";
import { Badge } from "@/common/components/ui/badge";
import { motion } from "framer-motion";
import { Skeleton } from "@/common/components/ui/skeleton";

type AchievementWithStatus = Achievement & {
  earned: boolean;
  earnedAt?: string;
};

type CategoryProgress = {
  category: string;
  total: number;
  earned: number;
  percentage: number;
};

const AchievementsDisplay = () => {
  const [milestones, setMilestones] = useState<AchievementWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [progress, setProgress] = useState({
    totalMilestones: 0,
    completedMilestones: 0,
    percentage: 0,
    categoryProgress: [] as CategoryProgress[],
  });

  // Load achievements data
  useEffect(() => {
    const loadAchievementsData = async () => {
      setLoading(true);

      // Get all achievements
      const { achievements: allAchievements, error: achievementsError } =
        await getAchievements();

      // Get user's earned achievements
      const { achievements: userAchievements, error: userAchievementsError } =
        await getUserAchievements();

      // Get achievement progress
      const { progress: achievementProgress, error: progressError } =
        await getAchievementProgress();

      if (achievementsError || userAchievementsError || progressError) {
        console.error("Error loading achievements data:", {
          achievementsError,
          userAchievementsError,
          progressError,
        });
      } else {
        // Create a map of earned achievements for quick lookup
        const earnedMap = new Map<string, UserAchievement>();
        userAchievements.forEach((ua) => {
          earnedMap.set(ua.achievement_id, ua);
        });

        // Combine the data
        const milestonesWithStatus = allAchievements.map((achievement) => ({
          ...achievement,
          earned: earnedMap.has(achievement.id),
          earnedAt: earnedMap.get(achievement.id)?.earned_at,
        }));

        setMilestones(milestonesWithStatus);

        if (achievementProgress) {
          // Convert achievement progress to milestone progress
          setProgress({
            totalMilestones: achievementProgress.totalAchievements,
            completedMilestones: achievementProgress.earnedAchievements,
            percentage: achievementProgress.percentage,
            categoryProgress: achievementProgress.categoryProgress,
          });
        }
      }

      setLoading(false);
    };

    loadAchievementsData();
  }, []);

  // Filter milestones based on active tab
  const filteredMilestones = milestones.filter((milestone) => {
    if (activeTab === "all") return true;
    if (activeTab === "earned") return milestone.earned;
    if (activeTab === "locked") return !milestone.earned;
    return milestone.category === activeTab;
  });

  // Get category name for display
  const getCategoryName = (category: string) => {
    switch (category) {
      case "streak":
        return "Streak";
      case "dating":
        return "Dating Bestie";
      case "therapist":
        return "Therapist Bestie";
      case "profile":
        return "Profile";
      default:
        return category;
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "streak":
        return "bg-amber-500";
      case "dating":
        return "bg-pink-500";
      case "therapist":
        return "bg-green-500";
      case "profile":
        return "bg-blue-500";
      default:
        return "bg-purple-500";
    }
  };

  // Milestone card component
  const MilestoneCard = ({
    milestone,
  }: {
    milestone: AchievementWithStatus;
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          className={`border-2 ${
            milestone.earned
              ? "border-green-200 dark:border-green-800/50 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20"
              : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  milestone.earned
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600"
                }`}
              >
                {milestone.earned ? (
                  <div className="text-xl">{milestone.icon}</div>
                ) : (
                  <Lock className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">{milestone.name}</h3>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getCategoryColor(
                      milestone.category
                    )} bg-opacity-10`}
                  >
                    {getCategoryName(milestone.category)}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                  {milestone.description}
                </p>

                {milestone.earned && milestone.earnedAt && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Completed{" "}
                    {new Date(milestone.earnedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // Loading skeleton
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-20 w-full mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-100 dark:border-green-900/30 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-green-500" />
          Your Progress
        </CardTitle>
        <CardDescription>
          Track your journey and personal growth
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress summary */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">
              {progress.completedMilestones} of {progress.totalMilestones}{" "}
              milestones completed
            </span>
            <span className="text-sm text-muted-foreground">
              {progress.percentage}%
            </span>
          </div>
          <Progress value={progress.percentage} className="h-2" />

          <div className="grid grid-cols-2 gap-4 mt-4">
            {progress.categoryProgress.map((category) => (
              <div
                key={category.category}
                className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">
                    {getCategoryName(category.category)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {category.earned}/{category.total}
                  </span>
                </div>
                <Progress
                  value={category.percentage}
                  className={`h-1.5 ${
                    category.category === "streak"
                      ? "bg-amber-200 dark:bg-amber-950"
                      : category.category === "dating"
                      ? "bg-pink-200 dark:bg-pink-950"
                      : category.category === "therapist"
                      ? "bg-green-200 dark:bg-green-950"
                      : "bg-blue-200 dark:bg-blue-950"
                  }`}
                  indicatorClassName={`${getCategoryColor(category.category)}`}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div>
              <span className="text-sm font-medium flex items-center gap-1">
                <Calendar className="h-4 w-4 text-green-500" />
                Your Journey
              </span>
              <span className="text-xs text-muted-foreground">
                Track your progress over time
              </span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                {progress.completedMilestones}
              </span>
              <span className="text-sm text-muted-foreground">milestones</span>
            </div>
          </div>
        </div>

        {/* Tabs for filtering milestones */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4 grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="earned">Completed</TabsTrigger>
            <TabsTrigger value="locked">Upcoming</TabsTrigger>
            <TabsTrigger value="streak">Streak</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 gap-3">
              {filteredMilestones.length > 0 ? (
                filteredMilestones.map((milestone) => (
                  <MilestoneCard key={milestone.id} milestone={milestone} />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No milestones found in this category.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AchievementsDisplay;
