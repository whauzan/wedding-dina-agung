import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function ButtonLink({
  href,
  icon,
  children,
  className,
}: {
  href: string;
  icon?: { src: string; alt: string };
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "flex items-center justify-center gap-2 rounded-sm px-4 py-1 text-sm bg-[#333C4B] text-white",
        className,
      )}
    >
      {icon && (
        <Image
          src={icon.src}
          alt={icon.alt}
          width={16}
          height={16}
          className="object-cover select-none"
        />
      )}
      {children}
    </a>
  );
}
