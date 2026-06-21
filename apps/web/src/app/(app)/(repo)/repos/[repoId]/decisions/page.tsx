"use client";

import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { GitPullRequest, MessageSquare, Network } from "lucide-react";

export default function DecisionsPage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Architectural Decisions</h1>
          <p className="text-muted-foreground text-sm mt-1">Mined from code comments and PR descriptions.</p>
        </div>
        <button className="flex items-center gap-2 bg-secondary/20 hover:bg-secondary/40 text-foreground px-4 py-2 rounded-md font-medium text-sm transition-colors border border-border/50">
          <Network size={16} />
          Decision Graph
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card border border-border p-4 rounded-lg shadow-sm">
        <Skeleton className="h-9 w-48 rounded-md" />
        <Skeleton className="h-9 w-32 rounded-md" />
        <div className="flex-1" />
        <Skeleton className="h-9 w-64 rounded-md" />
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border/50 bg-secondary/5">
                <th className="px-6 py-4 font-medium text-muted-foreground text-xs uppercase tracking-wider w-1/2">Decision</th>
                <th className="px-6 py-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <tr key={i} className="hover:bg-secondary/5 cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                      <div className="flex gap-2 pt-1">
                        <Skeleton className="h-4 w-12 rounded-full" />
                        <Skeleton className="h-4 w-16 rounded-full" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {i % 2 === 0 ? <GitPullRequest size={14} /> : <MessageSquare size={14} />}
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-2 w-16 rounded-full" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
