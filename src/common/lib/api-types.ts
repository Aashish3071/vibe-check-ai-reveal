
// Types for the HeartCheck AI API

// Conversation Analysis
export interface VibeAnalysis {
  sentiment: string;
  keyInsights: string[];
  redFlags: string[];
  greenFlags: string[];
  advice: string;
}

// Make ConversationAnalysis inherit from VibeAnalysis for compatibility
export interface ConversationAnalysis extends VibeAnalysis {}

// Intent Detection
export interface InterestAnalysis {
  interestScore: number;
  gameLevel: string;
  breakdown: string;
  signals: string;
}

// Pattern Recognition
export interface RelationshipPattern {
  name: string;
  description: string;
  impact: "positive" | "negative" | "neutral";
  frequency: number;
}

export interface PatternResult {
  detectedPatterns: RelationshipPattern[];
  recommendedActions: string[];
  summary: string;
}

// Tarot Reading
export interface TarotCard {
  name: string;
  position: string;
  imageUrl: string;
  interpretation: string;
}

export interface TarotResult {
  cards: TarotCard[];
  overallReading: string;
  loveForecast: string;
}

// Journal Analysis
export interface JournalInsight {
  moodAnalysis: string;
  patterns: string[];
  suggestions: string[];
  questions: string[];
}

// Pattern Analysis
export interface PatternAnalysis {
  detectedPatterns: RelationshipPattern[];
  recommendedActions: string[];
  summary: string;
}
