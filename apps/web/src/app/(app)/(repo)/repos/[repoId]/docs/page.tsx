"use client";

import { use } from "react";
import { Folder, Search, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function DocsPage({ params }: { params: Promise<{ repoId: string }> }) {
  const { repoId } = use(params);

  // Stub empty state
  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center p-8">
      <div className="bg-card border border-border/50 p-10 rounded-lg flex flex-col items-center text-center max-w-md w-full shadow-sm">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">No Documentation Generated</h2>
        <p className="text-sm text-muted-foreground mb-6">
          You haven't generated documentation for this repository yet. Run the documentation pipeline to explore the code base by domain or folder.
        </p>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:brightness-110 transition-all shadow-[0_0_15px_rgba(229,77,46,0.2)]">
          Generate Documentation
        </button>
      </div>
    </div>
  );
}
