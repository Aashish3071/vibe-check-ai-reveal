
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  path: string;
  emoji: string;
}

const FeatureCard = ({ title, description, icon: Icon, color, path, emoji }: FeatureCardProps) => {
  return (
    <Link to={path}>
      <Card className="gradient-card border-white/30 dark:border-purple-800/30 shadow-lg h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20"></div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center mb-2">
            <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center`}>
              <Icon className="text-white w-5 h-5" />
            </div>
            <span className="text-2xl">{emoji}</span>
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};

export default FeatureCard;
