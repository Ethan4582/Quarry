export interface ModuleGroup {
  path: string;
  fileCount: number;
  filePaths: string[];
}

export function groupByModule(paths: string[]): ModuleGroup[] {
  const groups = new Map<string, string[]>();

  for (const p of paths) {
    const parts = p.split("/");
    const key = parts.length <= 2 ? parts[0] : parts.slice(0, 2).join("/");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  }

  return Array.from(groups.entries()).map(([path, filePaths]) => ({
    path,
    fileCount: filePaths.length,
    filePaths,
  }));
}
