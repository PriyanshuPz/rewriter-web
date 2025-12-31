"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit3, Eye } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import * as z from "zod";
import Brand from "@/components/core/brand";
import UserProfile from "@/components/core/user-profile";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  summary: z.string().max(500, "Summary is too long").optional(),
  content: z.string().min(1, "Content is required"),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PageEditorClient({ vaultId }: { vaultId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [previewMode, setPreviewMode] = useState(false);

  const { data: vault } = useQuery({
    queryKey: ["vault", vaultId],
    queryFn: async () => {
      const response = await fetch(`/api/vaults/${vaultId}`);
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.message || "Failed to fetch vault");
      }
      return body.data;
    },
  });

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
      router.push(`/console/vault/${vaultId}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create page");
    },
  });

  const onSubmit = (data: FormValues) => {
    createPage.mutate(data);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <Brand />
          <UserProfile />
        </div>
        <Separator className="mb-4" />

        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/console/vault/${vaultId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {vault?.title || "Vault"}
          </Button>

          <div className="flex gap-2">
            <Button
              variant={previewMode ? "ghost" : "secondary"}
              size="sm"
              onClick={() => setPreviewMode(false)}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant={previewMode ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setPreviewMode(true)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {!previewMode && (
              <>
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
                          className="text-2xl font-bold"
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
              </>
            )}

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {previewMode ? "Preview" : "Content (Markdown)"}
                  </FormLabel>
                  <FormControl>
                    {previewMode ? (
                      <div className="min-h-125 p-6 border rounded-lg">
                        <h1 className="text-3xl font-bold mb-4">
                          {form.watch("title") || "Untitled Page"}
                        </h1>
                        {form.watch("summary") && (
                          <p className="text-muted-foreground mb-6">
                            {form.watch("summary")}
                          </p>
                        )}
                        <div className="prose prose-lg max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw, rehypeSanitize]}
                          >
                            {field.value || "No content yet..."}
                          </ReactMarkdown>
                        </div>
                        {form.watch("tags") && (
                          <div className="flex gap-2 mt-6 flex-wrap">
                            {form
                              .watch("tags")
                              ?.split(",")
                              .map((tag) => tag.trim())
                              .filter(Boolean)
                              .map((tag) => (
                                <span
                                  key={tag}
                                  className="px-3 py-1 bg-secondary rounded-full text-sm"
                                >
                                  {tag}
                                </span>
                              ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div data-color-mode="light">
                        <MDEditor
                          value={field.value}
                          onChange={(val) => field.onChange(val || "")}
                          height={500}
                          preview="edit"
                        />
                      </div>
                    )}
                  </FormControl>
                  {!previewMode && (
                    <FormDescription>
                      Write your page content using Markdown syntax. Use the
                      toolbar for formatting help.
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/console/vault/${vaultId}`)}
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
      </div>
    </div>
  );
}
