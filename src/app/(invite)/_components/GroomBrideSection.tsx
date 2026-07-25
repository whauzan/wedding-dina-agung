"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { ButtonLink } from "./ui/ButtonLink";

const fadeUp = (reduced: boolean) => ({
  initial: { opacity: 0, y: reduced ? 0 : 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
});

type Person = {
  photo: string;
  name: string;
  bio: string;
  instagramUrl: string;
  /** Extra object-cover zoom for photos framed wider than the others (default 1). */
  zoom?: number;
  /** object-position vertical bias, e.g. "20%" to favor the face/chest (default "50%"). */
  focusY?: string;
  /** Mirror horizontally so groom/bride face each other, per the Figma design. */
  flip?: boolean;
};

const groom: Person = {
  photo: "/groom.jpg",
  name: "Agung Nugroho",
  bio: "Putra pertama Bapak Radino dan Ibu Turminah",
  instagramUrl: "https://www.instagram.com/gaungnugroho",
  zoom: 2.6,
  focusY: "25%",
  flip: true,
};

const bride: Person = {
  photo: "/bride.jpg",
  name: "Yudia Putri M.",
  bio: "Putri ketiga Bapak Yudianto (Alm.) dan Ibu Halimatus Sakdiyah",
  instagramUrl: "https://www.instagram.com/yudiapm",
  zoom: 1.3,
  focusY: "80%",
  flip: true,
};

function PersonCard({ person, delay }: { person: Person; delay: number }) {
  const reduced = useReducedMotion();
  const fade = fadeUp(!!reduced);

  return (
    <motion.div
      {...fade}
      transition={{ duration: 0.6, delay }}
      className="flex h-full flex-col items-center gap-4"
    >
      <div className="relative aspect-3/4 w-3/4 overflow-hidden rounded-t-full">
        <Image
          src={person.photo}
          alt={person.name}
          fill
          sizes="(max-width: 480px) 45vw, 200px"
          className="object-cover select-none"
          style={{
            objectPosition: `50% ${person.focusY ?? "50%"}`,
            transform: [
              person.flip && "scaleX(-1)",
              person.zoom && `scale(${person.zoom})`,
            ]
              .filter(Boolean)
              .join(" "),
          }}
        />
      </div>
      <div className="flex flex-1 flex-col items-center gap-2">
        <h3 className="font-bold text-2xl italic">{person.name}</h3>
        <p className="text-center text-sm">{person.bio}</p>
      </div>
      <ButtonLink
        href={person.instagramUrl}
        icon={{ src: "/icon_instagram.svg", alt: "Instagram icon" }}
        className="mt-auto min-w-36"
      >
        instagram
      </ButtonLink>
    </motion.div>
  );
}

export function GroomBrideSection() {
  const reduced = useReducedMotion();
  const fade = fadeUp(!!reduced);

  return (
    <section className="min-h-dvh relative flex flex-col items-center justify-center gap-6 overflow-hidden px-8 text-cream">
      <Image
        src="/ornament-corner.svg"
        alt=""
        width={192}
        height={211}
        className="absolute top-0 left-0 w-48 select-none transform scale-x-[-1]"
      />
      <Image
        src="/ornament-corner.svg"
        alt=""
        width={192}
        height={211}
        className="absolute top-0 right-0 w-48 select-none"
      />
      <Image
        src="/ornament-corner.svg"
        alt=""
        width={192}
        height={211}
        className="absolute bottom-0 left-0 w-48 transform scale-y-[-1] scale-x-[-1] select-none"
      />
      <Image
        src="/ornament-corner.svg"
        alt=""
        width={192}
        height={211}
        className="absolute right-0 bottom-0 w-48 transform scale-y-[-1] select-none"
      />

      <motion.div {...fade} transition={{ duration: 0.6 }} className="text-3xl">
        <Image src="/icon_heart.svg" alt="Icon heart" width={24} height={24} />
      </motion.div>

      <motion.h2
        {...fade}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-[2rem] italic font-bold"
      >
        Groom &amp; Bride
      </motion.h2>

      <div className="relative grid w-full max-w-sm grid-cols-2 gap-2.5">
        <PersonCard person={groom} delay={0.2} />
        <PersonCard person={bride} delay={0.3} />
      </div>
    </section>
  );
}
