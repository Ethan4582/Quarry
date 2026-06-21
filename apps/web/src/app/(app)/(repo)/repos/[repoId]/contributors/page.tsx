"use client";

import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/StatCard";
import { Users, UserX, AlertTriangle, FileMinus } from "lucide-react";

export default function ContributorsPage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contributors</h1>
          <p className="text-muted-foreground text-sm mt-1">Discover expertise, ownership, and key personnel risks.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Contributors" value="--" icon={<Users size={16} />} />
        <StatCard title="Silo Owners" value="--" icon={<UserX size={16} />} />
        <StatCard title="Bus Factor Risk" value="--" icon={<AlertTriangle size={16} className="text-warning" />} />
        <StatCard title="Dead Lines Owned" value="--" icon={<FileMinus size={16} />} />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Skeleton className="h-10 w-full max-w-sm rounded-md" />
        <Skeleton className="h-10 w-48 rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-5 shadow-sm hover:border-primary/30 transition-colors cursor-pointer">
            <div className="flex items-start gap-4 mb-4">
              <Skeleton className="h-12 w-12 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-secondary/10 p-2 rounded-md">
                <Skeleton className="h-3 w-16 mb-1" />
                <Skeleton className="h-4 w-8" />
              </div>
              <div className="bg-secondary/10 p-2 rounded-md">
                <Skeleton className="h-3 w-16 mb-1" />
                <Skeleton className="h-4 w-8" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
