
import { toast } from "sonner";
import { supabase } from "./supabase";

// Import types
import type {
  VibeAnalysis,
  InterestAnalysis,
  PatternResult,
  TarotResult,
  JournalInsight,
} from "./api";

// OpenAI API configuration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

// Check if the API key is available
if (!OPENAI_API_KEY) {
  console.warn("OpenAI API key is not set. AI features will use mock data.");
}

// Helper function for making OpenAI API requests
async function callOpenAI(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  temperature: number = 0.7
) {
  try {
    // If no API key, throw error to use mock data
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        temperature,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "OpenAI API request failed");
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}

// Log AI usage for billing/monitoring
async function logAIUsage(
  userId: string,
  feature: string,
  promptTokens: number,
  completionTokens: number
) {
  try {
    // In production, this would save to a table in Supabase
    console.log(
      `AI Usage: ${feature} - Prompt: ${promptTokens}, Completion: ${completionTokens}`
    );
  } catch (error) {
    console.error("Error logging AI usage:", error);
  }
}

// AI Analysis Functions

export async function analyzeConversationWithAI(
  conversationText: string
): Promise<VibeAnalysis> {
  try {
    toast.loading("Analyzing your conversation...");

    // Get current user ID for logging
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    try {
      // Prepare the prompt
      const messages = [
        {
          role: "system" as const,
          content: `You are an expert relationship analyst. Analyze the provided conversation for emotional cues, relationship dynamics, and potential red/green flags. 
          Format your response as a JSON object with the following structure:
          {
            "vibe": "Overall emotional tone of the conversation",
            "intentions": "Analysis of the person's likely intentions and level of interest",
            "flags": "List of red and green flags in bullet point format with emoji indicators",
            "nextMove": "Practical advice on how to proceed based on this conversation"
          }`,
        },
        {
          role: "user" as const,
          content: conversationText,
        },
      ];

      // Call OpenAI API
      const analysis = await callOpenAI(messages);

      // Log usage
      if (userId) {
        // Estimate token usage - in a real app, this would come from the API response
        const promptTokens = conversationText.length / 4;
        const completionTokens = JSON.stringify(analysis).length / 4;
        await logAIUsage(
          userId,
          "conversation_analysis",
          promptTokens,
          completionTokens
        );
      }

      toast.dismiss();
      toast.success("Analysis complete!");
      return analysis;
    } catch (error) {
      console.error("Error with AI analysis:", error);

      // Fallback to mock data if AI call fails
      const mockAnalysis: VibeAnalysis = {
        vibe: "Positive and engaging",
        intentions: "Strong mutual interest is evident. Communication style is respectful and engaged.",
        flags: "✅ Active listening\n✅ Validation of feelings\n✅ Respectful boundaries\n🚩 Some inconsistencies in communication style",
        nextMove: "Continue being authentic and open in your communication. Consider addressing the occasional mixed signals directly."
      };

      toast.dismiss();
      toast.success("Analysis complete!");
      return mockAnalysis;
    }
  } catch (error) {
    toast.dismiss();
    toast.error("Failed to analyze conversation");
    console.error("Error in conversation analysis:", error);
    throw error;
  }
}

export async function analyzeIntentWithAI(
  text: string
): Promise<InterestAnalysis> {
  try {
    toast.loading("Decoding intentions...");

    // Get current user ID for logging
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    try {
      // Prepare the prompt
      const messages = [
        {
          role: "system" as const,
          content: `You are an expert at decoding romantic intentions from text messages. Analyze the provided conversation or situation description to determine the level of interest and authenticity.
          Format your response as a JSON object with the following structure:
          {
            "interestScore": 7.8, // A number from 0-10 indicating level of romantic interest
            "gameLevel": "smart flirt", // A short description with emoji of their communication style
            "breakdown": "A paragraph explaining what the messages reveal about the person's intentions",
            "signals": "List of behavioral signals to watch for, comma separated"
          }`,
        },
        {
          role: "user" as const,
          content: text,
        },
      ];

      // Call OpenAI API
      const analysis = await callOpenAI(messages);

      // Log usage
      if (userId) {
        // Estimate token usage
        const promptTokens = text.length / 4;
        const completionTokens = JSON.stringify(analysis).length / 4;
        await logAIUsage(
          userId,
          "intent_analysis",
          promptTokens,
          completionTokens
        );
      }

      toast.dismiss();
      toast.success("Intent analysis complete!");
      return analysis;
    } catch (error) {
      console.error("Error with AI analysis:", error);

      // Fallback to mock data if AI call fails
      const mockAnalysis: InterestAnalysis = {
        interestScore: 7.8,
        gameLevel: "🧠 smart flirt",
        breakdown: "This person seems genuinely interested in getting to know you better. Their communication style is fairly direct with minimal game-playing.",
        signals: "Consistent response times, asks personal questions, shares personal details unprompted"
      };

      toast.dismiss();
      toast.success("Intent analysis complete!");
      return mockAnalysis;
    }
  } catch (error) {
    toast.dismiss();
    toast.error("Failed to analyze intent");
    console.error("Error in intent analysis:", error);
    throw error;
  }
}

