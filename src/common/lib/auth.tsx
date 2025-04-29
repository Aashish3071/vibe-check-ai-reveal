import { createContext, useContext, useEffect, useState } from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase, getUserProfile, signIn, signUp } from "./supabase";
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

// Create the auth context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  signOut: async () => {},
  isLoading: true,
  isAuthenticated: false,
  setQuizCompleted: () => {},
  setUserAvatar: () => {},
  setUserTags: () => {},
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
  const isMockSupabase = process.env.NODE_ENV === "development";

  // Check for authentication on load
  useEffect(() => {
    let mounted = true;

    const fetchSession = async () => {
      try {
        console.log("Fetching initial session...");
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (mounted) {
          console.log("Session data:", data);
          setSession(data.session);

          if (data.session?.user) {
            const newUser: User = {
              id: data.session.user.id,
              username: data.session.user.email || "",
              name: data.session.user.email?.split("@")[0] || "",
              quizCompleted: false,
              preferences: {
                theme: "system",
                notifications: true,
              },
            };
            setUser(newUser);

            // Fetch user profile
            const { profile, error: profileError } = await getUserProfile();
            if (profileError) {
              console.error("Error fetching profile:", profileError);
            } else {
              setProfile(profile);
            }
          } else {
            setUser(null);
            setProfile(null);
          }
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        if (mounted) {
          setError(
            error instanceof Error ? error.message : "An error occurred"
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSession();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed:", event, newSession?.user?.email);

      if (mounted) {
        setSession(newSession);

        if (newSession?.user) {
          const newUser: User = {
            id: newSession.user.id,
            username: newSession.user.email || "",
            name: newSession.user.email?.split("@")[0] || "",
            quizCompleted: false,
            preferences: {
              theme: "system",
              notifications: true,
            },
          };
          setUser(newUser);

          // Fetch user profile when signed in
          if (event === "SIGNED_IN") {
            const { profile } = await getUserProfile();
            setProfile(profile);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    });

    return () => {
      mounted = false;
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session?.user) {
        const newUser: User = {
          id: data.session.user.id,
          username: data.session.user.email || "",
          name: data.session.user.email?.split("@")[0] || "",
          quizCompleted: false,
          preferences: {
            theme: "system",
            notifications: true,
          },
        };
        setUser(newUser);
        setSession(data.session);
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  // Signup function
  const signup = async (email: string, fullName: string, password: string) => {
    console.log("Starting signup process...");
    // setIsPending(true);
    // setError(null);
    // try {
    //   console.log("Starting signup process...");

    //   // First, sign up the user
    //   const { data: signUpData, error: signUpError } =
    //     await supabase.auth.signUp({
    //       email,
    //       password,
    //       options: {
    //         data: {
    //           full_name: fullName,
    //         },
    //       },
    //     });

    //   if (signUpError) {
    //     console.error("Signup error:", signUpError);
    //     throw signUpError;
    //   }

    //   console.log("Signup successful, data:", signUpData);

    //   // If email confirmation is required, we'll wait for the user to confirm
    //   if (signUpData.user?.identities?.length === 0) {
    //     console.log("Email confirmation required");
    //     return;
    //   }

    //   // If no email confirmation required, auto-login
    //   const { data: signInData, error: signInError } =
    //     await supabase.auth.signInWithPassword({
    //       email,
    //       password,
    //     });

    //   if (signInError) {
    //     console.error("Auto-login error:", signInError);
    //     throw signInError;
    //   }

    //   console.log("Auto-login successful, data:", signInData);

    //   if (signInData.session?.user) {
    //     const newUser: User = {
    //       id: signInData.session.user.id,
    //       username: signInData.session.user.email || "",
    //       name: signInData.session.user.email?.split("@")[0] || "",
    //       quizCompleted: false,
    //       preferences: {
    //         theme: "system",
    //         notifications: true,
    //       },
    //     };
    //     setUser(newUser);
    //     setSession(signInData.session);
    //   }
    // } catch (err) {
    //   const error = err as Error;
    //   console.error("Signup process failed:", error);
    //   setError(error.message);
    //   throw error;
    // } finally {
    //   setIsPending(false);
    // }
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
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

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
