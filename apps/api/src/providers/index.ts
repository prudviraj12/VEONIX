import { env } from "../config/env.js";
import type { AIProvider } from "./ai-provider.js";
import { OpenAIProvider } from "./openai-provider.js";

export function createAIProvider(): AIProvider {
  if (env.AI_PROVIDER === "openai") return new OpenAIProvider(env.OPENAI_API_KEY);
  throw new Error(`AI provider '${env.AI_PROVIDER}' is not configured`);
}
