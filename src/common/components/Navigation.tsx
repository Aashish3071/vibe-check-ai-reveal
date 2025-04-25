
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/common/components/ui/button";
import {
  Home,
  MessageSquare,
  Zap,
  Eye,
  Puzzle,
  ScrollText,
  Brain,
  Heart,
  LineChart,
  BookOpen,
  Sparkles as SparklesIcon,
} from "lucide-react";
import { cn } from "@/common/lib/utils";
import { useAppMode } from "@/common/lib/appMode";

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { mode } = useAppMode();

  // Dating mode features
  const datingFeatures = [
    {
      name: "Decode Vibe",
      href: "/decode-vibe",
      icon: <MessageSquare className="w-5 h-5" />,
      color: "text-blue-500",
    },
    {
      name: "Intent Detector",
      href: "/intent-detector",
      icon: <Eye className="w-5 h-5" />,
      color: "text-amber-500",
    },
    {
      name: "Pattern Finder",
      href: "/pattern-recognizer",
      icon: <Puzzle className="w-5 h-5" />,
      color: "text-indigo-500",
    },
    {
      name: "Tarot",
      href: "/tarot-mode",
      icon: <SparklesIcon className="w-5 h-5" />,
      color: "text-purple-500",
    },
    {
      name: "Journal",
      href: "/journal",
      icon: <ScrollText className="w-5 h-5" />,
      color: "text-pink-500",
    },
  ];

  // Therapist mode features
  const therapistFeatures = [
    {
      name: "Mood Check",
      href: "/mood-check",
      icon: <Brain className="w-5 h-5" />,
      color: "text-teal-500",
    },
    {
      name: "Self Coaching",
      href: "/self-coaching",
      icon: <Heart className="w-5 h-5" />,
      color: "text-green-500",
    },
    {
      name: "Pattern Tracker",
      href: "/pattern-tracker",
      icon: <LineChart className="w-5 h-5" />,
      color: "text-cyan-500",
    },
    {
      name: "Prompted Journal",
      href: "/prompted-journal",
      icon: <BookOpen className="w-5 h-5" />,
      color: "text-emerald-500",
    },
    {
      name: "Journal",
      href: "/journal",
      icon: <ScrollText className="w-5 h-5" />,
      color: "text-green-600",
    },
  ];

  // Choose which features to display based on mode
  const features = mode === "dating" ? datingFeatures : therapistFeatures;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900/95 border-t border-gray-200 dark:border-gray-800 backdrop-blur-md py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {features.map((feature) => (
          <Link key={feature.name} to={feature.href}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col items-center justify-center h-auto gap-1 px-1",
                currentPath === feature.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              <span className={feature.color}>{feature.icon}</span>
              <span className="text-[10px] font-medium leading-none">
                {feature.name}
              </span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
