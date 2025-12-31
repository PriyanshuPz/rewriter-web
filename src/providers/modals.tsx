import { Toaster } from "sonner";
import CreateVaultModal from "@/components/modals/create-vault-modal";

export default function ModalsProvider() {
  return (
    <>
      <Toaster />
      <CreateVaultModal />
    </>
  );
}
