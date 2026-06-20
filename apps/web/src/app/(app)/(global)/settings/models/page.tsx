export default function ModelSettingsPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto w-full">
      <h1 className="text-2xl font-semibold text-foreground mb-8">Model Settings</h1>
      
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-lg bg-card/30">
        <div className="w-10 h-10 rounded-full bg-dark-gray-16 border border-dim-gray/10 flex items-center justify-center mb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-dark-gray">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <p className="text-sm text-foreground mb-1">Coming in a future phase</p>
        <p className="text-xs text-muted max-w-sm">Map your configured API providers to Cheap, Balanced, and Premium tiers.</p>
      </div>
    </div>
  );
}
