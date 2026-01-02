"use client";

import { Copy, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import type { ApiKey } from "@/hooks/settings";

interface ApiKeysSectionProps {
  apiKeys: ApiKey[];
  onGenerate: (name: string) => Promise<ApiKey>;
  onDelete: (id: string) => Promise<void>;
  isGenerating?: boolean;
  isDeleting?: boolean;
}

interface ApiKeyFormData {
  name: string;
}

export function ApiKeysSection({
  apiKeys,
  onGenerate,
  onDelete,
  isGenerating = false,
  isDeleting = false,
}: ApiKeysSectionProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null);
  const [newGeneratedKey, setNewGeneratedKey] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApiKeyFormData>();

  const onSubmit = async (data: ApiKeyFormData) => {
    try {
      const newKey = await onGenerate(data.name);
      setNewGeneratedKey(newKey.key);
      reset();
      setIsCreating(false);
    } catch (_error) {
      // Error handled by the hook
    }
  };

  const handleDelete = async () => {
    if (!deleteKeyId) return;
    try {
      await onDelete(deleteKeyId);
    } catch (_error) {
      // Error handled by the hook
    } finally {
      setDeleteKeyId(null);
    }
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold mb-1">API Keys</h2>
            <p className="text-sm text-muted-foreground">
              Manage your API keys for programmatic access
            </p>
          </div>
          <Button onClick={() => setIsCreating(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Generate Key
          </Button>
        </div>

        {/* New Key Generation Form */}
        {isCreating && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-4 border rounded-lg bg-muted/50 space-y-4"
          >
            <div>
              <Label htmlFor="keyName">API Key Name</Label>
              <Input
                id="keyName"
                placeholder="e.g., Production API Key"
                className="mt-1.5"
                {...register("name", {
                  required: "API key name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  reset();
                }}
                disabled={isGenerating}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* New Generated Key Alert */}
        {newGeneratedKey && (
          <div className="p-4 border border-yellow-500 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 space-y-2">
            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
              ⚠️ Save this API key - you won't be able to see it again!
            </p>
            <div className="flex gap-2">
              <Input
                value={newGeneratedKey}
                readOnly
                className="font-mono text-sm bg-white dark:bg-background"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(newGeneratedKey)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setNewGeneratedKey(null)}
            >
              I've saved the key
            </Button>
          </div>
        )}

        {/* API Keys List */}
        <div className="space-y-3">
          {apiKeys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No API keys yet</p>
              <p className="text-sm mt-1">
                Generate your first API key to get started
              </p>
            </div>
          ) : (
            apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{apiKey.name}</h3>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <code className="font-mono text-xs">{apiKey.key}</code>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span>Created: {formatDate(apiKey.createdAt)}</span>
                    <span>Last used: {formatDate(apiKey.lastUsed)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(apiKey.key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteKeyId(apiKey.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteKeyId}
        onOpenChange={() => setDeleteKeyId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API Key?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Any applications using this API key
              will lose access immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
