export type Archetype = "monorepo" | "frontend" | "cli" | "rest_api" | "library";

export function detectArchetype(paths: string[]): Archetype {
  const pathSet = new Set(paths);
  const hasDir = (prefix: string) => paths.some((p) => p.startsWith(prefix + "/"));

  if (
    pathSet.has("pnpm-workspace.yaml") ||
    pathSet.has("lerna.json") ||
    pathSet.has("nx.json") ||
    pathSet.has("turbo.json")
  )
    return "monorepo";

  if (hasDir("pages") || hasDir("app") || hasDir("src/routes")) return "frontend";

  if (pathSet.has("package.json") || hasDir("bin")) {
    return "cli";
  }

  if (hasDir("routes") || hasDir("controllers") || hasDir("api")) return "rest_api";

  return "library";
}
