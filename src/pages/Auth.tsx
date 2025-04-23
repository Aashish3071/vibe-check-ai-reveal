
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const navigate = useNavigate();

  // Simulate signup/login, then redirect to quiz.
  const fakeLogin = () => {
    setTimeout(() => {
      navigate("/quiz");
    }, 800);
  };

  return (
    <div className="min-h-screen pb-20 pt-16 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 flex flex-col justify-center items-center">
      <Header />
      <main className="container px-4 mx-auto flex flex-col items-center">
        <div className="bg-white/70 dark:bg-gray-900/50 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-dancing font-bold mb-4">Sign Up or Log In</h2>
          <p className="mb-6 text-muted-foreground text-sm">The tea starts here! Create an account to unlock your HeartCheck AI vibe profile.</p>
          <Button
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg"
            onClick={fakeLogin}
          >
            Continue with Magic Link ✨
          </Button>
        </div>
      </main>
      <Navigation />
    </div>
  );
};
export default Auth;
