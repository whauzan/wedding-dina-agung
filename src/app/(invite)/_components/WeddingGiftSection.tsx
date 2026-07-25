"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { wedding, type BankAccount } from "@/data/event";
import { cn } from "@/lib/cn";

const fadeUp = (reduced: boolean) => ({
  initial: { opacity: 0, y: reduced ? 0 : 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
});

const INTRO = [
  "Doa restu Anda merupakan karunia yang sangat berarti bagi kami.",
  "Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado atau secara cashless.",
];

/** Small centered line-floral divider, matching the section header ornament. */
function DividerIcon({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      width={24}
      height={24}
      aria-hidden
      className="size-6 select-none"
    />
  );
}

/** A bank card row with a tap-to-copy account number. */
function BankCard({ bank, delay }: { bank: BankAccount; delay: number }) {
  const reduced = useReducedMotion();
  const fade = fadeUp(!!reduced);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(bank.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable (older browser / insecure context) — no-op,
      // the number stays visible for manual copy.
    }
  };

  return (
    <motion.div
      {...fade}
      transition={{ duration: 0.6, delay }}
      className="flex w-full max-w-xs items-center gap-2.5"
    >
      <div className="relative w-28 shrink-0 h-16 flex items-center">
        <Image
          src={bank.logo}
          alt={bank.name}
          width={137}
          height={58}
          className="object-contain object-left select-none"
        />
      </div>
      <div className="flex min-w-52 flex-col gap-1">
        <span className="text-xs font-medium">Atas Nama</span>
        <div className="flex flex-col">
          <span className="text-base font-medium">{bank.holder}</span>
          <button
            type="button"
            onClick={copy}
            aria-label={`Salin nomor rekening ${bank.holder}`}
            className="flex cursor-pointer items-center gap-2 text-left"
          >
            <span className="font-prata text-xs font-medium">
              {bank.number}
            </span>
            <span className="text-xs opacity-70">
              {copied ? "Tersalin!" : "Salin"}
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function WeddingGiftSection() {
  const reduced = useReducedMotion();
  const fade = fadeUp(!!reduced);
  const [open, setOpen] = useState(false);
  const { banks, address } = wedding.gift;

  return (
    <section
      className={cn(
        "bg-texture relative flex min-h-dvh flex-col items-center gap-6 overflow-hidden bg-slate px-8 py-12 text-cream",
        !open && "justify-center",
      )}
    >
      {/* Header line-floral, per the mockup. */}
      <motion.div
        {...fade}
        transition={{ duration: 0.6 }}
        className="-rotate-90 transform scale-x-[-1] -my-16"
      >
        <Image
          src="/ornament-flower.svg"
          alt=""
          width={160}
          height={120}
          aria-hidden
          className="w-28 select-none"
        />
      </motion.div>

      <motion.h2
        {...fade}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center text-[2rem] font-bold italic"
      >
        Wedding Gift
      </motion.h2>

      <div className="flex flex-col gap-4">
        {INTRO.map((text, i) => (
          <motion.p
            key={i}
            {...fade}
            transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
            className="max-w-md text-center text-base font-medium"
          >
            {text}
          </motion.p>
        ))}
      </div>

      {/* Collapsed: the toggle. Expanded: reveals cashless + kirim kado. */}
      <AnimatePresence initial={false} mode="wait">
        {!open ? (
          <motion.button
            key="toggle"
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.35 }}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-text-primary px-6 py-2 text-white"
          >
            <Image
              src="/icon_gift.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden
              className="size-5 select-none"
            />
            <span className="text-lg">Klik Di Sini</span>
          </motion.button>
        ) : (
          <motion.div
            key="details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.5 }}
            className="flex w-full flex-col items-center gap-6 overflow-hidden"
          >
            {/* --- Cashless --- */}
            <DividerIcon src="/icon_wallet.svg" />
            <motion.p
              {...fade}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl font-bold italic"
            >
              ~ Cashless ~
            </motion.p>

            <div className="flex flex-col items-center gap-6">
              {banks.map((bank, i) => (
                <BankCard key={i} bank={bank} delay={0.15 + i * 0.1} />
              ))}
            </div>

            {/* --- Kirim Kado --- */}
            <DividerIcon src="/icon_gift.svg" />
            <motion.p
              {...fade}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl font-bold italic"
            >
              ~ Kirim Kado ~
            </motion.p>

            <motion.div
              {...fade}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <p className="text-base font-medium">
                Anda bisa mengirim kado ke
              </p>
              <div className="flex flex-col gap-1">
                <p className="font-bold text-base">{address.recipient}</p>
                <p className="text-base font-medium">
                  {address.detail}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
