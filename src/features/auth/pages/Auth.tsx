import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/common/lib/auth";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import { toast } from "sonner";
import Sparkles from "@/common/components/Sparkles";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { login, signup, isPending, error, isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("Redirecting authenticated user to quiz", { user });
      navigate("/quiz", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
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
      toast.success("Welcome back!", {
        description: "Get ready to decode those relationships",
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

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
      console.log("Starting signup for:", signupData.email);
      await signup(signupData.email, signupData.name, signupData.password);
      
      toast.success("Account created!", {
        description: "Let's start decoding your relationships",
      });
      
      setTimeout(() => {
        navigate("/quiz", { replace: true });
      }, 500);
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-md gradient-card border-white/50 dark:border-purple-900/30 shadow-lg relative overflow-hidden">
        <Sparkles count={5} />
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-dancing mb-1">
            HeartCheck AI
          </CardTitle>
          <CardDescription>
            Sign in to decode your relationships and track your emotional growth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "login" | "signup")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
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
                  <Label htmlFor="password">Password</Label>
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
                      onClick={() => setActiveTab("signup")}
                    >
                      Sign up
                    </button>
                  </span>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
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
                      onClick={() => setActiveTab("login")}
                    >
                      Log in
                    </button>
                  </span>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Button
          variant="link"
          className="text-muted-foreground"
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default Auth;
