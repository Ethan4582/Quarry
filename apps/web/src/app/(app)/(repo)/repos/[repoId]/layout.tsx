import { createClient } from "@quarry/db/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Settings as SettingsIcon } from "lucide-react";
import { StatusPill } from "@/components/StatusPill";

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

  const { data: profile } = await supabase
    .from("profiles")
    .select("github_username, avatar_url")
    .eq("id", user!.id)
    .single();

  const { data: repo } = await supabase
    .from("repos")
    .select("github_owner, github_repo, status, commit_sha, created_at")
    .eq("id", repoId)
    .eq("user_id", user!.id)
    .single();

  if (!repo) {
    notFound();
  }

  const TABS = [
    { name: "Overview", path: `/repos/${repoId}` },
    { name: "Documentation", path: `/repos/${repoId}/docs` },
    { name: "Architecture", path: `/repos/${repoId}/architecture` },
    { name: "Code Health", path: `/repos/${repoId}/code-health` },
    { name: "Commits", path: `/repos/${repoId}/commits` },
    { name: "Contributors", path: `/repos/${repoId}/contributors` },
    { name: "Decisions", path: `/repos/${repoId}/decisions` },
    { name: "Chat", path: `/repos/${repoId}/chat` },
  ];

  return (
    <>
      {/* Repository Sidebar */}
      <aside className="relative z-10 w-56 shrink-0 flex flex-col glass border-r border-dim-gray/10">
        {/* Repo Header Identity */}
        <div className="p-3 border-b border-dim-gray/10 flex flex-col gap-1">
          <Link href="/dashboard" className="text-[10px] text-dark-gray/60 hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors">
            ← Repositories
          </Link>
          <div className="font-medium text-sm text-white truncate px-1">
            {repo.github_owner}/<span className="text-royal-blue-1">{repo.github_repo}</span>
          </div>
        </div>

        {/* Nav Tabs */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {TABS.map((tab) => (
              <Link
                key={tab.name}
                href={tab.path}
                className="block px-3 py-2 text-sm font-medium rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-white/5"
              >
                {tab.name}
              </Link>
          ))}

          <div className="pt-4 pb-1 px-3">
            <span className="border-t border-border/10 w-full block pt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Settings</span>
          </div>
          <Link
            href={`/repos/${repoId}/settings`}
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-md transition-colors"
          >
            Repository Settings
          </Link>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-border/10">
          <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/5 transition-colors cursor-default">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full border border-border/20" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-secondary border border-border/20 flex items-center justify-center text-sm text-muted-foreground">
                {profile?.github_username?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-foreground truncate">{profile?.github_username ?? "User"}</span>
              <span className="text-xs text-muted-foreground">Personal</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden bg-black-4/80">
        
        {/* Repo Top Header (Identity + Status Only) */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-white/[0.05] glass shrink-0">
          <div className="flex items-center text-sm">
            <span className="text-muted">Repositories</span>
            <ChevronRight size={14} className="mx-2 text-muted" />
            <span className="font-medium text-foreground">
              {repo.github_owner}/{repo.github_repo}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {repo.status !== "done" ? (
              <StatusPill status={repo.status} />
            ) : (
              <div className="flex items-center gap-3 text-xs text-dark-gray">
                <span className="font-mono bg-dark-gray-16 px-1.5 py-0.5 rounded border border-dim-gray/20">
                  {repo.commit_sha?.slice(0, 7) || "unknown"}
                </span>
                <span>Indexed {new Date(repo.created_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </>
  );
}
