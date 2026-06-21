"use client";

import { createClient } from "@quarry/db/client";
import Image from "next/image";

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
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0a0a0a] p-4">
      <div className="w-full max-w-[380px] h-[550px] overflow-hidden rounded-[40px] bg-[#1c1c1e] shadow-2xl relative">
        
        {/* Background Image (Top Half) */}
        <div className="absolute top-0 left-0 w-full h-[55%]">
          <img 
            src="https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop"
            alt="Background"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Dark overlay panel (Bottom Half) */}
        <div className="absolute bottom-0 left-0 w-full h-[55%] rounded-[40px] bg-[#1c1c1e] p-8 text-white shadow-[0_-10px_30px_rgba(0,0,0,0.3)] flex flex-col">
          
          <div className="mt-4 mb-8">
            <h1 className="mb-3 text-[32px] font-semibold tracking-tight">Get started</h1>
            <p className="text-[15px] leading-relaxed text-[#8e8e93]">
              Welcome to Quarry ! Please choose a way to sign up or log in.
            </p>
          </div>

          <div className="mt-auto mb-6">
            <button 
              onClick={handleLogin} 
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#2c2c2e] hover:bg-[#3a3a3c] py-[18px] text-[16px] font-medium text-white transition-colors"
            >
              <Image 
                src="/logo/github.png" 
                alt="GitHub" 
                width={20} 
                height={20} 
                className="brightness-0 invert" 
              />
              Continue with GitHub
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
