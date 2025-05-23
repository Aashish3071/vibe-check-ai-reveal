// API service for HeartCheck AI
// This simulates API calls to a backend service for AI analysis

import { toast } from "sonner";

// Types for conversation analysis
export interface VibeAnalysis {
  vibe: string;
  intentions: string;
  flags: string;
  nextMove: string;
}

export interface InterestAnalysis {
  interestScore: number;
  gameLevel: string;
  breakdown: string;
  signals: string;
}

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

export interface JournalInsight {
  moodAnalysis: string;
  patterns: string[];
  suggestions: string[];
  questions: string[];
}

// Dictionary of predefined responses for different scenarios
// In a real app, these would be generated by an AI model
const vibeDictionary = [
  {
    keywords: ["not texting", "ghosted", "left on read", "no response"],
    response: {
      vibe: "You're dealing with classic ghosting energy. 👻 The inconsistent responses and sudden disappearance show emotional unavailability.",
      intentions:
        "They're keeping options open while avoiding direct communication. This often means they're either conflict-avoidant or just not that invested.",
      flags:
        "🚩 Disappearing without explanation\n🚩 Hot and cold behavior\n🚩 Vague about plans\n✅ Was engaged in conversation initially",
      nextMove:
        "Focus on people who match your energy, bestie! This ghosting says more about them than you. Your time is valuable - don't waste it waiting for someone who doesn't make you a priority. 💅",
    },
  },
  {
    keywords: [
      "flirting",
      "compliments",
      "called me cute",
      "said i was pretty",
      "thinks im hot",
    ],
    response: {
      vibe: "The flirty energy is overflowing here! 💖 They're definitely giving interested vibes with those compliments and attention to detail.",
      intentions:
        "Their intentions seem genuine - they're putting effort into creating a connection and making it clear they find you attractive.",
      flags:
        "✅ Consistent communication\n✅ Shows interest in your life\n✅ Compliments are respectful\n🚩 Watch if compliments are all physical",
      nextMove:
        "The vibe check is good! If you're interested too, match their energy with some flirty but authentic responses. Make sure it moves beyond just physical compliments to establish a real connection. 💕",
    },
  },
  {
    keywords: ["mixed signals", "confusing", "hot and cold", "unsure"],
    response: {
      vibe: "You're on the mixed signals rollercoaster. 🎢 They're giving both interested and distant energy, which creates confusion and uncertainty.",
      intentions:
        "They likely enjoy your attention but aren't fully committed to pursuing something serious. This could be emotional immaturity or indecision.",
      flags:
        "🚩 Inconsistent communication patterns\n🚩 Actions don't match their words\n🚩 Makes plans but often cancels\n✅ Shows genuine moments of connection",
      nextMove:
        "Set clear boundaries and communicate what you need. If the mixed signals continue, consider whether this emotional rollercoaster is worth the ride. Remember, confusion is not the same as mystery - you deserve clarity! ✨",
    },
  },
  {
    keywords: [
      "new relationship",
      "just started dating",
      "first date",
      "beginning",
    ],
    response: {
      vibe: "There's fresh relationship energy here! ✨ The excitement and curiosity between you two is palpable in your communications.",
      intentions:
        "They seem genuinely interested in getting to know you better. The questions and engagement show investment in building something.",
      flags:
        "✅ Makes consistent effort to communicate\n✅ Asks thoughtful questions\n✅ Respects boundaries\n🚩 Watch for love bombing or rushing",
      nextMove:
        "Enjoy this discovery phase! Keep the communication open and honest, and don't rush the process. Pay attention to how they respond to different sides of your personality as you reveal more of yourself. 🦋",
    },
  },
  {
    keywords: ["ex", "broke up", "back together", "trying again"],
    response: {
      vibe: "There's lingering attachment energy with complex emotions. 🔄 The history between you creates both familiarity and caution.",
      intentions:
        "Their intentions seem mixed between nostalgia for what was good and uncertainty about whether things can actually be different.",
      flags:
        "🚩 Same patterns may still exist\n🚩 Unresolved issues from before\n✅ Familiar comfort and understanding\n✅ Shared history can build depth",
      nextMove:
        "Before diving back in, have an honest conversation about what's changed since the breakup. Don't ignore the reasons things ended before. If you decide to try again, set clear boundaries and watch for old patterns returning. Growth requires both people to have evolved! 🌱",
    },
  },
];

