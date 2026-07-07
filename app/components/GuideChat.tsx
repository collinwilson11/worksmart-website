"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type Lenis from "lenis";

const ease = [0.22, 1, 0.36, 1] as const;

/* ─────────── THE FIELD GUIDE — a personal guide in the bottom corner ───────────
   A scripted companion, not a live model: it answers the questions every
   visitor actually asks (what we build, who it serves, cost, security, how to
   begin) in the practice's own voice, and walks the reader to the right part
   of the map. Fully client-side, so the site ships with no keys and no
   backend; the reply engine is one array, easy to swap for a real API later. */

type Reply = { text: string; link?: { label: string; href: string } };
type Msg = { id: number; role: "guide" | "user"; text: string; link?: Reply["link"] };

const EMAIL = "mailto:hello@worksmartsc.com";

const GREETING: Reply = {
  text: "Welcome in. I am the field guide for this practice. Ask me what we build, who it serves, or how an engagement runs, and I will point you to the right part of the map.",
};

const RULES: { match: RegExp; reply: Reply }[] = [
  {
    match: /^(hi|hey|hello|howdy|yo)\b/i,
    reply: {
      text: "Well met. Ask me anything about the practice: what we build, who it serves, what it costs, or how to begin.",
    },
  },
  {
    match: /secur|privacy|private|safe|confiden|nda|protect|leak|train.*model|model.*train/i,
    reply: {
      text: "Your data stays inside a private boundary. Role-based access, full lineage, and an audit trail on everything agents touch. Nothing you give us trains a public model, and the brain we build is yours, not ours.",
      link: { label: "See the architecture", href: "#build" },
    },
  },
  {
    match: /how long|timeline|how fast|how quick|duration|how many (weeks|months)/i,
    reply: {
      text: "Most teams have their first working system inside the first several weeks, and feel the compounding effect within a quarter or two of going live. The full arc depends on how deep your operation runs.",
      link: { label: "Walk the journey", href: "#journey" },
    },
  },
  {
    match: /price|pricing|cost|fee|invest|budget|charge|expensive|rate/i,
    reply: {
      text: "We don't publish a flat price list. Every engagement is scoped to your business after a first conversation. And if we are not the right fit, we will tell you that for free.",
      link: { label: "Start that conversation", href: EMAIL },
    },
  },
  {
    match: /who|fit|right for|size|revenue|arr|million|small business|local|qualif|client/i,
    reply: {
      text: "Our core is growth-stage companies, roughly five to fifty million in revenue, with real operational depth. We also keep a few seats for small Greenville-area businesses doing remarkable work. We take a small number of teams at a time, on purpose.",
      link: { label: "See who travels well", href: "#who" },
    },
  },
  {
    match: /process|journey|phase|step|roadmap|diagnose|how.*work/i,
    reply: {
      text: "The expedition runs in five stages: Diagnose, Design, Build, Train, Operate. We map where you stand first, then build foundation up. No leap of faith required at any point.",
      link: { label: "Walk the journey", href: "#journey" },
    },
  },
  {
    match: /start|begin|book|call|talk|contact|email|reach|meet|schedule/i,
    reply: {
      text: "The next step is a thirty-minute conversation. No deck. We walk through your business and tell you plainly whether we can help.",
      link: { label: "Email us", href: EMAIL },
    },
  },
  {
    match: /brain|memor|knowledge|moat|foundation|rag|retriev|vector/i,
    reply: {
      text: "The company brain is layer one: we consolidate the knowledge scattered across drives, inboxes, tickets, and systems of record into one governed retrieval layer. It is the foundation everything else reasons over, and it compounds into a moat no competitor can license.",
      link: { label: "Read about the brain", href: "#build" },
    },
  },
  {
    match: /agent|automat|workflow|chatbot|outcome/i,
    reply: {
      text: "We deploy narrow, supervised agents that own outcomes end to end: triage, drafting, reconciling, routing, reporting. Guardrails, evals, and human checkpoints. Processes that execute, not another tool to babysit.",
      link: { label: "See the architecture", href: "#build" },
    },
  },
  {
    match: /dashboard|control|interface|internal app|visib|audit/i,
    reply: {
      text: "Layer three is the human command surface: control centers, dashboards, and internal apps where your team approves, overrides, and inspects everything the agents do.",
      link: { label: "See the architecture", href: "#build" },
    },
  },
  {
    match: /train|literacy|prompt|teach|enable|adopt|learn/i,
    reply: {
      text: "We train your people to run the system themselves: AI literacy, prompting, working with agents, and troubleshooting when something drifts. We hand over the keys, not a dependency.",
      link: { label: "See the architecture", href: "#build" },
    },
  },
  {
    match: /software|tool|buy|vendor|saas|license|seat/i,
    reply: {
      text: "Buying more software adds surface area and another login. We build the intelligence underneath: your data, your processes, agents that deliver outcomes. That is the difference between renting capability and owning it.",
      link: { label: "See what we build", href: "#build" },
    },
  },
  {
    match: /build|architecture|stack|layer|offer|service|deliver/i,
    reply: {
      text: "Four layers, in order: a company brain (your data and memory, governed and private), agents and workflows that deliver outcomes on top of it, the control centers your team commands them from, and training so your people can run it all. Foundation first, always.",
      link: { label: "See the stack assemble", href: "#build" },
    },
  },
  {
    match: /where|greenville|carolina|location|remote|near/i,
    reply: {
      text: "We are based in Greenville, South Carolina, and work with teams across the Southeast and beyond. Distance has never been the hard part.",
    },
  },
];

