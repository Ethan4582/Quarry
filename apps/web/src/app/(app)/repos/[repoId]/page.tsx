"use client";

import { useEffect, useState } from "react";
import { createClient } from "@quarry/db/client";
import { Loader2 } from "lucide-react";
import { use } from "react";

export default function RepoOverviewPage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);
  const supabase = createClient();
  const [repo, setRepo] = useState<any>(null);
  const [chunks, setChunks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const fetchStatus = async () => {
      const { data, error } = await supabase
        .from("repos")
        .select("*")
        .eq("id", repoId)
        .single();
        
      if (data) {
        setRepo(data);
        if (data.status === "done" || data.status === "failed") {
          clearInterval(interval);
          if (data.status === "done") {
            const { data: chunksData } = await supabase
              .from("chunks")
              .select("file_path, symbol_name, symbol_type, token_count")
              .eq("repo_id", repoId)
              .limit(200);
            setChunks(chunksData || []);
          }
        }
      }
      setLoading(false);
    };

    fetchStatus();
    interval = setInterval(fetchStatus, 2000);

    return () => clearInterval(interval);
  }, [repoId, supabase]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="animate-spin text-royal-blue-1" />
      </div>
    );
  }

  if (!repo) {
    return <div className="p-8 text-tomato-1">Repository not found</div>;
  }

  const isDone = repo.status === "done";
  const isFailed = repo.status === "failed";
  const isPending = !isDone && !isFailed;

  return (
    <div className="p-8 max-w-5xl mx-auto w-full space-y-6">
      
      {isPending && (
        <div className="bg-panel border border-border p-8 rounded-lg flex flex-col items-center justify-center text-center space-y-4">
          <Loader2 className="animate-spin text-royal-blue-1 w-8 h-8" />
          <div>
            <h3 className="text-foreground font-medium text-lg">Ingestion in progress</h3>
            <p className="text-muted text-sm mt-1">Current stage: <span className="text-golden-yellow-2 font-medium uppercase tracking-wider text-xs px-2 py-0.5 bg-golden-yellow-2/10 rounded-full border border-golden-yellow-2/20 ml-1">{repo.status}</span></p>
          </div>
        </div>
      )}

      {isFailed && (
        <div className="bg-tomato-1/10 border border-tomato-1/20 p-6 rounded-lg text-tomato-1">
          <h3 className="font-semibold mb-2">Ingestion Failed</h3>
          <p className="text-sm">Something went wrong during the ingestion process.</p>
        </div>
      )}

      {isDone && (
        <div className="bg-panel border border-border rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border bg-dark-gray-16 flex justify-between items-center">
            <h3 className="font-medium text-foreground">Ingested Chunks</h3>
            <span className="text-xs text-muted">Showing {chunks.length} chunks</span>
          </div>
          
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="sticky top-0 bg-dark-gray-16 border-b border-border">
                <tr>
                  <th className="p-3 font-medium text-muted">File</th>
                  <th className="p-3 font-medium text-muted">Symbol</th>
                  <th className="p-3 font-medium text-muted">Type</th>
                  <th className="p-3 font-medium text-muted text-right">Tokens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {chunks.map((c, i) => (
                  <tr key={i} className="hover:bg-dark-gray-16/50 transition-colors">
                    <td className="p-3 text-muted truncate max-w-[200px]" title={c.file_path}>
                      {c.file_path}
                    </td>
                    <td className="p-3 text-foreground font-medium">{c.symbol_name}</td>
                    <td className="p-3 text-muted">{c.symbol_type}</td>
                    <td className="p-3 text-right text-muted">{c.token_count}</td>
                  </tr>
                ))}
                {chunks.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted">
                      No chunks found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
