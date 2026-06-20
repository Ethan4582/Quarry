import { createClient } from "@quarry/db/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function RepoLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ repoId: string }>;
}) {
  const { repoId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: repo } = await supabase
    .from("repos")
    .select("github_owner, github_repo")
    .eq("id", repoId)
    .eq("user_id", user!.id)
    .single();

  if (!repo) {
    notFound();
  }

  const TABS = [
    { name: "Overview", path: `/repos/${repoId}`, active: true },
    { name: "Docs", disabled: true },
    { name: "Architecture", disabled: true },
    { name: "Code Health", disabled: true },
    { name: "Commits", disabled: true },
    { name: "Contributors", disabled: true },
    { name: "Decisions", disabled: true },
    { name: "Chat", disabled: true },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="h-14 flex items-center px-6 border-b border-white/[0.05] glass shrink-0">
        <div className="flex items-center text-sm">
          <Link href="/dashboard" className="text-muted hover:text-foreground transition-colors">
            Repositories
          </Link>
          <ChevronRight size={14} className="mx-2 text-muted" />
          <span className="font-medium text-foreground">
            {repo.github_owner}/{repo.github_repo}
          </span>
        </div>
      </header>

      <div className="px-6 border-b border-white/[0.04] glass-light flex gap-6 shrink-0">
        {TABS.map((tab) => (
          tab.disabled ? (
            <span 
              key={tab.name} 
              className="py-3 text-sm text-muted/50 cursor-not-allowed font-medium"
              title="Coming in a future phase"
            >
              {tab.name}
            </span>
          ) : (
            <Link
              key={tab.name}
              href={tab.path!}
              className={`py-3 text-sm font-medium border-b-2 ${
                tab.active ? "border-royal-blue-1 text-royal-blue-1" : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              {tab.name}
            </Link>
          )
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
