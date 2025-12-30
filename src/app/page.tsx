"use client";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Brand from "@/components/core/brand";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="max-w-md mx-auto p-4 min-h-screen flex flex-col">
      <header className="block min-h-16 text-center tracking-tight">
        <ul className="p-0 list-none flex justify-between items-center">
          <li>
            <Brand redirectable />
          </li>
          <div className="flex items-center justify-center space-x-2">
            <li>
              <ILink url="/auth" label="Login" />
            </li>
            <li>
              <ILink
                url="https://github.com/PriyanshuPz/rewriter-web"
                label="Source Code"
              />
            </li>
          </div>
        </ul>
      </header>

      <main className="flex-1">
        <section className="space-y-2 mb-6">
          <p className="text-accent-foreground/90">
            This platform is for <b>Writers</b> to host there blogs or save
            journals without any setup just create a vault and start writing
            rest we will do.
          </p>
          <p>
            Integrate{" "}
            <b>
              <i>Rewriter</i>
            </b>{" "}
            with <span className="text-purple-600 underline">Obsidian</span>{" "}
            throught plugin and you are good to go. No heavy setup. Only manage
            online presence or backups here.
          </p>
        </section>
        <Separator />
        <section className="flex items-center flex-col space-y-3 mt-2">
          Stay tune! launching soon.
        </section>
      </main>

      <footer className="text-sm">
        &copy; 2026 Rewriter, a P8labs Product.
      </footer>
    </div>
  );
}

function ILink({ url, label }: { url: string; label: string }) {
  const pathname = usePathname();
  const isEx = url.startsWith("http");
  return (
    <Link
      rel={isEx ? "noopener" : undefined}
      target={isEx ? "_blank" : undefined}
      href={url}
      className={cn(
        "transition-all flex items-start justify-between text-muted-foreground hover:text-primary/50",
        pathname === url && "text-primary hover:text-primary/95",
        isEx && "hover:underline"
      )}
    >
      {label}
      {isEx && <ExternalLinkIcon className="ml-1" size={14} />}
    </Link>
  );
}
