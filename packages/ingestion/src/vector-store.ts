import { Pinecone } from "@pinecone-database/pinecone";

export async function ensureIndex(
  apiKey: string,
  indexName: string,
  dimension: number
): Promise<void> {
  const pc = new Pinecone({ apiKey });

  const existing = await pc.listIndexes();
  const found = existing.indexes?.some((idx) => idx.name === indexName);
  if (found) return;

  await pc.createIndex({
    name: indexName,
    dimension,
    metric: "cosine",
    spec: { serverless: { cloud: "aws", region: "us-east-1" } },
  });

  await waitForReady(pc, indexName);
}

async function waitForReady(pc: Pinecone, indexName: string) {
  for (let i = 0; i < 60; i++) {
    const desc = await pc.describeIndex(indexName);
    if (desc.status?.ready) return;
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(`Pinecone index ${indexName} not ready after 120s`);
}

export async function upsertChunks(
  apiKey: string,
  indexName: string,
  chunks: {
    id: string;
    vector: number[];
    repoId: string;
    moduleId: string | null;
    filePath: string;
  }[]
): Promise<string[]> {
  const pc = new Pinecone({ apiKey });
  const index = pc.index(indexName);

  const BATCH = 100;
  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH);
    await index.upsert(
      {
        records: batch.map((c) => ({
          id: c.id,
          values: c.vector,
          metadata: {
            repo_id: c.repoId,
            module_id: c.moduleId ?? "",
            file_path: c.filePath,
          },
        }))
      } as any
    );
  }

  return chunks.map((c) => c.id);
}

export async function queryVectors(
  apiKey: string,
  indexName: string,
  queryVector: number[],
  topK: number,
  filter?: Record<string, unknown>
): Promise<{ id: string; score: number }[]> {
  const pc = new Pinecone({ apiKey });
  const index = pc.index(indexName);

  const result = await index.query({
    vector: queryVector,
    topK,
    filter,
  });

  return (
    result.matches?.map((m) => ({
      id: m.id,
      score: m.score ?? 0,
    })) ?? []
  );
}

export async function deleteVectorsByRepoId(
  apiKey: string,
  indexName: string,
  repoId: string
): Promise<void> {
  const pc = new Pinecone({ apiKey });
  const index = pc.index(indexName);

  await index.deleteMany({ filter: { repo_id: repoId } });
}
