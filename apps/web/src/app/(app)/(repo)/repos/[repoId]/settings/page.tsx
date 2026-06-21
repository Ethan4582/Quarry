import { createClient } from "@quarry/db/server";
import { notFound } from "next/navigation";
import { DeleteRepoButton } from "@/components/DeleteRepoButton";

export default async function RepoSettingsPage({
  params,
}: {
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

  return (
    <div className="p-8 max-w-4xl mx-auto w-full h-full flex flex-col">
      <h1 className="text-2xl font-semibold text-white mb-8">Repository Settings</h1>

      <div className="flex-1">
        <section className="bg-dark-gray-16/30 border border-tomato-1/20 rounded-lg overflow-hidden shadow-sm backdrop-blur-sm">
          <div className="p-6 border-b border-tomato-1/10 bg-tomato-1/5">
            <h2 className="text-lg font-medium text-tomato-1">Danger Zone</h2>
            <p className="text-sm text-tomato-1/80 mt-1">
              Irreversible and destructive actions for this repository.
            </p>
          </div>
          
          <div className="p-6 flex items-center justify-between gap-8">
            <div>
              <h3 className="text-base font-medium text-white">Delete Repository</h3>
              <p className="text-sm text-dark-gray mt-1 max-w-xl">
                This will permanently delete <span className="font-medium text-white">{repo.github_owner}/{repo.github_repo}</span>, 
                including all database records, parsed chunks, and Pinecone embedded vectors. This action cannot be undone.
              </p>
            </div>
            
            <div className="shrink-0">
              <DeleteRepoButton 
                repoId={repoId} 
                repoName={`${repo.github_owner}/${repo.github_repo}`} 
                variant="full" 
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
