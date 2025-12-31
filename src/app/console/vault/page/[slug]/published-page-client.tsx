"use client";

import { useQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import Brand from "@/components/core/brand";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getAccentColor, getIcon } from "@/lib/ui-extras";

type Page = {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  tags: string[];
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  vault: {
    title: string;
    icon: string | null;
    accentColor: string | null;
  };
  user: {
    name: string;
    username: string;
    image: string | null;
  };
};

export default function PublishedPageClient({ slug }: { slug: string }) {
  const router = useRouter();

  const {
    data: page,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["published-page", slug],
    queryFn: async () => {
      const response = await fetch(`/api/pages/slug/${slug}`);
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.message || "Failed to fetch page");
      }
      return body.data as Page;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <Brand />
          </div>
          <Separator className="mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <Brand />
          </div>
          <Separator className="mb-8" />
          <Card className="mt-8">
            <CardContent className="pt-6">
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>Page not found</EmptyTitle>
                  <EmptyDescription>
                    The page you're looking for doesn't exist or is not
                    published.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button onClick={() => router.push("/console")}>
                    Go to Console
                  </Button>
                </EmptyContent>
              </Empty>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const Icon = getIcon(page.vault.icon);
  const accentColor = getAccentColor(page.vault.accentColor);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <Brand redirectable />
        </div>
        <Separator className="mb-8" />

        <article className="prose prose-lg dark:prose-invert max-w-none">
          <div className="flex items-center gap-2 mb-6 not-prose">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `rgba(${accentColor}, 0.1)` }}
            >
              <Icon
                className="w-5 h-5"
                style={{ color: `rgb(${accentColor})` }}
              />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {page.vault.title}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-4">{page.title}</h1>

          {/* Meta Info */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6 not-prose">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={page.user.image || undefined} />
                <AvatarFallback>
                  {page.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{page.user.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(page.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Summary */}
          {page.summary && (
            <p className="text-lg text-muted-foreground mb-8">{page.summary}</p>
          )}

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
            >
              {page.content}
            </ReactMarkdown>
          </div>

          {/* Tags */}
          {page.tags.length > 0 && (
            <div className="flex gap-2 mt-8 flex-wrap not-prose">
              {page.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-secondary rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t">
          <p className="text-sm text-muted-foreground text-center">
            Last updated {new Date(page.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
