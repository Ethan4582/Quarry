"use client";

import { useState } from "react";
import { Search, Layers as LayersIcon, Share2, Code2, Package } from "lucide-react";
import { use } from "react";

export default function ArchitecturePage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);
  const [tab, setTab] = useState("map");

  const tabs = [
    { id: "map", label: "Map", icon: <Share2 size={14} /> },
    { id: "layers", label: "Layers", icon: <LayersIcon size={14} /> },
    { id: "symbols", label: "Symbols", icon: <Code2 size={14} /> },
    { id: "dependencies", label: "Dependencies", icon: <Package size={14} /> },
  ];

  return (
    <div className="h-full flex flex-col bg-background">
      {/* In-page Tab Bar */}
      <div className="h-12 border-b border-border/50 flex items-center justify-between px-6 shrink-0 bg-card/50">
        <div className="flex items-center gap-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-md font-medium transition-colors ${tab === t.id ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder={`Search ${tab}...`}
            className="bg-secondary border border-border/50 rounded-md pl-8 pr-3 py-1.5 text-xs text-foreground outline-none focus:border-primary/50"
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden relative">
        {tab === "map" && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/10">
            {/* Force-directed graph canvas placeholder */}
            <div className="text-center">
              <Share2 size={48} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">Force-Directed Knowledge Graph Canvas</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Interactive network visualization goes here</p>
            </div>
            {/* Top-right overlay control */}
            <div className="absolute top-4 right-4 bg-card border border-border/50 rounded-lg p-2 shadow-sm flex gap-1">
              <button className="text-xs px-2 py-1 bg-secondary text-foreground rounded font-medium">Knowledge Graph</button>
              <button className="text-xs px-2 py-1 text-muted-foreground hover:text-foreground rounded font-medium">Modules</button>
              <button className="text-xs px-2 py-1 text-muted-foreground hover:text-foreground rounded font-medium">Full</button>
            </div>
          </div>
        )}

        {tab === "layers" && (
          <div className="flex h-full">
            <div className="flex-1 p-8 overflow-y-auto bg-card/10">
              <div className="max-w-4xl mx-auto space-y-4">
                <h3 className="text-sm font-semibold text-foreground mb-6">Detected Architecture Layers</h3>
                {["UI / Presentation", "Application / Services", "Domain / Core", "Infrastructure / Config"].map((layer, i) => (
                  <div key={i} className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-foreground">{layer}</h4>
                      <span className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">High Complexity</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Contains X files, Y lines of code.</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-64 border-l border-border/50 bg-secondary/20 p-4 overflow-y-auto">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">File Tree Browser</h3>
              <p className="text-xs text-muted-foreground/50">Collapsible tree goes here</p>
            </div>
          </div>
        )}

        {tab === "symbols" && (
          <div className="h-full flex flex-col p-6 bg-card/30">
            {/* Filter Row */}
            <div className="flex items-center gap-2 mb-4">
              <select className="bg-secondary border border-border/50 rounded text-xs px-2 py-1 outline-none">
                <option>All Kinds</option>
              </select>
              <select className="bg-secondary border border-border/50 rounded text-xs px-2 py-1 outline-none">
                <option>All Languages</option>
              </select>
            </div>
            <div className="bg-card border border-border/50 rounded-xl flex-1 overflow-hidden flex flex-col">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/30 border-b border-border/50">
                  <tr>
                    <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Name</th>
                    <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Kind</th>
                    <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">File:Line</th>
                    <th className="p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider text-right">Complexity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr className="hover:bg-secondary/20">
                    <td className="p-3 text-foreground font-medium flex items-center gap-2">
                      AuthService
                      <span className="text-[9px] bg-primary/20 text-primary px-1.5 rounded uppercase tracking-wider">Entry Point</span>
                    </td>
                    <td className="p-3 text-muted-foreground">Class</td>
                    <td className="p-3 text-muted-foreground font-mono text-xs">src/auth.ts:12</td>
                    <td className="p-3 text-right text-muted-foreground">High</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "dependencies" && (
          <div className="h-full overflow-y-auto p-6 bg-card/30">
            <h3 className="text-sm font-semibold text-foreground mb-4">Frameworks & Libraries</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {["React", "Next.js", "TailwindCSS"].map((dep, i) => (
                <div key={i} className="bg-card border border-border/50 rounded-xl p-4 shadow-sm flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">{dep}</h4>
                    <p className="text-xs text-muted-foreground mt-1">Found in package.json</p>
                  </div>
                  <span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded">v18.2.0</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
