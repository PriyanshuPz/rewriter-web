"use client";
import { GithubIcon } from "lucide-react";
import { toast } from "sonner";
import Brand from "@/components/core/brand";
import ILink from "@/components/landing/ilink";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export default function AuthPage() {
  async function onGitHub() {
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/console",
      });
    } catch (error: any) {
      console.log(error);
      toast.error("Facing problem while getting you in", {
        description: error?.message,
      });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen max-w-md mx-auto">
      <Card>
        <CardHeader>
          <Brand />
        </CardHeader>
        <CardContent className="flex flex-col space-y-2">
          <h6 className="text-secondary-foreground/80">
            Continue with these social options <br /> to start using rewriter
          </h6>
          <p className="text-xs flex pb-4">
            By continuing, you agree to our{" "}
            <ILink className="text-xs pl-1" href="/legal/privacy">
              privacy policy
            </ILink>
            .
          </p>
          <Button
            onClick={onGitHub}
            size="lg"
            className="bg-black hover:bg-black/85"
          >
            <GithubIcon />
            Github
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
