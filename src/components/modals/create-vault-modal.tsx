"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
  type AccentColorName,
  AccentColors,
  type IconName,
  Icons,
} from "@/lib/ui-extras";
import { useCreateVaultModal } from "@/stores/modal-store";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  icon: z.string().optional(),
  accentColor: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateVaultModal() {
  const modalState = useCreateVaultModal();
  const queryClient = useQueryClient();
  const [selectedIcon, setSelectedIcon] = useState<IconName | null>(null);
  const [selectedAccent, setSelectedAccent] = useState<AccentColorName | null>(
    null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      icon: "",
      accentColor: "",
    },
  });

  const createVault = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await fetch("/api/vaults", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.message || "Failed to create vault");
      }

      return body.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vaults"] });
      toast.success("Vault created successfully!");
      form.reset();
      setSelectedIcon(null);
      setSelectedAccent(null);
      modalState.onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create vault");
    },
  });

  const onSubmit = (data: FormValues) => {
    createVault.mutate(data);
  };

  const handleClose = () => {
    if (!createVault.isPending) {
      form.reset();
      setSelectedIcon(null);
      setSelectedAccent(null);
      modalState.onClose();
    }
  };

  return (
    <Dialog open={modalState.isOpen} modal onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle>Create New Vault</DialogTitle>
          <DialogDescription>
            Create a new vault to organize your pages
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
                      placeholder="My Vault"
                      {...field}
                      disabled={createVault.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of this vault..."
                      {...field}
                      disabled={createVault.isPending}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon (Optional)</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-6 gap-2">
                      {Object.entries(Icons).map(([name, Icon]) => {
                        const isSelected = selectedIcon === name;
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => {
                              setSelectedIcon(name as IconName);
                              field.onChange(name);
                            }}
                            disabled={createVault.isPending}
                            className={`p-3 rounded-lg border-2 transition-all hover:border-primary ${
                              isSelected
                                ? "border-primary bg-primary/10"
                                : "border-border"
                            }`}
                          >
                            <Icon className="w-5 h-5 mx-auto" />
                          </button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Choose an icon to represent your vault
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accentColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accent Color (Optional)</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-6 gap-2">
                      {Object.entries(AccentColors).map(([name, color]) => {
                        const isSelected = selectedAccent === name;
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => {
                              setSelectedAccent(name as AccentColorName);
                              field.onChange(name);
                            }}
                            disabled={createVault.isPending}
                            className={`p-3 rounded-lg border-2 transition-all hover:border-primary ${
                              isSelected
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-border"
                            }`}
                          >
                            <div
                              className="w-full h-6 rounded"
                              style={{ backgroundColor: color }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Pick a color theme for your vault
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
                disabled={createVault.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createVault.isPending}>
                {createVault.isPending ? (
                  <>
                    <Spinner className="mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Vault"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
