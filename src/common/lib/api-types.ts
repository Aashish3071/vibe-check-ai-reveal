
// Types for the HeartCheck AI API

// Shared base analysis type
interface BaseAnalysis {
  sentiment: string;
  advice: string;
  timestamp: string;
}

// Conversation Analysis (Decode the Vibe)
export interface VibeAnalysis extends BaseAnalysis {
  keyInsights: string[];
  redFlags: string[];
  greenFlags: string[];
}

// For backwards compatibility - ConversationAnalysis is the same as VibeAnalysis
export type ConversationAnalysis = VibeAnalysis;

// Intent Detection
export interface InterestAnalysis extends BaseAnalysis {
  interestScore: number;
  gameLevel: string;
  breakdown: string;
  signals: string;
}

// Hype Check
export interface HypeCheck extends BaseAnalysis {
  affirmations: string[];
  boundaries: string[];
  selfWorthReminders: string[];
}

// Pattern Recognition
export interface RelationshipPattern {
  name: string;
  description: string;
  impact: "positive" | "negative" | "neutral";
  frequency: number;
}

export interface PatternResult extends BaseAnalysis {
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

export interface TarotResult extends BaseAnalysis {
  cards: TarotCard[];
  overallReading: string;
  loveForecast: string;
}

// Journal Analysis
export interface JournalInsight extends BaseAnalysis {
  moodAnalysis: string;
  patterns: string[];
  suggestions: string[];
  questions: string[];
}

// Mood Check
export interface MoodCheck extends BaseAnalysis {
  currentMood: string;
  bodyAwareness: string[];
  thoughtPatterns: string[];
  copingStrategies: string[];
}

// Cognitive Distortion Analysis
export interface CognitiveDistortion {
  type: string;
  description: string;
  examples: string[];
  reframeScript: string;
}

export interface DistortionAnalysis extends BaseAnalysis {
  detectedDistortions: CognitiveDistortion[];
  healthierPerspectives: string[];
}

// Grounding Exercise
export interface GroundingExercise {
  name: string;
  duration: string;
  steps: string[];
  benefits: string[];
}
