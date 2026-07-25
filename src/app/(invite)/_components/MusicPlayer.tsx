"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { m } from "motion/react";

export type MusicPlayerHandle = {
  /** Start playback. Safe to call from a user-gesture handler (envelope tap). */
  play: () => void;
};

/**
 * Floating background-music control. Owns a looping <audio> whose source is the
 * invitation song. Playback is started imperatively from the envelope tap (the
 * user gesture browsers require for autoplay), exposed via `play()` on the ref.
 *
 * The visible toggle is a slowly-spinning disc: it rotates while audio is
 * actually playing and stops when paused. Button state is driven off the real
 * `play`/`pause` events, not local guesses, so it stays truthful if playback is
 * interrupted (a phone call, the OS, tab switch).
 */
export const MusicPlayer = forwardRef<MusicPlayerHandle>(
  function MusicPlayer(_props, ref) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);

    useImperativeHandle(ref, () => ({
      play: () => {
        const audio = audioRef.current;
        if (!audio) return;
        // Rejected promise (some mobile browsers) just leaves us paused rather
        // than throwing — the toggle stays visible for a manual tap.
        void audio.play().catch(() => {});
      },
    }));

    // Mirror real audio state into the button, and pause when the tab is hidden.
    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const onPlay = () => setPlaying(true);
      const onPause = () => setPlaying(false);
      const onVisibility = () => {
        if (document.hidden) audio.pause();
      };

      audio.addEventListener("play", onPlay);
      audio.addEventListener("pause", onPause);
      document.addEventListener("visibilitychange", onVisibility);
      return () => {
        audio.removeEventListener("play", onPlay);
        audio.removeEventListener("pause", onPause);
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }, []);

    const toggle = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (audio.paused) void audio.play().catch(() => {});
      else audio.pause();
    };

    return (
      <>
        <audio ref={audioRef} src="/song.m4a" loop preload="none" />

        <m.button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Jeda musik" : "Putar musik"}
          aria-pressed={playing}
          className="fixed right-4 bottom-4 z-50 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-slate/90 text-cream shadow-lg ring-1 ring-cream/40 backdrop-blur-sm"
          whileTap={{ scale: 0.92 }}
        >
          {/* Vinyl disc: outer ring + spindle hole, with a "paused" pause-bar
              overlay when stopped so the control reads clearly either way. The
              spin is a pure CSS keyframe (GPU-composited, no per-frame JS) that
              only runs while playing; `.music-disc--spin` is gated on
              prefers-reduced-motion in globals.css so it also degrades there. */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className={playing ? "music-disc--spin" : undefined}
          >
            <circle
              cx="12"
              cy="12"
              r="9.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle
              cx="12"
              cy="12"
              r="4.5"
              stroke="currentColor"
              strokeWidth="1.25"
              opacity="0.7"
            />
            <circle cx="12" cy="12" r="1.4" fill="currentColor" />
          </svg>

          {!playing && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-cream text-slate">
              <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
                <rect x="1" y="1" width="2" height="6" fill="currentColor" />
                <rect x="5" y="1" width="2" height="6" fill="currentColor" />
              </svg>
            </span>
          )}
        </m.button>
      </>
    );
  },
);
