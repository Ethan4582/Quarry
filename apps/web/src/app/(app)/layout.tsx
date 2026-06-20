import { createClient } from "@quarry/db/server";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex h-screen bg-black-4 text-white font-sans relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="bg-orb w-[600px] h-[600px] bg-royal-blue-1/[0.06] -top-48 -left-48" />
      <div className="bg-orb w-[400px] h-[400px] bg-royal-blue-1/[0.04] bottom-0 right-1/4" />

      {/* Children provide their own sidebar and main container */}
      {children}
    </div>
  );
}
