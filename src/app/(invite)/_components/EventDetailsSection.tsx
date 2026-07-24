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
}: {
  event: EventDetails;
  delay: number;
  paired: boolean;
}) {
  const reduced = useReducedMotion();
  const fade = fadeUp(!!reduced);

  return (
    <motion.div
      {...fade}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center gap-4 text-center"
    >
      <p className="text-[2rem] italic font-bold">~ {event.label} ~</p>
      <div
        className={cn(
          "flex items-center gap-4",
          !paired && "flex-col gap-1",
        )}
      >
        <p className="font-semibold">
          <span className={cn("font-serif", paired ? "text-2xl" : "text-4xl")}>
            {event.day},
          </span>{" "}
          <span className={cn("font-prata", paired ? "text-base" : "text-[2rem]")}>
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
      <div className="flex flex-col">
        <p className="text-xl font-bold">Nama Tempat</p>
        <p className="max-w-xs text-base font-medium">
          {event.venueName}
          <br />
          {event.address}
        </p>
      </div>
      <ButtonLink href={event.mapsUrl}>Lihat Peta</ButtonLink>
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
    <section className="relative flex min-h-dvh flex-col items-center justify-center bg-texture py-12">
      <TornEdge />
      <TornEdge flip />

      <div className="bg-ash text-text-primary relative z-10 flex size-full flex-col items-center justify-center gap-6">
        <motion.p
          {...fade}
          transition={{ duration: 0.6 }}
          className="text-[2rem] italic font-bold"
        >
          Save the Date!
        </motion.p>

        <motion.div
          {...fade}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={cn(isAkadResepsi ? "w-52" : "w-80")}
        >
          <Image
            src="/floral-gate.svg"
            alt=""
            width={205}
            height={204}
            className="w-full select-none"
          />
        </motion.div>

        {isAkadResepsi && (
          <EventBlock event={wedding.akad} delay={0.2} paired={isAkadResepsi} />
        )}
        <EventBlock
          event={wedding.resepsi}
          delay={isAkadResepsi ? 0.35 : 0.2}
          paired={isAkadResepsi}
        />
      </div>
    </section>
  );
}
