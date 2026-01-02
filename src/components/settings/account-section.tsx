"use client";

import { LogOut, Mail, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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

interface AccountSectionProps {
  onLogout: () => Promise<void>;
  isLoggingOut?: boolean;
}

export function AccountSection({
  onLogout,
  isLoggingOut = false,
}: AccountSectionProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    try {
      await onLogout();
    } catch (_error) {
      // Error handled by the hook
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-1">Account</h2>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-4">
          {/* Logout Button */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Sign Out</h3>
                <p className="text-sm text-muted-foreground">
                  Sign out from your account on this device
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setShowLogoutDialog(true)}>
              Sign Out
            </Button>
          </div>

          {/* Privacy Policy Link */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Privacy Policy</h3>
                <p className="text-sm text-muted-foreground">
                  Review our privacy policy and data handling practices
                </p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/legal/privacy">View Policy</Link>
            </Button>
          </div>

          {/* Support Email */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Email Support</h3>
                <p className="text-sm text-muted-foreground">
                  Contact us for help and support
                </p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <a href="mailto:rewriter@p8labs.qzz.io">Contact Support</a>
            </Button>
          </div>
        </div>

        {/* Account Info Footer */}
        <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
          <p>
            Need help? Email us at{" "}
            <a
              href="mailto:rewriter@p8labs.qzz.io"
              className="underline hover:text-foreground"
            >
              rewriter@p8labs.qzz.io
            </a>
          </p>
          <p>
            Read our{" "}
            <Link
              href="/legal/privacy"
              className="underline hover:text-foreground"
            >
              Privacy Policy
            </Link>{" "}
            to learn how we protect your data.
          </p>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You'll need to sign in again to
              access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Signing out...
                </>
              ) : (
                "Sign Out"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
