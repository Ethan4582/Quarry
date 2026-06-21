"use client";

import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function ArchitecturePage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto w-full h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Architecture</h1>
          <p className="text-muted-foreground text-sm mt-1">Explore the repository structure, layers, and dependencies.</p>
        </div>
        <div className="flex gap-2">
          {["Map", "Layers", "Symbols", "Dependencies"].map((tab, i) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                i === 0 ? "bg-primary/10 text-primary border border-primary/20" : "bg-transparent text-muted-foreground hover:bg-secondary/20 hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-card border border-border rounded-lg relative overflow-hidden flex items-center justify-center">
        {/* Placeholder for Force-directed graph canvas */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <Skeleton className="h-8 w-48 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
        
        <div className="flex flex-col items-center justify-center opacity-50">
          <div className="w-64 h-64 border-4 border-dashed border-border rounded-full flex items-center justify-center">
            <span className="text-muted-foreground text-sm font-medium uppercase tracking-widest">Graph Canvas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
