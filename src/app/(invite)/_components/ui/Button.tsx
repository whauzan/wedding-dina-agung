import Image from "next/image";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Button({
  icon,
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: { src: string; alt: string };
  children: ReactNode;
}) {
  return (
    <button
      {...props}
      className={cn(
        "flex w-32 items-center justify-center gap-2 rounded-sm px-4 py-1 text-sm bg-[#333C4B] text-white",
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
    </button>
  );
}
