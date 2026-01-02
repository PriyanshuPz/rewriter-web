import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  createdAt: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
}

export interface Session {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  current: boolean;
}

// Fetch user data
export const useUser = () =>
  useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/user");
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json() as Promise<User>;
    },
  });

// Update user profile
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; bio: string }) => {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update user");
      return res.json() as Promise<User>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      toast.error("Failed to update profile");
    },
  });
};

// Fetch API keys
export const useApiKeys = () =>
  useQuery({
    queryKey: ["apikeys"],
    queryFn: async () => {
      const res = await fetch("/api/apikeys");
      if (!res.ok) throw new Error("Failed to fetch API keys");
      return res.json() as Promise<ApiKey[]>;
    },
  });

// Generate new API key
export const useGenerateApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("/api/apikeys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to generate API key");
      return res.json() as Promise<ApiKey>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apikeys"] });
      toast.success("API key generated successfully");
    },
    onError: (error) => {
      console.error("Error generating API key:", error);
      toast.error("Failed to generate API key");
    },
  });
};

// Delete API key
export const useDeleteApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/apikeys/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete API key");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apikeys"] });
      toast.success("API key deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting API key:", error);
      toast.error("Failed to delete API key");
    },
  });
};

// Fetch sessions
export const useSessions = () =>
  useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const res = await fetch("/api/sessions");
      if (!res.ok) throw new Error("Failed to fetch sessions");
      return res.json() as Promise<Session[]>;
    },
  });

// Revoke session
export const useRevokeSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/sessions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to revoke session");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Session revoked successfully");
    },
    onError: (error) => {
      console.error("Error revoking session:", error);
      toast.error("Failed to revoke session");
    },
  });
};

// Logout
export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to logout");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      console.error("Error logging out:", error);
      toast.error("Failed to logout");
    },
  });
};
