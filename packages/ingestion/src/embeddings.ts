import type { RawChunk } from "./chunking/symbols.js";

export interface EmbeddedChunk extends RawChunk {
  vector: number[];
  tokenCount: number;
}

function jitter(ms: number): number {
  return ms * (0.8 + Math.random() * 0.4);
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const BATCH_SIZE = 50;

export async function embedChunks(
  chunks: RawChunk[],
  voyageApiKey?: string
): Promise<EmbeddedChunk[]> {
  const apiKey = voyageApiKey ?? process.env.VOYAGE_API_KEY;
  if (!apiKey) throw new Error("VOYAGE_API_KEY is required");

  const results: EmbeddedChunk[] = [];

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const texts = batch.map((c) => c.content);
    const vectors = await callVoyageWithRetry(apiKey, texts);

    for (let j = 0; j < batch.length; j++) {
      results.push({
        ...batch[j],
        vector: vectors[j],
        tokenCount: Math.ceil(batch[j].content.length / 4),
      });
    }
  }

  return results;
}

async function callVoyageWithRetry(
  apiKey: string,
  texts: string[]
): Promise<number[][]> {
  const delays = [15_000, 30_000, 60_000];

  for (let attempt = 0; attempt <= 3; attempt++) {
    try {
      const res = await fetch("https://api.voyageai.com/v1/embeddings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "voyage-code-2",
          input: texts,
          input_type: "document",
        }),
      });

      if (res.status === 429) {
        const retryAfter = res.headers.get("retry-after");
        const waitMs = retryAfter
          ? Number(retryAfter) * 1000
          : jitter(delays[attempt] ?? 60_000);
        await sleep(waitMs);
        continue;
      }

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Voyage API error ${res.status}: ${body}`);
      }

      const json = await res.json();
      return json.data.map((d: { embedding: number[] }) => d.embedding);
    } catch (err) {
      if (attempt === 3) throw err;
      await sleep(jitter(delays[attempt]));
    }
  }

  throw new Error("Voyage API: max retries exceeded");
}
