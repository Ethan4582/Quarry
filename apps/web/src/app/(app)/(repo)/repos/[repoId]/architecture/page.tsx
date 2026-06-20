"use client";

import { Search, Layers as LayersIcon, Share2, Code2, Package } from "lucide-react";
import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArchitecturePage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);

  return (
    <div className="h-full flex flex-col bg-background p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* Title and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Architecture Explorer</h1>
            <p className="text-sm text-muted-foreground mt-1">Explore dependencies, layers, and project structure.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 text-muted-foreground" size={14} />
              <input 
                type="text" 
                placeholder="Search symbols..." 
                className="pl-8 pr-4 py-1.5 text-sm bg-card border border-border/50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-64 text-foreground"
              />
            </div>
            <select className="bg-card border border-border/50 text-sm px-3 py-1.5 rounded-md outline-none text-foreground">
              <option>View: Map</option>
              <option>View: Layers</option>
              <option>View: Symbols</option>
              <option>View: Dependencies</option>
            </select>
          </div>
        </div>

        {/* Tabs Stub */}
        <div className="border-b border-border/50">
          <nav className="-mb-px flex space-x-6">
            {['Map', 'Layers', 'Symbols', 'Dependencies'].map((tab, i) => (
              <button 
                key={tab}
                className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                  i === 0 ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Content area based on tab (Skeleton) */}
        <div className="bg-card border border-border/50 rounded-lg shadow-sm min-h-[500px] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <LayersIcon size={16} className="text-primary" />
              Dependency Graph
            </h2>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>

          {/* Skeleton Graph Area */}
          <div className="border border-border/50 rounded-md h-[400px] bg-secondary/10 relative overflow-hidden flex items-center justify-center p-8">
            <div className="w-full h-full relative">
               {/* Skeletons simulating nodes and edges */}
               <Skeleton className="absolute top-10 left-1/4 w-32 h-16 rounded-md" />
               <Skeleton className="absolute top-10 right-1/4 w-32 h-16 rounded-md" />
               
               <Skeleton className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-20 rounded-md" />
               
               <Skeleton className="absolute bottom-10 left-1/3 w-32 h-16 rounded-md" />
               <Skeleton className="absolute bottom-10 right-1/3 w-32 h-16 rounded-md" />

               {/* Central connecting lines simulated */}
               <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                 <line x1="30%" y1="20%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="2" />
                 <line x1="70%" y1="20%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="2" />
                 <line x1="35%" y1="80%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="2" />
                 <line x1="65%" y1="80%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="2" />
               </svg>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Top Modules</h3>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-md border border-border/50">
                    <Skeleton className="w-8 h-8 rounded-md shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">External Dependencies</h3>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-md border border-border/50">
                    <Skeleton className="w-8 h-8 rounded-md shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
