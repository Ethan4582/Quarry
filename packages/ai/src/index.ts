import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";

export type Provider = "anthropic" | "openai" | "google" | "groq";

function resolveModel(provider: Provider, apiKey: string) {
  switch (provider) {
    case "anthropic": {
      const anthropic = createAnthropic({ apiKey });
      return anthropic("claude-3-5-sonnet-20240620");
    }
    case "openai": {
      const openai = createOpenAI({ apiKey });
      return openai("gpt-4o-mini");
    }
    case "google": {
      const google = createGoogleGenerativeAI({ apiKey });
      return google("gemini-2.5-flash");
    }
    case "groq": {
      const groq = createGroq({ apiKey });
      return groq("llama-3.3-70b-versatile");
    }
  }
}

export async function testGenerate(provider: Provider, apiKey: string, prompt: string) {
  const model = resolveModel(provider, apiKey);
  const { text } = await generateText({ model, prompt });
  return text;
}