const FALLBACK: Reply = {
  text: "That one deserves a real conversation rather than a canned answer. Send us a note and a human will reply.",
  link: { label: "Email hello@worksmartsc.com", href: EMAIL },
};

const CHIPS = [
  "What do you build?",
  "Who do you work with?",
  "How does it start?",
  "Is our data safe?",
];

function matchReply(text: string): Reply {
  for (const r of RULES) if (r.match.test(text)) return r.reply;
  return FALLBACK;
}

function Star({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
      <path
        d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z"
        fill="var(--ember)"
      />
    </svg>
  );
}

export default function GuideChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { id: 0, role: "guide", ...GREETING },
  ]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const nextId = useRef(1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* auto-scroll the thread as it grows */
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  /* focus the input when the panel opens; ESC closes */
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function send(raw: string) {
    const text = raw.trim();
    if (!text || typing) return;
    setMessages((m) => [...m, { id: nextId.current++, role: "user", text }]);
    setInput("");
    setTyping(true);
    const reply = matchReply(text);
    timer.current = setTimeout(() => {
      setMessages((m) => [...m, { id: nextId.current++, role: "guide", ...reply }]);
      setTyping(false);
    }, 550 + Math.random() * 450);
  }

  function onLinkClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const el = document.querySelector(href);
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (el && lenis) lenis.scrollTo(el as HTMLElement, { offset: -10 });
    else el?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      {/* launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="launcher"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.45, ease }}
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setOpen(true)}
            aria-label="Open the field guide"
            className="card-grain shadow-plate fixed bottom-5 right-5 z-[80] flex items-center gap-2.5 rounded-full px-5 py-3.5 cursor-pointer"
            style={{
              background:
                "linear-gradient(158deg, var(--espresso) 0%, var(--espresso-2) 100%)",
              border: "1px solid rgba(247,235,208,0.16)",
            }}
          >
            <Star />
            <span
              className="font-mono uppercase"
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.26em",
                color: "var(--card-cream)",
              }}
            >
              Ask the guide
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            role="dialog"
            aria-label="Field guide chat"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.97 }}
            transition={{ duration: 0.5, ease }}
            className="card-grain shadow-plate fixed bottom-4 right-4 z-[80] flex flex-col overflow-hidden"
            style={{
              width: "min(24rem, calc(100vw - 2rem))",
              height: "min(33rem, calc(100dvh - 6rem))",
              borderRadius: "18px",
              background:
                "linear-gradient(165deg, var(--espresso) 0%, var(--espresso-2) 100%)",
              border: "1px solid rgba(247,235,208,0.16)",
            }}
          >
            {/* header */}
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{ borderBottom: "1px solid rgba(247,235,208,0.1)" }}
            >
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
                style={{
                  background: "rgba(222,76,0,0.14)",
                  border: "1px solid rgba(222,76,0,0.3)",
                }}
              >
                <Star size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <div
                  className="font-mono uppercase"
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.3em",
                    color: "var(--ember)",
                  }}
                >
                  Field Guide
                </div>
                <div
                  className="font-serif italic truncate"
                  style={{ fontSize: "0.85rem", color: "rgba(247,235,208,0.72)" }}
                >
                  WorkSmart SC · Greenville
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close the field guide"
                className="grid h-8 w-8 place-items-center rounded-full cursor-pointer transition-colors"
                style={{ color: "rgba(247,235,208,0.6)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "var(--ember)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color =
                    "rgba(247,235,208,0.6)")
                }
              >
                <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden>
                  <path
                    d="M1 1l11 11M12 1L1 12"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* thread */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 flex flex-col gap-2.5"
            >
              {messages.map((m) =>
                m.role === "guide" ? (
                  <div
                    key={m.id}
                    className="self-start max-w-[88%] px-3.5 py-2.5"
                    style={{
                      background: "rgba(247,235,208,0.08)",
                      border: "1px solid rgba(247,235,208,0.1)",
                      borderRadius: "12px 12px 12px 4px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.85rem",
                        lineHeight: 1.55,
                        color: "rgba(255,254,251,0.9)",
                      }}
                    >
                      {m.text}
                    </p>
                    {m.link && (
                      <a
                        href={m.link.href}
                        onClick={(e) => onLinkClick(e, m.link!.href)}
                        className="mt-2 inline-block font-mono uppercase underline underline-offset-4"
                        style={{
                          fontSize: "0.6rem",
                          letterSpacing: "0.22em",
                          color: "var(--ember)",
                        }}
                      >
                        {m.link.label}
                      </a>
                    )}
                  </div>
                ) : (
                  <div
                    key={m.id}
                    className="self-end max-w-[88%] px-3.5 py-2.5"
                    style={{
                      background: "rgba(222,76,0,0.16)",
                      border: "1px solid rgba(222,76,0,0.28)",
                      borderRadius: "12px 12px 4px 12px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.85rem",
                        lineHeight: 1.5,
                        color: "var(--card-cream)",
                      }}
                    >
                      {m.text}
                    </p>
                  </div>
                )
              )}

              {typing && (
                <div
                  className="self-start flex items-center gap-1.5 px-3.5 py-3"
                  style={{
                    background: "rgba(247,235,208,0.08)",
                    border: "1px solid rgba(247,235,208,0.1)",
                    borderRadius: "12px 12px 12px 4px",
                  }}
                  aria-label="The guide is writing"
                >
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="block h-1.5 w-1.5 rounded-full"
                      style={{
                        background: "rgba(247,235,208,0.55)",
                        animation: "pulse-dot 1.2s ease-in-out infinite",
                        animationDelay: `${d * 0.18}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* suggestion chips */}
            <div className="flex flex-wrap gap-2 px-4 pb-3">
              {CHIPS.map((c) => (
                <button
                  key={c}
                  onClick={() => send(c)}
                  className="rounded-full px-3 py-1.5 font-mono uppercase cursor-pointer transition-colors"
                  style={{
                    fontSize: "0.56rem",
                    letterSpacing: "0.18em",
                    color: "rgba(247,235,208,0.66)",
                    border: "1px solid rgba(247,235,208,0.16)",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = "var(--ember)";
                    el.style.borderColor = "rgba(222,76,0,0.45)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = "rgba(247,235,208,0.66)";
                    el.style.borderColor = "rgba(247,235,208,0.16)";
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center"
              style={{ borderTop: "1px solid rgba(247,235,208,0.1)" }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about the route..."
                aria-label="Ask the field guide a question"
                className="min-w-0 flex-1 bg-transparent px-4 py-3.5 outline-none"
                style={{
                  fontSize: "0.88rem",
                  color: "var(--cream)",
                  caretColor: "var(--ember)",
                }}
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!input.trim() || typing}
                className="m-2 grid h-9 w-9 shrink-0 place-items-center rounded-full cursor-pointer transition-opacity disabled:opacity-35 disabled:cursor-default"
                style={{ background: "var(--ember)", color: "var(--cream)" }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                  <path
                    d="M1 6h10M6.5 1.5L11 6l-4.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
