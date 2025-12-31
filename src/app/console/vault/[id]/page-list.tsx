"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, ExternalLink, FileText, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";

type Page = {
  id: string;
  title: string;
  summary: string | null;
  thumbnail: string | null;
  tags: string[];
  slug: string;
  updatedAt: Date;
  createdAt: Date;
};

export default function PageList({ vaultId }: { vaultId: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [deletePageId, setDeletePageId] = useState<string | null>(null);

  const { data: pages, isLoading } = useQuery({
    queryKey: ["pages", vaultId],
    queryFn: async () => {
      const response = await fetch(`/api/pages?vaultId=${vaultId}`);
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.message || "Failed to fetch pages");
      }
      return body.data as Page[];
    },
  });

  const deletePage = useMutation({
    mutationFn: async (pageId: string) => {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: "DELETE",
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.message || "Failed to delete page");
      }

      return body;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages", vaultId] });
      queryClient.invalidateQueries({ queryKey: ["vault", vaultId] });
      toast.success("Page deleted successfully!");
      setDeletePageId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete page");
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map(() => (
          <Skeleton key={crypto.randomUUID()} className="h-40" />
        ))}
      </div>
    );
  }

  if (!pages || pages.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>No pages yet</EmptyTitle>
              <EmptyDescription>
                Create your first page to get started
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {pages.map((page) => (
          <Card key={page.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-1">
                    {page.title}
                  </CardTitle>
                  {page.summary && (
                    <CardDescription className="mt-2 line-clamp-2">
                      {page.summary}
                    </CardDescription>
                  )}
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      router.push(`/console/vault/page/${page.slug}`)
                    }
                    title="View published page"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      // TODO: Navigate to edit page
                      toast.info("Edit functionality coming soon!");
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeletePageId(page.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex gap-2 flex-wrap">
                  {page.tags.length > 0 && (
                    <>
                      {page.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-secondary rounded-md text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {page.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs">
                          +{page.tags.length - 3} more
                        </span>
                      )}
                    </>
                  )}
                </div>
                <span className="text-xs">
                  {new Date(page.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={!!deletePageId}
        onOpenChange={() => setDeletePageId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              page and all its content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletePageId) {
                  deletePage.mutate(deletePageId);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
