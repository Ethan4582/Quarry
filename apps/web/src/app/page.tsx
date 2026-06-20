import Link from "next/link";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-black-4 text-white font-sans flex flex-col relative overflow-hidden">
      {/* Ambient orbs — give glass something to blur against */}
      <div className="bg-orb w-[500px] h-[500px] bg-royal-blue-1/[0.07] -top-32 -left-32" />
      <div className="bg-orb w-[400px] h-[400px] bg-royal-blue-1/[0.05] top-1/2 right-0 translate-x-1/3" />

      {/* Glass nav */}
      <nav className="sticky top-0 z-50 glass flex items-center justify-between px-8 h-14">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-royal-blue-1">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-semibold text-sm tracking-tight">Quarry</span>
        </div>
        <Link href="/login" className="text-sm text-dark-gray hover:text-white transition-colors">
          Sign in →
        </Link>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="inline-flex items-center gap-2 glass-light rounded-full px-3 py-1 text-xs text-dark-gray mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-royal-blue-1 animate-pulse" />
          Codebase intelligence for engineering teams
        </div>

        <h1 className="text-5xl font-semibold tracking-tight text-white max-w-2xl leading-[1.1] mb-5">
          Understand any repo,{" "}
          <span className="text-royal-blue-1">instantly.</span>
        </h1>

        <p className="text-dark-gray text-lg max-w-lg leading-relaxed mb-10">
          Paste a GitHub URL. Quarry ingests, chunks, and embeds your codebase — then lets you query, document, and explore it.
        </p>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-2 bg-gradient-to-b from-[#6b75df] to-royal-blue-1 border border-royal-blue-1/40 shadow-[0_4px_14px_rgba(94,106,210,0.35),inset_0_1px_0_rgba(255,255,255,0.1)] text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Get started free
          </Link>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-dark-gray hover:text-white transition-colors">
            View on GitHub →
          </a>
        </div>

        {/* Feature strip — glass cards */}
        <div className="mt-20 grid grid-cols-3 gap-px bg-white/[0.04] rounded-xl overflow-hidden border border-white/[0.05] max-w-2xl w-full">
          {[
            { label: "Ingest", desc: "Fetches tree, blobs, and metadata from any public repo" },
            { label: "Embed", desc: "Chunks by symbol with Tree-sitter, embeds with Voyage AI" },
            { label: "Query", desc: "Semantic search over your entire codebase via Pinecone" },
          ].map((f) => (
            <div key={f.label} className="glass-light px-5 py-5 text-left">
              <div className="text-xs font-semibold text-royal-blue-1 mb-1.5 uppercase tracking-wider">{f.label}</div>
              <div className="text-xs text-dark-gray leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <footer className="relative z-10 px-8 h-12 flex items-center border-t border-white/[0.04]">
        <span className="text-xs text-dark-gray/40">© 2026 Quarry</span>
      </footer>
    </div>
  );
}
