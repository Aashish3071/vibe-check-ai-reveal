import React from "react";
import { motion } from "framer-motion";
import { useAppMode } from "@/common/lib/appMode";
import { Switch } from "@/common/components/ui/switch";
import { Heart, Brain } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/common/components/ui/tooltip";

const ModeToggle: React.FC = () => {
  const { mode, toggleMode } = useAppMode();
  const isDating = mode === "dating";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            <Switch
              checked={!isDating}
              onCheckedChange={toggleMode}
              className={`${
                isDating
                  ? "bg-gradient-to-r from-purple-400 to-pink-400"
                  : "bg-gradient-to-r from-green-400 to-teal-400"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
            />
            <motion.div
              className="absolute ml-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md"
              animate={{
                x: isDating ? 0 : 20,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {isDating ? (
                <Heart className="h-3 w-3 text-pink-500" />
              ) : (
                <Brain className="h-3 w-3 text-teal-500" />
              )}
            </motion.div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Switch to {isDating ? "Therapist" : "Dating"} Bestie</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ModeToggle;
