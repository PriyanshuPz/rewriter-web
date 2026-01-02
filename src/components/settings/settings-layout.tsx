"use client";

import Brand from "@/components/core/brand";
import UserProfile from "@/components/core/user-profile";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

interface SettingsLayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function SettingsLayout({
  children,
  isLoading,
  error,
  onRetry,
}: SettingsLayoutProps) {
  return (
    <div className="min-h-screen max-w-3xl mx-auto p-2 flex-col">
      <div className="flex justify-between items-center">
        <Brand />
        <div className="flex items-center">
          <UserProfile />
        </div>
      </div>
      <Separator className="my-2" />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
          <Spinner className="h-8 w-8" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">Something went wrong</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
          {onRetry && (
            /** biome-ignore lint/a11y/useButtonType: <> */
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8 py-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/console">Console</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {children}
        </div>
      )}
    </div>
  );
}
