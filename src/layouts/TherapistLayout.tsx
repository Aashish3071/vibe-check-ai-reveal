import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { useAppMode } from "@/lib/appMode";

interface TherapistLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const TherapistLayout: React.FC<TherapistLayoutProps> = ({
  children,
  showNavigation = true,
}) => {
  const { mode } = useAppMode();
  const isActive = mode === "therapist";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: isActive ? 1 : 0,
        display: isActive ? "block" : "none",
      }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pb-20 pt-16 bg-gradient-to-b from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30"
    >
      <Header />

      {/* Calm waves pattern */}
      <div className="fixed inset-0 z-0 opacity-10 dark:opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMTI4MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzAyNjY3MiI+PHBhdGggZD0iTTEyODAgMEw2NDAgNzAgMCAwdjE0MGw2NDAgLTcwIDY0MCA3MFYweiIgZmlsbC1vcGFjaXR5PSIuNSIvPjxwYXRoIGQ9Ik0xMjgwIDBIBDAgMHYxNDBsNjQwIC02NSA2NDAgNjVWMHoiLz48L2c+PC9zdmc+')] bg-bottom bg-repeat-x animate-wave-slow" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMTI4MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzAyOTdhOSI+PHBhdGggZD0iTTAgOTAuNzJsMTQwLTI4Ljk4IDE0NS41MiAxOUw2NDAgMjIuNTQgMTI4MCA4MFY2MEw2NDAgMCAyODUuNTIgNTQuNzIgMTQwIDM1Ljc0IDAgNjBWOTAuNzJ6IiBmaWxsLW9wYWNpdHk9Ii41MCIvPjxwYXRoIGQ9Ik0wIDEyMEwxNDAgNjAuOTQgMjg1LjUyIDc5Ljk0IDY0MCAyMCAxMjgwIDEwMFYwTDY0MCA2MEwyODUuNTIgMTUuMjYgMTQwIDQwIDAgNjBWMTIweiIvPjwvZz48L3N2Zz4=')] bg-bottom bg-repeat-x animate-wave" />
      </div>

      <main className="container mx-auto px-4 max-w-md relative z-10">
        <div className="mb-8 mt-2 flex justify-center opacity-80">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
        </div>

        {children}

        <div className="mt-10 mb-8 flex justify-center opacity-80">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
        </div>
      </main>

      {showNavigation && <Navigation />}
    </motion.div>
  );
};

export default TherapistLayout;
