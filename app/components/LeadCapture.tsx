"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type Variant = "diagnose" | "build";

const COPY: Record<Variant, {
  eyebrow: string;
  prompt: string;
  placeholder: string;
  cta: string;
  micro: string;
  done: string;
}> = {
  diagnose: {
    eyebrow: "Free trail review · 30 minutes",
    prompt: "What's one thing in your business costing too much time or money?",
    placeholder: "e.g. Our ops lead spends 9 hours a week stitching together the weekly report.",
    cta: "Send for review",
    micro: "We'll come back with one specific recommendation. No deck. No pitch.",
    done: "We'll be in touch within two business days.",
  },
  build: {
    eyebrow: "Pick one problem · One-page build plan",
    prompt: "Start small. Pick the one thing that, if it ran itself, would change your week.",
    placeholder: "e.g. Customer onboarding emails. We do it manually for every new account.",
    cta: "Get the build plan",
    micro: "We'll send a one-page build plan you can run with, even if you don't hire us.",
    done: "Plan incoming. Check your inbox in the next 48 hours.",
  },
};

export default function LeadCapture({ variant }: { variant: Variant }) {
  const c = COPY[variant];
  const [problem, setProblem] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState(false);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const valid = problem.trim().length > 5 && validEmail;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    setSubmitted(true);
  };

  return (
    <div className="brackets relative w-full max-w-[520px] bg-paper p-6 md:p-7">
      <span className="brk-tl" />
      <span className="brk-br" />

      <div className="font-mono text-[10px] tracking-[0.32em] uppercase text-ember mb-4">
        {c.eyebrow}
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="flex flex-col gap-4"
          >
            <p className="font-serif text-ink text-[20px] leading-[1.3] tracking-[-0.01em] text-pretty">
              {c.prompt}
            </p>

            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-ink-3">
                The friction
              </span>
              <textarea
                required
                rows={3}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder={c.placeholder}
                className="resize-none border border-ink/30 bg-paper-warm/60 px-3 py-2.5 font-serif italic text-ink text-[15px] leading-[1.45] outline-none transition-colors placeholder:text-ink-soft focus:border-ember"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-ink-3">
                Where to send it
              </span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourdomain.com"
                className="border border-ink/30 bg-paper-warm/60 px-3 py-2.5 font-serif italic text-ink text-[15px] outline-none transition-colors placeholder:text-ink-soft focus:border-ember"
              />
              {touched && email.length > 0 && !validEmail && (
                <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-ember">
                  · please use a valid email
                </span>
              )}
            </label>

            <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
              <button
                type="submit"
                className="group inline-flex items-center gap-3 bg-ink px-5 py-3 font-mono text-[11px] tracking-[0.28em] uppercase text-paper transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-ember disabled:opacity-50 active:scale-[0.98]"
              >
                <span>{c.cta}</span>
                <span className="grid h-6 w-6 place-items-center rounded-full bg-paper/15 transition-transform duration-300 group-hover:translate-x-0.5">
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <path d="M1 5h8M5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>

              <span className="font-serif italic text-ink-3 text-[12.5px] leading-[1.4] max-w-[230px]">
                {c.micro}
              </span>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="flex items-start gap-4"
          >
            <motion.svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              initial={{ rotate: -20, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 }}
              className="mt-1 text-ember"
            >
              <circle cx="14" cy="14" r="12" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <motion.path
                d="M 8 14 L 13 19 L 21 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
              />
            </motion.svg>
            <div>
              <p className="font-serif text-ink text-[20px] leading-[1.3] tracking-[-0.01em] mb-2">
                Got it.
              </p>
              <p className="font-serif italic text-ink-2 text-[15px] leading-[1.5] max-w-[400px]">
                {c.done}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
