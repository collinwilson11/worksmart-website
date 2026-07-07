"use client";

import { motion } from "motion/react";

const ease = [0.32, 0.72, 0, 1] as const;

const cases = [
  {
    icon: "⌂",
    title: "Smart Home Control",
    body: "One press dims every light, locks every door, and arms the alarm — your full evening routine, done.",
    tags: ["Lights", "Thermostat", "Security", "Locks"],
    col: "md:col-span-5",
    row: "md:row-span-2",
  },
  {
    icon: "✦",
    title: "AI Shortcut",
    body: "Trigger your AI assistant, fire a prompt, or summarize your last 10 emails — hands-free, instantly.",
    tags: [],
    col: "md:col-span-7",
    row: "",
  },
  {
    icon: "◈",
    title: "Focus Mode",
    body: "Block distractions, start a Pomodoro, silence all notifications. One press, total focus.",
    tags: [],
    col: "md:col-span-4",
    row: "",
  },
  {
    icon: "▷",
    title: "Media Control",
    body: "Play, pause, skip tracks — hands-free from anywhere in the room.",
    tags: [],
    col: "md:col-span-3",
    row: "",
  },
  {
    icon: "⚙",
    title: "Custom Workflows",
    body: "Build multi-step automations with conditions, delays, and branching logic using the visual flow editor.",
    tags: [],
    col: "md:col-span-8",
    row: "",
    workflow: true,
  },
  {
    icon: "◇",
    title: "Health Reminders",
    body: "Log water intake, trigger stretch reminders, or send medication alerts on demand.",
    tags: [],
    col: "md:col-span-4",
    row: "",
  },
];

export default function UseCases() {
  return (
    <section
      id="use-cases"
      className="py-32 md:py-40 px-4 md:px-8 max-w-[82rem] mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease }}
        viewport={{ once: true, margin: "-80px" }}
      >
        <span className="eyebrow mb-7 inline-flex">Use Cases</span>
        <h2
          className="font-display font-extrabold tracking-[-0.025em] leading-[1.04]"
          style={{ fontSize: "clamp(2.75rem, 5.5vw, 4.5rem)", color: "var(--text-1)" }}
        >
          What will you
          <br />
          press it for?
        </h2>
        <p className="mt-4 font-light leading-relaxed max-w-md text-[1.05rem]" style={{ color: "var(--text-2)" }}>
          CLiKR AI adapts to every corner of your life. Here&apos;s what people are building.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-16">
        {cases.map((c, i) => (
          <motion.div
            key={i}
            className={`col-span-1 ${c.col} ${c.row}`}
            initial={{ opacity: 0, y: 36, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.85, delay: i * 0.065, ease }}
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Double-bezel outer */}
            <div
              className="group h-full p-1.5 rounded-[2rem] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{
                background: "rgba(0,0,0,0.02)",
                border: "1px solid rgba(0,0,0,0.07)",
              }}
            >
              {/* Double-bezel inner */}
              <div
                className="relative h-full rounded-[calc(2rem-0.375rem)] p-7 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                style={{
                  background: "var(--surface)",
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.04)",
                  border: "1px solid transparent",
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none rounded-[calc(2rem-0.375rem)] transition-opacity duration-700"
                  style={{
                    background: "radial-gradient(circle at 28% 24%, rgba(0,184,158,0.04) 0%, transparent 58%)",
                  }}
                />

                <div className="relative z-10 h-full flex flex-col">
                  <span
                    className="text-xl mb-5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "var(--accent-dim)",
                      border: "1px solid rgba(0,184,158,0.18)",
                    }}
                  >
                    {c.icon}
                  </span>

                  <h3 className="font-display font-bold text-[1.1rem] mb-2" style={{ color: "var(--text-1)" }}>
                    {c.title}
                  </h3>
                  <p className="font-light text-[0.875rem] leading-relaxed flex-1" style={{ color: "var(--text-2)" }}>
                    {c.body}
                  </p>

                  {c.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-5">
                      {c.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[0.6875rem] font-light px-2.5 py-1 rounded-full"
                          style={{ border: "1px solid rgba(0,0,0,0.08)", color: "var(--text-2)" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {c.workflow && (
                    <div className="flex flex-col gap-2 mt-5">
                      <div className="h-px rounded-full" style={{ background: "var(--accent)", width: "72%", opacity: 0.5 }} />
                      <div className="h-px rounded-full" style={{ background: "rgba(0,0,0,0.08)", width: "48%" }} />
                      <div className="h-px rounded-full" style={{ background: "rgba(0,0,0,0.08)", width: "64%" }} />
                      <div className="h-px rounded-full" style={{ background: "rgba(0,0,0,0.05)", width: "38%" }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
