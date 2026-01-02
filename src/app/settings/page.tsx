"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AccountSection } from "@/components/settings/account-section";
import { ApiKeysSection } from "@/components/settings/api-keys-section";
import { SessionsSection } from "@/components/settings/sessions-section";
import { SettingsLayout } from "@/components/settings/settings-layout";
import { UserProfileSection } from "@/components/settings/user-profile-section";
import {
  useApiKeys,
  useDeleteApiKey,
  useGenerateApiKey,
  useLogout,
  useRevokeSession,
  useSessions,
  useUpdateUser,
  useUser,
} from "@/hooks/settings";

export default function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Queries
  const { data: user, isLoading: isLoadingUser, error: userError } = useUser();
  const {
    data: apiKeys = [],
    isLoading: isLoadingApiKeys,
    error: apiKeysError,
  } = useApiKeys();
  const {
    data: sessions = [],
    isLoading: isLoadingSessions,
    error: sessionsError,
  } = useSessions();

  // Mutations
  const updateUser = useUpdateUser();
  const generateApiKey = useGenerateApiKey();
  const deleteApiKey = useDeleteApiKey();
  const revokeSession = useRevokeSession();
  const logout = useLogout();

  const isLoading = isLoadingUser || isLoadingApiKeys || isLoadingSessions;
  const error =
    userError?.message ||
    apiKeysError?.message ||
    sessionsError?.message ||
    null;

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
    queryClient.invalidateQueries({ queryKey: ["apikeys"] });
    queryClient.invalidateQueries({ queryKey: ["sessions"] });
  };

  const handleLogout = async () => {
    await logout.mutateAsync();
    router.push("/");
  };

  return (
    <SettingsLayout isLoading={isLoading} error={error} onRetry={handleRetry}>
      {user && (
        <>
          <UserProfileSection
            user={user}
            onUpdate={async (data) => {
              await updateUser.mutateAsync(data);
            }}
            isUpdating={updateUser.isPending}
          />

          <ApiKeysSection
            apiKeys={apiKeys}
            onGenerate={(name) => generateApiKey.mutateAsync(name)}
            onDelete={(id) => deleteApiKey.mutateAsync(id)}
            isGenerating={generateApiKey.isPending}
            isDeleting={deleteApiKey.isPending}
          />

          <SessionsSection
            sessions={sessions}
            onRevoke={(id) => revokeSession.mutateAsync(id)}
            isRevoking={revokeSession.isPending}
          />

          <AccountSection
            onLogout={handleLogout}
            isLoggingOut={logout.isPending}
          />
        </>
      )}
    </SettingsLayout>
  );
}
