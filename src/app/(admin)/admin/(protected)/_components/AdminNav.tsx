"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/admin", label: "Tamu" },
  { href: "/admin/rsvp", label: "RSVP" },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {LINKS.map((link) => {
        // /admin is active only on an exact match so it doesn't also light up
        // for /admin/rsvp; nested routes still highlight their section.
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-(--admin-accent-soft) text-(--admin-accent)"
                : "text-(--admin-muted) hover:text-(--admin-ink)",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
