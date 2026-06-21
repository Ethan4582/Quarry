"use client";

import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Send, Zap, BrainCircuit, MessageSquareText } from "lucide-react";

export default function ChatPage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);

  // Stub for pre-signin/pre-key state OR active chat state.
  // We'll show a mixed view just for the stub layout.

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-5xl mx-auto w-full p-4 lg:p-8">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Codebase Chat</h1>
          <p className="text-muted-foreground text-sm mt-1">Ask questions about the architecture, logic, and implementation.</p>
        </div>
        
        <div className="flex bg-secondary/10 border border-border rounded-lg p-1">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-card shadow-sm text-foreground border border-border/50">
            <Zap size={14} className="text-primary" /> Quick
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground">
            <BrainCircuit size={14} /> Deep
          </button>
        </div>
      </div>

      <div className="flex-1 bg-card border border-border rounded-lg shadow-sm overflow-hidden flex flex-col relative">
        
        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          <div className="flex gap-4 max-w-3xl">
            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 border border-border">
              <MessageSquareText size={14} className="text-muted-foreground" />
            </div>
            <div className="space-y-2 mt-1">
              <div className="text-sm font-medium text-foreground">You</div>
              <Skeleton className="h-5 w-64" />
            </div>
          </div>

          <div className="flex gap-4 max-w-4xl">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
              <Zap size={14} className="text-primary" />
            </div>
            <div className="space-y-4 mt-1 w-full">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-primary">Quarry</div>
                <Badge variant="outline" className="text-[10px] h-4 px-1.5 py-0 border-primary/30 text-primary/70">Quick Mode</Badge>
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary" className="font-mono text-[10px] cursor-pointer hover:bg-secondary/80">src/components/auth.ts:12</Badge>
                <Badge variant="secondary" className="font-mono text-[10px] cursor-pointer hover:bg-secondary/80">src/lib/utils.ts:45</Badge>
              </div>
            </div>
          </div>
          
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-card">
          <div className="max-w-4xl mx-auto">
            {/* Suggested Queries */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Skeleton className="h-7 w-32 rounded-full" />
              <Skeleton className="h-7 w-48 rounded-full" />
              <Skeleton className="h-7 w-40 rounded-full" />
            </div>
            
            <div className="relative">
              <div className="w-full bg-secondary/10 border border-border rounded-xl p-3 min-h-[80px] flex flex-col justify-end">
                <div className="flex justify-between items-center mt-4">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">~2 calls</span> · est. $0.002
                  </div>
                  <button className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:brightness-110 shadow-[0_0_10px_rgba(229,77,46,0.2)]">
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
