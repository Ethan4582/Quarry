import { Octokit } from "octokit";

export async function fetchGitHubAnalytics(owner: string, repo: string) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  // 1. Fetch Commits (last 100 for demo)
  const commitsResponse = await octokit.rest.repos.listCommits({
    owner,
    repo,
    per_page: 100,
  });

  const commitsData = await Promise.all(
    commitsResponse.data.map(async (c) => {
      // Fetch single commit to get lines_added/deleted (files changed)
      const detail = await octokit.rest.repos.getCommit({
        owner,
        repo,
        ref: c.sha,
      });

      const stats = detail.data.stats;
      const filesChanged = detail.data.files?.length || 0;

      // Risk score heuristic: diff size + files changed
      const diffSize = (stats?.additions || 0) + (stats?.deletions || 0);
      let risk_score = Math.min(1.0, (diffSize / 500) * 0.5 + (filesChanged / 20) * 0.5);
      
      let risk_band = "low";
      if (risk_score > 0.7) risk_band = "high";
      else if (risk_score > 0.4) risk_band = "medium";

      return {
        sha: c.sha,
        message: c.commit.message,
        author_name: c.commit.author?.name || "Unknown",
        author_email: c.commit.author?.email || "",
        committed_at: c.commit.author?.date,
        lines_added: stats?.additions || 0,
        lines_deleted: stats?.deletions || 0,
        files_changed: filesChanged,
        is_agent_attributed: c.commit.message.includes("[agent]") || c.commit.message.includes("AI"),
        risk_score,
        risk_band,
      };
    })
  );

  // 2. Compute Contributors from Commits (In-memory)
  const contributorsMap = new Map<string, any>();

  for (const c of commitsData) {
    const key = c.author_email || c.author_name;
    if (!contributorsMap.has(key)) {
      contributorsMap.set(key, {
        name: c.author_name,
        email: c.author_email,
        commit_count_90d: 0,
        files_owned: 0,
        hotspots_owned: 0,
        bus_factor_1_count: 0,
        dead_lines_owned: 0,
        last_touched: c.committed_at,
        avatar_url: null, // Hard to get reliably without extra API call per user
      });
    }

    const contributor = contributorsMap.get(key);
    contributor.commit_count_90d += 1;
    if (new Date(c.committed_at!).getTime() > new Date(contributor.last_touched).getTime()) {
      contributor.last_touched = c.committed_at;
    }
    
    // Heuristic: More commits -> more files owned
    contributor.files_owned += Math.floor(c.files_changed / 2);
  }

  return {
    commits: commitsData,
    contributors: Array.from(contributorsMap.values()),
  };
}
