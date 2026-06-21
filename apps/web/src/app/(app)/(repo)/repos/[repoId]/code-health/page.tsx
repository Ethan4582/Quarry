"use client";

import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/StatCard";
import { Activity, ShieldAlert, FileWarning, TrendingUp } from "lucide-react";

export default function CodeHealthPage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);

  // Tabs: Triage (default), Hotspots & Churn, Modules, Coverage, Dead Code, Impact, Security, Trend
  const tabs = ["Triage", "Hotspots & Churn", "Modules", "Coverage", "Dead Code", "Impact", "Security", "Trend"];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Code Health</h1>
          <p className="text-muted-foreground text-sm mt-1">Analyze technical debt, hotspots, and maintenance risks.</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            disabled={i > 1}
            className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
              i === 0 
                ? "border-primary text-primary" 
                : i === 1 
                  ? "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  : "border-transparent text-muted-foreground/40 cursor-not-allowed"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Triage View Stub */}
      <div className="space-y-6 pt-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard title="Files Analyzed" value="--" icon={<Activity size={16} />} />
          <StatCard title="Avg Health" value="--" />
          <StatCard title="Hotspot Health" value="--" />
          <StatCard title="Worst Performer" value="--" />
          <StatCard title="Open Findings" value="--" icon={<FileWarning size={16} />} />
        </div>

        <div className="bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 rounded-lg p-4 flex items-start sm:items-center gap-4">
          <div className="bg-primary/20 p-2 rounded-lg text-primary shrink-0">
            <ShieldAlert size={20} />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-foreground">Health Validation</h4>
            </div>
            <Skeleton className="h-3 w-full max-w-2xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border/50 bg-secondary/5 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Needs Triage</h3>
              <Skeleton className="h-8 w-64 rounded-md" />
            </div>
            <div className="p-6 flex flex-col items-center justify-center opacity-50 min-h-[300px]">
              <FileWarning className="w-8 h-8 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground font-medium">No findings to triage yet.</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-4">Findings by Category</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-8 rounded-full" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