const intentDictionary = [
  {
    keywords: ["not interested", "rejecting", "friendzone"],
    response: {
      interestScore: 25,
      gameLevel: "💀 dead end",
      breakdown:
        "The signs point to low romantic interest. The delayed responses, lack of questions about your life, and absence of flirty energy suggest they see this as platonic.",
      signals:
        "Watch for deflection when you suggest meeting up, changing the subject when conversations get personal, or consistently taking hours to respond to your messages.",
    },
  },
  {
    keywords: ["crushing", "likes me", "into me", "interested"],
    response: {
      interestScore: 85,
      gameLevel: "🧠 smart flirt",
      breakdown:
        "They're definitely showing strong interest! The consistent communication, thoughtful questions, and subtle flirting all point to genuine attraction.",
      signals:
        "Notice how they remember small details about you, find reasons to talk to you, and their messages have a playful, warm energy. These are all green flags!",
    },
  },
  {
    keywords: ["breadcrumbing", "mixed signals", "confusing"],
    response: {
      interestScore: 45,
      gameLevel: "🧩 mixed",
      breakdown:
        "They're showing just enough interest to keep you engaged, but not committing fully. This often happens when someone likes the attention but isn't sure about their feelings.",
      signals:
        "Watch for inconsistent patterns - they'll disappear then return with extra affection, make vague future plans without setting dates, or be very engaged then suddenly distant.",
    },
  },
  {
    keywords: ["busy", "slow responses", "work"],
    response: {
      interestScore: 60,
      gameLevel: "🧠 smart flirt",
      breakdown:
        "There seems to be genuine interest, but with competing priorities. When they do engage, the quality suggests they care, even if the quantity is inconsistent.",
      signals:
        "Look for apologetic messages after delays, detailed responses even if they're not frequent, and efforts to make real plans despite their schedule.",
    },
  },
  {
    keywords: ["dating app", "matched", "tinder", "bumble", "hinge"],
    response: {
      interestScore: 70,
      gameLevel: "🧩 mixed",
      breakdown:
        "The initial interest is definitely there - matching and maintaining conversation shows potential. However, dating app dynamics often include talking to multiple people.",
      signals:
        "Pay attention to whether they ask questions to get to know you deeper, suggest moving from the app to texting, and most importantly, make efforts to meet in person.",
    },
  },
];

// Mock API endpoints for development
// These will be replaced with actual Supabase and OpenAI calls
const MOCK_DELAY = 1500;

/**
 * Analyzes conversation text to provide insights
 */
export async function analyzeConversation(
  text: string
): Promise<VibeAnalysis> {
  try {
    // Add loading toast
    toast.loading("Analyzing your conversation...");

    // In production, this would call the OpenAI API through a serverless function
    // that secures your API key
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

    // Mock response
    const analysis: VibeAnalysis = {
      vibe: "Positive and engaging",
      intentions: "Strong mutual interest is evident. Communication style is respectful and engaged.",
      flags: "✅ Active listening\n✅ Validation of feelings\n✅ Respectful boundaries\n🚩 Some inconsistencies in communication style",
      nextMove: "Continue being authentic and open in your communication. Consider addressing the occasional mixed signals directly."
    };

    toast.dismiss();
    toast.success("Analysis complete!");
    return analysis;
  } catch (error) {
    toast.dismiss();
    toast.error("Failed to analyze conversation");
    console.error("Error analyzing conversation:", error);
    throw error;
  }
}

/**
 * Analyzes the intent behind messages
 */
export async function analyzeIntent(text: string): Promise<InterestAnalysis> {
  try {
    toast.loading("Decoding intentions...");

    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

    // Mock response
    const analysis: InterestAnalysis = {
      interestScore: 7.8,
      gameLevel: "🧠 smart flirt",
      breakdown: "This person seems genuinely interested in getting to know you better. Their communication style is fairly direct with minimal game-playing.",
      signals: "Consistent response times, asks personal questions, shares personal details unprompted"
    };

    toast.dismiss();
    toast.success("Intent analysis complete!");
    return analysis;
  } catch (error) {
    toast.dismiss();
    toast.error("Failed to analyze intent");
    console.error("Error analyzing intent:", error);
    throw error;
  }
}

/**
 * Recognizes patterns in relationship communication
 */
