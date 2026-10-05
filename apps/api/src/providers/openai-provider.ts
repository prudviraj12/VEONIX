import type { AIMessage, AIProvider } from "./ai-provider.js";

/** OpenAI adapter boundary. Add the SDK and implementation when AI Chat is built. */
export class OpenAIProvider implements AIProvider {
  readonly name = "openai";
  constructor(private readonly apiKey?: string) {}

  async chat(_messages: AIMessage[]): Promise<string> {
    if (!this.apiKey) throw new Error("OPENAI_API_KEY is not configured");
    throw new Error("AI chat is not implemented yet");
  }

  async summarize(_content: string): Promise<string> {
    if (!this.apiKey) throw new Error("OPENAI_API_KEY is not configured");
    throw new Error("AI summarization is not implemented yet");
  }
}
