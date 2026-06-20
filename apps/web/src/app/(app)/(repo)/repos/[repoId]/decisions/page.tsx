"use client";

import { Badge } from "@/components/Badge";
import { Share2, FileText, CheckCircle2, Search, Filter, AlertTriangle, MessageSquare } from "lucide-react";
import { useState, use } from "react";

export default function DecisionsPage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);
  const [showGraph, setShowGraph] = useState(false);

  return (
    <div className="h-full flex flex-col bg-background p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* Top bar: View toggle & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setShowGraph(!showGraph)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border shadow-sm ${
                showGraph ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground border-border/50 hover:bg-secondary'
              }`}
            >
              <Share2 size={14} />
              Decision Graph
            </button>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search decisions..." 
                className="w-full bg-card border border-border/50 rounded-md pl-8 pr-3 py-1.5 text-xs text-foreground outline-none focus:border-primary/50 shadow-sm"
              />
            </div>
            <button className="flex items-center gap-1.5 bg-card border border-border/50 text-xs px-3 py-1.5 rounded-md text-foreground shadow-sm hover:bg-secondary shrink-0">
              <Filter size={12} />
              Filter
            </button>
          </div>
        </div>

        {/* Collapsible Decision Graph */}
        {showGraph && (
          <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm h-64 flex flex-col items-center justify-center relative">
            <Share2 size={32} className="text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">Decision Relationship Graph</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Supersession and dependencies</p>
          </div>
        )}

        {/* Decisions Table */}
        <div className="bg-card border border-border/50 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/30 border-b border-border/50">
                <tr>
                  <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Decision</th>
                  <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                  <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Source & Trust</th>
                  <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Tags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <tr className="hover:bg-secondary/20 cursor-pointer">
                  <td className="p-3">
                    <div className="font-medium text-foreground mb-1 text-sm">Migrate to App Router</div>
                    <div className="text-xs text-muted-foreground max-w-md truncate">
                      "We should move from pages/ to app/ router to support React Server Components..."
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant="success" className="h-5 text-[10px] px-2 py-0">Active</Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MessageSquare size={12} />
                        PR Comment
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="success" className="text-[9px] px-1.5 py-0 h-4">High Trust</Badge>
                        <span className="text-[10px] text-muted-foreground">98% Conf</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1.5 flex-wrap max-w-[150px]">
                      <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded border border-border/50">architecture</span>
                      <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded border border-border/50">react</span>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-secondary/20 cursor-pointer">
                  <td className="p-3">
                    <div className="font-medium text-foreground mb-1 text-sm flex items-center gap-2">
                      Use Redux for global state
                      <AlertTriangle size={12} className="text-amber-500" />
                    </div>
                    <div className="text-xs text-muted-foreground max-w-md truncate">
                      "Adding Redux to manage the complex form state..."
                    </div>
                    <div className="text-[10px] text-amber-500 mt-1 font-medium">Stale: Evidence contradicts (Zustand used instead)</div>
                  </td>
                  <td className="p-3">
                    <Badge variant="secondary" className="h-5 text-[10px] px-2 py-0">Superseded</Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <FileText size={12} />
                        Doc (ADR-004)
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-amber-500/30 text-amber-500 bg-amber-500/10">Low Trust</Badge>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1.5 flex-wrap max-w-[150px]">
                      <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded border border-border/50">state-management</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
