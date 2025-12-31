import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Vault = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  accentColor: string | null;
  updatedAt: Date;
  pageCount: number;
};

export const useVaults = () =>
  useQuery({
    queryKey: ["vaults"],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/vaults`);
        const body = await response.json();
        if (response.status === 200) {
          return body.data as Vault[];
        } else {
          throw new Error(body.message);
        }
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  });

export const useVault = (vaultId: string) =>
  useQuery({
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

type CreateVaultData = {
  title: string;
  description?: string;
  icon?: string;
  accentColor?: string;
};

export const useCreateVault = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateVaultData) => {
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
    },
  });
};
