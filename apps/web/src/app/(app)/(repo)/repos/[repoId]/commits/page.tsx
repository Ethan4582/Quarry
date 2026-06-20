"use client";

import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/Badge";
import { Bot, User, Info, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { use } from "react";

export default function CommitsPage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);

  // Set isLoading to true for all content sections until connected to backend
  const isLoading = true;

  return (
    <div className="h-full flex flex-col bg-background p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* Stat row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard isLoading={isLoading} title="Total Commits" />
          <StatCard isLoading={isLoading} title="High Priority" />
          <StatCard isLoading={isLoading} title="Fix Commits" />
          <StatCard isLoading={isLoading} title="Avg Entropy" />
        </div>

        {/* Agent-attribution strip */}
        <div className="bg-card border border-border/50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Bot size={20} className="text-primary" />
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-foreground">AI Attribution</p>
              {isLoading ? (
                <Skeleton className="h-3 w-48" />
              ) : null}
            </div>
          </div>
          {isLoading ? (
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
          ) : null}
        </div>

        {/* Filter row */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <select className="bg-card border border-border/50 text-sm px-3 py-1.5 rounded-md outline-none text-foreground">
              <option>All Commits</option>
              <option>High Priority</option>
              <option>Fixes</option>
            </select>
            <select className="bg-card border border-border/50 text-sm px-3 py-1.5 rounded-md outline-none text-foreground">
              <option>Everyone</option>
              <option>Humans</option>
              <option>Agents</option>
            </select>
          </div>
          <select className="bg-card border border-border/50 text-sm px-3 py-1.5 rounded-md outline-none text-foreground">
            <option>Sort: Most Recent</option>
            <option>Sort: Review Priority</option>
          </select>
        </div>

        {/* Commits Table */}
        <div className="bg-card border border-border/50 rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/30 border-b border-border/50">
                <tr>
                  <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Commit</th>
                  <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Author</th>
                  <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Time</th>
                  <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider text-right">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="hover:bg-secondary/5">
                      <td className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-64" />
                        </div>
                        <Skeleton className="h-3 w-20" />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-6 h-6 rounded-full" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-2 w-16 rounded-full" />
                          <Skeleton className="h-5 w-16 rounded-md" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        {/* Methodology Disclosure */}
        <details className="group bg-secondary/10 border border-border/50 rounded-lg text-sm text-muted-foreground">
          <summary className="flex items-center gap-2 p-3 cursor-pointer list-none font-medium text-sm">
            <Info size={16} className="text-primary" />
            Methodology: Change-Risk Model
            <ChevronDown size={16} className="ml-auto group-open:rotate-180 transition-transform" />
          </summary>
          <div className="p-3 pt-0 text-sm leading-relaxed border-t border-border/50 mt-2">
            The change-risk model is a ranking aid backed by historical validation (82% AUC vs baseline). It analyzes diff size, diffusion, and author familiarity to estimate risk, but it is not a definitive verdict. Please use it to prioritize your code review efforts appropriately.
          </div>
        </details>

      </div>
    </div>
  );
}
