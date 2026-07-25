"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";

const fadeUp = (reduced: boolean) => ({
  initial: { opacity: 0, y: reduced ? 0 : 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
});

const STORY = {
  body: "Within the hall of our university, our hearts first pound each other. Though time and distance led us apart, the thread that bound us never truly broke. Years later, destiny brought us back together, and our hearts found their way home—into each other, and into a lifetime of love.",
  photo: "/our-story.png",
};

const MOMENTS_QUOTE = '"A moment is better when shared with you."';
const MOMENTS = [
  "/moments1.png",
  "/moments2.png",
  "/our-story.png",
  "/bride.jpg",
  "/groom.jpg",
];

// Hand-painted brush frame for the selected thumbnail — the "Rectangle 5" brush
// stroke extracted from Figma (photo/pattern stripped) into a standalone SVG
// shape. Applied as a CSS mask on a cream-tinted layer so it inherits the theme
// color and stretches to the thumbnail, rather than a fixed-color PNG.
const SELECTED_FRAME_MASK =
  "url(/selected-frame.svg) center / 100% 100% no-repeat";

/** Featured moment photo with a spotlight vignette + a tappable thumbnail strip
 *  that slides the selected image to the center of the strip. */
function MomentsGallery() {
  const reduced = useReducedMotion();
  const fade = fadeUp(!!reduced);
  const [active, setActive] = useState(0);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Select a moment and slide its thumbnail to the center of the strip. We
  // measure the on-screen centers of the thumbnail and the strip and shift the
  // strip's current scrollLeft by their difference — immune to offsetParent /
  // section padding / positioning. scrollTo clamps the target, so index 0 stays
  // left-aligned and the last stays right-aligned.
  const select = (i: number) => {
    setActive(i);
    const strip = stripRef.current;
    const thumb = thumbRefs.current[i];
    if (!strip || !thumb) return;
    const stripRect = strip.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    const delta =
      thumbRect.left +
      thumbRect.width / 2 -
      (stripRect.left + stripRect.width / 2);
    strip.scrollTo({
      left: strip.scrollLeft + delta,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  return (
    <>
      {/* Featured image with a spotlight vignette + crossfade on selection. */}
      <motion.div
        {...fade}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 aspect-3/4 w-full max-w-xs self-center overflow-hidden bg-black"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.4 }}
            className="absolute inset-0"
          >
            <Image
              src={MOMENTS[active]}
              alt={`Moment ${active + 1}`}
              fill
              sizes="(max-width: 480px) 90vw, 320px"
              className="object-cover select-none"
            />
          </motion.div>
        </AnimatePresence>
        {/* Spotlight vignette — dark corners, lit center. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.7) 100%)",
          }}
        />
      </motion.div>

      {/* Thumbnail strip — horizontal scroll, taps swap the featured image. */}
      <motion.div
        ref={stripRef}
        {...fade}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="z-10 flex w-full max-w-xs snap-x gap-2 self-center overflow-x-auto pb-2 scrollbar-none"
      >
        {MOMENTS.map((src, i) => (
          <button
            key={src}
            ref={(el) => {
              thumbRefs.current[i] = el;
            }}
            type="button"
            onClick={() => select(i)}
            aria-label={`Lihat momen ${i + 1}`}
            aria-current={i === active}
            className="relative aspect-video w-28 shrink-0 cursor-pointer snap-start"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="112px"
              className="object-cover select-none"
            />
            {/* Painted brush frame (Figma "Rectangle 5") on the active thumb. */}
            {i === active && (
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-px bg-cream"
                style={{
                  mask: SELECTED_FRAME_MASK,
                  WebkitMask: SELECTED_FRAME_MASK,
                }}
              />
            )}
          </button>
        ))}
      </motion.div>
    </>
  );
}

export function OurStorySection() {
  const reduced = useReducedMotion();
  const fade = fadeUp(!!reduced);

  return (
    <section className="bg-texture relative flex min-h-dvh flex-col gap-6 overflow-hidden bg-slate px-8 py-8 text-cream">
      {/* Top-left forget-me-not floral, per the mockup. */}
      <Image
        src="/ornament.svg"
        alt=""
        width={384}
        height={320}
        aria-hidden
        className="pointer-events-none absolute top-10 -left-9 w-52 -scale-x-100 select-none"
      />

      {/* --- Our Story --- */}
      <motion.h2
        {...fade}
        transition={{ duration: 0.6 }}
        className="text-center text-[2rem] font-bold italic"
      >
        Our Story
      </motion.h2>

      <div className="flex flex-col items-center gap-4">
        <motion.div
          {...fade}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative aspect-3/4 w-2/5 shrink-0 overflow-hidden rounded-t-full"
        >
          <Image
            src={STORY.photo}
            alt="Our story"
            fill
            sizes="(max-width: 480px) 45vw, 160px"
            className="object-cover select-none"
          />
        </motion.div>

        <motion.p
          {...fade}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-md text-center text-base font-medium"
        >
          {STORY.body}
        </motion.p>
      </div>

      {/* --- Our Moments --- */}
      <motion.h2
        {...fade}
        transition={{ duration: 0.6 }}
        className="text-center text-[2rem] font-bold italic"
      >
        Our Moments
      </motion.h2>

      <motion.p
        {...fade}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-md self-center text-center text-base font-medium"
      >
        {MOMENTS_QUOTE}
      </motion.p>

      <MomentsGallery />

      {/* Bottom-right forget-me-not floral, per the mockup. */}
      <Image
        src="/ornament.svg"
        alt=""
        width={384}
        height={362}
        aria-hidden
        className="pointer-events-none absolute -right-4 -bottom-20 w-52 select-none"
      />
    </section>
  );
}
