"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  summary: z.string().max(500, "Summary is too long").optional(),
  content: z.string().min(1, "Content is required"),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreatePageModalProps {
  vaultId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePageModal({
  vaultId,
  isOpen,
  onClose,
}: CreatePageModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      summary: "",
      content: "",
      tags: "",
    },
  });

  const createPage = useMutation({
    mutationFn: async (data: FormValues) => {
      const tags = data.tags
        ? data.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      const response = await fetch("/api/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vaultId,
          title: data.title,
          summary: data.summary || null,
          content: data.content,
          tags,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.message || "Failed to create page");
      }

      return body.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages", vaultId] });
      queryClient.invalidateQueries({ queryKey: ["vault", vaultId] });
      toast.success("Page created successfully!");
      form.reset();
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create page");
    },
  });

  const onSubmit = (data: FormValues) => {
    createPage.mutate(data);
  };

  const handleClose = () => {
    if (!createPage.isPending) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle>Create New Page</DialogTitle>
          <DialogDescription>
            Add a new page to your vault. Use Markdown for formatting the
            content.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="My Page Title"
                      {...field}
                      disabled={createPage.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief summary of this page..."
                      {...field}
                      disabled={createPage.isPending}
                      rows={2}
                    />
                  </FormControl>
                  <FormDescription>
                    A short description that will be shown in the page list
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="tag1, tag2, tag3"
                      {...field}
                      disabled={createPage.isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Comma-separated tags to organize your page
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content (Markdown)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="# Heading&#10;&#10;Your content here..."
                      {...field}
                      disabled={createPage.isPending}
                      rows={12}
                      className="font-mono"
                    />
                  </FormControl>
                  <FormDescription>
                    Write your page content using Markdown syntax
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createPage.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createPage.isPending}>
                {createPage.isPending ? (
                  <>
                    <Spinner className="mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Page"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
