import { createClient } from "@quarry/db/server";
import { redirect } from "next/navigation";

export default async function AccountSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("github_username, avatar_url")
    .eq("id", user.id)
    .single();

  const metadata = user.user_metadata || {};
  const email = user.email || "No email available";
  const name = metadata.full_name || metadata.user_name || profile?.github_username || "GitHub User";
  const avatar = profile?.avatar_url || metadata.avatar_url;

  return (
    <div className="p-8 max-w-2xl mx-auto w-full">
      <h1 className="text-2xl font-semibold text-foreground mb-8">Account Settings</h1>
      
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border/50 bg-secondary/5">
          <h2 className="text-lg font-medium text-foreground mb-1">Personal Info</h2>
          <p className="text-sm text-muted-foreground">Manage your identity and authentication.</p>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Avatar and Name */}
          <div className="flex items-center gap-4">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-full border border-border" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center text-xl font-bold text-muted-foreground">
                {name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="text-lg font-medium text-foreground">{name}</h3>
              <p className="text-sm text-muted-foreground">User ID: <span className="font-mono text-xs">{user.id}</span></p>
            </div>
          </div>

          <div className="grid gap-6">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Email Address</label>
              <input 
                type="text" 
                disabled
                value={email}
                className="w-full max-w-md bg-secondary/10 border border-border text-foreground p-2.5 rounded text-sm opacity-70 cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">GitHub Username</label>
              <input 
                type="text" 
                disabled
                value={profile?.github_username || metadata.user_name || ""}
                className="w-full max-w-md bg-secondary/10 border border-border text-foreground p-2.5 rounded text-sm opacity-70 cursor-not-allowed"
              />
            </div>
          </div>
          
          <div className="pt-6 border-t border-border flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              You are signed in securely via GitHub.
            </div>
            <form action="/auth/signout" method="post">
              <button 
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
