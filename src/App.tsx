import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./hooks/use-theme";
import { useIsAuthenticated } from "./lib/auth";
import { useIsOnboardingComplete, useAppMode } from "./lib/appMode";

import Index from "./pages/Index";
import DecodeVibe from "./pages/DecodeVibe";
import IntentDetectorPage from "./pages/IntentDetectorPage";
import PatternRecognizer from "./pages/PatternRecognizer";
import TarotMode from "./pages/TarotMode";
import Journal from "./pages/Journal";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Quiz from "./pages/Quiz";
import Analyze from "./pages/Analyze";
import MoodCheckPage from "./pages/MoodCheckPage";

import LayoutSwitcher from "./components/LayoutSwitcher";

// Placeholder components for remaining therapist mode features
const SelfCoaching = () => (
  <div className="p-4">Self Coaching (Coming Soon)</div>
);
const PatternTracker = () => (
  <div className="p-4">Pattern Tracker (Coming Soon)</div>
);
const PromptedJournal = () => (
  <div className="p-4">Prompted Journal (Coming Soon)</div>
);

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useIsAuthenticated();
  const hasCompletedOnboarding = useIsOnboardingComplete();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to quiz if onboarding not completed
  if (!hasCompletedOnboarding) {
    return <Navigate to="/quiz" replace />;
  }

  return <LayoutSwitcher>{children}</LayoutSwitcher>;
};

// Route that conditionally shows quiz or redirects to appropriate dashboard
const QuizRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useIsAuthenticated();
  const hasCompletedOnboarding = useIsOnboardingComplete();
  const { mode } = useAppMode();

  // If already onboarded, redirect to the appropriate dashboard based on mode
  if (isAuthenticated && hasCompletedOnboarding) {
    return (
      <Navigate
        to={mode === "dating" ? "/decode-vibe" : "/mood-check"}
        replace
      />
    );
  }

  // If not authenticated, redirect to auth
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Show the quiz with showNavigation=false
  return <LayoutSwitcher showNavigation={false}>{children}</LayoutSwitcher>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/quiz"
              element={
                <LayoutSwitcher showNavigation={false}>
                  <Quiz />
                </LayoutSwitcher>
              }
            />

            {/* Dating mode routes */}
            <Route
              path="/analyze"
              element={
                <ProtectedRoute>
                  <Analyze />
                </ProtectedRoute>
              }
            />
            <Route
              path="/decode-vibe"
              element={
                <ProtectedRoute>
                  <DecodeVibe />
                </ProtectedRoute>
              }
            />
            <Route
              path="/intent-detector"
              element={
                <ProtectedRoute>
                  <IntentDetectorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pattern-recognizer"
              element={
                <ProtectedRoute>
                  <PatternRecognizer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tarot-mode"
              element={
                <ProtectedRoute>
                  <TarotMode />
                </ProtectedRoute>
              }
            />

            {/* Therapist mode routes */}
            <Route
              path="/mood-check"
              element={
                <ProtectedRoute>
                  <MoodCheckPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/self-coaching"
              element={
                <ProtectedRoute>
                  <SelfCoaching />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pattern-tracker"
              element={
                <ProtectedRoute>
                  <PatternTracker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/prompted-journal"
              element={
                <ProtectedRoute>
                  <PromptedJournal />
                </ProtectedRoute>
              }
            />

            {/* Shared routes */}
            <Route
              path="/journal"
              element={
                <ProtectedRoute>
                  <Journal />
                </ProtectedRoute>
              }
            />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
