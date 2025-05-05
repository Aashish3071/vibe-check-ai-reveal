import React, { useState } from "react";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/common/lib/auth";

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

const LoginForm = ({ onSwitchToSignup, onForgotPassword }: LoginFormProps) => {
  const { login, isPending, error } = useAuth();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!loginData.username.trim() || !loginData.password) {
      setValidationError("Please fill in all fields");
      return;
    }

    try {
      await login(loginData.username, loginData.password);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Email</Label>
        <Input
          id="username"
          type="email"
          placeholder="Enter your email"
          value={loginData.username}
          onChange={(e) =>
            setLoginData({ ...loginData, username: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Button
            type="button"
            variant="link"
            className="text-xs text-muted-foreground px-0"
            onClick={onForgotPassword}
          >
            Forgot Password?
          </Button>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={loginData.password}
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
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
            Logging in...
          </>
        ) : (
          "Log In"
        )}
      </Button>

      <div className="text-center text-sm text-muted-foreground pt-2">
        <span className="inline-block mx-auto">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-purple-600 dark:text-purple-400 hover:underline"
            onClick={onSwitchToSignup}
          >
            Sign up
          </button>
        </span>
      </div>
    </form>
  );
};

export default LoginForm;
