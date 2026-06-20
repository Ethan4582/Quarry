"use client";

import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/Badge";
import { Bot, User, Info, ChevronDown } from "lucide-react";
import { use } from "react";

export default function CommitsPage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);

  return (
    <div className="h-full flex flex-col bg-background p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* Stat row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Commits" value="4,892" />
          <StatCard title="High Priority" value="12" trend="Action Needed" trendDirection="down" />
          <StatCard title="Fix Commits" value="842" />
          <StatCard title="Avg Entropy" value="0.42" />
        </div>

        {/* Agent-attribution strip */}
        <div className="bg-card border border-border/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Bot size={20} className="text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">AI Attribution</p>
              <p className="text-xs text-muted-foreground">34% of recent commits are AI-assisted</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5"><Badge variant="outline" className="text-[10px]">Copilot</Badge> 21%</div>
            <div className="flex items-center gap-1.5"><Badge variant="outline" className="text-[10px]">Claude</Badge> 11%</div>
            <div className="flex items-center gap-1.5"><Badge variant="outline" className="text-[10px]">Other</Badge> 2%</div>
          </div>
        </div>

        {/* Filter row */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <select className="bg-card border border-border/50 text-xs px-3 py-1.5 rounded-md outline-none text-foreground">
              <option>All Commits</option>
              <option>High Priority</option>
              <option>Fixes</option>
            </select>
            <select className="bg-card border border-border/50 text-xs px-3 py-1.5 rounded-md outline-none text-foreground">
              <option>Everyone</option>
              <option>Humans</option>
              <option>Agents</option>
            </select>
          </div>
          <select className="bg-card border border-border/50 text-xs px-3 py-1.5 rounded-md outline-none text-foreground">
            <option>Sort: Most Recent</option>
            <option>Sort: Review Priority</option>
          </select>
        </div>

        {/* Commits Table */}
        <div className="bg-card border border-border/50 rounded-xl shadow-sm overflow-hidden flex flex-col">
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
                <tr className="hover:bg-secondary/20 cursor-pointer">
                  <td className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-muted-foreground">a1b2c3d</span>
                      <span className="font-medium text-foreground truncate max-w-sm">Refactor auth flow to use new JWT service</span>
                    </div>
                    <div className="flex gap-2 text-[10px] text-muted-foreground">
                      <span className="text-green-500">+124</span>
                      <span className="text-red-500">-42</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                        <User size={10} className="text-muted-foreground" />
                      </div>
                      <span className="text-foreground text-xs">alice</span>
                    </div>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">2 hours ago</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs text-muted-foreground w-24 truncate">High Diffusion</span>
                      <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full w-[85%]" />
                      </div>
                      <Badge variant="destructive" className="text-[9px] px-1.5 py-0 h-4">High Risk</Badge>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-secondary/20 cursor-pointer">
                  <td className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-muted-foreground">e4f5g6h</span>
                      <span className="font-medium text-foreground truncate max-w-sm">Update README documentation</span>
                    </div>
                    <div className="flex gap-2 text-[10px] text-muted-foreground">
                      <span className="text-green-500">+12</span>
                      <span className="text-red-500">-2</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                        <User size={10} className="text-muted-foreground" />
                      </div>
                      <span className="text-foreground text-xs">bob</span>
                      <Badge variant="info" className="text-[9px] px-1.5 py-0 h-4">New Contributor</Badge>
                    </div>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">5 hours ago</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs text-muted-foreground w-24 truncate">-</span>
                      <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-[5%]" />
                      </div>
                      <Badge variant="success" className="text-[9px] px-1.5 py-0 h-4">Low Risk</Badge>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Methodology Disclosure */}
        <details className="group bg-secondary/30 border border-border/50 rounded-lg text-sm text-muted-foreground">
          <summary className="flex items-center gap-2 p-3 cursor-pointer list-none font-medium">
            <Info size={14} className="text-primary" />
            Methodology: Change-Risk Model
            <ChevronDown size={14} className="ml-auto group-open:rotate-180 transition-transform" />
          </summary>
          <div className="p-3 pt-0 text-xs leading-relaxed border-t border-border/50 mt-2">
            The change-risk model is a ranking aid backed by historical validation (82% AUC vs baseline). It analyzes diff size, diffusion, and author familiarity to estimate risk, but it is not a definitive verdict. Please use it to prioritize your code review efforts appropriately.
          </div>
        </details>

      </div>
    </div>
  );
}
