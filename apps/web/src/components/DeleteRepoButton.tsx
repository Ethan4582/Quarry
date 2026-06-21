"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { deleteRepo } from "@/actions/deleteRepo";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogMedia,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteRepoButtonProps {
  repoId: string;
  repoName: string;
  variant?: "icon" | "full";
  onDeleted?: () => void;
}

export function DeleteRepoButton({ repoId, repoName, variant = "icon", onDeleted }: DeleteRepoButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteRepo(repoId);
      setShowConfirm(false);
      if (onDeleted) {
        onDeleted();
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete repository.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {variant === "icon" ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowConfirm(true);
          }}
          className="p-1.5 text-dark-gray hover:text-tomato-1 hover:bg-tomato-1/10 rounded-md transition-colors"
          title="Delete Repository"
        >
          <Trash2 size={16} />
        </button>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 bg-tomato-1/10 hover:bg-tomato-1/20 border border-tomato-1/20 text-tomato-1 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Trash2 size={16} />
          Delete Repository
        </button>
      )}

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <AlertTriangle />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete Repository?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you absolutely sure you want to delete <span className="text-foreground font-medium">{repoName}</span>? 
              This action cannot be undone. All embedded vectors in Pinecone and database contents associated with this repository will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="gap-2"
            >
              {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              {isDeleting ? "Deleting..." : "Yes, Delete Repo"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
