"use client";

import { useSearchParams } from "next/navigation";
import { BookOpen, AlertCircle, FileText, ChevronRight, Search } from "lucide-react";
import { Badge } from "@/components/Badge";
import Link from "next/link";
import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DocsPage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);
  const searchParams = useSearchParams();
  
  // We'll simulate that docs are generating/loading to show skeletons instead of empty state
  const hasDocs = true;
  const isGenerating = false; 

  if (isGenerating) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background p-6">
        <div className="bg-card border border-border/50 p-10 rounded-lg flex flex-col items-center justify-center text-center space-y-5 shadow-sm max-w-sm w-full">
           <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2 relative">
             <BookOpen className="animate-pulse text-primary w-8 h-8" />
             <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-[spin_2s_linear_infinite]" />
           </div>
           <div>
             <h3 className="text-foreground font-semibold text-lg">Generating Documentation</h3>
             <p className="text-muted-foreground/60 text-sm mt-3 max-w-[200px] mx-auto leading-relaxed">
               Analyzing codebase and synthesizing markdown docs. This can take several minutes.
             </p>
           </div>
        </div>
      </div>
    );
  }

  if (!hasDocs) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background p-6">
        <div className="bg-card border border-border/50 p-10 rounded-lg flex flex-col items-center justify-center text-center space-y-5 shadow-sm max-w-md w-full">
           <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-2">
             <FileText className="text-muted-foreground w-8 h-8" />
           </div>
           <div>
             <h3 className="text-foreground font-semibold text-lg">No Documentation Found</h3>
             <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
               Quarry can automatically generate comprehensive, architecture-aware documentation for this repository.
             </p>
           </div>
           <Link href={`/repos/${repoId}/docs?generate=true`} className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors w-full mt-2 block">
             Generate Docs Now
           </Link>
           <p className="text-[10px] text-muted-foreground/60 flex items-center justify-center gap-1 mt-4">
             <AlertCircle size={10} /> Requires ~12.5k tokens
           </p>
        </div>
      </div>
    );
  }

  // Active Docs State (Skeleton)
  return (
    <div className="h-full flex flex-col sm:flex-row bg-background overflow-hidden">
      
      {/* Sidebar Explorer */}
      <div className="w-full sm:w-64 md:w-72 border-r border-border/50 bg-card/30 flex flex-col shrink-0">
        <div className="p-4 border-b border-border/50">
           <div className="relative">
             <Search className="absolute left-2.5 top-2.5 text-muted-foreground" size={14} />
             <input 
               type="text" 
               placeholder="Search docs..." 
               className="w-full pl-8 pr-4 py-2 text-sm bg-background border border-border/50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
             />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Getting Started</h4>
            <ul className="space-y-1">
              {[1, 2].map((i) => (
                <li key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary/50 cursor-pointer">
                  <Skeleton className="w-4 h-4 rounded-sm" />
                  <Skeleton className="h-3 w-24" />
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Architecture</h4>
            <ul className="space-y-1">
              {[1, 2, 3, 4].map((i) => (
                <li key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary/50 cursor-pointer">
                  <Skeleton className="w-4 h-4 rounded-sm" />
                  <Skeleton className="h-3 w-28" />
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">API Reference</h4>
            <ul className="space-y-1">
              {[1, 2, 3].map((i) => (
                <li key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary/50 cursor-pointer">
                  <Skeleton className="w-4 h-4 rounded-sm" />
                  <Skeleton className="h-3 w-20" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Skeleton className="h-3 w-16" />
            <ChevronRight size={14} />
            <Skeleton className="h-3 w-20" />
            <ChevronRight size={14} />
            <Skeleton className="h-3 w-24" />
          </div>

          {/* Doc Header Skeleton */}
          <div>
            <Skeleton className="h-8 w-64 mb-4" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-20 rounded-md" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>

          {/* Doc Body Skeleton */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            
            <Skeleton className="h-6 w-40 mt-8 mb-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            
            <div className="p-4 bg-secondary/10 border border-border/50 rounded-md my-6 space-y-2">
               <Skeleton className="h-3 w-32 mb-4" />
               <Skeleton className="h-4 w-full font-mono" />
               <Skeleton className="h-4 w-2/3 font-mono" />
            </div>
            
            <Skeleton className="h-6 w-32 mt-8 mb-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

        </div>
      </div>

    </div>
  );
}
