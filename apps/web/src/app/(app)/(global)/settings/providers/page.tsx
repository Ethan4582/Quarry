"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [provider, setProvider] = useState("groq");
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error" | "loading" | null; msg: string }>({ type: null, msg: "" });

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      setStatus({ type: "error", msg: "API key is required" });
      return;
    }
    
    setStatus({ type: "loading", msg: "Testing connection..." });

    try {
      const res = await fetch("/api/test-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          provider, 
          apiKey, 
          prompt: "Return the exact phrase: CONNECTION_SUCCESS" 
        }),
      });
      const data = await res.json();
      
      if (data.error) {
        setStatus({ type: "error", msg: data.error });
      } else if (data.text?.includes("CONNECTION_SUCCESS")) {
        setStatus({ type: "success", msg: "Connection successful!" });
      } else {
        setStatus({ type: "success", msg: "Connected, but unexpected response: " + data.text });
      }
    } catch (err: any) {
      setStatus({ type: "error", msg: err.message });
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto w-full">
      <h1 className="text-2xl font-semibold text-foreground mb-8">Settings</h1>
      
      <div className="bg-panel border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-medium text-foreground mb-1">AI Providers</h2>
          <p className="text-sm text-muted">Configure the models used for embedding and chat.</p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleTest} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Provider</label>
              <select 
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full bg-card border border-border text-foreground p-2.5 rounded focus:outline-none focus:border-royal-blue-1 text-sm transition-colors"
              >
                <option value="groq">Groq</option>
                <option value="anthropic">Anthropic</option>
                <option value="openai">OpenAI</option>
                <option value="google">Google</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">API Key</label>
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter API key"
                className="w-full bg-card border border-border text-foreground p-2.5 rounded focus:outline-none focus:border-royal-blue-1 text-sm transition-colors font-mono"
              />
            </div>
            
            <div className="pt-2 flex items-center gap-4">
              <button 
                type="submit"
                disabled={status.type === "loading"}
                className="bg-dark-gray-16 border border-border hover:bg-card text-foreground px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {status.type === "loading" && <Loader2 size={14} className="animate-spin" />}
                Test connection
              </button>
              
              {status.type === "success" && (
                <span className="text-sm text-forest-green-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-green-1"></span>
                  {status.msg}
                </span>
              )}
              {status.type === "error" && (
                <span className="text-sm text-tomato-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-tomato-1"></span>
                  {status.msg}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
