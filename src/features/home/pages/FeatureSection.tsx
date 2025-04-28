
import React from 'react';

interface FeatureSectionProps {
  emoji: string;
  title: string;
  description: string;
  animationDelay?: number;
}

const FeatureSection = ({
  emoji,
  title,
  description,
  animationDelay = 0,
}: FeatureSectionProps) => (
  <div
    className="flex items-start gap-2 animate-fade-in"
    style={{ animationDelay: `${animationDelay}ms` }}
  >
    <span className="text-3xl">{emoji}</span>
    <div>
      <p className="font-semibold text-base text-purple-700 dark:text-pink-200">
        {title}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  </div>
);

export default FeatureSection;
