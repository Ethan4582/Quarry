import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export type Provider = "anthropic" | "openai" | "google";

// Placeholder resolver
function resolveModel(provider: Provider, apiKey: string) {
  switch (provider) {
    case "anthropic":
      return anthropic("claude-sonnet-4-6", { apiKey });
    case "openai":
      return openai("gpt-5-mini", { apiKey });
    case "google":
      return google("gemini-2.5-flash", { apiKey });
  }
}

export async function testGenerate(provider: Provider, apiKey: string, prompt: string) {
  const model = resolveModel(provider, apiKey);
  const { text } = await generateText({ model, prompt });
  return text;
}
