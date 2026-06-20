"use client";

import { createClient } from "@quarry/db/client";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const supabase = createClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Button onClick={handleLogin}>Sign in with GitHub</Button>
    </div>
  );
}
