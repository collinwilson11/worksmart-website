"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Nav from "../components/Nav";
import GuideChat from "../components/GuideChat";
import ScrollCompass from "../components/ScrollCompass";
import { RunningHead, RiseLines, Reveal, Footer } from "../components/Sections";

const ease = [0.22, 1, 0.36, 1] as const;
const EMAIL = "mailto:hello@worksmartsc.com";

function SolutionIcon({ name }: { name: string }) {
  const common = {
    width: 32, height: 32, viewBox: "0 0 40 40", fill: "none",
    stroke: "var(--card-cream)", strokeWidth: 1.5,
    strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "os":
      return (<svg {...common}><rect x="5" y="7" width="30" height="26" rx="3" /><line x1="5" y1="14.5" x2="35" y2="14.5" /><line x1="16" y1="14.5" x2="16" y2="33" /><circle cx="9" cy="10.7" r="0.9" fill="var(--ember)" stroke="none" /></svg>);
    case "dash":
      return (<svg {...common}><path d="M7 27 A13 13 0 0 1 33 27" /><line x1="11" y1="27" x2="11.5" y2="24" /><line x1="29" y1="27" x2="28.5" y2="24" /><line x1="20" y1="27" x2="26" y2="18" stroke="var(--ember)" /><circle cx="20" cy="27" r="2" fill="var(--ember)" stroke="none" /></svg>);
    case "app":
      return (<svg {...common}><rect x="13" y="5" width="14" height="30" rx="3" /><line x1="17.5" y1="31" x2="22.5" y2="31" /><circle cx="20" cy="13" r="2.4" stroke="var(--ember)" /></svg>);
    case "agent":
      return (<svg {...common}><path d="M20 6 L22.6 17.4 L34 20 L22.6 22.6 L20 34 L17.4 22.6 L6 20 L17.4 17.4 Z" stroke="var(--ember)" /><circle cx="20" cy="20" r="2" fill="var(--card-cream)" stroke="none" /></svg>);
    case "knowledge":
      return (<svg {...common}><path d="M20 6 L34 12.5 L20 19 L6 12.5 Z" /><path d="M6 19.5 L20 26 L34 19.5" stroke="var(--ember)" /><path d="M6 26.5 L20 33 L34 26.5" /></svg>);
    default:
      return null;
  }
}

const STEPS = [
  { n: "01", t: "Find the one", d: "We pinpoint the single highest-return priority in your business, the one fix that buys back the most time or money." },
  { n: "02", t: "Build it, you watch", d: "We build that first and put it live in your own operation. You see it working before a single invoice." },
  { n: "03", t: "Pay, then grow", d: "You only pay once it delivers. Then, if it earns its place, we build out from there, one win at a time." },
];

const GENERIC = [
  "Knows nothing about your business.",
  "Answers from a canned script, not your prices or history.",
  "You wire it up and babysit it yourself.",
  "One more subscription, locked to someone else's roadmap.",
  "Sounds like every other bot in your industry.",
];
const OURS = [
  "Trained on your services, pricing, history, and voice.",
  "Wired into the calendar, inbox, and records you already use.",
  "We build it, connect it, and look after it.",
  "You own it, and it gets sharper the more it works.",
  "Fits how you actually operate, because we built it around you.",
];

const BUILDS = [
  { icon: "os", k: "Your operating system", v: "One place to run the business: jobs, customers, schedule, and money, instead of six tabs and a whiteboard." },
  { icon: "dash", k: "Live dashboards", v: "The handful of numbers that actually matter, updating themselves, on your phone and your wall." },
  { icon: "app", k: "Internal apps & tools", v: "Intake forms, quoting tools, job trackers, built for your exact workflow, not bent around someone else's." },
  { icon: "agent", k: "Agents that do the work", v: "Scheduling, quoting, follow-up, and intake, handled end to end, with you approving anything that matters." },
  { icon: "knowledge", k: "Your knowledge, structured", v: "How you price, decide, and get the work done, captured so it no longer lives in one person's head." },
];

const TRUST = [
  { k: "Every owner, same respect", v: "A two-person shop or a regional operation, you get the same care, candor, and craft." },
  { k: "Trust before change", v: "Bringing AI into your business is a big deal. We earn your confidence before we touch how you operate." },
  { k: "Plain language", v: "No jargon, no black boxes. We walk you through every piece in words that mean something." },
  { k: "Most return, least waste", v: "Together we find the most cost-effective plan for the biggest return, then sequence it." },
];

const cardHover = { y: -6, boxShadow: "0 22px 46px -18px rgba(222,76,0,0.45)" };

