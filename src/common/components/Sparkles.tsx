
import React from 'react';

interface SparklesProps {
  count?: number;
  className?: string;
}

const Sparkles = ({ count = 5, className = "" }: SparklesProps) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="sparkle animate-pulse-sparkle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            opacity: Math.random() * 0.8 + 0.2,
            transform: `scale(${Math.random() * 1.5 + 0.5})`,
            background: `rgba(${255}, ${255}, ${Math.floor(Math.random() * 100) + 155}, ${Math.random() * 0.6 + 0.4})`,
          }}
        />
      ))}
    </div>
  );
};

export default Sparkles;