export async function analyzePatterns(text: string): Promise<PatternResult> {
  try {
    toast.loading("Recognizing patterns...");

    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

    // Mock response
    const analysis: PatternResult = {
      detectedPatterns: [
        {
          name: "Active Listener",
          description:
            "Consistently responds to what you say with thoughtful questions or comments",
          frequency: 85,
          impact: "positive",
        },
        {
          name: "Slow to Open Up",
          description:
            "Takes time to share personal feelings or vulnerabilities",
          frequency: 60,
          impact: "neutral",
        },
        {
          name: "Reassurance Seeking",
          description:
            "Often looks for confirmation that things are going well",
          frequency: 45,
          impact: "neutral",
        },
      ],
      recommendedActions: [
        "Create more opportunities for deeper sharing",
        "Provide reassurance when appropriate",
        "Continue engaging with active listening yourself",
      ],
      summary:
        "Overall, this relationship shows healthy communication patterns with some areas for growth. The consistent active listening indicates genuine interest and respect.",
    };

    toast.dismiss();
    toast.success("Pattern analysis complete!");
    return analysis;
  } catch (error) {
    toast.dismiss();
    toast.error("Failed to analyze patterns");
    console.error("Error analyzing patterns:", error);
    throw error;
  }
}

/**
 * Generates a tarot reading based on a question
 */
export async function generateTarotReading(
  question: string
): Promise<TarotResult> {
  try {
    toast.loading("Consulting the cards...");

    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

    // Mock response
    const reading: TarotResult = {
      cards: [
        {
          name: "The Lovers",
          position: "Present",
          imageUrl: "/tarot/lovers.jpg",
          interpretation:
            "You're at a crossroads in your romantic life, facing important choices about values and relationships.",
        },
        {
          name: "Two of Cups",
          position: "Challenge",
          imageUrl: "/tarot/two-of-cups.jpg",
          interpretation:
            "Finding balance between giving and receiving in relationships is your current challenge.",
        },
        {
          name: "The Star",
          position: "Future",
          imageUrl: "/tarot/star.jpg",
          interpretation:
            "Hope and optimism lie ahead. A period of emotional healing and renewed faith in love is coming.",
        },
      ],
      overallReading:
        "This reading suggests you're in a period of significant relationship decisions that may feel challenging now but lead to renewal and hope. Trust your intuition when making choices about your heart.",
      loveForecast:
        "The next few weeks will bring clarity to your romantic situation. Be patient and open to unexpected connections.",
    };

    toast.dismiss();
    toast.success("Your reading is ready!");
    return reading;
  } catch (error) {
    toast.dismiss();
    toast.error("Failed to generate reading");
    console.error("Error generating tarot reading:", error);
    throw error;
  }
}

/**
 * Analyzes a journal entry to provide insights
 */
export async function analyzeJournalEntry(
  entry: string
): Promise<JournalInsight> {
  try {
    toast.loading("Reflecting on your entry...");

    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

    // Mock response
    const insight: JournalInsight = {
      moodAnalysis:
        "Your entry reflects a mix of optimism about new possibilities and some anxiety about uncertainty. Overall, there's a positive undertone of growth.",
      patterns: [
        "Self-reflection on communication style",
        "Consideration of future possibilities",
        "Balancing hope with realistic expectations",
      ],
      suggestions: [
        "Consider journaling specifically about your expectations vs. reality",
        "Explore what healthy boundaries look like for you in this situation",
        "Reflect on past relationships for growth insights",
      ],
      questions: [
        "What specific qualities are most important to you in this connection?",
        "How does this relationship compare to your ideal vision?",
        "What are you learning about yourself through this experience?",
      ],
    };

    toast.dismiss();
    toast.success("Insights generated!");
    return insight;
  } catch (error) {
    toast.dismiss();
    toast.error("Failed to analyze journal entry");
    console.error("Error analyzing journal entry:", error);
    throw error;
  }
}

/**
 * Saves an analysis result to the user's profile
 * This is a placeholder for the actual Supabase integration
 */
export async function saveToProfile(
  type: "conversation" | "intent" | "pattern" | "tarot" | "journal",
  data: any
): Promise<boolean> {
  try {
    toast.loading("Saving to your profile...");

    // In production, this would save to Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.dismiss();
    toast.success("Saved to your profile!");
    return true;
  } catch (error) {
    toast.dismiss();
    toast.error("Failed to save to profile");
    console.error("Error saving to profile:", error);
    return false;
  }
}
