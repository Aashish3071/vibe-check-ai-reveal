import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  MessageSquareText,
  User2,
  Sparkles,
  BrainCircuit,
  ScrollText,
  Heart,
  Smile,
  Lightbulb,
  BarChart,
} from "lucide-react";
import { useAppMode } from "@/lib/appMode";

const Navigation = () => {
  const location = useLocation();
  const { mode } = useAppMode();

  // Dating mode navigation items
  const datingNavItems = [
    {
      path: "/decode-vibe",
      icon: <MessageSquareText className="h-6 w-6" />,
      label: "Decode Vibe",
    },
    {
      path: "/intent-detector",
      icon: <User2 className="h-6 w-6" />,
      label: "Do They Like Me",
    },
    {
      path: "/pattern-recognizer",
      icon: <BrainCircuit className="h-6 w-6" />,
      label: "Pattern Loop",
    },
    {
      path: "/tarot-mode",
      icon: <Sparkles className="h-6 w-6" />,
      label: "Tarot",
    },
    {
      path: "/journal",
      icon: <ScrollText className="h-6 w-6" />,
      label: "Journal",
    },
  ];

  // Therapist mode navigation items
  const therapistNavItems = [
    {
      path: "/mood-check",
      icon: <Smile className="h-6 w-6" />,
      label: "Mood Check",
    },
    {
      path: "/self-coaching",
      icon: <Lightbulb className="h-6 w-6" />,
      label: "Self-Coaching",
    },
    {
      path: "/pattern-tracker",
      icon: <BarChart className="h-6 w-6" />,
      label: "Patterns",
    },
    {
      path: "/prompted-journal",
      icon: <ScrollText className="h-6 w-6" />,
      label: "Journal",
    },
    {
      path: "/journal",
      icon: <Heart className="h-6 w-6" />,
      label: "Timeline",
    },
  ];

  // Select navigation items based on mode
  const navItems = mode === "dating" ? datingNavItems : therapistNavItems;

  // Dynamic styling based on mode
  const activeColor =
    mode === "dating"
      ? "text-purple-600 dark:text-pink-400"
      : "text-green-600 dark:text-teal-400";

  const hoverColor =
    mode === "dating"
      ? "hover:text-purple-600 dark:hover:text-pink-400"
      : "hover:text-green-600 dark:hover:text-teal-400";

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 backdrop-blur-md border-t z-50",
        mode === "dating"
          ? "bg-white/70 dark:bg-gray-900/70 border-gray-200 dark:border-gray-800"
          : "bg-white/70 dark:bg-gray-900/70 border-green-100 dark:border-green-950/50"
      )}
    >
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-between items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center py-3 px-2 text-xs",
                location.pathname === item.path
                  ? activeColor
                  : `text-gray-500 dark:text-gray-400 ${hoverColor}`
              )}
            >
              {item.icon}
              <span className="mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
