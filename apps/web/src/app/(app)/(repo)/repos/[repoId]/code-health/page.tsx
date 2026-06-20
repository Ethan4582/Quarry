"use client";

import { useState } from "react";
import { ShieldAlert, AlertTriangle, FileText, Bug } from "lucide-react";
import { Badge } from "@/components/Badge";
import { StatCard } from "@/components/StatCard";
import { use } from "react";

export default function CodeHealthPage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);
  const [tab, setTab] = useState("triage");

  const tabs = [
    { id: "triage", label: "Triage", disabled: false },
    { id: "hotspots", label: "Hotspots & Churn", disabled: false },
    { id: "modules", label: "Modules", disabled: true },
    { id: "coverage", label: "Coverage", disabled: true },
    { id: "dead-code", label: "Dead Code", disabled: true },
    { id: "impact", label: "Impact", disabled: true },
    { id: "security", label: "Security", disabled: true },
    { id: "trend", label: "Trend", disabled: true },
  ];

  return (
    <div className="h-full flex flex-col bg-background">
      {/* In-page Tab Bar */}
      <div className="h-12 border-b border-border/50 flex items-center px-6 shrink-0 bg-card/50 overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => !t.disabled && setTab(t.id)}
              disabled={t.disabled}
              className={`text-sm px-3 py-1.5 rounded-md font-medium transition-colors ${
                t.disabled ? 'text-muted-foreground/30 cursor-not-allowed' :
                tab === t.id ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        {tab === "triage" && (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stat Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <StatCard title="Files Analyzed" value="1,248" />
              <StatCard title="Avg Health" value="85/100" trend="Stable" trendDirection="neutral" />
              <StatCard title="Hotspot Health" value="62/100" trend="Declining" trendDirection="down" />
              <StatCard title="Worst Performer" value="api.ts" description="Health 41/100" />
              <StatCard title="Open Findings" value="184" trend="-12" trendDirection="up" />
            </div>

            {/* Health Validation Card */}
            <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-xl p-4 flex items-start sm:items-center gap-4">
              <div className="bg-primary/20 p-2 rounded-lg text-primary shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-foreground">Code Health Analysis Active</h4>
                  <Badge variant="success" className="h-5 text-[10px] px-2 py-0">Validated</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 max-w-3xl">
                  Health scores correlate with a 3.2x increase in bug frequency for files scoring below 60.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              {/* File Table */}
              <div className="flex-1 bg-card border border-border/50 rounded-xl overflow-hidden flex flex-col shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="bg-secondary/30 border-b border-border/50">
                    <tr>
                      <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">File</th>
                      <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider text-right">Score</th>
                      <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider text-right">CCN</th>
                      <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider text-right">Coverage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr className="hover:bg-secondary/20">
                      <td className="p-3 text-foreground font-mono text-xs">src/api/legacy.ts</td>
                      <td className="p-3 text-right text-red-500 font-medium">41</td>
                      <td className="p-3 text-right text-muted-foreground">84</td>
                      <td className="p-3 text-right text-muted-foreground">12%</td>
                    </tr>
                    <tr className="hover:bg-secondary/20">
                      <td className="p-3 text-foreground font-mono text-xs">src/components/button.tsx</td>
                      <td className="p-3 text-right text-green-500 font-medium">92</td>
                      <td className="p-3 text-right text-muted-foreground">4</td>
                      <td className="p-3 text-right text-muted-foreground">98%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Findings Side Panel */}
              <div className="w-80 shrink-0 bg-card border border-border/50 rounded-xl p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-foreground mb-4">Findings Categories</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-secondary/30">
                    <Bug size={14} className="text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-foreground">High Complexity</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">24 files exceed CCN 50</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-secondary/30">
                    <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-foreground">Low Coverage</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">14 hotspots lack tests</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "hotspots" && (
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <StatCard title="Total Hotspots" value="14" />
              <StatCard title="Avg Churn" value="4.2%" />
              <StatCard title="Bus Factor Risk" value="3" />
              <StatCard title="Dead Code" value="~12k LOC" />
              <StatCard title="Stable Files" value="89%" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border/50 p-6 rounded-xl shadow-sm h-64 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Churn Distribution Histogram Placeholder</p>
              </div>
              <div className="bg-card border border-border/50 p-6 rounded-xl shadow-sm h-64 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Commit-Type Donut Placeholder</p>
              </div>
              <div className="bg-card border border-border/50 p-6 rounded-xl shadow-sm h-64 flex items-center justify-center md:col-span-2">
                <p className="text-muted-foreground text-sm">Risk Distribution Bar List Placeholder</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
