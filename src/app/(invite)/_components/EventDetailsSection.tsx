"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import type { GuestType } from "@/lib/guests";
import { wedding, type EventDetails } from "@/data/event";
import { cn } from "@/lib/cn";
import { ButtonLink } from "./ui/ButtonLink";

const fadeUp = (reduced: boolean) => ({
  initial: { opacity: 0, y: reduced ? 0 : 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
});

function EventBlock({
  event,
  delay,
  paired,
  showVenue = true,
}: {
  event: EventDetails;
  delay: number;
  paired: boolean;
  showVenue?: boolean;
}) {
  const reduced = useReducedMotion();
  const fade = fadeUp(!!reduced);

  return (
    <motion.div
      {...fade}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center gap-4 text-center"
    >
      <p className="text-[clamp(1.75rem,8vw,2rem)] italic font-bold">
        ~ {event.label} ~
      </p>
      <div
        className={cn("flex items-center gap-4", !paired && "flex-col gap-1")}
      >
        <p className="font-semibold">
          <span
            className={cn(
              "font-serif",
              paired ? "text-2xl" : "text-[clamp(1.875rem,9vw,2.25rem)]",
            )}
          >
            {event.day},
          </span>{" "}
          <span
            className={cn(
              "font-prata",
              paired ? "text-base" : "text-[clamp(1.75rem,8vw,2rem)]",
            )}
          >
            {event.date}
          </span>
        </p>
        <div className="flex items-center gap-4">
          {paired && <div className="h-5 border-[0.5px] border-text-primary" />}
          <p className={cn("font-prata", paired ? "text-base" : "text-lg")}>
            {event.time}
          </p>
        </div>
      </div>
      {showVenue && <VenueBlock event={event} />}
    </motion.div>
  );
}

/**
 * Venue name + address + maps button. Standalone so it can be rendered once,
 * shared beneath both event blocks for akad_resepsi guests (same venue, two
 * times), or inline inside a single EventBlock for resepsi-only guests.
 */
function VenueBlock({ event, delay }: { event: EventDetails; delay?: number }) {
  const reduced = useReducedMotion();
  const fade = fadeUp(!!reduced);

  const content = (
    <>
      <div className="flex flex-col">
        <p className="max-w-xs text-base font-medium">
          <span className="font-bold">{event.venueName}</span>
          <br />
          {event.address}
        </p>
      </div>
      <ButtonLink href={event.mapsUrl}>Lihat Peta</ButtonLink>
    </>
  );

  // When rendered standalone (shared footer) it animates on its own; inline
  // inside an EventBlock the parent already handles the reveal.
  if (delay === undefined) return content;

  return (
    <motion.div
      {...fade}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center gap-4 text-center"
    >
      {content}
    </motion.div>
  );
}

function TornEdge({ flip }: { flip?: boolean }) {
  return (
    <Image
      src="/torn.svg"
      alt=""
      width={429}
      height={173}
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 h-auto w-full select-none ${
        flip
          ? "bottom-20 translate-y-1/2 -scale-y-100"
          : "top-20 -translate-y-1/2"
      }`}
    />
  );
}

export function EventDetailsSection({ guestType }: { guestType: GuestType }) {
  const reduced = useReducedMotion();
  const fade = fadeUp(!!reduced);
  const isAkadResepsi = guestType === "akad_resepsi";

  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center py-12">
      <TornEdge />
      <TornEdge flip />

      <div className="bg-ash text-text-primary relative z-10 flex size-full flex-col items-center justify-center gap-6">
        <motion.p
          {...fade}
          transition={{ duration: 0.6 }}
          className="text-[clamp(1.75rem,8vw,2rem)] italic font-bold"
        >
          Save the Date!
        </motion.p>

        <motion.div
          {...fade}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={cn(
            isAkadResepsi
              ? "w-[clamp(11rem,42vw,13rem)]"
              : "w-[clamp(15rem,62vw,20rem)]",
          )}
        >
          <Image
            src="/floral-gate.svg"
            alt=""
            width={205}
            height={204}
            className="w-full select-none"
          />
        </motion.div>

        {isAkadResepsi ? (
          <>
            {/* Same venue, two times: render both time rows, then one shared
                venue footer below (client wants the venue shown only once). */}
            <EventBlock
              event={wedding.akad}
              delay={0.2}
              paired
              showVenue={false}
            />
            <EventBlock
              event={wedding.resepsi}
              delay={0.35}
              paired
              showVenue={false}
            />
            <VenueBlock event={wedding.resepsi} delay={0.5} />
          </>
        ) : (
          <EventBlock event={wedding.resepsi} delay={0.2} paired={false} />
        )}
      </div>
    </section>
  );
}
