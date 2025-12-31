"use client";
import { usePathname } from "next/navigation";
import Brand from "../core/brand";
import ILink from "./ilink";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="block min-h-16 text-center tracking-tight">
      <ul className="p-0 list-none flex justify-between items-center">
        <li>
          <Brand redirectable />
        </li>
        <div className="flex items-center justify-center space-x-2">
          <li>
            <ILink href="/console" pathname={pathname}>
              Console
            </ILink>
          </li>
          <li>
            <ILink
              href="https://github.com/PriyanshuPz/rewriter-web"
              pathname={pathname}
            >
              Source
            </ILink>
          </li>
        </div>
      </ul>
    </header>
  );
}
