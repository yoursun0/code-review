import { useEffect, useState, type ReactNode } from "react";

const LINES = [
  "fee = daysPastDue * dailyRate",
  "if daysPastDue == 1: fee *= 30",
  "limit = score * 0.82",
  "authorize(user, accountId)",
  "cache.set(accountId, balance)",
  "ALTER TABLE cards DROP COLUMN",
  "copy = 'Your card is ready'",
  "generated client from openapi",
];

export function CodeFlood({ children }: { children?: ReactNode }) {
  return (
    <div className="relative min-h-64 flex-1 overflow-hidden rounded-3xl border border-line bg-stage-2">
      {LINES.map((line, i) => (
        <p
          key={line}
          className="flow-line absolute left-0 font-mono text-sm whitespace-nowrap text-gold/80"
          style={{ top: `${8 + (i % 6) * 14}%`, animationDelay: `${i * 0.28}s` }}
        >
          {line}
        </p>
      ))}
      <div className="absolute inset-y-0 right-0 w-2/5 bg-stage/80" />
      <div className="absolute inset-y-8 right-[18%] w-1 bg-cinnabar" />
      <div className="absolute top-8 right-3 bottom-8 flex w-16 flex-col justify-end gap-1 sm:w-24">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="pile-card h-6 rounded-md border border-line bg-paper/90"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
      <div className="absolute inset-0 flex items-end p-6 sm:p-10">{children}</div>
    </div>
  );
}

const BARS = [
  { name: "2024", write: 80, review: 20, reviewClass: "bg-muted" },
  { name: "5×", write: 20, review: 80, reviewClass: "bg-gold" },
  { name: "2×", write: 70, review: 30, reviewClass: "bg-cinnabar" },
];

export function SplitBars() {
  return (
    <div className="grid min-h-80 flex-1 grid-cols-3 gap-3 sm:gap-6">
      {BARS.map((col, i) => (
        <div key={col.name} className="flex min-h-0 flex-col">
          <p className="text-center font-serif text-4xl sm:text-6xl">{col.name}</p>
          <div className="mt-4 flex min-h-0 flex-1 items-end justify-center gap-2 sm:gap-3">
            <Column pct={col.write} className="bg-paper" delay={i * 0.08} />
            <Column pct={col.review} className={col.reviewClass} delay={0.15 + i * 0.08} />
          </div>
          <div className="mt-2 flex justify-center gap-3 text-xs tracking-widest text-muted uppercase">
            <span>Write</span>
            <span>Review</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Column({ pct, className, delay }: { pct: number; className: string; delay: number }) {
  return (
    <div className="flex h-full w-8 flex-col justify-end sm:w-14">
      <div
        className={`bar-grow w-full rounded-t-2xl ${className}`}
        style={{ height: `${pct}%`, animationDelay: `${delay}s` }}
      />
    </div>
  );
}

const BEATS = [
  { n: "40%", k: "Agent opens the PR" },
  { n: "6×", k: "Since March" },
  { n: "90%", k: "Written by Claude" },
  { n: "12×", k: "Changes per day" },
];

export function NumberReel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % BEATS.length), 2400);
    return () => window.clearInterval(id);
  }, []);
  const beat = BEATS[i]!;
  return (
    <button
      type="button"
      className="flex min-h-0 flex-1 flex-col items-start justify-center text-left"
      onClick={() => setI((n) => (n + 1) % BEATS.length)}
    >
      <p key={beat.n} className="num-pop font-serif text-8xl leading-none text-gold sm:text-9xl">
        {beat.n}
      </p>
      <p className="mt-4 font-serif text-3xl sm:text-5xl">{beat.k}</p>
      <div className="mt-8 flex gap-2">
        {BEATS.map((b, idx) => (
          <span key={b.n} className={`h-2 w-8 rounded-full ${idx === i ? "bg-cinnabar" : "bg-line"}`} />
        ))}
      </div>
    </button>
  );
}

export function ThenNow() {
  return (
    <div className="grid min-h-72 flex-1 gap-4 sm:grid-cols-2">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-stage-2 p-4">
        <p className="text-sm tracking-widest text-muted uppercase">Then</p>
        <div className="mt-4 space-y-2">
          {LINES.slice(0, 8).map((line) => (
            <div key={line} className="h-3 rounded-full bg-line" style={{ width: `${55 + (line.length % 5) * 8}%` }} />
          ))}
        </div>
        <div className="scan-bar absolute right-3 left-3 h-8 rounded-md bg-cinnabar/35" />
      </div>
      <div className="flex h-full min-h-64 flex-col gap-2">
        <p className="text-sm tracking-widest text-muted uppercase">Now</p>
        <Block pct="45%" label="Rules" className="bg-paper text-ink" />
        <Block pct="30%" label="Tests" className="bg-gold text-ink" />
        <Block pct="25%" label="Judgment" className="bg-cinnabar text-paper" />
      </div>
    </div>
  );
}

function Block({ pct, label, className }: { pct: string; label: string; className: string }) {
  return (
    <div className={`bar-grow flex flex-1 items-center rounded-2xl px-4 font-serif text-2xl sm:text-3xl ${className}`}>
      <span className="mr-3 text-base">{pct}</span>
      {label}
    </div>
  );
}

const JOBS = ["Decide", "Evidence", "Sign", "Own"];

export function HumanWords() {
  return (
    <div className="grid min-h-64 flex-1 grid-cols-2 content-center gap-3">
      {JOBS.map((job, i) => (
        <p
          key={job}
          className="num-pop rounded-3xl border border-line px-4 py-8 text-center font-serif text-4xl sm:text-6xl"
          style={{ animationDelay: `${i * 0.18}s` }}
        >
          {job}
        </p>
      ))}
    </div>
  );
}

const QUESTIONS = [
  "What can machines sign?",
  "What proof is mandatory?",
  "1,500 lines. No brief.",
];

export function Questions() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % QUESTIONS.length), 4200);
    return () => window.clearInterval(id);
  }, []);
  return (
    <button type="button" className="flex flex-1 flex-col justify-center text-left" onClick={() => setI((n) => (n + 1) % QUESTIONS.length)}>
      <p className="font-serif text-6xl text-cinnabar">{i + 1}</p>
      <p key={QUESTIONS[i]} className="num-pop mt-2 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">
        {QUESTIONS[i]}
      </p>
      <div className="mt-8 flex gap-2">
        {QUESTIONS.map((q, idx) => (
          <span key={q} className={`h-2 w-8 rounded-full ${idx === i ? "bg-gold" : "bg-line"}`} />
        ))}
      </div>
    </button>
  );
}
