import { useEffect, useState } from "react";

const STEPS = [
  { id: "before", name: "Prove", phrase: "Before the pull request" },
  { id: "during", name: "Check", phrase: "Machines first" },
  { id: "merge", name: "Merge", phrase: "Humans by risk" },
  { id: "after", name: "Watch", phrase: "Then roll back" },
] as const;

export function Stages() {
  const [step, setStep] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (pinned) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % STEPS.length), 2800);
    return () => window.clearInterval(id);
  }, [pinned]);

  return (
    <div className="flex min-h-72 flex-1 flex-col justify-center">
      <div className="relative">
        <div className="absolute top-8 right-8 left-8 h-1 bg-line" />
        <div
          className="absolute top-8 left-8 h-1 bg-cinnabar"
          style={{ width: step === 0 ? "0px" : `${(step / (STEPS.length - 1)) * 78}%` }}
        />
        <div className="relative grid grid-cols-4">
          {STEPS.map((s, i) => {
            const on = i === step;
            return (
              <button key={s.id} type="button" onClick={() => { setStep(i); setPinned(true); }} className="flex flex-col items-center gap-3">
                <span
                  className={`grid h-16 w-16 place-items-center rounded-full border-2 font-serif text-xl ${
                    on ? "step-live border-cinnabar bg-cinnabar text-paper" : i < step ? "border-cinnabar bg-stage-2 text-gold" : "border-line bg-stage text-muted"
                  }`}
                >
                  {i + 1}
                </span>
                <span className={`font-serif text-2xl sm:text-4xl ${on ? "text-paper" : "text-muted"}`}>{s.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      <p key={STEPS[step].phrase} className="num-pop mt-10 text-center font-serif text-3xl text-gold sm:text-5xl">
        {STEPS[step].phrase}
      </p>
    </div>
  );
}

const CASES: { id: string; label: string; tier: "low" | "med" | "high"; why: string }[] = [
  { id: "readme", label: "One-line README typo", tier: "low", why: "Docs. No behavior change." },
  { id: "flag", label: "Copy behind a feature flag", tier: "low", why: "You can turn it off." },
  { id: "tests", label: "Tests only, no product code", tier: "low", why: "Claude Code lets this move fast." },
  { id: "cache", label: "Change the caching layer", tier: "med", why: "Sensitive. One human." },
  { id: "prompt", label: "Edit a system prompt", tier: "med", why: "It becomes a pattern." },
  { id: "fee", label: "Interest or fee calculation", tier: "high", why: "Money path. Two humans." },
  { id: "auth", label: "Login, session, or permissions", tier: "high", why: "Identity always gets a person." },
  { id: "drop", label: "Migration that drops a column", tier: "high", why: "Revert will not undo this." },
];

const TIER_LABEL = { low: "Low · 0 humans", med: "Medium · 1 human", high: "High · 2 humans" } as const;

export function RiskSort() {
  const [picks, setPicks] = useState<Record<string, "low" | "med" | "high" | null>>({});
  const correct = CASES.filter((c) => picks[c.id] === c.tier).length;

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-end">
        <p className="font-serif text-3xl text-gold">
          {correct}
          <span className="text-base text-muted">/{CASES.length}</span>
        </p>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {CASES.map((c) => {
          const pick = picks[c.id];
          const shown = pick != null;
          const ok = pick === c.tier;
          return (
            <li key={c.id} className="rounded-2xl border border-line bg-stage-2 px-3 py-2">
              <p className="font-medium">{c.label}</p>
              <div className="mt-2 flex gap-2">
                {(["low", "med", "high"] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setPicks({ ...picks, [c.id]: tier })}
                    className={`min-h-11 flex-1 rounded-xl text-sm ${
                      pick === tier
                        ? tier === "high"
                          ? "bg-cinnabar text-paper"
                          : tier === "med"
                            ? "bg-gold text-ink"
                            : "bg-paper text-ink"
                        : "bg-soft text-paper"
                    }`}
                  >
                    {tier === "low" ? "Low" : tier === "med" ? "Med" : "High"}
                  </button>
                ))}
              </div>
              {shown ? (
                <p className={`mt-2 text-sm ${ok ? "text-gold" : "text-cinnabar"}`}>
                  {ok ? "Matches" : `Their bar: ${TIER_LABEL[c.tier]}`} · {c.why}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const DUTIES = [
  { id: "why", label: "The problem", cut: 6 },
  { id: "risk", label: "Risk and off-switch", cut: 7 },
  { id: "proof", label: "Proof", cut: 8 },
  { id: "where", label: "Where to look", cut: 5 },
  { id: "size", label: "Small enough", cut: 4 },
  { id: "own", label: "I can explain it", cut: 3 },
] as const;

export function AuthorContract() {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const cuts = DUTIES.reduce((sum, d) => sum + (on[d.id] ? d.cut : 0), 0);
  const minutes = 45 - cuts;
  const ready = Object.values(on).filter(Boolean).length;

  return (
    <div className="flex min-h-0 flex-1 flex-col justify-center gap-6">
      <div className="flex items-end justify-between gap-4">
        <p className="font-serif text-8xl leading-none text-gold sm:text-9xl">{minutes}</p>
        <p className="pb-2 text-right font-serif text-2xl sm:text-4xl">minutes</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {DUTIES.map((d) => {
          const active = !!on[d.id];
          return (
            <button
              key={d.id}
              type="button"
              aria-pressed={active}
              onClick={() => setOn({ ...on, [d.id]: !active })}
              className={`min-h-11 rounded-full border px-4 text-sm sm:text-base ${
                active ? "border-gold bg-gold text-ink" : "border-line text-paper"
              }`}
            >
              {d.label}
            </button>
          );
        })}
      </div>
      <p className="max-w-xl font-serif text-2xl leading-snug sm:text-3xl">
        {ready === 0 ? "Fix stuff. Claude did it." : ready < 4 ? "Still guessing." : "Worth a seat."}
      </p>
    </div>
  );
}
