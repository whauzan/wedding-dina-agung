"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";

const fadeUp = (reduced: boolean) => ({
  initial: { opacity: 0, y: reduced ? 0 : 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
});

export function VerseSection() {
  const reduced = useReducedMotion();
  const fade = fadeUp(!!reduced);

  return (
    <section className="min-h-dvh relative flex flex-col gap-6 items-center py-16 text-cream">
      <motion.div
        initial={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative w-full max-w-md"
      >
        <Image
          src="/image1.png"
          alt="Pengantin mengenakan busana adat"
          width={1720}
          height={1240}
          className="w-full select-none"
        />
      </motion.div>

      <motion.p
        {...fade}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-md px-10 text-center text-base"
      >
        Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan
        pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan
        merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan
        sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda
        (kebesaran Allah) bagi kaum yang berpikir
      </motion.p>

      <motion.p
        {...fade}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="text-xs font-semibold"
      >
        QS Ar Rum 21
      </motion.p>

      <motion.div
        {...fade}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="rotate-90 -mt-16"
      >
        <Image
          src="/ornament-flower.svg"
          alt=""
          width={1908}
          height={3234}
          className="w-[clamp(8rem,32vw,10rem)] select-none"
        />
      </motion.div>
    </section>
  );
}
