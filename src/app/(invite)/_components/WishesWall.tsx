"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { wishes as copy } from "@/data/event";
import { cn } from "@/lib/cn";
import { Button } from "./ui/Button";
import { Field, fieldSurface } from "./ui/Field";
import { WishBoxFrame } from "./ui/WishBoxFrame";

const fadeUp = (reduced: boolean) => ({
  initial: { opacity: 0, y: reduced ? 0 : 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
});

type Wish = {
  id: string;
  name: string;
  message: string;
};

type Status = "idle" | "submitting" | "error";

export function WishesWall({
  guestName,
  guestSlug,
}: {
  guestName: string;
  guestSlug: string | null;
}) {
  const reduced = useReducedMotion();
  const fade = fadeUp(!!reduced);

  const [name, setName] = useState(guestName === "Tamu" ? "" : guestName);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [list, setList] = useState<Wish[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/wishes?limit=20")
      .then((r) => (r.ok ? r.json() : { wishes: [] }))
      .then((data: { wishes: Wish[] }) => {
        if (active) setList(data.wishes ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const canSubmit =
    name.trim() !== "" && message.trim() !== "" && status !== "submitting";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          message: message.trim(),
          guest_slug: guestSlug,
        }),
      });
      if (!res.ok) throw new Error("request failed");
      const wish: Wish = await res.json();
      // Optimistically surface the new wish at the top of the wall.
      setList((prev) => [wish, ...prev]);
      setMessage("");
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <motion.h2
          {...fade}
          transition={{ duration: 0.6 }}
          className="text-[clamp(1.75rem,8vw,2rem)] font-bold italic"
        >
          {copy.title}
        </motion.h2>
        <motion.p
          {...fade}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-base font-medium"
        >
          {copy.subtitle}
        </motion.p>
      </div>

      <motion.form
        {...fade}
        transition={{ duration: 0.6, delay: 0.1 }}
        onSubmit={submit}
        className="flex w-full max-w-md flex-col gap-4"
      >
        <Field label={copy.nameLabel} htmlFor="wish-name">
          <input
            id="wish-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={copy.namePlaceholder}
            className={fieldSurface}
            maxLength={80}
            required
          />
        </Field>

        <Field label={copy.messageLabel} htmlFor="wish-message">
          <textarea
            id="wish-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={copy.messagePlaceholder}
            rows={4}
            maxLength={500}
            className={cn(fieldSurface, "resize-none")}
            required
          />
        </Field>

        {status === "error" && (
          <p className="text-center text-sm text-seal">{copy.error}</p>
        )}

        <Button
          type="submit"
          disabled={!canSubmit}
          icon={{ src: "/icon_send.svg", alt: "Icon send" }}
          className={cn(
            "mt-4 self-center transition-opacity",
            !canSubmit && "opacity-60",
          )}
        >
          {status === "submitting" ? copy.submitting : copy.submit}
        </Button>
      </motion.form>

      {/* Wishes list — scrolls within a bounded panel so the section stays a
          phone-height column rather than growing unbounded. */}
      <div className="w-full max-w-md">
        {loaded && list.length === 0 ? (
          <p className="py-4 text-center text-sm text-text-primary/70">
            {copy.empty}
          </p>
        ) : (
          <div className="flex max-h-64 flex-col gap-3 overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {list.map((wish) => (
                <motion.div
                  key={wish.id}
                  layout={!reduced}
                  initial={{ opacity: 0, y: reduced ? 0 : -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0.15 : 0.35 }}
                  className="relative text-cream"
                >
                  {/* Hand-drawn frame stretches to the card's text-driven height. */}
                  <WishBoxFrame className="absolute inset-0 z-0 h-full w-full" />
                  <div className="relative z-10 flex flex-col gap-2 px-5 py-3">
                    <p className="text-sm font-bold text-text-primary">
                      {wish.name}
                    </p>
                    <p className="text-sm font-medium leading-relaxed wrap-break-word">
                      {wish.message}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
