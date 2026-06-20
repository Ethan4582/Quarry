import { createClient } from "@quarry/db/server";
import { SubmitRepoForm } from "./SubmitRepoForm";
import Link from "next/link";
import { StatusPill } from "@/components/StatusPill";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: repos }] = await Promise.all([
    supabase.from("profiles").select("github_username, avatar_url").eq("id", user!.id).single(),
    supabase.from("repos").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
  ]);

  return (
    <div className="p-8 max-w-4xl mx-auto w-full flex flex-col h-full overflow-y-auto">
      <h1 className="text-2xl font-semibold text-white mb-8">Dashboard</h1>
      
      {/* Primary Ingestion Panel */}
      <div className="bg-dark-gray-16/30 border border-dim-gray/10 rounded-lg p-6 mb-10 shadow-sm backdrop-blur-sm">
        <h2 className="text-base font-medium text-white mb-1.5">Ingest a repository</h2>
        <p className="text-sm text-dark-gray mb-5">Paste a GitHub URL or pick from your recent repos to begin indexing.</p>
        <SubmitRepoForm githubUsername={profile?.github_username} />
      </div>

      {/* Repositories List */}
      <div className="pb-12">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-base font-medium text-white">Recent Repositories</h2>
          <span className="text-sm text-dark-gray">{repos?.length ?? 0} total</span>
        </div>

        {!repos || repos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-dim-gray/20 rounded-lg bg-dark-gray-16/20">
            <div className="w-10 h-10 rounded-full bg-dark-gray-16 border border-dim-gray/10 flex items-center justify-center mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-dark-gray">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <p className="text-base text-dark-gray mb-1">No repositories yet</p>
            <p className="text-sm text-dark-gray/50">Paste a GitHub URL above to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {repos.map((repo) => (
              <Link key={repo.id} href={`/repos/${repo.id}`} className="block">
                <div className="flex items-center gap-4 px-4 py-3.5 rounded-lg bg-dark-gray-16/30 border border-dim-gray/10 hover:border-dim-gray/30 hover:bg-dark-gray-16 group transition-all">
                  <div className="w-8 h-8 rounded-lg bg-dark-gray-16 border border-dim-gray/20 flex items-center justify-center shrink-0 group-hover:border-dim-gray/40 group-hover:scale-105 transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-dark-gray">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-medium text-white truncate">
                      <span className="text-dark-gray font-normal">{repo.github_owner}/</span>{repo.github_repo}
                    </div>
                    <div className="text-sm text-dark-gray/60 mt-0.5 font-medium uppercase tracking-wider">
                      Indexed {new Date(repo.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
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
  );
}
