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
            <span className="text-base font-semibold tracking-tight">Quarry</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          <NavItem href="/dashboard" icon={<LayoutDashboard size={16} />} label="Dashboard" />
          
          <div className="pt-4 pb-1 px-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Workspace</span>
          </div>
          <NavItem href="/settings/providers" icon={<Key size={16} />} label="API Providers" />
          <NavItem href="/settings/models" icon={<Cpu size={16} />} label="Model Settings" />
          <NavItem href="/settings/usage" icon={<Activity size={16} />} label="Token Usage" />
          <NavItem href="/settings/analytics" icon={<BarChart size={16} />} label="Analytics" />

          <div className="pt-4 pb-1 px-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">System</span>
          </div>
          <NavItem href="/settings" icon={<SettingsIcon size={16} />} label="Settings" />
        </nav>

        {/* User */}
        <div className="p-4 border-t border-border/10">
          <div className="group relative flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full border border-border/20" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-secondary border border-border/20 flex items-center justify-center text-sm text-muted-foreground">
                {(profile?.github_username || user?.user_metadata?.user_name || "U")[0]?.toUpperCase()}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-foreground truncate">
                {profile?.github_username || user?.user_metadata?.user_name || "User"}
              </span>
              <span className="text-xs text-muted-foreground">Personal</span>
            </div>

            {/* Hover Menu */}
            <div className="absolute bottom-full left-0 mb-2 hidden w-48 flex-col rounded-md border border-border bg-card p-1 shadow-lg group-hover:flex z-50">
              <a href="/settings" className="w-full rounded-sm px-2 py-1.5 text-left text-sm text-foreground hover:bg-white/10 transition-colors">
                Settings
              </a>
              <form action="/auth/signout" method="post" className="w-full">
                <button type="submit" className="w-full rounded-sm px-2 py-1.5 text-left text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                  Sign Out
                </button>
              </form>
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
      className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-md transition-colors"
    >
      <span className="text-muted-foreground/60">{icon}</span>
      {label}
    </Link>
  );
}
