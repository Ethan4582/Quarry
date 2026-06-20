import { Octokit } from "octokit";
import { isBlocked } from "../blocklist";


export async function fetchRepoTree(
  owner: string,
  repo: string,
  token?: string
): Promise<{ sha: string; paths: string[] }> {
  const octokit = new Octokit(token ? { auth: token } : undefined);

  const { data: ref } = await octokit.rest.repos.get({ owner, repo });
  const defaultBranch = ref.default_branch;

  const { data: branchRef } = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: `heads/${defaultBranch}`,
  });
  const sha = branchRef.object.sha;

  const { data: tree } = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: sha,
    recursive: "1",
  });

  const paths = tree.tree
    .filter((item) => item.type === "blob" && item.path)
    .map((item) => item.path!)
    .filter((p) => !isBlocked(p));

  return { sha, paths };
}
