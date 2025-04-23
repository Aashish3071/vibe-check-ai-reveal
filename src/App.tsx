
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./hooks/use-theme";

import Index from "./pages/Index";
import DecodeVibe from "./pages/DecodeVibe";
import IntentDetectorPage from "./pages/IntentDetectorPage";
import PatternRecognizer from "./pages/PatternRecognizer";
import TarotMode from "./pages/TarotMode";
import Journal from "./pages/Journal";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Quiz from "./pages/Quiz";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/decode-vibe" element={<DecodeVibe />} />
            <Route path="/intent-detector" element={<IntentDetectorPage />} />
            <Route path="/pattern-recognizer" element={<PatternRecognizer />} />
            <Route path="/tarot-mode" element={<TarotMode />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
