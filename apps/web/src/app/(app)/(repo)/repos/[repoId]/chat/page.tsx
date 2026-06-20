"use client";

import { use } from "react";
import { Send, Zap, BrainCircuit, Key, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/Badge";

export default function ChatPage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);
  
  // Hardcoded stub: Assume user hasn't set an API key yet
  const hasProviderKey = false;

  if (!hasProviderKey) {
    return (
      <div className="h-full flex flex-col bg-background relative">
        {/* Preview State: Messages overlay */}
        <div className="flex-1 overflow-hidden p-6 lg:p-8 blur-[2px] opacity-60 pointer-events-none select-none flex flex-col gap-6">
          <div className="flex justify-end">
            <div className="bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-lg text-sm">
              How does the authentication flow work in this repo?
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-secondary text-foreground border border-border/50 px-4 py-3 rounded-2xl rounded-tl-sm max-w-2xl text-sm leading-relaxed space-y-3">
              <p>The authentication flow is primarily handled in <span className="bg-card border border-border/50 px-1.5 py-0.5 rounded text-xs text-primary font-mono inline-flex items-center gap-1">src/auth.ts</span>.</p>
              <p>1. The client sends credentials to the <span className="font-mono text-xs text-muted-foreground">/api/login</span> endpoint.</p>
              <p>2. It's validated against Supabase using the <span className="font-mono text-xs text-muted-foreground">createClient</span> utility.</p>
              <p>3. A session cookie is set which is then verified in <span className="bg-card border border-border/50 px-1.5 py-0.5 rounded text-xs text-primary font-mono inline-flex items-center gap-1">middleware.ts</span>.</p>
            </div>
          </div>
        </div>

        {/* Call to Action Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/40 backdrop-blur-sm z-10 p-6">
          <div className="max-w-md w-full bg-card border border-border/50 rounded-2xl p-8 text-center shadow-lg">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Key className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Configure API Provider</h2>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              To chat with your codebase, you need to configure an LLM provider key. Quarry supports OpenAI, Anthropic, and local models.
            </p>
            
            <Link 
              href="/settings/providers"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Configure Providers <ArrowRight size={16} />
            </Link>

            <div className="mt-8 pt-6 border-t border-border/50 text-left">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center">Try asking</p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Where is state managed?", "Explain the deployment process", "How do I add a new route?"].map((q, i) => (
                  <span key={i} className="text-xs bg-secondary border border-border/50 text-muted-foreground px-3 py-1.5 rounded-full cursor-not-allowed">
                    {q}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Chat State (stub)
  return (
    <div className="h-full flex flex-col bg-background relative">
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 flex flex-col gap-6">
        {/* Chat bubbles go here */}
        <div className="flex justify-center my-4">
          <Badge variant="outline" className="text-[10px] text-muted-foreground bg-card">Today</Badge>
        </div>
      </div>

      <div className="p-4 border-t border-border/50 bg-card/50">
        <div className="max-w-3xl mx-auto">
          {/* Mode toggle */}
          <div className="flex items-center gap-1 mb-2 bg-secondary/50 p-1 rounded-lg w-fit border border-border/50">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-card text-foreground shadow-sm">
              <Zap size={14} className="text-amber-500" />
              Quick
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <BrainCircuit size={14} className="text-primary" />
              Deep
            </button>
          </div>
          
          {/* Input Box */}
          <div className="relative flex items-end gap-2 bg-card border border-border/50 rounded-xl p-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-sm">
            <textarea 
              placeholder="Ask anything about your codebase..." 
              className="w-full bg-transparent text-sm text-foreground outline-none resize-none min-h-[44px] max-h-32 p-3 hide-scrollbar"
              rows={1}
            />
            <button className="bg-primary text-primary-foreground p-3 rounded-lg hover:bg-primary/90 transition-colors shrink-0 disabled:opacity-50 h-11 w-11 flex items-center justify-center">
              <Send size={16} className="ml-1" />
            </button>
          </div>
          <div className="flex justify-between items-center mt-2 px-1">
            <span className="text-[10px] text-muted-foreground">Use Deep mode for complex architectural queries</span>
          </div>
        </div>
      </div>
    </div>
  );
}
