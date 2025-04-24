import { createContext, useContext, useEffect, useState } from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase, getUserProfile } from "./supabase";
import type { User as UserProfile } from "./supabase";

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
};

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  signOut: async () => {},
  isLoading: true,
  isAuthenticated: false,
});

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for authentication on load
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);

        // Create a mock user from the Supabase user for now
        // In a real app, you'd fetch user data from your database
        if (data.session?.user) {
          const mockUser: User = {
            id: data.session.user.id,
            username: data.session.user.email || "",
            name: data.session.user.email?.split("@")[0] || "",
            quizCompleted: true, // Default to true for now
            preferences: {
              theme: "system",
              notifications: true,
            },
          };
          setUser(mockUser);
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
      setSession(newSession);

      // Update user state when session changes
      if (newSession?.user) {
        const mockUser: User = {
          id: newSession.user.id,
          username: newSession.user.email || "",
          name: newSession.user.email?.split("@")[0] || "",
          quizCompleted: true, // Default to true for now
          preferences: {
            theme: "system",
            notifications: true,
          },
        };
        setUser(mockUser);
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
