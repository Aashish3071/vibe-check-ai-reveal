
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/common/lib/auth";
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
import { Button } from "@/common/components/ui/button";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import Sparkles from "@/common/components/Sparkles";

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("Redirecting authenticated user to quiz", { user });
      navigate("/quiz", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

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
              <LoginForm onSwitchToSignup={() => setActiveTab("signup")} />
            </TabsContent>

            <TabsContent value="signup">
              <SignupForm onSwitchToLogin={() => setActiveTab("login")} />
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
