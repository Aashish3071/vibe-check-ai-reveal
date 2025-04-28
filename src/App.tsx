import { Toaster } from "@/common/components/ui/toaster";
import { Toaster as Sonner } from "@/common/components/ui/sonner";
import { TooltipProvider } from "@/common/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/common/hooks/use-theme";
import { useIsAuthenticated, useIsQuizCompleted } from "@/common/lib/auth";
import { useAppMode } from "@/common/lib/appMode";

// Common Components
import { LayoutSwitcher, NotFound } from "@/common/components";

// Home Page
import { HomePage } from "@/features/home/pages";

// Auth Pages
import { AuthPage } from "@/features/auth/pages";

// Profile Pages
import { Quiz, AvatarGenerator } from "@/features/profile/pages";

// Dating Bestie Pages
import {
  Analyze,
  DecodeVibe,
  IntentDetectorPage,
  PatternRecognizer,
  TarotMode,
} from "@/features/bestie/pages";

// Therapist Bestie Pages
import { MoodCheckPage } from "@/features/therapist/pages";
import { Journal } from "@/features/therapist/components";

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
  const { isAuthenticated, isLoading } = useIsAuthenticated();
  const isQuizCompleted = useIsQuizCompleted();

  // If still loading authentication state, show a loading spinner
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

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
  const { isAuthenticated, isLoading } = useIsAuthenticated();
  const isQuizCompleted = useIsQuizCompleted();
  const { mode } = useAppMode();

  // Add error boundary for debugging
  console.log("QuizRoute - Auth Status:", { isLoading, isAuthenticated, isQuizCompleted });

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading your vibe...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to auth
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // If quiz is completed, redirect to avatar generator
  if (isQuizCompleted) {
    return <Navigate to="/generate-avatar" replace />;
  }

  // Show the quiz
  return <LayoutSwitcher showNavigation={false}>{children}</LayoutSwitcher>;
};

// Route specifically for avatar generation after quiz
const AvatarRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useIsAuthenticated();
  const isQuizCompleted = useIsQuizCompleted();

  console.log("AvatarRoute - isAuthenticated:", isAuthenticated);
  console.log("AvatarRoute - isQuizCompleted:", isQuizCompleted);

  // If still loading, show nothing
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

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
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />

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
