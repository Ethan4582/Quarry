import { Octokit } from "octokit";

export interface RepoStats {
  totalContributors: number;
  totalCommits: number;
}

export async function fetchRepoStats(
  owner: string,
  repo: string,
  token?: string
): Promise<RepoStats> {
  const octokit = new Octokit(token ? { auth: token } : undefined);

  let totalContributors = 0;
  let totalCommits = 0;

  try {
    const { data: contributors } = await octokit.rest.repos.getContributorsStats({ owner, repo });
    if (Array.isArray(contributors)) {
      totalContributors = contributors.length;
      totalCommits = contributors.reduce((sum, c) => sum + (c.total ?? 0), 0);
    }
  } catch {
    // stats may return 202 (computing) — fall back to 0
  }

  return { totalContributors, totalCommits };
}
