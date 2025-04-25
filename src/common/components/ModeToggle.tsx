
import React from "react";
import { Button } from "@/common/components/ui/button";
import { useAppMode, AppMode } from "@/common/lib/appMode";
import { Heart, Brain } from "lucide-react";

const ModeToggle = () => {
  const { mode, setMode } = useAppMode();

  const toggleMode = () => {
    setMode(mode === "dating" ? "therapist" : "dating");
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={toggleMode}
      className="flex items-center gap-1.5 px-3 py-1.5 h-9 rounded-full border border-purple-200 dark:border-purple-800"
    >
      {mode === "dating" ? (
        <>
          <Heart className="h-3.5 w-3.5 text-pink-500 fill-pink-500" />
          <span className="text-xs">Switch to Therapist</span>
        </>
      ) : (
        <>
          <Brain className="h-3.5 w-3.5 text-green-500" />
          <span className="text-xs">Switch to Dating</span>
        </>
      )}
    </Button>
  );
};

export default ModeToggle;
