"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Link as LinkIcon, Github } from "lucide-react";

export function SubmitRepoForm({ githubUsername }: { githubUsername?: string }) {
  const [repoStr, setRepoStr] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentRepos, setRecentRepos] = useState<any[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!githubUsername) return;
    setLoadingRepos(true);
    fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setRecentRepos(data); })
      .finally(() => setLoadingRepos(false));
  }, [githubUsername]);

  const parseInput = (raw: string) => {
    let s = raw.trim().replace(/\.git$/, "").replace(/\/$/, "");
    if (s.includes("github.com/")) {
      const parts = s.split("github.com/")[1].split("/");
      if (parts.length >= 2) return { owner: parts[0], repo: parts[1] };
    }
    const parts = s.split("/");
    if (parts.length === 2 && parts[0] && parts[1]) return { owner: parts[0], repo: parts[1] };
    return null;
  };

  const submit = async (value: string) => {
    const parsed = parseInput(value);
    if (!parsed) { setError("Enter a GitHub URL or owner/repo"); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      router.push(`/repos/${data.repoId}`);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* URL input row */}
      <div className="flex items-center gap-2 bg-dark-gray-16 border border-dim-gray/20 rounded-lg px-3 py-2 focus-within:border-royal-blue-1/50 transition-colors">
        <LinkIcon size={14} className="text-dark-gray shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={repoStr}
          onChange={e => { setRepoStr(e.target.value); setError(null); }}
          onKeyDown={e => e.key === "Enter" && !loading && submit(repoStr)}
          placeholder="Paste GitHub URL or owner/repo..."
          disabled={loading}
          className="flex-1 bg-transparent text-sm text-white placeholder:text-dark-gray/50 outline-none"
        />
        <button
          onClick={() => submit(repoStr)}
          disabled={loading || !repoStr.trim()}
          className="flex items-center gap-1.5 bg-gradient-to-b from-[#6b75df] to-royal-blue-1 border border-royal-blue-1/40 shadow-[0_2px_8px_rgba(94,106,210,0.3),inset_0_1px_0_rgba(255,255,255,0.12)] text-white px-3 py-1.5 rounded-md text-xs font-medium hover:brightness-110 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : null}
          {loading ? "Ingesting..." : "Ingest"}
        </button>
      </div>

      {error && <p className="text-tomato-1 text-xs px-1">{error}</p>}

      {/* Recent repos quick-select */}
      {githubUsername && (
        <div>
          <p className="text-[11px] font-medium text-dark-gray/60 uppercase tracking-wider px-1 mb-2">
            Your recent repos
          </p>
          {loadingRepos ? (
            <div className="flex items-center gap-2 text-xs text-dark-gray px-1 py-1">
              <Loader2 size={11} className="animate-spin" /> Loading...
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1">
              {recentRepos.map(r => (
                <button
                  key={r.id}
                  onClick={() => submit(r.full_name)}
                  disabled={loading}
                  className="flex items-center gap-2 text-left bg-dark-gray-16 hover:bg-dark-gray-20 border border-dim-gray/10 hover:border-dim-gray/25 px-2.5 py-2 rounded-md transition-colors disabled:opacity-50 group"
                >
                  <Image src="logo/github.png" width={12} height={12} className="text-dark-gray shrink-0" />
                  <span className="text-xs text-dark-gray group-hover:text-white transition-colors truncate">{r.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
