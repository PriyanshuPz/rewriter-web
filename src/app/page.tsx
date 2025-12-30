"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Home() {
  return (
    <div>
      <Header />
    </div>
  );
}

const navItems: { label: string; page?: string; link?: string }[] = [
  { label: "Home", page: "/" },
  { label: "How it works", page: "/blog" },
  { label: "Login", page: "/contact" },
  { label: "Source Code", link: "https://github.com/PriyanshuPz/rewriter-web" },
];

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="block min-h-16 p-[2em] pr-0 text-center tracking-tight">
      <ul className="p-0 list-none">
        {navItems.map(({ label, page, link }) => (
          <li className="inline-block pr-2.5" key={label}>
            {page ? (
              <Link
                href={page}
                className={pathname === page ? "active" : undefined}
              >
                {label}
              </Link>
            ) : (
              <Link rel="noopener" target={"_blank"} href={link ?? ""}>
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </header>
  );
};
