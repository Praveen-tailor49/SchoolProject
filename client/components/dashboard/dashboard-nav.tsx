"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/teachers", label: "Teachers" },
  { href: "/dashboard/students", label: "Students" },
  { href: "/dashboard/classes", label: "Classes" },
  { href: "/dashboard/fees", label: "Fees" },
] as const;

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1 border-b border-ink/10 pb-3">
      {links.map(({ href, label }) => {
        const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-forest/10 text-forest"
                : "text-ink-muted hover:bg-mist/80 hover:text-ink"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
