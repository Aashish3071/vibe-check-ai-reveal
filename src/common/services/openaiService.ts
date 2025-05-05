import { AZURE_OPENAI_CONFIG, DEFAULT_MODEL_PARAMS } from "@/common/config/api";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    message: Message;
    finish_reason: string;
    index: number;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenAIService {
  private static instance: OpenAIService;
  private readonly endpoint: string;
  private readonly apiKey: string;
  private readonly apiVersion: string;

  private constructor() {
    this.endpoint = AZURE_OPENAI_CONFIG.endpoint;
    this.apiKey = AZURE_OPENAI_CONFIG.apiKey;
    this.apiVersion = AZURE_OPENAI_CONFIG.apiVersion;
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  public async chatCompletion(
    messages: Message[],
    params: Partial<typeof DEFAULT_MODEL_PARAMS> = {}
  ): Promise<ChatCompletionResponse> {
    const url = `${this.endpoint}?api-version=${this.apiVersion}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.apiKey,
      },
      body: JSON.stringify({
        messages,
        ...DEFAULT_MODEL_PARAMS,
        ...params,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    return response.json();
  }

  public async generateResponse(
    prompt: string,
    systemMessage?: string
  ): Promise<string> {
    const messages: Message[] = [];

    if (systemMessage) {
      messages.push({ role: "system", content: systemMessage });
    }

    messages.push({ role: "user", content: prompt });

    const response = await this.chatCompletion(messages);
    return response.choices[0].message.content;
  }
}

export const openAIService = OpenAIService.getInstance();
