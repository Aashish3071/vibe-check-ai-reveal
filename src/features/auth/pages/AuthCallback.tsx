import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/common/lib/supabase";
import { useToast } from "@/common/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if this is a password reset callback
        const isPasswordReset = searchParams.get("type") === "recovery";

        if (isPasswordReset) {
          // Extract the access token from the URL
          const accessToken = searchParams.get("access_token");
          if (!accessToken) {
            throw new Error("No access token found in URL");
          }

          // Set the session with the access token
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: "",
          });

          if (sessionError) throw sessionError;

          // Redirect to password update page
          navigate("/auth/update-password", { replace: true });
          return;
        }

        // Handle regular OAuth callback
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          // Regular auth callback - redirect to quiz
          navigate("/quiz", { replace: true });
        } else {
          // No session found - redirect to login
          navigate("/auth", { replace: true });
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        toast({
          title: "Authentication Error",
          description: "Failed to complete authentication. Please try again.",
          variant: "destructive",
        });
        navigate("/auth", { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
};
