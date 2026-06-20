import { createClient } from "@quarry/db/server";
import { createClient as createServiceClient } from "@quarry/db/service";
import { fetchRepoTree, fetchBlobsBatch } from "@quarry/ingestion/github";
import { detectArchetype } from "@quarry/ingestion/archetype";
import { groupByModule } from "@quarry/ingestion/chunking/modules";
import { extractSymbolChunks } from "@quarry/ingestion/chunking/symbols";
import { coalesceChunks } from "@quarry/ingestion/chunking/coalesce";
import { embedChunks } from "@quarry/ingestion/embeddings";
import { ensureIndex, upsertChunks } from "@quarry/ingestion/vector-store";
import { NextResponse } from "next/server";

const PINECONE_DEMO_KEY = process.env.PINECONE_TEST_KEY!;
const PINECONE_DEMO_INDEX = "quarry-demo";
const EMBED_DIM = 1024;

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const today = new Date().toISOString().slice(0, 10);
  const { data: counter } = await supabase
    .from("usage_counters")
    .select("ingestion_jobs_count")
    .eq("day", today)
    .maybeSingle();
  const DAILY_LIMIT = Number(process.env.DAILY_INGESTION_LIMIT ?? 200);
  if (counter && counter.ingestion_jobs_count >= DAILY_LIMIT) {
    return NextResponse.json(
      { error: "Demo capacity reached for today, try again tomorrow" },
      { status: 429 }
    );
  }
  await supabase.rpc("increment_usage_counter", { p_day: today });

  const { owner, repo } = await req.json();

  try {
    const { sha, paths } = await fetchRepoTree(owner, repo);

    // Cache hit: same commit already done
    const { data: existing } = await supabase
      .from("repos")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("github_owner", owner)
      .eq("github_repo", repo)
      .eq("commit_sha", sha)
      .maybeSingle();
    if (existing && existing.status === "done") {
      return NextResponse.json({ repoId: existing.id, status: "done", cached: true });
    }

    const archetype = detectArchetype(paths);
    const { data: repoRow } = await supabase
      .from("repos")
      .insert({
        user_id: user.id,
        github_owner: owner,
        github_repo: repo,
        commit_sha: sha,
        archetype,
        status: "fetching",
        pinecone_index: PINECONE_DEMO_INDEX,
      })
      .select()
      .single();

    const repoId = repoRow!.id;

    // Return immediately — run pipeline in background
    runIngestionPipeline(repoId, owner, repo, sha, paths).catch(async (err) => {
      console.error("[ingest] pipeline failed:", err);
      const svc = await createServiceClient();
      await svc.from("repos").update({ status: "failed" }).eq("id", repoId);
    });

    return NextResponse.json({ repoId, status: "fetching" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function runIngestionPipeline(
  repoId: string,
  owner: string,
  repo: string,
  sha: string,
  paths: string[]
) {
  // Use service-role client so it works outside the user's request context
  const supabase = await createServiceClient();

  // Fetch blobs
  const files = await fetchBlobsBatch(owner, repo, paths, sha);

  await supabase.from("repos").update({ status: "parsing" }).eq("id", repoId);

  // Chunk
  const modules = groupByModule(paths);
  const rawChunks = (await Promise.all(files.map(extractSymbolChunks))).flat();
  const chunks = coalesceChunks(rawChunks);

  // Insert modules
  const { data: moduleRows } = await supabase
    .from("modules")
    .insert(modules.map((m) => ({ repo_id: repoId, path: m.path, file_count: m.fileCount })))
    .select();

  await supabase.from("repos").update({ status: "embedding" }).eq("id", repoId);

  // Embed
  const embedded = await embedChunks(chunks);

  // Upsert to Pinecone
  await ensureIndex(PINECONE_DEMO_KEY, PINECONE_DEMO_INDEX, EMBED_DIM);
  const vectorPayload = embedded.map((c, i) => ({
    id: `${repoId}:${i}`,
    vector: c.vector,
    repoId,
    moduleId: resolveModuleId(c, moduleRows ?? []),
    filePath: c.filePath,
  }));
  const vectorIds = await upsertChunks(PINECONE_DEMO_KEY, PINECONE_DEMO_INDEX, vectorPayload);

  // Save chunks to DB
  await supabase.from("chunks").insert(
    embedded.map((c, i) => ({
      repo_id: repoId,
      module_id: vectorPayload[i].moduleId,
      pinecone_vector_id: vectorIds[i],
      file_path: c.filePath,
      symbol_name: c.symbolName,
      symbol_type: c.symbolType,
      start_line: c.startLine,
      end_line: c.endLine,
      content: c.content,
      token_count: c.tokenCount,
    }))
  );

  await supabase
    .from("repos")
    .update({ status: "done", file_count: files.length })
    .eq("id", repoId);
}

function resolveModuleId(
  chunk: { filePath: string },
  modules: { id: string; path: string }[]
): string | null {
  const match = modules.find((m) => chunk.filePath.startsWith(m.path));
  return match?.id ?? null;
}

