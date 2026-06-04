import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Line =
  | { kind: "cmd"; text: string }
  | { kind: "out"; text: string }
  | { kind: "links" };

const SCRIPT: Line[] = [
  { kind: "cmd", text: "whoami" },
  { kind: "out", text: "TheFirstIstari" },
  { kind: "cmd", text: "ls ~/links" },
  { kind: "links" },
];

const LINKS = [
  { label: "github", href: "https://github.com/TheFirstIstari", color: "var(--accent)" },
  { label: "projects", href: "/projects", color: "var(--accent)" },
  { label: "youtube", href: "https://www.youtube.com/@TheFirstIstari", color: "var(--accent-2)" },
  { label: "instagram", href: "https://instagram.com/TheFirstIstari", color: "var(--accent-2)" },
];

function useTypewriter(reduced: boolean) {
  // step = index into SCRIPT currently being revealed
  const [step, setStep] = useState(reduced ? SCRIPT.length : 0);
  const [typed, setTyped] = useState("");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (reduced || step >= SCRIPT.length) return;
    const line = SCRIPT[step];

    if (line.kind === "cmd") {
      if (typed.length < line.text.length) {
        timer.current = window.setTimeout(
          () => setTyped(line.text.slice(0, typed.length + 1)),
          38,
        );
      } else {
        timer.current = window.setTimeout(() => {
          setTyped("");
          setStep((s) => s + 1);
        }, 360);
      }
    } else {
      // output / links appear instantly, brief pause, advance
      timer.current = window.setTimeout(() => setStep((s) => s + 1), 220);
    }
    return () => window.clearTimeout(timer.current);
  }, [step, typed, reduced]);

  return { step, typed };
}

function Prompt() {
  return (
    <span style={{ color: "var(--prompt)" }}>
      <span style={{ opacity: 0.55 }}>tweak.wiki</span>
      <span style={{ color: "var(--accent-2)" }}> ❯ </span>
    </span>
  );
}

export default function Hero() {
  const reduced = useReducedMotion() ?? false;
  const { step, typed } = useTypewriter(reduced);

  const renderLine = (line: Line, i: number) => {
    const visible = i < step;
    const active = i === step;
    if (!visible && !active) return null;

    if (line.kind === "cmd") {
      return (
        <div key={i} className="whitespace-pre-wrap break-words">
          <Prompt />
          <span style={{ color: "var(--text)" }}>{active ? typed : line.text}</span>
          {active && <span className="cursor-blink">&nbsp;</span>}
        </div>
      );
    }
    if (line.kind === "out") {
      return (
        <div
          key={i}
          className="whitespace-pre-wrap break-words pl-1"
          style={{ color: "var(--text-muted)" }}
        >
          {line.text}
        </div>
      );
    }
    // links
    return (
      <div key={i} className="flex flex-wrap gap-2 pt-1 pb-1">
        {LINKS.map((l, li) => (
          <motion.a
            key={l.label}
            href={l.href}
            target={l.href.startsWith("http") ? "_blank" : undefined}
            rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * li }}
            whileHover={{ y: -2 }}
            className="px-3 py-1.5 text-sm transition-colors"
            style={{
              border: "1px solid var(--border)",
              borderRadius: 6,
              color: l.color,
            }}
          >
            <span style={{ opacity: 0.5 }}>[</span> {l.label}{" "}
            <span style={{ opacity: 0.5 }}>]</span>
          </motion.a>
        ))}
      </div>
    );
  };

  return (
    <section className="relative z-10 min-h-[88vh] flex items-center justify-center px-4 pt-24 pb-12">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-3xl"
      >
        {/* Terminal window */}
        <div
          className="relative overflow-hidden rounded-xl"
          style={{
            background: "color-mix(in srgb, var(--bg-secondary) 70%, transparent)",
            border: "1px solid var(--border)",
            boxShadow: "0 24px 80px -20px rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-2 px-4 py-2.5"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <span className="w-3 h-3 rounded-full" style={{ background: "#e06b82" }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "#e3b341" }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "#2dd4bf" }} />
            <span
              className="ml-3 text-xs"
              style={{ color: "var(--text-faint)" }}
            >
              thefirstistari — zsh — 80×24
            </span>
          </div>

          {/* Scanline sweep */}
          {!reduced && (
            <div
              className="pointer-events-none absolute inset-0 z-20"
              aria-hidden="true"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(45,212,191,0.06), transparent)",
                height: "40%",
                animation: "scan 6s linear infinite",
                mixBlendMode: "screen",
              }}
            />
          )}

          {/* Body */}
          <div className="relative z-10 p-5 md:p-7 text-[0.95rem] md:text-base leading-7 space-y-1.5">
            {SCRIPT.map(renderLine)}
            {step >= SCRIPT.length && (
              <div>
                <Prompt />
                <span className="cursor-blink">&nbsp;</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
