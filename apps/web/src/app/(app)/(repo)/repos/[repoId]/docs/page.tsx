"use client";

import { useSearchParams } from "next/navigation";
import { BookOpen, AlertCircle, FileText, ChevronRight, Search, PlayCircle } from "lucide-react";
import { Badge } from "@/components/Badge";
import Link from "next/link";
import { use } from "react";

export default function DocsPage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "explorer";
  
  // Hardcoded for now. In a real app, we'd fetch this to see if doc-gen has run.
  const hasDocs = false; 

  if (!hasDocs) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-background">
        <div className="max-w-md w-full bg-card border border-border/50 rounded-2xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Documentation Not Generated</h2>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            Generate comprehensive, model-driven documentation for your entire repository. This will analyze all files and create interconnected guides.
          </p>
          
          <div className="bg-secondary/50 border border-border/50 rounded-lg p-4 mb-8 text-left">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Pre-flight Estimate</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Files to analyze</span>
                <span className="font-medium text-foreground">1,248</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated tokens</span>
                <span className="font-medium text-foreground">~4.2M</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border/50">
                <span className="text-muted-foreground">Estimated time</span>
                <span className="font-medium text-foreground">~5 minutes</span>
              </div>
            </div>
          </div>

          <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
            <PlayCircle size={18} />
            Start Generation
          </button>
        </div>
      </div>
    );
  }

  // Once generated, it will show the Explorer or Coverage views:
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top Header / Tab Switcher */}
      <div className="h-12 border-b border-border/50 flex items-center justify-between px-6 shrink-0 bg-card/50">
        <div className="flex items-center gap-1">
          <Link 
            href={`/repos/${repoId}/docs?tab=explorer`}
            className={`text-sm px-3 py-1.5 rounded-md font-medium transition-colors ${tab === 'explorer' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Explorer
          </Link>
          <Link 
            href={`/repos/${repoId}/docs?tab=coverage`}
            className={`text-sm px-3 py-1.5 rounded-md font-medium transition-colors ${tab === 'coverage' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Coverage
          </Link>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search docs..." 
            className="bg-secondary border border-border/50 rounded-md pl-8 pr-3 py-1.5 text-xs text-foreground outline-none focus:border-primary/50"
          />
        </div>
      </div>

      {tab === "explorer" ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Pane: Tree */}
          <div className="w-64 border-r border-border/50 bg-secondary/20 flex flex-col shrink-0">
            <div className="p-3 border-b border-border/50 flex items-center gap-2">
              <button className="text-xs font-medium text-foreground bg-secondary px-2 py-1 rounded border border-border/50">By domain</button>
              <button className="text-xs font-medium text-muted-foreground hover:text-foreground px-2 py-1 rounded">By folder</button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <div className="mb-4">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Start Here</span>
                <div className="space-y-1">
                  <div className="text-xs text-foreground flex items-center gap-2 cursor-pointer bg-secondary/50 p-1.5 rounded">
                    <FileText size={14} className="text-primary" />
                    Architecture Overview
                  </div>
                  <div className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 cursor-pointer p-1.5 rounded">
                    <FileText size={14} />
                    Authentication Flow
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Pane: Content */}
          <div className="flex-1 overflow-y-auto p-8 relative">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-start justify-between">
                <h1 className="text-2xl font-bold text-foreground">Architecture Overview</h1>
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-[10px] px-2 py-0">Up to date</Badge>
                  <span className="text-[10px] text-muted-foreground">claude-3-opus</span>
                </div>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                <p>Stubbed documentation content goes here...</p>
              </div>
            </div>
            {/* Mini TOC floating right */}
            <div className="absolute top-8 right-8 w-48 hidden xl:block">
              <span className="text-xs font-medium text-foreground mb-2 block">On this page</span>
              <ul className="text-xs text-muted-foreground space-y-2 border-l border-border/50 pl-3">
                <li className="text-primary hover:underline cursor-pointer">Overview</li>
                <li className="hover:text-foreground cursor-pointer">Public API</li>
                <li className="hover:text-foreground cursor-pointer">Dependencies</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6 bg-card/30">
          <div className="max-w-5xl mx-auto">
            {/* Summary stat row */}
            <div className="flex items-center gap-6 mb-6 bg-card border border-border/50 p-4 rounded-xl">
              <div>
                <div className="text-2xl font-semibold text-green-500">94%</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Overall Freshness</div>
              </div>
              <div className="w-px h-10 bg-border/50" />
              <div>
                <div className="text-2xl font-semibold text-amber-500">12</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Stale Pages</div>
              </div>
            </div>

            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/30">
                  <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Page / File</th>
                  <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                  <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Confidence</th>
                  <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider text-right">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <tr className="hover:bg-secondary/20">
                  <td className="p-3 text-foreground font-medium">Architecture Overview</td>
                  <td className="p-3"><Badge variant="success" className="text-[10px] px-2 py-0">Fresh</Badge></td>
                  <td className="p-3 text-muted-foreground">98%</td>
                  <td className="p-3 text-right text-muted-foreground">2 hours ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
