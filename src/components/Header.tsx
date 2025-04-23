import React from "react";
import { Menu, Heart, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../hooks/use-theme";
import ModeToggle from "./ModeToggle";
import {
  useAuth,
  useUser,
  useIsAuthenticated,
  useIsQuizCompleted,
} from "@/lib/auth";
import { useAppMode } from "@/lib/appMode";
import { useLocation, Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const isAuthenticated = useIsAuthenticated();
  const isQuizCompleted = useIsQuizCompleted();
  const location = useLocation();
  const { logout } = useAuth();
  const user = useUser();
  const { mode } = useAppMode();

  // Don't show the toggle during quiz or when not authenticated
  const showModeToggle =
    isAuthenticated &&
    isQuizCompleted &&
    !location.pathname.includes("/quiz") &&
    !location.pathname.includes("/generate-avatar");

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  // Determine avatar emoji and background
  const avatarEmoji = user?.userAvatar?.emoji || "💖";
  const avatarName = user?.userAvatar?.name || "";

  return (
    <header className="w-full flex justify-between items-center py-4 px-5 md:px-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md fixed top-0 z-50">
      <div className="flex items-center gap-2">
        <Heart className="text-pink-500 fill-pink-500 animate-pulse h-5 w-5" />
        <h1 className="font-dancing text-xl md:text-2xl font-bold">
          HeartCheck AI
        </h1>
        {showModeToggle && (
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-purple-100 dark:bg-purple-900/40">
            {mode === "dating" ? "Bestie AI 🤪" : "Therapist AI 🌿"}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {showModeToggle && <ModeToggle />}

        <Button
          size="icon"
          variant="ghost"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {user?.userAvatar ? (
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full border overflow-hidden hover:bg-transparent"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-xl">
                  {avatarEmoji}
                </div>
              </Button>
            ) : (
              <Button size="icon" variant="ghost" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {user ? (
              <>
                <DropdownMenuLabel>
                  <div className="flex items-center gap-2">
                    {user.userAvatar ? (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-xl border-2 border-purple-200 dark:border-purple-800">
                        {avatarEmoji}
                      </div>
                    ) : (
                      <Avatar className="h-8 w-8 border-2 border-purple-200 dark:border-purple-800">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="text-[10px] bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          {user?.name?.substring(0, 2).toUpperCase() || "ME"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col">
                      <span className="font-semibold">{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {avatarName || "@" + user.username}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/journal" className="cursor-pointer">
                    My Journal
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to={mode === "dating" ? "/decode-vibe" : "/mood-check"}
                    className="cursor-pointer"
                  >
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 dark:text-red-400 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuLabel>Not logged in</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/auth" className="cursor-pointer">
                    Log In
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
