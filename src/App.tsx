import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./hooks/use-theme";
import { useIsAuthenticated, useIsQuizCompleted } from "./lib/auth";
import { useAppMode } from "./lib/appMode";

// Shared Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Quiz from "./pages/Quiz";
import NotFound from "./pages/NotFound";
import Journal from "./pages/Journal";
import AvatarGenerator from "./pages/AvatarGenerator";

// Layout
import LayoutSwitcher from "./components/LayoutSwitcher";

// Dating Bestie Pages and Components
import DecodeVibe from "./features/bestie/pages/DecodeVibe";
import IntentDetectorPage from "./features/bestie/pages/IntentDetectorPage";
import PatternRecognizer from "./features/bestie/pages/PatternRecognizer";
import TarotMode from "./features/bestie/pages/TarotMode";
import Analyze from "./features/bestie/pages/Analyze";

// Therapist Bestie Pages and Components
import MoodCheckPage from "./features/therapist/pages/MoodCheckPage";

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
  const isQuizCompleted = useIsQuizCompleted();

  if (!isAuthenticated) {
    // Only show the login page if not authenticated
    console.log("ProtectedRoute - Redirecting to auth");
    return <Navigate to="/auth" replace />;
  }

  // Redirect to quiz if quiz not completed
  if (!isQuizCompleted) {
    console.log("ProtectedRoute - Redirecting to quiz");
    return <Navigate to="/quiz" replace />;
  }

  return <LayoutSwitcher>{children}</LayoutSwitcher>;
};

// Route that conditionally shows quiz or redirects to appropriate dashboard
const QuizRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useIsAuthenticated();
  const isQuizCompleted = useIsQuizCompleted();
  const { mode } = useAppMode();

  console.log("QuizRoute - isAuthenticated:", isAuthenticated);
  console.log("QuizRoute - isQuizCompleted:", isQuizCompleted);

  // If already completed quiz, redirect to the avatar generator or appropriate dashboard
  if (isAuthenticated && isQuizCompleted) {
    console.log("QuizRoute - Quiz completed, redirecting to dashboard");
    // User has already completed quiz, send to appropriate dashboard
    return (
      <Navigate
        to={mode === "dating" ? "/decode-vibe" : "/mood-check"}
        replace
      />
    );
  }

  // If not authenticated, redirect to auth
  if (!isAuthenticated) {
    console.log("QuizRoute - Not authenticated, redirecting to auth");
    return <Navigate to="/auth" replace />;
  }

  console.log("QuizRoute - Showing quiz");
  // Show the quiz with showNavigation=false
  return <LayoutSwitcher showNavigation={false}>{children}</LayoutSwitcher>;
};

// Route specifically for avatar generation after quiz
const AvatarRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useIsAuthenticated();
  const isQuizCompleted = useIsQuizCompleted();

  // If not authenticated, redirect to auth
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // If quiz not completed, redirect to quiz first
  if (!isQuizCompleted) {
    return <Navigate to="/quiz" replace />;
  }

  // Show the avatar generator with no navigation
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

            {/* Quiz and Avatar Generator routes */}
            <Route
              path="/quiz"
              element={
                <QuizRoute>
                  <Quiz />
                </QuizRoute>
              }
            />
            <Route
              path="/generate-avatar"
              element={
                <AvatarRoute>
                  <AvatarGenerator />
                </AvatarRoute>
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
