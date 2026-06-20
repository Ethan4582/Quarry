import { createClient } from "@quarry/db/server";
import Link from "next/link";
import { LayoutDashboard, Settings as SettingsIcon, Key, Cpu, Activity, BarChart } from "lucide-react";

export default async function GlobalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("github_username, avatar_url")
    .eq("id", user!.id)
    .single();

  return (
    <>
      {/* Global Sidebar */}
      <aside className="relative z-10 w-56 shrink-0 flex flex-col glass">
        {/* Logo */}
        <div className="h-12 flex items-center px-4 border-b border-dim-gray/10">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-royal-blue-1">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-semibold tracking-tight">Quarry</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          <NavItem href="/dashboard" icon={<LayoutDashboard size={14} />} label="Dashboard" />
          
          <div className="pt-4 pb-1 px-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-dark-gray/40">Workspace</span>
          </div>
          <NavItem href="/settings/providers" icon={<Key size={14} />} label="API Providers" />
          <NavItem href="/settings/models" icon={<Cpu size={14} />} label="Model Settings" />
          <NavItem href="/settings/usage" icon={<Activity size={14} />} label="Token Usage" />
          <NavItem href="/settings/analytics" icon={<BarChart size={14} />} label="Analytics" />

          <div className="pt-4 pb-1 px-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-dark-gray/40">System</span>
          </div>
          <NavItem href="/settings" icon={<SettingsIcon size={14} />} label="Settings" />
        </nav>

        {/* User */}
        <div className="p-3 border-t border-dim-gray/10">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-dark-gray-16 transition-colors cursor-default">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-6 h-6 rounded-full border border-dim-gray/20" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-dark-gray-16 border border-dim-gray/20 flex items-center justify-center text-[10px] text-dark-gray">
                {profile?.github_username?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-white truncate">{profile?.github_username ?? "User"}</span>
              <span className="text-[10px] text-dark-gray/50">Personal</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden bg-black-4/80">
        {children}
      </main>
    </>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-2 py-1.5 text-xs text-dark-gray hover:text-white hover:bg-dark-gray-16 rounded-md transition-colors"
    >
      <span className="text-dark-gray/60">{icon}</span>
      {label}
    </Link>
  );
}
