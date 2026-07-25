"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useScrollLock } from "../_hooks/useScrollLock";
import { InvitationIntro } from "./InvitationIntro";
import { VerseSection } from "./VerseSection";
import { GroomBrideSection } from "./GroomBrideSection";
import { OurStorySection } from "./OurStorySection";
import { EventDetailsSection } from "./EventDetailsSection";
import type { GuestType } from "@/lib/guests";
import Image from "next/image";

type Phase = "sealed" | "opening" | "expanding" | "slate" | "names";

// Deterministic timeline (ms). Each phase auto-advances after its duration so
// the sequence never depends on motion's onAnimationComplete firing (which is
// racy with keyframe / already-settled values). Tuned for ~3.5s total.
const DURATIONS: Record<Exclude<Phase, "sealed" | "names">, number> = {
  opening: 550, // envelope swaps to slight-open art + seal slides off
  expanding: 700, // slight-open envelope scales up to fill the viewport
  slate: 2200, // floral "You are invited to" enters + holds
};

const REDUCED_DURATIONS: Record<Exclude<Phase, "sealed" | "names">, number> = {
  opening: 200,
  expanding: 250,
  slate: 900,
};

const NEXT: Record<Exclude<Phase, "sealed" | "names">, Phase> = {
  opening: "expanding",
  expanding: "slate",
  slate: "names",
};

export function EnvelopeGate({
  guestName = "Tamu",
  guestType = "resepsi",
}: {
  guestName?: string;
  guestType?: GuestType;
}) {
  const [phase, setPhase] = useState<Phase>("sealed");
  const reduced = useReducedMotion();

  useScrollLock(phase !== "names");

  // Drive the timeline: whenever we enter a timed phase, schedule the next one.
  useEffect(() => {
    if (phase === "sealed" || phase === "names") return;
    const table = reduced ? REDUCED_DURATIONS : DURATIONS;
    const id = window.setTimeout(() => setPhase(NEXT[phase]), table[phase]);
    return () => window.clearTimeout(id);
  }, [phase, reduced]);

  const handleOpen = () => {
    if (phase !== "sealed") return;
    setPhase("opening");
  };

  const isSlate = phase === "slate" || phase === "names";

  return (
    <div className="relative flex min-h-screen w-full flex-1 flex-col overflow-hidden">
      {/* Background layer: cream -> slate. Color is driven by inline style
          (the theme CSS vars) with a CSS transition — a plain `bg-slate`
          utility here was being overridden and never painted. The texture
          overlay is layered separately so it sits above this solid fill. */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundColor: isSlate
            ? "var(--color-slate)"
            : "var(--color-cream)",
          transition: `background-color ${reduced ? 200 : 500}ms ease`,
        }}
      />
      <div className="bg-texture fixed inset-0 z-0" />

      {/* Envelope + floral stage. Unmounted in the `names` phase so it no
          longer occupies flex space above InvitationIntro, letting the intro
          fill the full-height column. */}
      {phase !== "names" && (
        <div className="relative z-30 flex flex-1 flex-col items-center justify-center px-10 py-16">
          {/* Sealed -> opening (slight-open art + seal slide-off) -> expanding
              (envelope itself scales up to cover the viewport, taking over
              the "wipe" role) beat. Fixed positioning kicks in once we start
              expanding so the scale grows from the envelope's own center
              rather than jumping to a full-screen layer. */}
          <AnimatePresence>
            {(phase === "sealed" ||
              phase === "opening" ||
              phase === "expanding") && (
              <motion.div
                key="envelope"
                className={
                  phase === "expanding"
                    ? "fixed inset-0 z-40 flex flex-col items-center justify-center gap-0 text-center"
                    : "flex flex-col items-center gap-0 text-center"
                }
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0.15 : 0.3 }}
              >
                <motion.p
                  className="font-serif text-2xl text-ink"
                  animate={{ opacity: phase === "sealed" ? 1 : 0 }}
                  transition={{ duration: reduced ? 0.15 : 0.25 }}
                >
                  Hi, {guestName}!
                </motion.p>

                <motion.button
                  type="button"
                  onClick={handleOpen}
                  aria-label="Buka undangan"
                  disabled={phase !== "sealed"}
                  className="relative w-104 cursor-pointer"
                  style={{ transformOrigin: "center" }}
                  animate={
                    phase === "opening"
                      ? { scale: reduced ? 1 : 1.08 }
                      : phase === "expanding"
                        ? { scale: reduced ? 1 : 14 }
                        : { scale: 1 }
                  }
                  transition={
                    phase === "opening"
                      ? { duration: reduced ? 0.2 : 0.55, ease: "easeOut" }
                      : phase === "expanding"
                        ? { duration: reduced ? 0.25 : 0.7, ease: "easeIn" }
                        : { duration: 0.2 }
                  }
                >
                  <Image
                    src={
                      phase === "sealed"
                        ? "/envelope.png"
                        : "/envelope-slight-open.png"
                    }
                    alt="envelope"
                    width={430}
                    height={327}
                    className="w-full select-none"
                  />
                  {(phase === "sealed" || phase === "opening") && (
                    <motion.img
                      src="/seal.png"
                      alt="seal"
                      className="absolute top-[55%] left-1/2 w-28 -translate-x-1/2 -translate-y-1/2 select-none"
                      animate={
                        phase === "opening"
                          ? {
                              y: reduced ? 0 : 160,
                              rotate: reduced ? 0 : 18,
                              scale: reduced ? 1 : 0.9,
                              opacity: 0,
                            }
                          : { y: 0, rotate: 0, scale: 1, opacity: 1 }
                      }
                      transition={{
                        duration: reduced ? 0.2 : 0.5,
                        ease: "easeIn",
                      }}
                    />
                  )}
                </motion.button>

                <motion.p
                  className="font-serif text-2xl tracking-wide text-ink/70 italic"
                  animate={{ opacity: phase === "sealed" ? 1 : 0 }}
                  transition={{ duration: reduced ? 0.15 : 0.25 }}
                >
                  Klik surat untuk membukanya
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floral "You are invited to" beat */}
          <AnimatePresence>
            {phase === "slate" && (
              <motion.div
                key="floral"
                className="flex flex-col items-center gap-1 text-center"
                initial={{ opacity: 0, y: reduced ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: reduced ? 1 : 0.95 }}
                transition={{ duration: reduced ? 0.2 : 0.6 }}
              >
                <Image
                  src="/floral-forget-me-not-top.svg"
                  alt="floral"
                  width={384}
                  height={320}
                  className="w-52 select-none"
                />
                <p className="font-serif text-2xl tracking-widest text-cream italic">
                  You are invited to
                </p>
                <Image
                  src="/floral-forget-me-not-bottom.svg"
                  alt="floral"
                  width={384}
                  height={362}
                  className="w-52 select-none"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Final content */}
      {phase === "names" && (
        <>
          <InvitationIntro />
          <VerseSection />
          <GroomBrideSection />
          <EventDetailsSection guestType={guestType} />
          <OurStorySection />
        </>
      )}
    </div>
  );
}
