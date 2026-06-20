export default function TokenUsagePage() {
  return (
    <div className="p-8 max-w-2xl mx-auto w-full">
      <h1 className="text-2xl font-semibold text-foreground mb-8">Token Usage</h1>
      
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-lg bg-card/30">
        <div className="w-10 h-10 rounded-full bg-dark-gray-16 border border-dim-gray/10 flex items-center justify-center mb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-dark-gray">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        </div>
        <p className="text-sm text-foreground mb-1">Coming in a future phase</p>
        <p className="text-xs text-muted max-w-sm">Token usage and cost tracking will appear here once Langfuse is integrated.</p>
      </div>
    </div>
  );
}
