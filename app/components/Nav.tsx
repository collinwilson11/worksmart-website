"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";

const LINKS = [
  { label: "What we build", href: "/#build" },
  { label: "Who it's for", href: "/#who" },
  { label: "Small business", href: "/small-business" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  /* tuck away on the way down, return the moment the reader scrolls up */
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (menuOpen) return setHidden(false);
    setHidden(y > prev && y > 160);
  });

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: hidden ? -88 : 0, opacity: 1 }}
        transition={{ duration: 0.6, ease }}
        className="card-grain fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-7 px-5 py-2.5 rounded-full"
        style={{
          background:
            "linear-gradient(158deg, rgba(43,33,24,0.92) 0%, rgba(28,21,13,0.94) 100%)",
          backdropFilter: "blur(18px) saturate(140%)",
          WebkitBackdropFilter: "blur(18px) saturate(140%)",
          border: "1px solid rgba(247,235,208,0.16)",
          boxShadow:
            "0 1px 2px rgba(20,15,9,0.2), 0 12px 32px rgba(20,15,9,0.28)",
        }}
      >
        <a
          href="/"
          className="font-serif text-[1.05rem] tracking-[-0.006em] shrink-0"
          style={{ color: "var(--card-cream)", fontStyle: "italic" }}
        >
          WorkSmart
          <span style={{ color: "var(--ember)" }}>SC</span>
        </a>

        <div className="hidden md:flex items-center gap-5">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[0.82rem] font-light transition-colors duration-300 font-sans"
              style={{ color: "rgba(247,235,208,0.68)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "var(--card-cream)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "rgba(247,235,208,0.68)")
              }
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="/#journey"
          className="group hidden md:flex items-center gap-2 font-sans font-semibold text-[0.8rem] tracking-wide rounded-full px-4 py-2 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.97]"
          style={{ background: "var(--ember)", color: "var(--cream)" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 24px rgba(222,76,0,0.45)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.boxShadow = "none")
          }
        >
          Get Started
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105"
            style={{ background: "rgba(0,0,0,0.18)" }}
          >
            ↗
          </span>
        </a>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-[5px] w-5 ml-1"
          aria-label="Toggle menu"
        >
          <span
            className="block w-full h-px origin-center transition-all duration-500"
            style={{
              background: "var(--card-cream)",
              transform: menuOpen ? "rotate(45deg) translateY(3px)" : "none",
            }}
          />
          <span
            className="block w-full h-px transition-all duration-500"
            style={{
              background: "var(--card-cream)",
              transform: menuOpen ? "rotate(-45deg) translateY(-3px)" : "none",
            }}
          />
        </button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-9"
            style={{
              background:
                "linear-gradient(170deg, rgba(28,21,13,0.97) 0%, rgba(24,17,10,0.98) 100%)",
              backdropFilter: "blur(20px)",
            }}
            onClick={() => setMenuOpen(false)}
          >
            {[...LINKS, { label: "Get Started", href: "/#journey" }].map(
              (l, i) => (
                <motion.a
                  key={l.href + l.label}
                  href={l.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.05 * i,
                    ease,
                  }}
                  className="font-serif italic text-4xl"
                  style={{
                    color:
                      i === LINKS.length
                        ? "var(--ember)"
                        : "var(--card-cream)",
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </motion.a>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
