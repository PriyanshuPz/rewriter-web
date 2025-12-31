import Brand from "@/components/core/brand";
import UserProfile from "@/components/core/user-profile";
import VaultGrid from "@/components/core/vault-grid";
import { Separator } from "@/components/ui/separator";

export default function ConsolePage() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto p-2 flex-col">
      <div className="flex justify-between items-center">
        <Brand />
        <div className="flex items-center">
          <UserProfile />
        </div>
      </div>
      <Separator className="my-2" />
      <VaultGrid />
    </div>
  );
}
