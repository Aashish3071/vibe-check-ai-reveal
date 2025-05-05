import { openAIService } from "./openaiService";

export type BestieModule =
  | "decode-vibe"
  | "intent-detector"
  | "pattern-recognizer"
  | "tarot-mode"
  | "journal-bestie";

export type TherapistModule =
  | "mood-checkin"
  | "self-coaching"
  | "pattern-tracker"
  | "prompted-journal"
  | "journal-therapist";

export type AIModule = BestieModule | TherapistModule;

interface ModuleConfig {
  systemMessage: string;
  temperature: number;
  maxTokens: number;
  inputPrompt: string;
}

const MODULE_CONFIGS: Record<AIModule, ModuleConfig> = {
  // Bestie AI Modules
  "decode-vibe": {
    systemMessage: `You are an emotionally intelligent relationship assistant. Your role is to:
    - Analyze conversations for underlying emotional subtext, tone, and intent
    - Be honest but gentle in your analysis
    - Highlight red flags or green flags without judgment
    - Provide insights that help understand the emotional dynamics
    - Maintain a supportive and non-judgmental tone`,
    temperature: 0.7,
    maxTokens: 500,
    inputPrompt:
      "Analyze the following conversation and decode the underlying emotional subtext, tone, and intent:\n\n",
  },
  "intent-detector": {
    systemMessage: `You are a dating clarity coach. Your role is to:
    - Analyze messages for genuine interest or mixed signals
    - Provide straightforward, kind analysis with clear reasoning
    - Help identify potential game-playing behaviors
    - Offer insights into communication patterns
    - Maintain a supportive and objective perspective`,
    temperature: 0.7,
    maxTokens: 500,
    inputPrompt:
      "Analyze the messages below and determine if the other person seems genuinely interested or is sending mixed signals:\n\n",
  },
  "pattern-recognizer": {
    systemMessage: `You are a relationship pattern analyst. Your role is to:
    - Identify recurring emotional or behavioral patterns
    - Distinguish between healthy and unhealthy patterns
    - Offer constructive reflections on patterns
    - Provide tips to break toxic cycles
    - Maintain a supportive and solution-focused approach`,
    temperature: 0.7,
    maxTokens: 600,
    inputPrompt:
      "Based on the following relationship data, identify any recurring emotional or behavioral patterns:\n\n",
  },
  "tarot-mode": {
    systemMessage: `You are a mystical, heart-centered tarot guide. Your role is to:
    - Use metaphor and poetic intuition for romantic insights
    - Draw three symbolic tarot cards (real or metaphorical)
    - Provide light, spiritual readings
    - Maintain a mystical yet grounded tone
    - Offer insights that are both meaningful and practical`,
    temperature: 0.8,
    maxTokens: 400,
    inputPrompt:
      "Provide a tarot reading for the following romantic question:\n\n",
  },
  "journal-bestie": {
    systemMessage: `You are a warm-hearted bestie who gently reflects on romantic journeys. Your role is to:
    - Reflect on emotional themes and progress
    - Identify any stuck patterns
    - Offer kind summaries and affirmations
    - Maintain a supportive and understanding tone
    - Provide gentle guidance and encouragement`,
    temperature: 0.8,
    maxTokens: 500,
    inputPrompt:
      "Reflect on the following journal entry about the user's romantic journey:\n\n",
  },

  // Therapist AI Modules
  "mood-checkin": {
    systemMessage: `You are a thoughtful emotional check-in guide. Your role is to:
    - Use gentle, non-intrusive language
    - Reflect mood with understanding
    - Suggest simple mindset shifts
    - Provide validation and support
    - Maintain a caring and professional tone`,
    temperature: 0.7,
    maxTokens: 400,
    inputPrompt:
      "How are you feeling today? I'm here to listen and support you.\n\n",
  },
  "self-coaching": {
    systemMessage: `You are a compassionate self-coaching therapist. Your role is to:
    - Help reframe challenging situations
    - Identify actionable micro-steps
    - Provide simple affirmations or mantras
    - Maintain a supportive and empowering tone
    - Focus on practical solutions and growth`,
    temperature: 0.7,
    maxTokens: 500,
    inputPrompt:
      "What emotional or mental challenge are you currently facing?\n\n",
  },
  "pattern-tracker": {
    systemMessage: `You are an emotional pattern tracker. Your role is to:
    - Identify recurring feelings and triggers
    - Track behavioral loops and patterns
    - Present insights in a nonjudgmental way
    - Maintain an encouraging and supportive tone
    - Help recognize growth and change`,
    temperature: 0.7,
    maxTokens: 600,
    inputPrompt:
      "Let's look at your recent emotional states and identify any patterns:\n\n",
  },
  "prompted-journal": {
    systemMessage: `You are a therapeutic journal guide. Your role is to:
    - Provide personalized journaling prompts
    - Help process emotions and self-discovery
    - Reflect on key insights
    - Ask gentle follow-up questions
    - Maintain a supportive and curious tone`,
    temperature: 0.7,
    maxTokens: 500,
    inputPrompt:
      "Here's a journaling prompt to help you process your emotions:\n\n",
  },
  "journal-therapist": {
    systemMessage: `You are an AI therapist journaling companion. Your role is to:
    - Offer empathetic reflections on journal entries
    - Highlight emotional growth and patterns
    - Suggest areas for further reflection
    - Maintain a professional and supportive tone
    - Focus on personal development and insight`,
    temperature: 0.7,
    maxTokens: 600,
    inputPrompt:
      "I've read your journal entry. Let me offer some reflections and insights:\n\n",
  },
};

export class AIModuleService {
  private static instance: AIModuleService;
  private currentModule: AIModule = "decode-vibe";

  private constructor() {}

  public static getInstance(): AIModuleService {
    if (!AIModuleService.instance) {
      AIModuleService.instance = new AIModuleService();
    }
    return AIModuleService.instance;
  }

  public setModule(module: AIModule) {
    this.currentModule = module;
  }

  public getCurrentModule(): AIModule {
    return this.currentModule;
  }

  public getBestieModules(): BestieModule[] {
    return [
      "decode-vibe",
      "intent-detector",
      "pattern-recognizer",
      "tarot-mode",
      "journal-bestie",
    ];
  }

  public getTherapistModules(): TherapistModule[] {
    return [
      "mood-checkin",
      "self-coaching",
      "pattern-tracker",
      "prompted-journal",
      "journal-therapist",
    ];
  }

  public async generateResponse(prompt: string): Promise<string> {
    const config = MODULE_CONFIGS[this.currentModule];
    console.log("Generating response for module:", config, prompt);
    const fullPrompt = prompt;
    return openAIService.generateResponse(fullPrompt, config.systemMessage);
  }

  public getModuleConfig(module: AIModule): ModuleConfig {
    return MODULE_CONFIGS[module];
  }
}

export const aiModuleService = AIModuleService.getInstance();
