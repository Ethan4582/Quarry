"use client";

import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/StatCard";
import { GitCommit, AlertCircle, Wrench, BarChart2 } from "lucide-react";

export default function CommitsPage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Commits & Risk</h1>
          <p className="text-muted-foreground text-sm mt-1">Analyze commit history, risk ranking, and change impact.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Commits" value="--" icon={<GitCommit size={16} />} />
        <StatCard title="High Priority" value="--" icon={<AlertCircle size={16} className="text-destructive" />} />
        <StatCard title="Fix Commits" value="--" icon={<Wrench size={16} />} />
        <StatCard title="Avg Entropy" value="--" icon={<BarChart2 size={16} />} />
      </div>

      <div className="bg-secondary/10 border border-border/50 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-foreground">AI Attribution</span>
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border/50 bg-secondary/5 flex items-center justify-between">
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
          <Skeleton className="h-8 w-32 rounded-md" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border/50">
                <th className="px-6 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Commit</th>
                <th className="px-6 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider text-right">Lines</th>
                <th className="px-6 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider text-right">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-secondary/5 cursor-pointer">
                  <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-6 py-4 w-1/3"><Skeleton className="h-4 w-full" /></td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-6 py-4"><div className="flex justify-end"><Skeleton className="h-4 w-12" /></div></td>
                  <td className="px-6 py-4"><div className="flex justify-end"><Skeleton className="h-4 w-20" /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center max-w-3xl mx-auto italic">
        The change-risk model is a ranking aid backed by validation against baseline bug occurrences, not an absolute verdict.
      </p>
    </div>
  );
}
