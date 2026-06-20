"use client";

import { Search, History, BookOpen, Plus } from "lucide-react";
import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DecisionsPage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);

  return (
    <div className="h-full flex flex-col bg-background p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* Title and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Architecture Decision Records</h1>
            <p className="text-sm text-muted-foreground mt-1">Track key technical decisions, context, and consequences over time.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 text-muted-foreground" size={14} />
              <input 
                type="text" 
                placeholder="Search ADRs..." 
                className="pl-8 pr-4 py-1.5 text-sm bg-card border border-border/50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-64 text-foreground"
              />
            </div>
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
              <Plus size={14} />
              New ADR
            </button>
          </div>
        </div>

        {/* Global ADR Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-card border border-border/50 rounded-lg p-5 shadow-sm space-y-3">
             <div className="flex items-center gap-2 text-muted-foreground">
               <BookOpen size={16} />
               <h3 className="text-xs font-semibold uppercase tracking-wider">Total ADRs</h3>
             </div>
             <Skeleton className="h-8 w-16" />
           </div>
           
           <div className="bg-card border border-border/50 rounded-lg p-5 shadow-sm space-y-3">
             <div className="flex items-center gap-2 text-muted-foreground">
               <History size={16} />
               <h3 className="text-xs font-semibold uppercase tracking-wider">Recent Activity</h3>
             </div>
             <Skeleton className="h-8 w-24" />
           </div>
        </div>

        {/* ADR Table (Skeleton) */}
        <div className="bg-card border border-border/50 rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/30 border-b border-border/50">
                <tr>
                  <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">ID</th>
                  <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Title</th>
                  <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                  <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Date</th>
                  <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider text-right">Author</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="hover:bg-secondary/5">
                    <td className="p-4 font-mono text-xs">
                       <Skeleton className="h-4 w-12" />
                    </td>
                    <td className="p-4 font-medium text-foreground">
                       <Skeleton className="h-4 w-64" />
                    </td>
                    <td className="p-4">
                       <Skeleton className="h-5 w-20 rounded-md" />
                    </td>
                    <td className="p-4 text-muted-foreground">
                       <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="p-4">
                       <div className="flex items-center justify-end gap-2">
                          <Skeleton className="h-6 w-6 rounded-full" />
                          <Skeleton className="h-4 w-20" />
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
