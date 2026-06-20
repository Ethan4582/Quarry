"use client";

import { Search, Users, GitCommit, Filter } from "lucide-react";
import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContributorsPage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);

  return (
    <div className="h-full flex flex-col bg-background p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* Title and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Contributors</h1>
            <p className="text-sm text-muted-foreground mt-1">Analyze team impact, knowledge distribution, and collaboration.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 text-muted-foreground" size={14} />
              <input 
                type="text" 
                placeholder="Search contributors..." 
                className="pl-8 pr-4 py-1.5 text-sm bg-card border border-border/50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-64 text-foreground"
              />
            </div>
            <button className="bg-card border border-border/50 p-2 rounded-md hover:bg-secondary/50 text-muted-foreground transition-colors">
              <Filter size={14} />
            </button>
          </div>
        </div>

        {/* Global Contributor Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-card border border-border/50 rounded-lg p-5 shadow-sm space-y-3">
             <div className="flex items-center gap-2 text-muted-foreground">
               <Users size={16} />
               <h3 className="text-xs font-semibold uppercase tracking-wider">Total Active</h3>
             </div>
             <Skeleton className="h-8 w-16" />
           </div>
           
           <div className="bg-card border border-border/50 rounded-lg p-5 shadow-sm space-y-3">
             <div className="flex items-center gap-2 text-muted-foreground">
               <GitCommit size={16} />
               <h3 className="text-xs font-semibold uppercase tracking-wider">Avg Commits/Wk</h3>
             </div>
             <Skeleton className="h-8 w-20" />
           </div>

           <div className="bg-card border border-border/50 rounded-lg p-5 shadow-sm space-y-3">
             <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bus Factor Risk</h3>
             <Skeleton className="h-8 w-12" />
             <Skeleton className="h-2 w-full" />
           </div>

           <div className="bg-card border border-border/50 rounded-lg p-5 shadow-sm space-y-3">
             <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Assistance</h3>
             <Skeleton className="h-8 w-16" />
             <Skeleton className="h-2 w-full" />
           </div>
        </div>

        {/* Contributors Grid (Skeleton) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card border border-border/50 rounded-lg p-5 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Commits</span>
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Files Touched</span>
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Primary Focus</span>
                  <Skeleton className="h-5 w-24 rounded-md" />
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-border/50">
                <Skeleton className="h-8 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
