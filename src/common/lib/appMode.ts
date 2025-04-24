import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppMode = "dating" | "therapist";
export type VibePersona =
  | "hopeful"
  | "cautious"
  | "reflective"
  | "analytical"
  | "balanced";

interface AppModeState {
  // Core state
  mode: AppMode;
  vibePersona: VibePersona | null;
  hasCompletedOnboarding: boolean;

  // Actions
  toggleMode: () => void;
  setMode: (mode: AppMode) => void;
  setVibePersona: (persona: VibePersona) => void;
  completeOnboarding: () => void;
}

export const useAppMode = create<AppModeState>()(
  persist(
    (set) => ({
      // Default state
      mode: "dating",
      vibePersona: null,
      hasCompletedOnboarding: false,

      // Actions
      toggleMode: () =>
        set((state) => ({
          mode: state.mode === "dating" ? "therapist" : "dating",
        })),

      setMode: (mode) => set({ mode }),

      setVibePersona: (persona) =>
        set({
          vibePersona: persona,
        }),

      completeOnboarding: () =>
        set({
          hasCompletedOnboarding: true,
        }),
    }),
    {
      name: "heart-check-app-mode",
      // Only persist certain parts of the state
      partialize: (state) => ({
        mode: state.mode,
        vibePersona: state.vibePersona,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    }
  )
);

// Custom hooks for specific state access
export const useIsOnboardingComplete = () => {
  return useAppMode((state) => state.hasCompletedOnboarding);
};

export const useVibePersona = () => {
  return useAppMode((state) => state.vibePersona);
};
