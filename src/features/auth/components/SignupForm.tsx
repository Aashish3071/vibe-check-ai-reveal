import React, { useState } from "react";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/common/lib/auth";
import { useNavigate } from "react-router-dom";

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
  const navigate = useNavigate();
  const { signup, isPending, error } = useAuth();
  const [signupData, setSignupData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (
      !signupData.email.trim() ||
      !signupData.name.trim() ||
      !signupData.password
    ) {
      setValidationError("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      setValidationError("Please enter a valid email address");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    if (signupData.password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }

    try {
      await signup(signupData.email, signupData.name, signupData.password);
      navigate("/quiz");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signupEmail">Email</Label>
        <Input
          id="signupEmail"
          type="email"
          placeholder="Enter your email"
          value={signupData.email}
          onChange={(e) =>
            setSignupData({ ...signupData, email: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Display Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your name"
          value={signupData.name}
          onChange={(e) =>
            setSignupData({ ...signupData, name: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signupPassword">Password</Label>
        <Input
          id="signupPassword"
          type="password"
          placeholder="Create a password"
          value={signupData.password}
          onChange={(e) =>
            setSignupData({ ...signupData, password: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={signupData.confirmPassword}
          onChange={(e) =>
            setSignupData({
              ...signupData,
              confirmPassword: e.target.value,
            })
          }
        />
      </div>

      {(validationError || error) && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm p-2 rounded">
          {validationError || error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>

      <div className="text-center text-sm text-muted-foreground pt-2">
        <span className="inline-block mx-auto">
          Already have an account?{" "}
          <button
            type="button"
            className="text-purple-600 dark:text-purple-400 hover:underline"
            onClick={onSwitchToLogin}
          >
            Log in
          </button>
        </span>
      </div>
    </form>
  );
};

export default SignupForm;