export async function analyzePatternsWithAI(
  text: string
): Promise<PatternResult> {
  try {
    toast.loading("Recognizing patterns...");

    // Get current user ID for logging
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    try {
      // Prepare the prompt
      const messages = [
        {
          role: "system" as const,
          content: `You are an expert relationship therapist specializing in identifying relationship patterns. Analyze the provided text to identify recurring patterns in communication and behavior.
          Format your response as a JSON object with the following structure:
          {
            "detectedPatterns": [
              {
                "name": "Pattern name",
                "description": "Description of the pattern",
                "frequency": 85, // A number from 0-100 indicating how frequently this appears
                "impact": "positive" // One of: "positive", "negative", "neutral"
              }
            ],
            "recommendedActions": ["Action 1", "Action 2", "Action 3"],
            "summary": "A paragraph summarizing the overall pattern analysis"
          }`,
        },
        {
          role: "user" as const,
          content: text,
        },
      ];

      // Call OpenAI API
      const analysis = await callOpenAI(messages);

      // Log usage
      if (userId) {
        // Estimate token usage
        const promptTokens = text.length / 4;
        const completionTokens = JSON.stringify(analysis).length / 4;
        await logAIUsage(
          userId,
          "pattern_analysis",
          promptTokens,
          completionTokens
        );
      }

      toast.dismiss();
      toast.success("Pattern analysis complete!");
      return analysis;
    } catch (error) {
      console.error("Error with AI analysis:", error);

      // Fallback to mock data if AI call fails
      const mockAnalysis: PatternResult = {
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
      return mockAnalysis;
    }
  } catch (error) {
    toast.dismiss();
    toast.error("Failed to analyze patterns");
    console.error("Error in pattern analysis:", error);
    throw error;
  }
}

export async function generateTarotReadingWithAI(
  question: string
): Promise<TarotResult> {
  try {
    toast.loading("Consulting the cards...");

    // Get current user ID for logging
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    try {
      // Prepare the prompt
      const messages = [
        {
          role: "system" as const,
          content: `You are an expert tarot reader with deep knowledge of tarot symbolism and relationship dynamics. Generate a three-card tarot reading based on the user's question. Select appropriate cards and provide insightful interpretations.
          Format your response as a JSON object with the following structure:
          {
            "cards": [
              {
                "name": "Card name",
                "position": "Position (e.g., Present, Challenge, Future)",
                "imageUrl": "/tarot/card-name.jpg", // Placeholder URL
                "interpretation": "Interpretation of this card in this position"
              }
            ],
            "overallReading": "A paragraph providing an overall interpretation of all three cards together",
            "loveForecast": "A brief forecast for love/relationships based on the reading"
          }`,
        },
        {
          role: "user" as const,
          content: `My question is: ${question}`,
        },
      ];

      // Call OpenAI API
      const reading = await callOpenAI(messages, 0.9); // Higher temperature for creative variation

      // Log usage
      if (userId) {
        // Estimate token usage
        const promptTokens = question.length / 4;
        const completionTokens = JSON.stringify(reading).length / 4;
        await logAIUsage(
          userId,
          "tarot_reading",
          promptTokens,
          completionTokens
        );
      }

      toast.dismiss();
      toast.success("Your reading is ready!");
      return reading;
    } catch (error) {
      console.error("Error with AI analysis:", error);

      // Fallback to mock data if AI call fails
      const mockReading: TarotResult = {
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
      return mockReading;
    }
  } catch (error) {
    toast.dismiss();
    toast.error("Failed to generate reading");
    console.error("Error generating tarot reading:", error);
    throw error;
  }
}

export async function analyzeJournalEntryWithAI(
  entry: string
): Promise<JournalInsight> {
  try {
    toast.loading("Reflecting on your entry...");

    // Get current user ID for logging
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    try {
      // Prepare the prompt
      const messages = [
        {
          role: "system" as const,
          content: `You are an empathetic therapist and journal coach. Analyze the provided journal entry to provide insightful reflections and help the user develop emotional awareness.
          Format your response as a JSON object with the following structure:
          {
            "moodAnalysis": "A paragraph analyzing the emotional tone of the journal entry",
            "patterns": ["Pattern 1", "Pattern 2", "Pattern 3"], // Patterns observed in thinking or behavior
            "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"], // Constructive suggestions for reflection
            "questions": ["Question 1?", "Question 2?", "Question 3?"] // Thoughtful questions for deeper journaling
          }`,
        },
        {
          role: "user" as const,
          content: entry,
        },
      ];

      // Call OpenAI API
      const insight = await callOpenAI(messages);

      // Log usage
      if (userId) {
        // Estimate token usage
        const promptTokens = entry.length / 4;
        const completionTokens = JSON.stringify(insight).length / 4;
        await logAIUsage(
          userId,
          "journal_analysis",
          promptTokens,
          completionTokens
        );
      }

      toast.dismiss();
      toast.success("Insights generated!");
      return insight;
    } catch (error) {
      console.error("Error with AI analysis:", error);

      // Fallback to mock data if AI call fails
      const mockInsight: JournalInsight = {
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
      return mockInsight;
    }
  } catch (error) {
    toast.dismiss();
    toast.error("Failed to analyze journal entry");
    console.error("Error analyzing journal entry:", error);
    throw error;
  }
}
