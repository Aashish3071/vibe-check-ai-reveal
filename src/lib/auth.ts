import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: boolean;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isPending: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

// In a real app, these would be API calls to a backend
const mockLogin = async (username: string, password: string): Promise<User> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock validation
  if (username === "test" && password === "password") {
    return {
      id: "user-1",
      username: "test",
      name: "Test User",
      avatar: "https://i.pravatar.cc/150?u=test",
      preferences: {
        theme: "system",
        notifications: true,
      },
    };
  }

  throw new Error("Invalid credentials");
};

const mockSignup = async (
  username: string,
  name: string,
  password: string
): Promise<User> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock validation
  if (username.length < 3) {
    throw new Error("Username must be at least 3 characters");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  // In a real app, we would make an API call to create the user
  // For demo, we just return a mock user
  return {
    id: "user-" + Date.now(),
    username,
    name,
    avatar: `https://i.pravatar.cc/150?u=${username}`,
    preferences: {
      theme: "system",
      notifications: true,
    },
  };
};

// Create auth store with Zustand
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isPending: false,
      error: null,

      login: async (username, password) => {
        set({ isPending: true, error: null });

        try {
          const user = await mockLogin(username, password);
          set({ user, isAuthenticated: true, isPending: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isPending: false,
          });
        }
      },

      signup: async (username, name, password) => {
        set({ isPending: true, error: null });

        try {
          const user = await mockSignup(username, name, password);
          set({ user, isAuthenticated: true, isPending: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isPending: false,
          });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },
    }),
    {
      name: "heart-check-auth",
      // Only persist certain parts of the state
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Hook to check if user is authenticated
export const useIsAuthenticated = () => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  return isAuthenticated;
};

// Hook to get current user
export const useUser = () => {
  const user = useAuth((state) => state.user);
  return user;
};
