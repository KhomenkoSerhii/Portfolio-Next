"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { startGameMusic, stopGameMusic, scoreBlip } from "./retro-audio";
import { prefillContact } from "@/lib/contact-prefill";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

// each caught pulse decodes one letter of the hidden transmission
const SECRET = "HIRE ME";
const LETTERS = SECRET.replace(" ", "").length; // catches needed

/**
 * HUD + input handling for the three easter eggs:
 *  1. click pulses in the neural network -> decode the hidden transmission
 *  2. Konami code -> particle hunt game mode (arrows/WASD, ESC to exit)
 *  3. page burst (triggered from the navbar logo) is CSS + scene only
 */
export default function EasterEggs() {
  const [caught, setCaught] = useState(0);
  const [game, setGame] = useState(false);
  const [score, setScore] = useState(0);
  const progress = useRef(0);

  const decoded = caught >= LETTERS;

  useEffect(() => {
    const onCaught = () =>
      setCaught((c) => {
        const next = Math.min(c + 1, LETTERS);
        // full decode -> celebrate with the scene burst
        if (next === LETTERS && c < LETTERS) {
          window.dispatchEvent(new Event("egg:burst"));
        }
        return next;
      });
    const onScore = () => {
      scoreBlip();
      setScore((s) => s + 1);
    };
    const onToggle = (e: Event) => {
      const on = (e as CustomEvent<{ on: boolean }>).detail.on;
      setGame(on);
      if (on) {
        setScore(0);
        startGameMusic();
      } else {
        stopGameMusic();
      }
      document.body.classList.toggle("game-mode", on);
    };

    function dispatchToggle(on: boolean) {
      window.dispatchEvent(
        new CustomEvent("egg:game-toggle", { detail: { on } })
      );
    }

    function onKey(e: KeyboardEvent) {
      if (!e.key) return; // synthetic events (autofill, extensions) have no key
      if (e.key === "Escape") {
        dispatchToggle(false);
        return;
      }
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === KONAMI[progress.current]) {
        progress.current++;
        if (progress.current === KONAMI.length) {
          progress.current = 0;
          dispatchToggle(true);
        }
      } else {
        progress.current = key === KONAMI[0] ? 1 : 0;
      }
    }

    window.addEventListener("egg:pulse-caught", onCaught);
    window.addEventListener("egg:game-score", onScore);
    window.addEventListener("egg:game-toggle", onToggle);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("egg:pulse-caught", onCaught);
      window.removeEventListener("egg:game-score", onScore);
      window.removeEventListener("egg:game-toggle", onToggle);
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("game-mode");
      stopGameMusic();
    };
  }, []);

  // render the secret with revealed letters; spaces are always visible
  let revealedCount = 0;
  const slots = SECRET.split("").map((ch, i) => {
    if (ch === " ") return { key: i, ch: " ", shown: true };
    revealedCount++;
    return { key: i, ch, shown: revealedCount <= caught };
  });

  return (
    <>
      {/* signal decoder (egg #1) */}
      <AnimatePresence>
        {caught > 0 && !game && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`fixed bottom-6 left-6 z-40 rounded-2xl border bg-zinc-950/85 px-5 py-3 font-mono backdrop-blur transition-colors ${
              decoded ? "border-cyan-400/50" : "border-emerald-500/30"
            }`}
          >
            <p className="text-[10px] tracking-widest text-zinc-500">
              {decoded
                ? "TRANSMISSION DECODED"
                : "INCOMING TRANSMISSION - CATCH THE SIGNALS"}
            </p>
            <p className="mt-1 flex gap-1 text-lg font-bold">
              {slots.map(({ key, ch, shown }) => (
                <motion.span
                  key={key}
                  initial={false}
                  animate={{
                    color: shown ? "#67e8f9" : "#3f3f46",
                    scale: shown ? 1 : 0.9,
                  }}
                >
                  {shown ? ch : "•"}
                </motion.span>
              ))}
            </p>
            {decoded && (
              <motion.a
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                href="#contact"
                onClick={() => prefillContact("I decoded the hidden \"HIRE ME\" signal 🛸")}
                className="mt-2 inline-block rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-4 py-1.5 text-xs font-bold text-white"
              >
                Well… let&apos;s talk →
              </motion.a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* game HUD (egg #2) */}
      <AnimatePresence>
        {game && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="pointer-events-none fixed inset-x-0 top-20 z-40 flex justify-center px-4"
          >
            <div className="rounded-2xl border border-cyan-500/30 bg-zinc-950/85 px-6 py-3 text-center font-mono text-xs text-cyan-200 backdrop-blur sm:text-sm">
              <span className="font-bold text-white">PARTICLE HUNT</span>
              <span className="mx-3 text-cyan-500">·</span>
              SCORE: <span className="font-bold text-cyan-300">{score}</span>
              <span className="mx-3 text-cyan-500">·</span>
              ARROWS / WASD - MOVE
              <span className="mx-3 text-cyan-500">·</span>
              ESC - EXIT
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
