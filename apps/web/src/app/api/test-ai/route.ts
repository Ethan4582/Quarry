import { testGenerate } from "@quarry/ai";
import { createClient } from "@quarry/db/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { provider, apiKey, prompt } = await req.json();
    const text = await testGenerate(provider, apiKey, prompt);
    return NextResponse.json({ text });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
