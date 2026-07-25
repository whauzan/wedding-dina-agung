"use client";

import { m, useReducedMotion } from "motion/react";
import Image from "next/image";
import { RsvpForm } from "./RsvpForm";
import { WishesWall } from "./WishesWall";

function TornEdge({ flip }: { flip?: boolean }) {
  return (
    <Image
      src="/torn.svg"
      alt=""
      width={429}
      height={173}
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 z-20 h-auto w-full select-none ${
        flip
          ? "bottom-20 translate-y-1/2 -scale-y-100"
          : "top-20 -translate-y-1/2"
      }`}
    />
  );
}

export function RsvpWishesSection({
  guestName,
  guestSlug,
}: {
  guestName: string;
  guestSlug: string | null;
}) {
  const reduced = useReducedMotion();

  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center py-12">
      <TornEdge />
      <TornEdge flip />

      <div className="bg-ash text-text-primary relative z-20 flex size-full flex-col items-center gap-4 py-2">
        <m.div
          initial={{ opacity: 0, y: reduced ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Image
            src="/ornament-rsvp.webp"
            alt=""
            width={430}
            height={69}
            aria-hidden
            className="mx-auto w-full select-none"
          />
        </m.div>

        <div className="flex flex-col items-center size-full px-8 gap-4">
          <RsvpForm guestName={guestName} guestSlug={guestSlug} />
          <WishesWall guestName={guestName} guestSlug={guestSlug} />
        </div>
      </div>
    </section>
  );
}
