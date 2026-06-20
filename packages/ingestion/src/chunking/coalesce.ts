import type { RawChunk } from "./symbols.js";

const TOKEN_FLOOR = 200;

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function coalesceChunks(chunks: RawChunk[]): RawChunk[] {
  const byFile = new Map<string, RawChunk[]>();
  for (const c of chunks) {
    if (!byFile.has(c.filePath)) byFile.set(c.filePath, []);
    byFile.get(c.filePath)!.push(c);
  }

  const result: RawChunk[] = [];

  for (const [filePath, fileChunks] of byFile) {
    let buffer: RawChunk[] = [];

    for (const chunk of fileChunks) {
      if (estimateTokens(chunk.content) >= TOKEN_FLOOR) {
        if (buffer.length > 0) {
          result.push(mergeBuffer(buffer));
          buffer = [];
        }
        result.push(chunk);
      } else {
        buffer.push(chunk);
        const totalTokens = buffer.reduce(
          (sum, c) => sum + estimateTokens(c.content),
          0
        );
        if (totalTokens >= TOKEN_FLOOR) {
          result.push(mergeBuffer(buffer));
          buffer = [];
        }
      }
    }

    if (buffer.length > 0) {
      result.push(mergeBuffer(buffer));
    }
  }

  return result;
}

function mergeBuffer(chunks: RawChunk[]): RawChunk {
  if (chunks.length === 1) return chunks[0];
  return {
    filePath: chunks[0].filePath,
    symbolName: chunks.map((c) => c.symbolName).join("+"),
    symbolType: "coalesced",
    startLine: Math.min(...chunks.map((c) => c.startLine)),
    endLine: Math.max(...chunks.map((c) => c.endLine)),
    content: chunks.map((c) => c.content).join("\n\n"),
  };
}
