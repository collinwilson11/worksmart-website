"use client";

import { useState } from "react";
import { motion } from "motion/react";

const ease = [0.32, 0.72, 0, 1] as const;

export default function CTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <section
      id="reserve"
      className="py-40 md:py-52 px-4 relative overflow-hidden text-center"
      style={{ background: "var(--bg)" }}
    >
      {/* Subtle teal mesh */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "70vw",
          height: "70vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,184,158,0.06) 0%, transparent 65%)",
          filter: "blur(120px)",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          viewport={{ once: true }}
        >
          <span className="eyebrow">Early Access</span>
        </motion.div>

        <motion.h2
          className="font-display font-extrabold tracking-[-0.03em] leading-[0.93]"
          style={{ fontSize: "clamp(3.25rem, 8vw, 7rem)", color: "var(--text-1)" }}
          initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.1, ease }}
          viewport={{ once: true }}
        >
          Reserve your
          <br />
          CLiKR AI.
        </motion.h2>

        <motion.p
          className="mt-6 font-light leading-relaxed text-[1.05rem]"
          style={{ color: "var(--text-2)" }}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.2, ease }}
          viewport={{ once: true }}
        >
          Join the waitlist for early access and exclusive launch pricing.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          className="flex gap-2 mt-10 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.3, ease }}
          viewport={{ once: true }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
            className="flex-1 rounded-full px-5 py-3 text-[0.875rem] font-light outline-none transition-all duration-300"
            style={{
              background: "var(--surface)",
              border: "1px solid rgba(0,0,0,0.1)",
              color: "var(--text-1)",
            }}
            onFocus={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor = "rgba(0,184,158,0.4)")
            }
            onBlur={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor = "rgba(0,0,0,0.1)")
            }
          />
          <button
            type="submit"
            className="group flex items-center gap-2 font-display font-bold text-[0.875rem] tracking-wide rounded-full px-5 py-3 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] whitespace-nowrap"
            style={{ background: "var(--accent)", color: "#fff" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 30px var(--accent-glow)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.boxShadow = "none")
            }
          >
            {submitted ? (
              "Reserved ✓"
            ) : (
              <>
                Reserve
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[0.55rem] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  →
                </span>
              </>
            )}
          </button>
        </motion.form>

        <motion.p
          className="mt-4 text-[0.75rem]"
          style={{ color: "var(--text-3)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.48 }}
          viewport={{ once: true }}
        >
          No spam. Unsubscribe anytime.
        </motion.p>
      </div>
    </section>
  );
}
