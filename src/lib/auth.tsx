
import { createContext, useContext, useEffect, useState } from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import {
  supabase,
  getUserProfile,
  signIn,
  signUp,
} from "./supabase";
import type { User as UserProfile } from "./supabase";
import { toast } from "sonner";

export interface UserAvatar {
  type: string;
  emoji: string;
  name: string;
  bio: string;
  tags: string[];
}

export interface User {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  userAvatar?: UserAvatar;
  quizCompleted: boolean;
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: boolean;
  };
  tags?: {
    emotionalVibe?: string;
    attachmentStyle?: string;
    tonePref?: string;
    [key: string]: string | undefined;
  };
}

// Define the context type
type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  setQuizCompleted?: (completed: boolean) => void;
  setUserAvatar?: (avatar: UserAvatar) => void;
  setUserTags?: (tags: Record<string, string>) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, fullName: string, password: string) => Promise<void>;
  isPending: boolean;
  error: string | null;
};

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  signOut: async () => {},
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  isPending: false,
  error: null,
});

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMockSupabase = process.env.NODE_ENV === 'development'; // Default fallback

  // Check for authentication on load
  useEffect(() => {
    const fetchSession = async () => {
      try {
        // If using a mock Supabase client, use dummy data
        if (isMockSupabase) {
          console.log("Using mock auth data for development");
          // Create a test user for development
          const mockUser: User = {
            id: "dev-user-123",
            username: "dev_user",
            name: "Development User",
            quizCompleted: false, // Default to false so new users are directed to the quiz
            preferences: {
              theme: "system",
              notifications: true,
            },
            tags: {
              emotionalVibe: "sensitive",
              attachmentStyle: "secure",
              tonePref: "caring",
            },
          };
          setUser(mockUser);

          // Mock profile data
          const mockProfile: UserProfile = {
            id: "dev-user-123",
            username: "dev_user",
            full_name: "Development User",
            avatar_url: null,
            persona_type: "dating",
            preferences: { theme: "dark" },
            streak_count: 5,
            last_active: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setProfile(mockProfile);

          // Mock session data
          setSession({
            access_token: "mock-token",
            refresh_token: "mock-refresh-token",
            token_type: "bearer",
            expires_at: Date.now() + 3600,
            expires_in: 3600,
            provider_token: null,
            provider_refresh_token: null,
            user: {
              id: "dev-user-123",
              app_metadata: {},
              user_metadata: {},
              aud: "authenticated",
              created_at: new Date().toISOString(),
              factors: null,
              last_sign_in_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              role: "authenticated",
              email: "dev@example.com",
              phone: null,
              confirmed_at: new Date().toISOString(),
              email_confirmed_at: new Date().toISOString(),
              phone_confirmed_at: null,
              banned_until: null,
              confirmation_sent_at: null,
              recovery_sent_at: null,
              identities: [],
            },
          } as Session);

          setIsLoading(false);
          return;
        }

        const { data } = await supabase.auth.getSession();
        setSession(data.session);

        // Create a user from the Supabase user
        if (data.session?.user) {
          const newUser: User = {
            id: data.session.user.id,
            username: data.session.user.email || "",
            name: data.session.user.email?.split("@")[0] || "",
            quizCompleted: false, // Default to false so new users are directed to quiz
            preferences: {
              theme: "system",
              notifications: true,
            },
          };
          setUser(newUser);
        } else {
          setUser(null);
        }

        // If user is authenticated, fetch their profile
        if (data.session?.user) {
          const { profile } = await getUserProfile();
          setProfile(profile);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial session fetch
    fetchSession();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed:", event, newSession?.user?.email);
      setSession(newSession);

      // Update user state when session changes
      if (newSession?.user) {
        const newUser: User = {
          id: newSession.user.id,
          username: newSession.user.email || "",
          name: newSession.user.email?.split("@")[0] || "",
          quizCompleted: false, // Default to false so new users are directed to quiz
          preferences: {
            theme: "system",
            notifications: true,
          },
        };
        setUser(newUser);
      } else {
        setUser(null);
      }

      // Fetch user profile when auth state changes to signed in
      if (event === "SIGNED_IN" && newSession?.user) {
        const { profile } = await getUserProfile();
        setProfile(profile);
      } else if (event === "SIGNED_OUT") {
        setProfile(null);
      }
    });

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Set quiz completed function
  const setQuizCompleted = (completed: boolean) => {
    if (user) {
      setUser({ ...user, quizCompleted: completed });
      console.log("Quiz completed set to:", completed);
    }
  };

  // Set user avatar function
  const setUserAvatar = (avatar: UserAvatar) => {
    if (user) {
      setUser({ ...user, userAvatar: avatar });
    }
  };

  // Set user tags function
  const setUserTags = (tags: Record<string, string>) => {
    if (user) {
      setUser({
        ...user,
        tags: { ...(user.tags || {}), ...tags },
      });
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsPending(true);
    setError(null);
    try {
      const { data, error } = await signIn(email, password);
      if (error) {
        setError(
          error.message || "Login failed. Please check your credentials."
        );
        return;
      }
      console.log("Login successful:", data);
      // Auth state will be updated by the onAuthStateChange listener
    } catch (err) {
      const error = err as Error;
      setError(error.message || "An unexpected error occurred");
      console.error("Login error:", error);
    } finally {
      setIsPending(false);
    }
  };

  // Signup function
  const signup = async (email: string, fullName: string, password: string) => {
    setIsPending(true);
    setError(null);
    try {
      console.log("Starting signup process for:", email);
      console.log("Using mock Supabase:", isMockSupabase);

      const { data, error } = await signUp(email, password, {
        username: email,
        full_name: fullName,
      });

      console.log("Signup response:", { data, error });

      if (error) {
        console.error("Signup error:", error);
        setError(error.message || "Signup failed. Please try again.");
        return;
      }

      // In development mode with mock Supabase, we can simulate a successful signup
      if (isMockSupabase) {
        console.log("Using mock mode - simulating successful signup");
        toast.success("Account created in development mode!");
        // We can auto-login in dev mode - this will trigger the auth state change
        await login(email, password);
      } else {
        console.log("Real Supabase mode - email verification required");
        // For real Supabase, auto-login after signup since email verification isn't required yet
        await login(email, password);
        
        toast.success("Account created successfully!", {
          description: "Welcome to HeartCheck AI!",
        });
      }
      
      return data;
    } catch (err) {
      const error = err as Error;
      console.error("Signup exception:", error);
      setError(error.message || "An unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  };

  // Authentication status
  const isAuthenticated = !!user && !!session;

  // Context value
  const value: AuthContextType = {
    user,
    profile,
    session,
    signOut,
    isLoading,
    isAuthenticated,
    setQuizCompleted,
    setUserAvatar,
    setUserTags,
    login,
    signup,
    isPending,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

// Hook to check if user is authenticated
export const useIsAuthenticated = () => {
  const { isAuthenticated, isLoading } = useAuth();
  return { isAuthenticated, isLoading };
};

// Hook to get current user
export const useUser = () => {
  const { user, profile, isLoading } = useAuth();
  return { user, profile, isLoading };
};

// Hook to check if quiz is completed
export const useIsQuizCompleted = () => {
  const { user } = useAuth();
  return user?.quizCompleted || false;
};

// Hook for setting quiz completed
export const useSetQuizCompleted = () => {
  const { setQuizCompleted } = useAuth();
  return setQuizCompleted;
};

// Hook for setting user avatar
export const useSetUserAvatar = () => {
  const { setUserAvatar } = useAuth();
  return setUserAvatar;
};

// Hook for setting user tags
export const useSetUserTags = () => {
  const { setUserTags } = useAuth();
  return setUserTags;
};
