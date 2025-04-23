import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { useAppMode } from "@/lib/appMode";
import Sparkles from "@/components/Sparkles";

interface DatingLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const DatingLayout: React.FC<DatingLayoutProps> = ({
  children,
  showNavigation = true,
}) => {
  const { mode } = useAppMode();
  const isActive = mode === "dating";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: isActive ? 1 : 0,
        display: isActive ? "block" : "none",
      }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pb-20 pt-16 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30"
    >
      <Header />

      <main className="container mx-auto px-4 max-w-md relative">
        <Sparkles count={5} />
        {children}
      </main>

      {showNavigation && <Navigation />}
    </motion.div>
  );
};

export default DatingLayout;
