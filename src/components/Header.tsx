
import React from 'react';
import { Menu, Heart, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '../hooks/use-theme';

const Header = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <header className="w-full flex justify-between items-center py-4 px-5 md:px-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md fixed top-0 z-50">
      <div className="flex items-center gap-2">
        <Heart className="text-pink-500 fill-pink-500 animate-pulse h-5 w-5" />
        <h1 className="font-dancing text-xl md:text-2xl font-bold">HeartCheck AI</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <Button size="icon" variant="ghost" className="rounded-full">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
