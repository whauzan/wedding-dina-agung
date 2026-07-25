"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { closing } from "@/data/event";

const fadeUp = (reduced: boolean) => ({
  initial: { opacity: 0, y: reduced ? 0 : 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
});

export function ClosingSection() {
  const reduced = useReducedMotion();
  const fade = fadeUp(!!reduced);

  return (
    <section className="relative flex flex-col">
      <div className="relative flex flex-col items-center gap-6 overflow-hidden px-8 pt-8 pb-24 text-center text-cream">
        <motion.h2
          {...fade}
          transition={{ duration: 0.6 }}
          className="text-[2rem] leading-none font-bold italic"
        >
          {closing.title}
        </motion.h2>

        <motion.p
          {...fade}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-md text-sm font-medium"
        >
          {closing.body}
        </motion.p>

        <motion.p
          {...fade}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-sm font-medium"
        >
          {closing.signOff}
        </motion.p>

        <motion.p
          {...fade}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-2xl font-prata"
        >
          {closing.names}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: reduced ? 0.2 : 0.8 }}
        className="-mt-16 z-10"
      >
        <Image
          src="/footer.png"
          alt="Agung & Yudia"
          width={1720}
          height={906}
          sizes="(max-width: 480px) 100vw, 480px"
          className="w-full select-none"
        />
      </motion.div>
    </section>
  );
}
