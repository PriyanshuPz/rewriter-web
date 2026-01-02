"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import type { User } from "@/hooks/settings";

interface UserProfileSectionProps {
  user: User;
  onUpdate: (data: { name: string; bio: string }) => Promise<void>;
  isUpdating?: boolean;
}

interface ProfileFormData {
  name: string;
  bio: string;
}

export function UserProfileSection({
  user,
  onUpdate,
  isUpdating = false,
}: UserProfileSectionProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user.name,
      bio: user.bio,
    },
  });

  // Update form when user data changes
  useEffect(() => {
    reset({
      name: user.name,
      bio: user.bio,
    });
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    await onUpdate(data);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-1">Profile Information</h2>
          <p className="text-sm text-muted-foreground">
            Update your account profile information
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="mt-1.5"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed
            </p>
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              className="mt-1.5"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              className="mt-1.5"
              rows={4}
              placeholder="Tell us about yourself..."
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-xs text-destructive mt-1">
                {errors.bio.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isUpdating || !isDirty}>
            {isUpdating ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
          {isDirty && (
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isUpdating}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
