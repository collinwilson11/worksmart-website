export default function Footer() {
  return (
    <footer
      className="py-8 px-4 md:px-8 max-w-[82rem] mx-auto flex flex-wrap items-center justify-between gap-4"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <span
        className="font-display font-extrabold tracking-[-0.02em]"
        style={{ color: "var(--text-1)" }}
      >
        CLiKR<span style={{ color: "var(--accent)" }}>AI</span>
      </span>
      <span className="text-[0.8rem]" style={{ color: "var(--text-3)" }}>
        © 2025 CLiKR AI. All rights reserved.
      </span>
      <div className="flex gap-5">
        {["Privacy", "Terms"].map((l) => (
          <a
            key={l}
            href="#"
            className="text-[0.8rem] transition-colors duration-300"
            style={{ color: "var(--text-3)" }}
          >
            {l}
          </a>
        ))}
      </div>
    </footer>
  );
}
