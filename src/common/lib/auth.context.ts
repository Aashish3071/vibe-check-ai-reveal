
import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, getUserProfile } from "./supabase";
import type { User as UserProfile } from "./supabase";

// Types for auth context
type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
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
        setUser(data.session?.user || null);

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
      setUser(newSession?.user || null);

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

  // Authentication status
  const isAuthenticated = !!user && !!session;

  // Context value
  const value = {
    user,
    profile,
    session,
    signOut,
    isLoading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useSupabaseAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useSupabaseAuth must be used within an AuthProvider");
  }

  return context;
}

// Helper hook to check if user is authenticated
export function useIsSupabaseAuthenticated() {
  const { isAuthenticated, isLoading } = useSupabaseAuth();
  return { isAuthenticated, isLoading };
}

// Helper to get the current user
export function useSupabaseUser() {
  const { user, profile, isLoading } = useSupabaseAuth();
  return { user, profile, isLoading };
}
