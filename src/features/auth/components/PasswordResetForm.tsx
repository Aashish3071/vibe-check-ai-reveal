import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { useToast } from "@/common/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/common/lib/supabase";

const passwordResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

interface PasswordResetFormProps {
  onBackToLogin: () => void;
}

export const PasswordResetForm = ({
  onBackToLogin,
}: PasswordResetFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
  });

  const onSubmit = async (data: PasswordResetFormData) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password?type=recovery`,
      });

      if (error) throw error;

      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for the password reset link.",
      });
      onBackToLogin();
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: "Failed to send password reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Reset Link...
          </>
        ) : (
          "Send Reset Link"
        )}
      </Button>

      <Button
        type="button"
        variant="link"
        className="w-full text-muted-foreground"
        onClick={onBackToLogin}
      >
        Back to Login
      </Button>
    </form>
  );
};
