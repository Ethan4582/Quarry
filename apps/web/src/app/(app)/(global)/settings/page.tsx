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

  return (
    <div className="p-8 max-w-2xl mx-auto w-full">
      <h1 className="text-2xl font-semibold text-foreground mb-8">Account Settings</h1>
      
      <div className="bg-panel border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-medium text-foreground mb-1">Profile</h2>
          <p className="text-sm text-muted">Manage your identity and authentication.</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">GitHub Username</label>
            <input 
              type="text" 
              disabled
              value={profile?.github_username || ""}
              className="w-full max-w-md bg-card border border-border text-foreground p-2.5 rounded text-sm opacity-70 cursor-not-allowed"
            />
          </div>
          
          <div className="pt-4 border-t border-border">
            <form action="/auth/signout" method="post">
              <button 
                type="submit"
                className="bg-dark-gray-16 hover:bg-card border border-border text-foreground px-4 py-2 rounded text-sm font-medium transition-colors"
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
