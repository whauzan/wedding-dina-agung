import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Labelled form field wrapper — small ink-on-cream label above the control,
 *  matching the RSVP / Best Wishes mockup. */
export function Field({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col gap-1", className)}>
      <label htmlFor={htmlFor} className="text-xs text-text-primary">
        {label}
      </label>
      {children}
    </div>
  );
}

/** Shared white field surface used by inputs / selects / textareas. */
export const fieldSurface =
  "w-full rounded-sm bg-white px-4 py-1 text-base text-ink placeholder:text-text-primary/50 outline-none ring-0 focus-visible:ring-2 focus-visible:ring-text-primary/30";
