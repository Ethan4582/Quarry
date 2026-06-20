"use client";

import { useEffect, useState } from "react";
import { createClient } from "@quarry/db/client";
import { Loader2, AlertTriangle, ShieldAlert, GitCommit, FileText, CheckCircle2, CheckCircle, Flame, ArrowRight, Zap, Users } from "lucide-react";
import { use } from "react";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/Badge";
import Link from "next/link";

export default function RepoOverviewPage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);
  const supabase = createClient();
  const [repo, setRepo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        <div className="bg-card border border-border/50 p-10 rounded-2xl flex flex-col items-center justify-center text-center space-y-5 shadow-sm max-w-sm w-full">
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
        <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-xl text-destructive max-w-2xl">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold">Ingestion Failed</h3>
          </div>
          <p className="text-sm opacity-90 pl-8">Something went wrong during the ingestion process. Please check your repository URL and permissions, and try again.</p>
        </div>
      </div>
    );
  }

  // --- DONE STATE ---
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
      
      {/* Top Row: Health Score & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* 1. Health score ring */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center shadow-sm relative overflow-hidden">
          {/* Subtle background glow based on score band */}
          <div className="absolute inset-0 bg-green-500/5 blur-3xl rounded-full scale-150" />
          
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider self-start absolute top-5 left-5">Codebase Health</h3>
          <div className="relative w-32 h-32 mt-6 flex flex-col items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-border/40" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="283" strokeDashoffset="42" className="text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            </svg>
            <span className="text-4xl font-bold text-foreground">85</span>
            <span className="text-[10px] font-medium text-green-500 uppercase tracking-widest mt-1">Healthy</span>
          </div>
          <button className="mt-6 text-xs text-muted-foreground hover:text-foreground transition-colors underline decoration-border underline-offset-4">
            Why this score?
          </button>
        </div>

        {/* 2. Stat row (takes up remaining 3 cols) */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Files Indexed" value="1,248" icon={<FileText size={16} />} trend="+12" trendDirection="up" description="In last 30 days" />
          <StatCard title="Symbols" value="14.2k" icon={<Zap size={16} />} />
          <StatCard title="Languages" value="TypeScript" description="React, Node.js" />
          <StatCard title="Architecture" value="Monolith" description="High coupling detected" />
        </div>
      </div>

      {/* 3. Health validation card */}
      <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-xl p-4 flex items-start sm:items-center gap-4">
        <div className="bg-primary/20 p-2 rounded-lg text-primary shrink-0">
          <ShieldAlert size={20} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">Bug Prediction Active</h4>
            <Badge variant="success" className="h-5 text-[10px] px-2 py-0">High Confidence</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1 max-w-3xl">
            Quarry's change-risk model operates at <strong className="text-foreground">82% AUC</strong> on this repository compared to your historical baseline. 
            Prioritize review on commits flagged as high-risk.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 4. Pulse panel: attention-needed */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Pulse</h3>
            <Badge variant="destructive" className="h-5 text-[10px] px-2 py-0">3 Needs Attention</Badge>
          </div>
          <div className="space-y-3 flex-1">
            {[
              { icon: Users, file: "src/core/auth.ts", reason: "Knowledge silo (1 author)" },
              { icon: Flame, file: "src/utils/parser.js", reason: "Ungoverned hotspot (high churn, low tests)" },
              { icon: AlertTriangle, file: "lib/legacy-api.ts", reason: "High complexity (CCN 42)" }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-secondary/30">
                <item.icon size={14} className="text-amber-500 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{item.file}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{item.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Hotspots list */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Top Hotspots</h3>
            <Link href={`/repos/${repoId}/code-health`} className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
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
                {[
                  { file: "src/components/ui/button.tsx", churn: "8.4%", commits: 142 },
                  { file: "src/lib/api-client.ts", churn: "6.2%", commits: 89 },
                  { file: "src/app/layout.tsx", churn: "5.1%", commits: 76 },
                  { file: "package.json", churn: "4.8%", commits: 61 }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-secondary/20">
                    <td className="py-2.5 text-foreground font-mono text-[11px] truncate max-w-[200px]">{row.file}</td>
                    <td className="py-2.5 text-right text-muted-foreground text-xs">{row.churn}</td>
                    <td className="py-2.5 text-right text-muted-foreground text-xs">{row.commits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 5. Language breakdown */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Languages</h3>
          <div className="h-2 w-full flex rounded-full overflow-hidden mb-4">
            <div className="bg-[#3178c6] h-full" style={{ width: '65%' }} title="TypeScript 65%" />
            <div className="bg-[#f1e05a] h-full" style={{ width: '20%' }} title="JavaScript 20%" />
            <div className="bg-[#e34c26] h-full" style={{ width: '10%' }} title="HTML 10%" />
            <div className="bg-[#563d7c] h-full" style={{ width: '5%' }} title="CSS 5%" />
          </div>
          <ul className="space-y-2.5">
            {[
              { name: "TypeScript", color: "bg-[#3178c6]", pct: "65%" },
              { name: "JavaScript", color: "bg-[#f1e05a]", pct: "20%" },
              { name: "HTML", color: "bg-[#e34c26]", pct: "10%" },
              { name: "CSS", color: "bg-[#563d7c]", pct: "5%" },
            ].map(lang => (
              <li key={lang.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${lang.color}`} />
                  <span className="text-muted-foreground">{lang.name}</span>
                </div>
                <span className="text-foreground font-medium">{lang.pct}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 7. Recent decisions feed */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Recent Decisions</h3>
            <Link href={`/repos/${repoId}/decisions`} className="text-xs text-primary hover:underline flex items-center gap-1">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { title: "Migrate to App Router", date: "2w ago", status: "Active" },
              { title: "Use Tailwind for styling", date: "1mo ago", status: "Active" },
              { title: "Deprecate legacy API v1", date: "3mo ago", status: "Superseded" },
            ].map((dec, i) => (
              <div key={i} className="flex flex-col gap-1.5 border-l-2 border-border/50 pl-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">{dec.title}</span>
                  <span className="text-[10px] text-muted-foreground">{dec.date}</span>
                </div>
                <Badge variant={dec.status === "Active" ? "success" : "secondary"} className="w-fit text-[9px] px-1.5 py-0 h-4">
                  {dec.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* 9. Bus factor distribution */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Bus Factor Risk</h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-center">
              <div className="text-lg font-semibold text-green-500">84%</div>
              <div className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">Safe</div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 text-center">
              <div className="text-lg font-semibold text-amber-500">12%</div>
              <div className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">Warning</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-center">
              <div className="text-lg font-semibold text-red-500">4%</div>
              <div className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">Risk</div>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">24 files</strong> are solely understood by a single contributor. 
            <Link href={`/repos/${repoId}/contributors`} className="text-primary hover:underline ml-1">View silos</Link>
          </p>
        </div>
      </div>

      {/* 8. Git summary strip */}
      <div className="bg-secondary/30 border border-border/50 rounded-xl p-4 flex flex-wrap items-center justify-around gap-4 text-xs">
        <div className="flex items-center gap-2">
          <FileText className="text-muted-foreground w-4 h-4" />
          <span className="text-muted-foreground">Total Files:</span>
          <span className="font-semibold text-foreground">1,248</span>
        </div>
        <div className="w-px h-4 bg-border/50 hidden sm:block" />
        <div className="flex items-center gap-2">
          <Flame className="text-amber-500 w-4 h-4" />
          <span className="text-muted-foreground">Hotspots:</span>
          <span className="font-semibold text-foreground">14</span>
        </div>
        <div className="w-px h-4 bg-border/50 hidden sm:block" />
        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-green-500 w-4 h-4" />
          <span className="text-muted-foreground">Stable Core:</span>
          <span className="font-semibold text-foreground">89%</span>
        </div>
        <div className="w-px h-4 bg-border/50 hidden sm:block" />
        <div className="flex items-center gap-2">
          <GitCommit className="text-muted-foreground w-4 h-4" />
          <span className="text-muted-foreground">Total Commits:</span>
          <span className="font-semibold text-foreground">4,892</span>
        </div>
      </div>

    </div>
  );
}