export default function SmallBusinessPage() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const paintingY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <>
      <Nav />
      <main>
        {/* ════════ HERO — the general store on the trail ════════ */}
        <section ref={heroRef} className="relative overflow-hidden" style={{ background: "#EFD6A8" }}>
          {/* the painting fills the hero on every size, drifting gently */}
          <motion.div aria-hidden className="absolute inset-0 select-none" style={{ y: paintingY, scale: 1.06 }}>
            <Image src="/illustrations/general-store.png" alt="" fill priority sizes="100vw" className="object-cover" style={{ objectPosition: "68% 46%" }} />
          </motion.div>
          {/* mobile/tablet: veil the whole scene so the words read clearly on top */}
          <div aria-hidden className="absolute inset-0 xl:hidden" style={{ background: "linear-gradient(to bottom, rgba(239,214,168,0.66) 0%, rgba(239,214,168,0.82) 60%, #EFD6A8 100%)" }} />
          {/* desktop: left-to-right scrim, the store stays clear on the right */}
          <div aria-hidden className="absolute inset-0 hidden xl:block" style={{ background: "linear-gradient(100deg, #EFD6A8 0%, #EFD6A8 32%, rgba(239,214,168,0.62) 50%, rgba(239,214,168,0) 70%)" }} />
          {/* bottom fade into the page parchment */}
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 md:h-32" style={{ background: "linear-gradient(to top, #EFD6A8 0%, rgba(239,214,168,0) 100%)" }} />

          <div className="relative mx-auto w-full max-w-[1340px] px-6 xl:px-14 flex items-center min-h-[86vh] pt-36 pb-16 xl:pt-28">
            <div className="xl:max-w-[33rem]">
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="font-mono uppercase mb-6" style={{ fontSize: "0.62rem", letterSpacing: "0.34em", color: "var(--ember)" }}>
                  For small business · Greenville, SC
                </motion.div>
                <RiseLines
                  delay={0.06}
                  className="font-serif font-light leading-[0.94] tracking-[-0.01em] text-balance"
                  style={{ fontSize: "clamp(2.6rem, 5.4vw, 5.4rem)", color: "var(--text-1)", maxWidth: "16ch" }}
                  lines={[
                    <span key="a">Big-company tools,</span>,
                    <span key="b">built for the{" "}<em className="not-italic" style={{ color: "var(--ember)", fontStyle: "italic" }}>shop down the street.</em></span>,
                  ]}
                />
                <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5, ease }} className="mt-7 font-serif italic text-pretty" style={{ fontSize: "clamp(1.1rem, 1.5vw, 1.4rem)", lineHeight: 1.5, color: "var(--text-1)", maxWidth: "40ch" }}>
                  We are not here to sell you a tool and vanish. We build the one
                  thing that moves your business most, earn your trust, and grow
                  with you from there.
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.64, ease }} className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                  <motion.a href={EMAIL} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 22 }} className="group inline-flex items-center gap-3 rounded-full px-7 py-3.5 font-sans font-semibold tracking-wide" style={{ background: "var(--ember)", color: "var(--cream)", fontSize: "0.95rem", boxShadow: "0 4px 18px rgba(222,76,0,0.25)" }}>
                    See what we&apos;d build for you
                    <span className="grid h-7 w-7 place-items-center rounded-full transition-transform duration-500 group-hover:translate-x-0.5" style={{ background: "rgba(0,0,0,0.18)" }}>
                      <svg width="11" height="11" viewBox="0 0 11 11"><path d="M1 5.5h9M5.5 1l4.5 4.5L5.5 10" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  </motion.a>
                  <Link href="/" className="font-mono uppercase" style={{ fontSize: "0.62rem", letterSpacing: "0.28em", color: "var(--text-3)" }}>Back to the main guide</Link>
                </motion.div>
              </div>
            </div>
        </section>

        {/* ════════ HOW WE START — warm parchment, bridges from the hero ════════ */}
        <section className="relative overflow-hidden py-20 md:py-28" style={{ background: "#EFD6A8" }}>
          <RunningHead left="How we start" right="One solution first" />
          <div className="mx-auto max-w-[1180px] px-6 md:px-14 mt-12">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:items-end">
              <RiseLines
                className="font-serif font-light leading-[0.98] tracking-[-0.01em] text-balance"
                style={{ fontSize: "clamp(2.3rem, 4.6vw, 4.2rem)", color: "var(--text-1)", maxWidth: "15ch" }}
                lines={[
                  <span key="a">We start with one solution.</span>,
                  <span key="b">You don&apos;t pay until it{" "}<em className="not-italic" style={{ color: "var(--ember)", fontStyle: "italic" }}>works.</em></span>,
                ]}
              />
              <Reveal delay={0.1}>
                <p className="font-serif italic text-pretty" style={{ fontSize: "clamp(1.05rem, 1.4vw, 1.3rem)", lineHeight: 1.55, color: "var(--text-2)", maxWidth: "42ch" }}>
                  No big bang. No leap of faith. No year-long contract before you
                  see a result. We prove the value, then we earn the next step.
                </p>
              </Reveal>
            </div>

            <div className="mt-14 grid gap-px sm:grid-cols-3" style={{ background: "var(--sepia)", border: "1px solid var(--sepia)", borderRadius: "16px", overflow: "hidden" }}>
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 0.1} className="p-7 md:p-8" style={{ background: "#EFD6A8" }}>
                  <div className="font-serif italic" style={{ fontSize: "2.4rem", lineHeight: 1, color: "var(--ember)" }}>{s.n}</div>
                  <h3 className="mt-4 font-serif font-light leading-[1.1]" style={{ fontSize: "clamp(1.3rem, 1.9vw, 1.6rem)", color: "var(--text-1)" }}>{s.t}</h3>
                  <p className="mt-2.5 text-pretty" style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "var(--text-2)" }}>{s.d}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ════════ OFF-THE-SHELF vs BUILT — the workshop goes dark ════════ */}
        <section className="relative overflow-hidden py-20 md:py-28" style={{ background: "linear-gradient(to bottom, #1A130C 0%, #17110B 100%)" }}>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-44" style={{ background: "linear-gradient(to bottom, #EFD6A8 0%, rgba(26,19,12,0) 100%)" }} />
          <div className="relative">
            <RunningHead left="The difference" right="Off-the-shelf vs. built" tone="light" />
            <div className="mx-auto max-w-[1180px] px-6 md:px-14 mt-12">
              <RiseLines
                className="font-serif font-light leading-[0.98] tracking-[-0.01em] text-balance"
                style={{ fontSize: "clamp(2.1rem, 4.2vw, 3.8rem)", color: "var(--card-cream)", maxWidth: "22ch" }}
                lines={[
                  <span key="a">A chatbot answers questions.</span>,
                  <span key="b">We build the thing that{" "}<em className="not-italic" style={{ color: "var(--ember)", fontStyle: "italic" }}>does the work.</em></span>,
                ]}
              />
              <Reveal delay={0.1}>
                <p className="mt-6 font-serif italic text-pretty" style={{ fontSize: "clamp(1.05rem, 1.4vw, 1.3rem)", lineHeight: 1.55, color: "rgba(247,235,208,0.8)", maxWidth: "56ch" }}>
                  Most small businesses get sold a generic AI receptionist or a
                  bolt-on chatbot. Here is the difference between renting one of
                  those and owning something built around you.
                </p>
              </Reveal>

              <div className="mt-12 grid gap-5 md:grid-cols-2 md:gap-6">
                <Reveal className="p-7 md:p-9 rounded-[18px]" style={{ background: "rgba(247,235,208,0.04)", border: "1px solid rgba(247,235,208,0.12)" }}>
                  <div className="font-mono uppercase" style={{ fontSize: "0.58rem", letterSpacing: "0.28em", color: "rgba(247,235,208,0.5)" }}>The off-the-shelf option</div>
                  <h3 className="mt-3 mb-5 font-serif font-light leading-[1.05]" style={{ fontSize: "clamp(1.5rem, 2.2vw, 1.95rem)", color: "rgba(247,235,208,0.85)" }}>A generic bot</h3>
                  <ul className="flex flex-col">
                    {GENERIC.map((line, i) => (
                      <li key={line} className="grid grid-cols-[1.2rem_1fr] gap-x-3 py-3" style={{ borderTop: "1px solid rgba(247,235,208,0.09)" }}>
                        <span aria-hidden className="pt-0.5" style={{ color: "rgba(247,235,208,0.4)" }}><svg width="13" height="13" viewBox="0 0 13 13"><path d="M3 3l7 7M10 3l-7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg></span>
                        <span style={{ fontSize: "0.95rem", lineHeight: 1.5, color: "rgba(247,235,208,0.66)" }}>{line}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
                <Reveal delay={0.1} className="card-grain shadow-plate p-7 md:p-9 rounded-[18px]" style={{ background: "linear-gradient(158deg, #FBF1D8 0%, #F3E3BE 100%)", border: "1.5px solid rgba(222,76,0,0.4)" }}>
                  <div className="font-mono uppercase" style={{ fontSize: "0.58rem", letterSpacing: "0.28em", color: "var(--ember)" }}>What we build</div>
                  <h3 className="mt-3 mb-5 font-serif font-light leading-[1.05]" style={{ fontSize: "clamp(1.5rem, 2.2vw, 1.95rem)", color: "var(--text-1)" }}>A system that knows you</h3>
                  <ul className="flex flex-col">
                    {OURS.map((line, i) => (
                      <li key={line} className="grid grid-cols-[1.2rem_1fr] gap-x-3 py-3" style={{ borderTop: "1px solid var(--sepia)" }}>
                        <span aria-hidden className="pt-0.5" style={{ color: "var(--ember)" }}><svg width="13" height="13" viewBox="0 0 13 13"><path d="M2 7l3.2 3.2L11 3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                        <span style={{ fontSize: "0.95rem", lineHeight: 1.5, color: "var(--text-2)" }}>{line}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>

              <Reveal delay={0.1} className="mt-6 p-7 md:p-10 rounded-[18px]" style={{ background: "rgba(20,15,9,0.4)", border: "1px solid rgba(247,235,208,0.12)" }}>
                <div className="font-mono uppercase mb-4" style={{ fontSize: "0.58rem", letterSpacing: "0.28em", color: "var(--ember)" }}>A booking comes in, after hours</div>
                <p className="font-serif italic text-pretty" style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.45rem)", lineHeight: 1.5, color: "var(--card-cream)", maxWidth: "66ch" }}>
                  The generic receptionist takes a message and drops a slot on a
                  calendar. What we build reads the request, checks your real
                  availability, quotes the service from your price list, texts you
                  for a one-tap yes or no, then books it, logs the customer, and
                  sends the confirmation. Same moment. Entirely different outcome.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ════════ WHAT WE BUILD FOR YOU ════════ */}
        <section className="relative overflow-hidden py-20 md:py-28" style={{ background: "linear-gradient(to bottom, #17110B 0%, #1C150D 100%)" }}>
          <div className="relative">
            <RunningHead left="What you can have" right="More than you think" tone="light" />
            <div className="mx-auto max-w-[1180px] px-6 md:px-14 mt-12">
              <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:items-end">
                <RiseLines
                  className="font-serif font-light leading-[0.96] tracking-[-0.01em] text-balance"
                  style={{ fontSize: "clamp(2.2rem, 4vw, 3.6rem)", color: "var(--card-cream)", maxWidth: "16ch" }}
                  lines={[
                    <span key="a">Custom is not</span>,
                    <span key="b">just for the{" "}<em className="not-italic" style={{ color: "var(--ember)", fontStyle: "italic" }}>big guys.</em></span>,
                  ]}
                />
                <Reveal delay={0.1}>
                  <p className="font-serif italic text-pretty" style={{ fontSize: "clamp(1.05rem, 1.35vw, 1.28rem)", lineHeight: 1.5, color: "rgba(247,235,208,0.78)", maxWidth: "40ch" }}>
                    Real software, built around how you work, at a scale that fits
                    a small business. Here is what that can look like.
                  </p>
                </Reveal>
              </div>

              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
                {BUILDS.map((b, i) => (
                  <Reveal key={b.k} delay={(i % 3) * 0.06} whileHover={cardHover} className="card-grain shadow-plate p-7 rounded-[16px] flex flex-col cursor-default" style={{ background: "linear-gradient(158deg, var(--espresso) 0%, var(--espresso-2) 100%)", border: "1px solid rgba(247,235,208,0.14)" }}>
                    <span style={{ color: "var(--card-cream)" }}><SolutionIcon name={b.icon} /></span>
                    <h3 className="mt-5 font-serif font-light leading-[1.1]" style={{ fontSize: "clamp(1.3rem, 1.8vw, 1.55rem)", color: "var(--card-cream)" }}>{b.k}</h3>
                    <p className="mt-2.5 text-pretty" style={{ fontSize: "0.92rem", lineHeight: 1.6, color: "rgba(247,235,208,0.68)" }}>{b.v}</p>
                  </Reveal>
                ))}
                <Reveal delay={0.12} className="p-7 rounded-[16px] flex flex-col justify-center" style={{ background: "rgba(222,76,0,0.09)", border: "1px solid rgba(222,76,0,0.32)" }}>
                  <p className="font-serif italic text-pretty" style={{ fontSize: "clamp(1.2rem, 1.6vw, 1.5rem)", lineHeight: 1.35, color: "var(--card-cream)" }}>Built to your budget, in the order that pays off fastest.</p>
                  <a href={EMAIL} className="mt-4 inline-flex items-center gap-2 font-mono uppercase transition-transform duration-300 hover:translate-x-1 w-fit" style={{ fontSize: "0.6rem", letterSpacing: "0.24em", color: "var(--ember)" }}>
                    Ask what yours could look like
                    <svg width="12" height="9" viewBox="0 0 12 9"><path d="M1 4.5h9M6.5 1L10.5 4.5L6.5 8" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </a>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ TRUST — slate twilight ════════ */}
        <section className="relative overflow-hidden py-20 md:py-28" style={{ background: "linear-gradient(172deg, #2A3A40 0%, #243338 60%, #1E2B30 100%)" }}>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-28" style={{ background: "linear-gradient(to bottom, #1C150D 0%, rgba(28,21,13,0) 100%)" }} />
          <div className="relative">
            <RunningHead left="Our promise" right="Earned, not sold" tone="light" />
            <div className="mx-auto max-w-[1180px] px-6 md:px-14 mt-12">
              <RiseLines
                className="font-serif font-light leading-[0.98] tracking-[-0.01em] text-balance mx-auto text-center"
                style={{ fontSize: "clamp(2.1rem, 4vw, 3.6rem)", color: "var(--card-cream)", maxWidth: "24ch" }}
                lines={[
                  <span key="a">Most AI sellers want the sale.</span>,
                  <span key="b">We want to{" "}<em className="not-italic" style={{ color: "var(--ember)", fontStyle: "italic" }}>earn your trust.</em></span>,
                ]}
              />
              <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {TRUST.map((t, i) => (
                  <Reveal key={t.k} delay={(i % 4) * 0.07} style={{ borderTop: "2px solid rgba(222,76,0,0.5)", paddingTop: "1.2rem" }}>
                    <h3 className="font-serif font-light leading-[1.15]" style={{ fontSize: "clamp(1.2rem, 1.7vw, 1.45rem)", color: "var(--card-cream)" }}>{t.k}</h3>
                    <p className="mt-2.5 text-pretty" style={{ fontSize: "0.92rem", lineHeight: 1.6, color: "rgba(247,235,208,0.66)" }}>{t.v}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════ CTA — campfire night ════════ */}
        <section className="relative overflow-hidden py-28 md:py-36 px-6 text-center" style={{ background: "linear-gradient(to bottom, #1E2B30 0%, #1C150D 46%, #18110a 100%)" }}>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-28" style={{ background: "linear-gradient(to bottom, #1E2B30 0%, rgba(28,21,13,0) 100%)" }} />
          <div className="relative mx-auto max-w-[46rem]">
            <RiseLines
              className="font-serif font-light leading-[1.0] tracking-[-0.01em] text-balance mx-auto"
              style={{ fontSize: "clamp(2.4rem, 4.6vw, 4.6rem)", color: "var(--card-cream)", maxWidth: "20ch" }}
              lines={[
                <span key="a">Tell us about</span>,
                <span key="b">your{" "}<em className="not-italic" style={{ color: "var(--ember)", fontStyle: "italic" }}>business.</em></span>,
              ]}
            />
            <Reveal delay={0.1}>
              <p className="mt-7 font-serif italic mx-auto text-pretty" style={{ fontSize: "clamp(1.05rem, 1.3vw, 1.28rem)", lineHeight: 1.55, color: "rgba(247,235,208,0.8)", maxWidth: "48ch" }}>
                A thirty-minute conversation, no deck, no pressure. Tell us how the
                work gets done today, and we will tell you honestly what we would
                build first and what it would take.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-10 flex justify-center">
              <motion.a href={EMAIL} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 22 }} className="group inline-flex items-center gap-3 rounded-full px-8 py-4 font-sans font-semibold tracking-wide" style={{ background: "var(--ember)", color: "var(--cream)", fontSize: "0.98rem", boxShadow: "0 4px 18px rgba(222,76,0,0.25)" }}>
                Start the conversation
                <span className="grid h-7 w-7 place-items-center rounded-full transition-transform duration-500 group-hover:translate-x-0.5" style={{ background: "rgba(0,0,0,0.18)" }}>
                  <svg width="11" height="11" viewBox="0 0 11 11"><path d="M1 5.5h9M5.5 1l4.5 4.5L5.5 10" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </motion.a>
            </Reveal>
          </div>
        </section>

        <Footer />
      </main>
      <GuideChat />
      <ScrollCompass />
    </>
  );
}
