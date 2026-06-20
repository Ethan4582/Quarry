"use client";

import { useEffect, useState } from "react";
import { createClient } from "@quarry/db/client";
import { Loader2, AlertTriangle, ShieldAlert, FileText, Zap, ArrowRight } from "lucide-react";
import { use } from "react";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/Badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function RepoOverviewPage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);
  const supabase = createClient();
  const [repo, setRepo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Set isLoading to true for all content sections until connected to backend
  const isLoading = true;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const fetchStatus = async () => {
      const { data } = await supabase
        .from("repos")
        .select("*")
        .eq("id", repoId)
        .single();
        
      if (data) {
        setRepo(data);
        if (data.status === "done" || data.status === "failed") {
          clearInterval(interval);
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
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  if (!repo) {
    return <div className="p-8 text-destructive">Repository not found</div>;
  }

  const isDone = repo.status === "done";
  const isFailed = repo.status === "failed";
  const isPending = !isDone && !isFailed;

  if (isPending) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center p-8">
        <div className="bg-card border border-border/50 p-10 rounded-lg flex flex-col items-center justify-center text-center space-y-5 shadow-sm max-w-sm w-full">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2 relative">
            <Loader2 className="animate-spin text-primary w-8 h-8" />
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-[spin_3s_linear_infinite]" />
          </div>
          <div>
            <h3 className="text-foreground font-semibold text-lg">Ingesting Repository</h3>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-muted-foreground text-sm">Stage:</span>
              <Badge variant="warning" className="px-3 uppercase tracking-wider text-[10px] animate-pulse">
                {repo.status}
              </Badge>
            </div>
            <p className="text-muted-foreground/60 text-xs mt-6 max-w-[200px] mx-auto leading-relaxed">
              We are cloning, parsing, and embedding your codebase into the knowledge graph. This may take a few minutes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="p-8">
        <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-lg text-destructive max-w-2xl">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold text-sm">Ingestion Failed</h3>
          </div>
          <p className="text-sm opacity-90 pl-8">Something went wrong during the ingestion process. Please check your repository URL and permissions, and try again.</p>
        </div>
      </div>
    );
  }

  // --- DONE STATE (Skeleton loading) ---
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
      
      {/* Top Row: Health Score & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* 1. Health score ring */}
        <div className="bg-card border border-border rounded-lg p-6 flex flex-col items-center justify-center shadow-sm relative overflow-hidden">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider self-start absolute top-5 left-5">Codebase Health</h3>
          <div className="relative w-32 h-32 mt-6 flex flex-col items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-border/40" />
            </svg>
            <Skeleton className="h-10 w-16 mb-2 rounded-md" />
            <Skeleton className="h-3 w-12" />
          </div>
          <button className="mt-6 text-xs text-muted-foreground hover:text-foreground transition-colors underline decoration-border underline-offset-4">
            Why this score?
          </button>
        </div>

        {/* 2. Stat row (takes up remaining 3 cols) */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard isLoading={isLoading} title="Files Indexed" icon={<FileText size={16} />} />
          <StatCard isLoading={isLoading} title="Symbols" icon={<Zap size={16} />} />
          <StatCard isLoading={isLoading} title="Languages" />
          <StatCard isLoading={isLoading} title="Architecture" />
        </div>
      </div>

      {/* 3. Health validation card */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 rounded-lg p-4 flex items-start sm:items-center gap-4">
        <div className="bg-primary/20 p-2 rounded-lg text-primary shrink-0">
          <ShieldAlert size={20} />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">Bug Prediction Active</h4>
            <Badge variant="success" className="h-5 text-[10px] px-2 py-0">High Confidence</Badge>
          </div>
          <Skeleton className="h-3 w-full max-w-2xl" />
          <Skeleton className="h-3 w-3/4 max-w-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 4. Pulse panel: attention-needed */}
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Pulse</h3>
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <div className="space-y-3 flex-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-secondary/10">
                <Skeleton className="w-4 h-4 rounded-md shrink-0" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-2 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Hotspots list */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Top Hotspots</h3>
            <Link href={`/repos/${repoId}/code-health`} className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="pb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">File</th>
                  <th className="pb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider text-right">Churn %</th>
                  <th className="pb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider text-right">Commits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {[1, 2, 3, 4].map((i) => (
                  <tr key={i} className="hover:bg-secondary/5">
                    <td className="py-3"><Skeleton className="h-4 w-48" /></td>
                    <td className="py-3 flex justify-end"><Skeleton className="h-4 w-12" /></td>
                    <td className="py-3"><div className="flex justify-end"><Skeleton className="h-4 w-8" /></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 5. Language breakdown */}
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Languages</h3>
          <div className="h-2 w-full flex rounded-full overflow-hidden mb-4">
            <Skeleton className="w-full h-full" />
          </div>
          <ul className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <li key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-3 w-8" />
              </li>
            ))}
          </ul>
        </div>

        {/* 7. Recent decisions feed */}
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Recent Decisions</h3>
            <Link href={`/repos/${repoId}/decisions`} className="text-xs text-primary hover:underline flex items-center gap-1">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-2 border-l-2 border-border/50 pl-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* 9. Bus factor distribution */}
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Bus Factor Risk</h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-secondary/10 border border-border/50 rounded-lg p-3 text-center space-y-2 flex flex-col items-center">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-2 w-10" />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      </div>

      {/* 8. Git summary strip */}
      <div className="bg-secondary/10 border border-border/50 rounded-lg p-4 flex flex-wrap items-center justify-around gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-md" />
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-8 h-4" />
          </div>
        ))}
      </div>

    </div>
  );
}
