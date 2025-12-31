import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { cn } from "@/lib/utils";

export default function ILink({
  href,
  children,
  pathname,
  className,
}: {
  href: string;
  className?: string;
  pathname?: string;
  children: React.ReactNode;
}) {
  const isEx = href.startsWith("http");
  return (
    <Link
      rel={isEx ? "noopener" : undefined}
      target={isEx ? "_blank" : undefined}
      href={href}
      className={cn(
        "transition-all flex items-start justify-between text-muted-foreground hover:text-primary/50",
        pathname === href && "text-primary hover:text-primary/95",
        "hover:underline",
        className
      )}
    >
      {children}
      {isEx && <ExternalLinkIcon className="ml-1" size={14} />}
    </Link>
  );
}
