"use client";
import { PlusIcon } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useVaults } from "@/hooks/vault";
import { getAccentColor, getIcon } from "@/lib/ui-extras";
import { cn } from "@/lib/utils";
import { useCreateVaultModal } from "@/stores/modal-store";
import { Skeleton } from "../ui/skeleton";

function VaultCardSkeleton() {
  return (
    <div className="p-3 border rounded-md space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />

      <div className="flex justify-between pt-2">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

const SKELETON_COUNT = 5;

export default function VaultGrid() {
  const { data: vaults, isLoading, error } = useVaults();

  return (
    <div className="grid grid-cols-1 min-[440px]:grid-cols-2 md:grid-cols-3 gap-1">
      <CreateVaultPlaceHolder />
      {isLoading &&
        Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <VaultCardSkeleton key={i.toString()} />
        ))}

      {!isLoading && error && (
        <div className="col-span-full text-sm text-muted-foreground p-4">
          Failed to load vaults.
        </div>
      )}
      {!isLoading &&
        !error &&
        vaults?.map((vault) => <VaultCard key={vault.id} vault={vault} />)}
    </div>
  );
}

export function CreateVaultPlaceHolder() {
  const createVaultModal = useCreateVaultModal();
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: <>
    // biome-ignore lint/a11y/useKeyWithClickEvents: <>
    <div
      onClick={createVaultModal.onOpen}
      className="cursor-pointer hover:bg-accent-foreground/5 transition-colors p-0.5 min-h-30 max-h-full hover:text-muted-foreground/90 text-muted-foreground"
    >
      <div className="rounded-xs w-full h-full border-2 border-dashed flex items-center justify-center flex-col">
        <PlusIcon size={40} />
        Create New Vault
      </div>
    </div>
  );
}

export function VaultCard({ vault }: { vault: any }) {
  const IC = getIcon(vault.icon);

  return (
    <Link href={`/console/vault/${vault.id}`}>
      <div
        style={{
          ["--ac" as any]: getAccentColor(vault.accentColor),
        }}
        className={cn(
          "p-3 min-h-30 max-h-full rounded-md border-2",
          "transition-colors flex flex-col justify-between",
          "bg-[rgba(var(--ac),0.12)] hover:bg-[rgba(var(--ac),0.18)]",
          "border-[rgba(var(--ac),0.6)]",
          "text-foreground cursor-pointer"
        )}
      >
        <div className="space-y-2">
          <div className="flex items-start gap-2 w-full">
            <span
              aria-hidden
              className={cn(
                "inline-flex items-center justify-center",
                "w-5 h-5 rounded-full shrink-0",
                "bg-[rgba(var(--ac),1)] border border-[rgba(var(--ac),1)]",
                "text-white"
              )}
            >
              <IC className="w-3 h-3" />
            </span>

            <span className="font-medium text-sm leading-tight wrap-break-word">
              {vault.title.substring(0, 35)}
              {vault.title.length > 35 && "..."}
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-snug">
            {vault.description.substring(0, 100)}
            {vault.description.length > 100 && "..."}
          </p>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground mt-3">
          <span>{vault.pagesCount} pages</span>
          <span>last {moment(vault.updatedAt).fromNow()}</span>
        </div>
      </div>
    </Link>
  );
}
