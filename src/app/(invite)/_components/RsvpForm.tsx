"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { rsvp, type Attendance } from "@/data/event";
import { cn } from "@/lib/cn";
import { Button } from "./ui/Button";
import { Field, fieldSurface } from "./ui/Field";
import { Select } from "./ui/Select";

const fadeUp = (reduced: boolean) => ({
  initial: { opacity: 0, y: reduced ? 0 : 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
});

type Status = "idle" | "submitting" | "success" | "error";

export function RsvpForm({
  guestName,
  guestSlug,
}: {
  guestName: string;
  guestSlug: string | null;
}) {
  const reduced = useReducedMotion();
  const fade = fadeUp(!!reduced);

  // Prefill the name from the invite, but let the guest edit it (the fallback
  // "Tamu" guest shouldn't lock in a placeholder name).
  const [name, setName] = useState(guestName === "Tamu" ? "" : guestName);
  const [count, setCount] = useState<string>("");
  const [attendance, setAttendance] = useState<"" | Attendance>("");
  const [status, setStatus] = useState<Status>("idle");

  const canSubmit =
    name.trim() !== "" &&
    count !== "" &&
    attendance !== "" &&
    status !== "submitting";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_slug: guestSlug,
          guest_name: name.trim(),
          guest_count: Number(count),
          attendance,
        }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-6 py-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <motion.h2
          {...fade}
          transition={{ duration: 0.6 }}
          className="text-[clamp(1.75rem,8vw,2rem)] font-bold italic"
        >
          {rsvp.title}
        </motion.h2>
        {status !== "success" && (
          <motion.p
            {...fade}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-base font-medium"
          >
            {rsvp.subtitle}
          </motion.p>
        )}
      </div>

      {status === "success" ? (
        <motion.p
          initial={{ opacity: 0, y: reduced ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xs rounded-sm bg-cream px-4 py-6 text-center text-base text-ink"
        >
          {rsvp.success}
        </motion.p>
      ) : (
        <motion.form
          {...fade}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={submit}
          className="flex w-full max-w-md flex-col gap-2"
        >
          <Field label={rsvp.nameLabel} htmlFor="rsvp-name">
            <input
              id="rsvp-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={rsvp.namePlaceholder}
              className={fieldSurface}
              maxLength={80}
              required
            />
          </Field>

          <Field label={rsvp.countLabel} htmlFor="rsvp-count">
            <Select
              id="rsvp-count"
              placeholder={rsvp.selectPlaceholder}
              value={count}
              onChange={(e) => setCount(e.target.value)}
              required
            >
              {rsvp.countOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label={rsvp.attendanceLabel} htmlFor="rsvp-attendance">
            <Select
              id="rsvp-attendance"
              placeholder={rsvp.selectPlaceholder}
              value={attendance}
              onChange={(e) => setAttendance(e.target.value as Attendance)}
              required
            >
              {rsvp.attendanceOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>

          {status === "error" && (
            <p className="text-center text-sm text-seal">{rsvp.error}</p>
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
            {status === "submitting" ? rsvp.submitting : rsvp.submit}
          </Button>
        </motion.form>
      )}
    </div>
  );
}
