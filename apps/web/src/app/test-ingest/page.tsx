"use client";

import { useState } from "react";
import { createClient } from "@quarry/db/client";

export default function TestIngestPage() {
  const [repoStr, setRepoStr] = useState("");
  const [provider, setProvider] = useState("groq");
  const [apiKey, setApiKey] = useState("");
  const [prompt, setPrompt] = useState("Tell me a one-sentence joke about databases.");
  const [aiResult, setAiResult] = useState<string | null>(null);
  
  const [ingestStatus, setIngestStatus] = useState<string | null>(null);
  const [chunks, setChunks] = useState<any[]>([]);

  const supabase = createClient();

  // Test AI
  const handleTestAi = async () => {
    setAiResult("Loading...");
    try {
      const res = await fetch("/api/test-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey, prompt })
      });
      const data = await res.json();
      setAiResult(data.text || data.error || JSON.stringify(data));
    } catch (e: any) {
      setAiResult(`Error: ${e.message}`);
    }
  };

  // Test Ingest
  const handleIngest = async () => {
    setIngestStatus("Loading... (this may take a minute depending on repo size)");
    setChunks([]);
    try {
      const [owner, repo] = repoStr.split("/");
      if (!owner || !repo) throw new Error("Format must be owner/repo");

      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setIngestStatus(`Done! Repo ID: ${data.repoId} ${data.cached ? "(Cached)" : ""}`);

      // Fetch chunks to verify
      const { data: chunksData, error } = await supabase
        .from("chunks")
        .select("file_path, symbol_name, symbol_type, token_count")
        .eq("repo_id", data.repoId)
        .limit(100);

      if (error) throw error;
      setChunks(chunksData || []);
    } catch (e: any) {
      setIngestStatus(`Error: ${e.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-black-4 text-white p-8 space-y-12 font-sans">
      <h1 className="text-2xl font-bold text-white">Phase 2 Test Harness</h1>

      {/* AI Test Panel */}
      <section className="bg-dark-gray-1 border border-dim-gray/30 p-6 rounded-lg space-y-4 max-w-xl">
        <h2 className="text-xl font-semibold text-royal-blue-1">1. Test AI Provider</h2>
        <div className="flex flex-col gap-3">
          <select 
            value={provider} 
            onChange={e => setProvider(e.target.value)}
            className="bg-dark-gray-16 border border-dim-gray/30 text-white p-2 rounded focus:outline-none focus:border-royal-blue-1"
          >
            <option value="groq">Groq</option>
            <option value="anthropic">Anthropic</option>
            <option value="openai">OpenAI</option>
            <option value="google">Google</option>
          </select>
          <input 
            type="password" 
            placeholder="API Key" 
            value={apiKey} 
            onChange={e => setApiKey(e.target.value)} 
            className="bg-dark-gray-16 border border-dim-gray/30 text-white p-2 rounded focus:outline-none focus:border-royal-blue-1"
          />
          <input 
            type="text" 
            value={prompt} 
            onChange={e => setPrompt(e.target.value)} 
            className="bg-dark-gray-16 border border-dim-gray/30 text-white p-2 rounded focus:outline-none focus:border-royal-blue-1"
          />
          <button onClick={handleTestAi} className="bg-royal-blue-1 text-white py-2 px-4 rounded hover:bg-royal-blue-1/80 transition-colors">
            Run AI Test
          </button>
          {aiResult && (
            <div className="bg-black/50 p-3 rounded mt-2 text-sm whitespace-pre-wrap">
              {aiResult}
            </div>
          )}
        </div>
      </section>

      {/* Ingestion Test Panel */}
      <section className="bg-dark-gray-1 border border-dim-gray/30 p-6 rounded-lg space-y-4 max-w-4xl">
        <h2 className="text-xl font-semibold text-royal-blue-1">2. Test Ingestion Pipeline</h2>
        <div className="flex flex-col gap-3 max-w-xl">
          <input 
            type="text" 
            placeholder="owner/repo (e.g. v0/quarry)" 
            value={repoStr} 
            onChange={e => setRepoStr(e.target.value)} 
            className="bg-dark-gray-16 border border-dim-gray/30 text-white p-2 rounded focus:outline-none focus:border-royal-blue-1"
          />
          <button onClick={handleIngest} className="bg-royal-blue-1 text-white py-2 px-4 rounded hover:bg-royal-blue-1/80 transition-colors">
            Run Ingestion
          </button>
          {ingestStatus && (
            <div className="bg-black/50 p-3 rounded mt-2 text-sm text-medium-turquoise">
              {ingestStatus}
            </div>
          )}
        </div>

        {chunks.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <h3 className="font-semibold mb-2 text-white">Chunks (showing up to 100)</h3>
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-dim-gray/30">
                  <th className="p-2">File</th>
                  <th className="p-2">Symbol</th>
                  <th className="p-2">Type</th>
                  <th className="p-2 text-right">Tokens</th>
                </tr>
              </thead>
              <tbody>
                {chunks.map((c, i) => (
                  <tr key={i} className="border-b border-dim-gray/10 hover:bg-dark-gray-16 transition-colors">
                    <td className="p-2 text-dark-gray">{c.file_path}</td>
                    <td className="p-2 text-white">{c.symbol_name}</td>
                    <td className="p-2 text-white">{c.symbol_type}</td>
                    <td className="p-2 text-right text-dark-gray">{c.token_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
