"use client";

import { motion } from "motion/react";

const ease = [0.32, 0.72, 0, 1] as const;

const templates = [
  { category: "Smart Home", name: "Goodnight Routine", desc: "Locks, lights off, alarm on, thermostat set — done in one press." },
  { category: "Productivity", name: "Deep Work Mode", desc: "Silence notifications, start Pomodoro timer, open focus apps." },
  { category: "AI", name: "Morning Briefing", desc: "Reads your calendar, emails, and top news highlights out loud." },
  { category: "Health", name: "Hydration Log", desc: "Logs a glass of water and nudges you toward your daily goal." },
  { category: "Media", name: "Watch Party", desc: "Dims lights, closes blinds, launches your streaming service." },
  { category: "Communication", name: "Quick Update", desc: "Sends a pre-written status message to your team or family." },
  { category: "Custom", name: "Build Your Own", desc: "Start from scratch with the visual flow editor. No limits." },
];

export default function Templates() {
  return (
    <section
      id="templates"
      className="py-32 md:py-40"
      style={{
        background: "var(--surface-2)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="max-w-[82rem] mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <motion.div
            initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <span className="eyebrow mb-7 inline-flex">Template Library</span>
            <h2
              className="font-display font-extrabold tracking-[-0.025em] leading-[1.04]"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "var(--text-1)" }}
            >
              Start from a template.
              <br />
              Build from scratch.
            </h2>
          </motion.div>

          <motion.a
            href="#"
            className="hidden md:flex items-center gap-2 font-light text-[0.875rem] rounded-full px-5 py-2.5 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] whitespace-nowrap shrink-0"
            style={{
              border: "1px solid rgba(0,0,0,0.1)",
              color: "var(--text-2)",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            viewport={{ once: true }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,0,0,0.22)";
              (e.currentTarget as HTMLElement).style.color = "var(--text-1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,0,0,0.1)";
              (e.currentTarget as HTMLElement).style.color = "var(--text-2)";
            }}
          >
            Browse all 100+ →
          </motion.a>
        </div>

        <motion.div
          className="flex gap-3 mt-12 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none" }}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease }}
          viewport={{ once: true, margin: "-60px" }}
        >
          {templates.map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-60 group cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1.5"
            >
              {/* Double-bezel outer */}
              <div
                className="h-full p-1.5 rounded-[1.75rem] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:border-[rgba(0,184,158,0.3)]"
                style={{
                  background: "rgba(0,0,0,0.02)",
                  border: "1px solid rgba(0,0,0,0.07)",
                }}
              >
                {/* Double-bezel inner */}
                <div
                  className="rounded-[calc(1.75rem-0.375rem)] p-5"
                  style={{
                    background: "var(--surface)",
                    boxShadow: "inset 0 1px 2px rgba(255,255,255,0.9), 0 1px 2px rgba(0,0,0,0.03)",
                  }}
                >
                  <div
                    className="text-[0.6rem] font-semibold tracking-[0.22em] uppercase mb-2.5"
                    style={{ color: "var(--accent)" }}
                  >
                    {t.category}
                  </div>
                  <div className="font-display font-bold text-[0.9875rem] mb-2 leading-snug" style={{ color: "var(--text-1)" }}>
                    {t.name}
                  </div>
                  <div className="text-[0.8rem] font-light leading-relaxed" style={{ color: "var(--text-2)" }}>
                    {t.desc}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
