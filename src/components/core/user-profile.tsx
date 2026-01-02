"use client";
import {
  FileQuestionMarkIcon,
  LogOutIcon,
  Settings2Icon,
  VerifiedIcon,
} from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";

export default function UserProfile() {
  const session = authClient.useSession();
  const router = useRouter();

  async function signOut() {
    try {
      await authClient.signOut();
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      router.push("/auth");
    }
  }

  if (session.isPending) {
    return (
      <div className="flex items-center space-x-1 border p-1">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="w-20 h-6 rounded-xl" />
      </div>
    );
  }

  if (!session.data) {
    return (
      <div className="flex items-center space-x-1 border p-1 text-destructive/70">
        <FileQuestionMarkIcon size={22} />
        <span className="text-sm">Failed to get your data.</span>
      </div>
    );
  }

  const { user } = session.data;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="p-1">
          <Avatar className="rounded-full w-6 h-6">
            <AvatarImage src={user.image ?? ""} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="text-secondary-foreground/90 max-[440px]:hidden flex items-center space-x-1">
            @{user.username}{" "}
            {user.emailVerified && (
              <VerifiedIcon
                size={28}
                className="text-primary-foreground fill-blue-500 ml-1"
              />
            )}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>My Information</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex items-start flex-col text-sm px-1 text-muted-foreground">
          <span>{user.name}</span>
          <span>{user.email} </span>
          <span>Joined {moment(user.createdAt).fromNow()}</span>
        </div>
        <DropdownMenuSeparator />
        <Link href="/settings">
          <DropdownMenuItem>
            <Settings2Icon /> Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={signOut}
          className="text-destructive focus:text-destructive/70"
        >
          <LogOutIcon className="text-destructive focus:text-destructive/70" />{" "}
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
