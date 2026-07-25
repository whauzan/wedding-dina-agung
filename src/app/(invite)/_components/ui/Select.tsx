import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { fieldSurface } from "./Field";

/** Native <select> styled to match the mockup: cream surface, hidden native
 *  chevron, custom chevron drawn on the right. Native keeps mobile pickers +
 *  a11y for free. `data-placeholder` dims the text while nothing is chosen. */
export function Select({
  className,
  placeholder,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { placeholder?: string }) {
  const isPlaceholder = props.value === "" || props.value === undefined;

  return (
    <div className="relative w-full">
      <select
        {...props}
        className={cn(
          fieldSurface,
          "cursor-pointer appearance-none pr-11",
          isPlaceholder && "text-ink/40",
          className,
        )}
      >
        {placeholder !== undefined && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {props.children}
      </select>
      {/* Custom chevron */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-ink"
      >
        <path
          d="m6 9 6 6 6-6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
