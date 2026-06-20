import { createClient } from "@quarry/db/server";
import { SubmitRepoForm } from "./SubmitRepoForm";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: repos }] = await Promise.all([
    supabase.from("profiles").select("github_username, avatar_url").eq("id", user!.id).single(),
    supabase.from("repos").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
  ]);

  return (
    <div className="flex h-full">
      {/* Left: submit panel */}
      <div className="w-80 shrink-0 border-r border-white/[0.05] glass flex flex-col">
        <div className="p-5 border-b border-dim-gray/10">
          <h2 className="text-sm font-semibold text-white mb-1">Ingest a repository</h2>
          <p className="text-xs text-dark-gray mb-4">Paste a GitHub URL or pick from your recent repos.</p>
          <SubmitRepoForm githubUsername={profile?.github_username} />
        </div>

        {profile?.github_username && (
          <div className="p-5 text-xs text-dark-gray/50">
            Signed in as{" "}
            <span className="text-dark-gray">{profile.github_username}</span>
          </div>
        )}
      </div>

      {/* Right: repo list */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-sm font-semibold text-white">Repositories</h1>
            <span className="text-xs text-dark-gray">{repos?.length ?? 0} total</span>
          </div>

          {!repos || repos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-10 h-10 rounded-full bg-dark-gray-16 border border-dim-gray/10 flex items-center justify-center mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-dark-gray">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <p className="text-sm text-dark-gray mb-1">No repositories yet</p>
              <p className="text-xs text-dark-gray/50">Paste a GitHub URL on the left to get started</p>
            </div>
          ) : (
            <div className="space-y-px">
              {repos.map((repo) => (
                <Link key={repo.id} href={`/repos/${repo.id}`}>
                  <div className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-dark-gray-16 group transition-colors">
                    <div className="w-7 h-7 rounded bg-dark-gray-16 border border-dim-gray/10 flex items-center justify-center shrink-0 group-hover:border-dim-gray/25 transition-colors">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-dark-gray">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white group-hover:text-white truncate">
                        <span className="text-dark-gray">{repo.github_owner}/</span>{repo.github_repo}
                      </div>
                      <div className="text-xs text-dark-gray/50 mt-0.5">
                        {new Date(repo.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                    <StatusPill status={repo.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    done: "bg-forest-green-1/10 text-forest-green-1 border-forest-green-1/20",
    failed: "bg-tomato-1/10 text-tomato-1 border-tomato-1/20",
    fetching: "bg-golden-yellow-2/10 text-golden-yellow-2 border-golden-yellow-2/20",
    parsing: "bg-golden-yellow-2/10 text-golden-yellow-2 border-golden-yellow-2/20",
    embedding: "bg-medium-turquoise/10 text-medium-turquoise border-medium-turquoise/20",
  };
  const cls = map[status] ?? "bg-dark-gray-16 text-dark-gray border-dim-gray/20";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${cls}`}>
      {["fetching","parsing","embedding"].includes(status) && (
        <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
      )}
      {status}
    </span>
  );
}
