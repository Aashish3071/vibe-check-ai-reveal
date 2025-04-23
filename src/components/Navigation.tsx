
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, TrendingUp, CircleX, BookHeart } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-2 px-4 flex justify-around items-center shadow-lg z-50 rounded-t-3xl">
      <Link to="/decode-vibe" className="flex flex-col items-center justify-center p-2 text-purple-600 dark:text-purple-400">
        <MessageCircle className="h-6 w-6" />
        <span className="text-[10px] mt-1">Decode</span>
      </Link>
      
      <Link to="/intent-detector" className="flex flex-col items-center justify-center p-2 text-pink-500 dark:text-pink-400">
        <Heart className="h-6 w-6" />
        <span className="text-[10px] mt-1">Intent</span>
      </Link>
      
      <Link to="/" className="relative flex flex-col items-center justify-center">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-12 w-12 rounded-full flex items-center justify-center shadow-lg -mt-5">
          <Heart className="h-6 w-6 text-white fill-white" />
        </div>
        <span className="text-[10px] mt-1 text-purple-600 dark:text-purple-400">Home</span>
      </Link>
      
      <Link to="/pattern-recognizer" className="flex flex-col items-center justify-center p-2 text-purple-600 dark:text-purple-400">
        <TrendingUp className="h-6 w-6" />
        <span className="text-[10px] mt-1">Patterns</span>
      </Link>
      
      <Link to="/journal" className="flex flex-col items-center justify-center p-2 text-pink-500 dark:text-pink-400">
        <BookHeart className="h-6 w-6" />
        <span className="text-[10px] mt-1">Journal</span>
      </Link>
    </nav>
  );
};

export default Navigation;
