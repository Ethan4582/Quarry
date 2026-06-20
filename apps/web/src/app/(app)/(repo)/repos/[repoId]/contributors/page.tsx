"use client";

import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/Badge";
import { Search, User, Filter, AlertTriangle } from "lucide-react";
import { use } from "react";

export default function ContributorsPage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);

  return (
    <div className="h-full flex flex-col bg-background p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* Stat row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Contributors" value="24" />
          <StatCard title="Silo Owners" value="3" trend="Attention" trendDirection="down" />
          <StatCard title="Bus Factor Risk" value="12" description="Files solely owned" />
          <StatCard title="Dead Lines Owned" value="4.2k" />
        </div>

        {/* Filter/Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search contributors..." 
              className="w-full bg-card border border-border/50 rounded-md pl-8 pr-3 py-1.5 text-xs text-foreground outline-none focus:border-primary/50 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-1.5 bg-card border border-border/50 text-xs px-3 py-1.5 rounded-md text-foreground shadow-sm hover:bg-secondary">
              <Filter size={12} />
              Filter
            </button>
            <select className="bg-card border border-border/50 text-xs px-3 py-1.5 rounded-md outline-none text-foreground shadow-sm flex-1 sm:flex-none">
              <option>Sort: Files Owned</option>
              <option>Sort: Commits</option>
              <option>Sort: Risk Level</option>
            </select>
          </div>
        </div>

        {/* Contributor Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <User size={20} className="text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">alice@example.com</h3>
                  <p className="text-xs text-muted-foreground">Alice Smith</p>
                </div>
              </div>
              <Badge variant="destructive" className="h-5 text-[10px] px-2 py-0 gap-1">
                <AlertTriangle size={10} />
                Silo Owner
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs mb-4">
              <div>
                <p className="text-muted-foreground">Files Owned</p>
                <p className="font-medium text-foreground mt-0.5">142</p>
              </div>
              <div>
                <p className="text-muted-foreground">Hotspots</p>
                <p className="font-medium text-amber-500 mt-0.5">4</p>
              </div>
              <div>
                <p className="text-muted-foreground">Bus Factor 1</p>
                <p className="font-medium text-red-500 mt-0.5">12 files</p>
              </div>
              <div>
                <p className="text-muted-foreground">Dead Lines</p>
                <p className="font-medium text-foreground mt-0.5">1.2k</p>
              </div>
            </div>

            <div className="pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>842 commits (last 90d)</span>
              <span>Touched 2h ago</span>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <User size={20} className="text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">bob@example.com</h3>
                  <p className="text-xs text-muted-foreground">Bob Jones</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs mb-4">
              <div>
                <p className="text-muted-foreground">Files Owned</p>
                <p className="font-medium text-foreground mt-0.5">12</p>
              </div>
              <div>
                <p className="text-muted-foreground">Hotspots</p>
                <p className="font-medium text-foreground mt-0.5">0</p>
              </div>
              <div>
                <p className="text-muted-foreground">Bus Factor 1</p>
                <p className="font-medium text-foreground mt-0.5">0 files</p>
              </div>
              <div>
                <p className="text-muted-foreground">Dead Lines</p>
                <p className="font-medium text-foreground mt-0.5">42</p>
              </div>
            </div>

            <div className="pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>14 commits (last 90d)</span>
              <span>Touched 1d ago</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
