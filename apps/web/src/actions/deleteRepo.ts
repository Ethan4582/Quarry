"use server";

import { createClient } from "@quarry/db/server";
import { deleteVectorsByRepoId } from "@quarry/ingestion";
import { revalidatePath } from "next/cache";

const PINECONE_TEST_KEY = process.env.PINECONE_TEST_KEY!;

export async function deleteRepo(repoId: string) {
  const supabase = await createClient();
  
  // Verify ownership
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");

  const { data: repo, error: repoError } = await supabase
    .from("repos")
    .select("id, pinecone_index")
    .eq("id", repoId)
    .eq("user_id", user.id)
    .single();

  if (repoError || !repo) {
    throw new Error("Repository not found or unauthorized");
  }

  // First try deleting from Pinecone if it has vectors
  // If the index isn't ready or it fails, we still want to proceed with DB deletion so it's not stuck.
  try {
    if (repo.pinecone_index && PINECONE_TEST_KEY) {
      console.log(`[delete] Removing Pinecone vectors for repo ${repoId}`);
      await deleteVectorsByRepoId(PINECONE_TEST_KEY, repo.pinecone_index, repoId);
    }
  } catch (error) {
    console.error(`[delete] Failed to remove Pinecone vectors for repo ${repoId}:`, error);
    // Proceed with DB deletion regardless to avoid getting stuck
  }

  console.log(`[delete] Removing repo ${repoId} from database`);
  const { error: deleteError } = await supabase
    .from("repos")
    .delete()
    .eq("id", repoId)
    .eq("user_id", user.id);

  if (deleteError) {
    throw new Error(`Failed to delete repository from database: ${deleteError.message}`);
  }

  revalidatePath("/dashboard");
  return { success: true };
}
