"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";

const fadeUp = (reduced: boolean) => ({
  initial: { opacity: 0, y: reduced ? 0 : 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
});

export function InvitationIntro() {
  const reduced = useReducedMotion();
  const fade = fadeUp(!!reduced);

  return (
    <main className="min-h-dvh relative flex flex-1 flex-col items-center justify-center px-[8vw] py-24 text-cream">
      <Image
        src="/ornament.svg"
        alt=""
        width={128}
        height={128}
        className="absolute top-0 -right-6 w-[clamp(11rem,52vw,16rem)]"
      />
      <Image
        src="/ornament.svg"
        alt=""
        width={128}
        height={128}
        className="absolute bottom-0 -left-6 w-[clamp(11rem,52vw,16rem)] transform scale-y-[-1] scale-x-[-1]"
      />
      <div className="relative flex w-full max-w-xs flex-col gap-3 py-5 px-6">
        {/* corner-bracket frame */}
        <span className="absolute top-0 left-0 size-8 border-t border-l border-white" />
        <span className="absolute right-0 bottom-0 size-8 border-r border-b border-white" />

        <motion.p
          {...fade}
          transition={{ duration: 0.6 }}
          className="font-serif text-[clamp(1.25rem,6vw,1.5rem)] italic"
        >
          The Wedding of
        </motion.p>
        <motion.h1
          {...fade}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-prata text-[clamp(1.875rem,9vw,2.25rem)] leading-tight text-center"
        >
          Agung Nugroho
          <br />
          &amp;
          <br />
          Yudia Putri M.
        </motion.h1>
        <motion.p
          {...fade}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-serif text-[clamp(1.25rem,6vw,1.5rem)] text-end"
        >
          <span className="font-semibold italic">22 Agustus</span>{" "}
          <span className="font-prata text-base">2026</span>
        </motion.p>
      </div>
    </main>
  );
}
