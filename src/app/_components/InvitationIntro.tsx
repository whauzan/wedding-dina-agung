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
    <main className="bg-texture relative flex flex-1 flex-col items-center justify-center bg-slate px-10 py-24 text-cream">
      <Image
        src="/ornament.svg"
        alt=""
        width={128}
        height={128}
        className="absolute top-0 -right-6 w-64"
      />
      <Image
        src="/ornament.svg"
        alt=""
        width={128}
        height={128}
        className="absolute bottom-0 -left-6 w-64 transform scale-y-[-1] scale-x-[-1]"
      />
      <div className="relative flex w-full max-w-xs flex-col gap-3 py-5 px-6">
        {/* corner-bracket frame */}
        <span className="absolute top-0 left-0 size-8 border-t border-l border-white" />
        <span className="absolute right-0 bottom-0 size-8 border-r border-b border-white" />

        <motion.p
          {...fade}
          transition={{ duration: 0.6 }}
          className="font-serif text-2xl italic tracking-widest"
        >
          The Wedding of
        </motion.p>
        <motion.h1
          {...fade}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-serif text-4xl leading-tight font-semibold text-center"
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
          className="font-serif text-2xl italic text-end"
        >
          22 Agustus 2026
        </motion.p>
      </div>
    </main>
  );
}
