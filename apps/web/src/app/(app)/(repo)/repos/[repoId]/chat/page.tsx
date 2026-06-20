"use client";

import { use } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatPage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);

  // We show the skeleton chat layout assuming the key is present but data is loading
  const hasKey = true;

  if (!hasKey) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background p-6">
        <div className="bg-card border border-border/50 p-10 rounded-lg flex flex-col items-center justify-center text-center space-y-5 shadow-sm max-w-md w-full">
           <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
             <Sparkles className="text-primary w-8 h-8" />
           </div>
           <div>
             <h3 className="text-foreground font-semibold text-lg">Chat with your Codebase</h3>
             <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
               Ask questions about architecture, find specific implementations, or get help debugging issues across the entire repository.
             </p>
           </div>
           <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors w-full mt-2">
             Configure API Key
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background relative">
      {/* Chat History Area (Skeleton) */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full pb-32">
        
        {/* Agent Greeting Skeleton */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
            <Bot size={16} className="text-primary" />
          </div>
          <div className="flex-1 space-y-2 pt-1">
            <Skeleton className="h-4 w-3/4 max-w-md" />
            <Skeleton className="h-4 w-1/2 max-w-sm" />
          </div>
        </div>

        {/* User Query Skeleton */}
        <div className="flex gap-4 flex-row-reverse">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1">
            <User size={16} className="text-muted-foreground" />
          </div>
          <div className="flex-1 flex flex-col items-end space-y-2 pt-1">
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        {/* Agent Response Skeleton */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
            <Bot size={16} className="text-primary" />
          </div>
          <div className="flex-1 space-y-3 pt-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[95%]" />
            
            <div className="p-4 bg-secondary/20 border border-border/50 rounded-md mt-4 space-y-2">
               <Skeleton className="h-3 w-32 mb-4" />
               <Skeleton className="h-4 w-full font-mono" />
               <Skeleton className="h-4 w-2/3 font-mono" />
               <Skeleton className="h-4 w-4/5 font-mono" />
            </div>
            
            <Skeleton className="h-4 w-1/2 mt-4" />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent p-6 lg:px-8 pb-8 pt-12">
        <div className="max-w-4xl mx-auto relative">
          <textarea 
            placeholder="Ask anything about the codebase..."
            className="w-full bg-card border border-border/50 rounded-lg pl-4 pr-12 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground resize-none h-[60px] shadow-sm"
          />
          <button className="absolute right-3 top-3 p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
