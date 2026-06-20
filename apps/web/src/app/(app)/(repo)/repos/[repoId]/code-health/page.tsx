"use client";

import { use } from "react";
import { Search, ShieldAlert, FileWarning, AlertTriangle, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CodeHealthPage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);

  return (
    <div className="h-full flex flex-col bg-background p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Code Health</h1>
            <p className="text-sm text-muted-foreground mt-1">Review complex files, test coverage, and maintenance risks.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 text-muted-foreground" size={14} />
              <input 
                type="text" 
                placeholder="Search files..." 
                className="pl-8 pr-4 py-1.5 text-sm bg-card border border-border/50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-64 text-foreground"
              />
            </div>
            <button className="bg-card border border-border/50 p-2 rounded-md hover:bg-secondary/50 text-muted-foreground transition-colors">
              <Filter size={14} />
            </button>
          </div>
        </div>

        {/* Categories Stub */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border/50 rounded-lg p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-500 mb-2">
              <AlertTriangle size={18} />
              <h3 className="font-semibold text-sm text-foreground">High Complexity</h3>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          
          <div className="bg-card border border-border/50 rounded-lg p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-red-500 mb-2">
              <FileWarning size={18} />
              <h3 className="font-semibold text-sm text-foreground">Hotspots</h3>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div className="bg-card border border-border/50 rounded-lg p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-primary mb-2">
              <ShieldAlert size={18} />
              <h3 className="font-semibold text-sm text-foreground">Security Risks</h3>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        {/* Detailed Findings Table (Skeleton) */}
        <div className="bg-card border border-border/50 rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border/50 flex justify-between items-center bg-secondary/10">
            <h2 className="text-sm font-semibold text-foreground">All Findings</h2>
            <div className="flex gap-2">
               <Skeleton className="h-8 w-24" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/30 border-b border-border/50">
                <tr>
                  <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">File</th>
                  <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Category</th>
                  <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Risk Score</th>
                  <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="hover:bg-secondary/5">
                    <td className="p-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </td>
                    <td className="p-4">
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-2 w-16 rounded-full" />
                        <Skeleton className="h-4 w-8" />
                      </div>
                    </td>
                    <td className="p-4">
                      <Skeleton className="h-8 w-24 rounded-md" />
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
