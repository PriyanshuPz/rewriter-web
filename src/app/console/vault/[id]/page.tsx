"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Brand from "@/components/core/brand";
import UserProfile from "@/components/core/user-profile";
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
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getAccentColor, getIcon } from "@/lib/ui-extras";
import PageList from "./page-list";

type Vault = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  accentColor: string | null;
  createdAt: Date;
  updatedAt: Date;
  pageCount: number;
};

export default function VaultDetailClient() {
  const { id } = useParams();
  const vaultId = id?.toString() ?? "";
  const router = useRouter();

  const {
    data: vault,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["vault", vaultId],
    queryFn: async () => {
      const response = await fetch(`/api/vaults/${vaultId}`);
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.message || "Failed to fetch vault");
      }
      return body.data as Vault;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen max-w-3xl mx-auto p-2 flex-col">
        <div className="flex justify-between items-center">
          <Brand />
          <UserProfile />
        </div>
        <Separator className="my-2" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !vault) {
    return (
      <div className="min-h-screen max-w-3xl mx-auto p-2 flex-col">
        <div className="flex justify-between items-center">
          <Brand />
          <UserProfile />
        </div>
        <Separator className="my-2" />
        <Card className="mt-4">
          <CardContent className="pt-6">
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Vault not found</EmptyTitle>
                <EmptyDescription>
                  The vault you're looking for doesn't exist or you don't have
                  access to it.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={() => router.push("/console")}>
                  Back to Console
                </Button>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      </div>
    );
  }

  const Icon = getIcon(vault.icon);
  const accentColor = getAccentColor(vault.accentColor);

  return (
    <div className="min-h-screen max-w-3xl mx-auto p-2 flex-col">
      <div className="flex justify-between items-center">
        <Brand />
        <UserProfile />
      </div>
      <Separator className="my-2" />

      <div className="mt-4 space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/console")}
          className="mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Vaults
        </Button>

        <Card
          className="relative overflow-hidden"
          style={{
            borderColor: `rgb(${accentColor})`,
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: `rgb(${accentColor})` }}
          />
          <CardHeader>
            <div className="flex items-start gap-4">
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `rgba(${accentColor}, 0.1)` }}
              >
                <Icon
                  className="w-8 h-8"
                  style={{ color: `rgb(${accentColor})` }}
                />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">{vault.title}</CardTitle>
                {vault.description && (
                  <CardDescription className="mt-2">
                    {vault.description}
                  </CardDescription>
                )}
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span>{vault.pageCount} pages</span>
                  <span>•</span>
                  <span>
                    Updated {new Date(vault.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Pages</h2>
          <Button
            onClick={() => router.push(`/console/vault/${vaultId}/page/new`)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Page
          </Button>
        </div>

        <PageList vaultId={vaultId} />
      </div>
    </div>
  );
}
