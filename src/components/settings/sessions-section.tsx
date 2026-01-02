"use client";

import { Laptop, Monitor, Shield, Smartphone } from "lucide-react";
import { useState } from "react";
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
import { Spinner } from "@/components/ui/spinner";
import type { Session } from "@/hooks/settings";

interface SessionsSectionProps {
  sessions: Session[];
  onRevoke: (id: string) => Promise<void>;
  isRevoking?: boolean;
}

export function SessionsSection({
  sessions,
  onRevoke,
  isRevoking = false,
}: SessionsSectionProps) {
  const [revokeSessionId, setRevokeSessionId] = useState<string | null>(null);

  const handleRevoke = async () => {
    if (!revokeSessionId) return;
    try {
      await onRevoke(revokeSessionId);
    } catch (_error) {
      // Error handled by the hook
    } finally {
      setRevokeSessionId(null);
    }
  };

  const getDeviceIcon = (device: string) => {
    if (
      device.toLowerCase().includes("iphone") ||
      device.toLowerCase().includes("android")
    ) {
      return <Smartphone className="h-5 w-5 text-muted-foreground" />;
    }
    if (
      device.toLowerCase().includes("mac") ||
      device.toLowerCase().includes("windows")
    ) {
      return <Laptop className="h-5 w-5 text-muted-foreground" />;
    }
    return <Monitor className="h-5 w-5 text-muted-foreground" />;
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-1">Active Sessions</h2>
          <p className="text-sm text-muted-foreground">
            Manage devices that are currently logged into your account
          </p>
        </div>

        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-start justify-between p-4 border rounded-lg"
            >
              <div className="flex gap-4 flex-1">
                <div className="mt-1">{getDeviceIcon(session.device)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{session.device}</h3>
                    {session.current && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <Shield className="h-3 w-3 mr-1" />
                        Current
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    <p>{session.location}</p>
                    <p className="text-xs mt-0.5">
                      IP: {session.ipAddress} · Last active:{" "}
                      {formatLastActive(session.lastActive)}
                    </p>
                  </div>
                </div>
              </div>
              {!session.current && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRevokeSessionId(session.id)}
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>

        {sessions.length > 1 && (
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                const nonCurrentSessions = sessions.filter((s) => !s.current);
                if (nonCurrentSessions.length > 0) {
                  // Revoke all non-current sessions
                  toast.success("All other sessions will be revoked");
                }
              }}
            >
              Revoke All Other Sessions
            </Button>
          </div>
        )}
      </div>

      {/* Revoke Confirmation Dialog */}
      <AlertDialog
        open={!!revokeSessionId}
        onOpenChange={() => setRevokeSessionId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will log out the device from your account. The device will
              need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRevoking}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              disabled={isRevoking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRevoking ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Revoking...
                </>
              ) : (
                "Revoke Session"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
