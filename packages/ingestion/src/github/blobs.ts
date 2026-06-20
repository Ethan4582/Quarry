import { Octokit } from "octokit";
import pLimit from "p-limit";

export interface FileBlob {
  path: string;
  content: string;
}

function jitter(ms: number): number {
  return ms * (0.8 + Math.random() * 0.4);
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchBlobWithRetry(
  octokit: Octokit,
  owner: string,
  repo: string,
  sha: string,
  path: string,
  treeSha: string
): Promise<FileBlob | null> {
  const delays = [15_000, 30_000, 60_000];

  for (let attempt = 0; attempt <= 3; attempt++) {
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref: treeSha,
      });

      if ("content" in data && data.content) {
        return {
          path,
          content: Buffer.from(data.content, "base64").toString("utf-8"),
        };
      }
      return null;
    } catch (err: any) {
      if (attempt === 3) return null;

      if (err.status === 429) {
        const retryAfter = err.response?.headers?.["retry-after"];
        const waitMs = retryAfter ? Number(retryAfter) * 1000 : jitter(delays[attempt]);
        await sleep(waitMs);
      } else if (err.status >= 500) {
        await sleep(jitter(delays[attempt]));
      } else {
        return null;
      }
    }
  }
  return null;
}

export async function fetchBlobsBatch(
  owner: string,
  repo: string,
  paths: string[],
  treeSha?: string,
  token?: string
): Promise<FileBlob[]> {
  const octokit = new Octokit(token ? { auth: token } : undefined);
  const limit = pLimit(15);
  const ref = treeSha ?? "HEAD";

  const results = await Promise.all(
    paths.map((p) =>
      limit(() => fetchBlobWithRetry(octokit, owner, repo, "", p, ref))
    )
  );

  return results.filter((r): r is FileBlob => r !== null);
}
