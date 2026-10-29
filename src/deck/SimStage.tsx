import { useMemo, useState } from "react";
import { simulate, TEAM, fmt, type SimInput } from "@/deck/model";

const DEFAULTS: SimInput = { highs: 5, brief: false, triage: false, fear: true };

export function SimStage() {
  const [input, setInput] = useState<SimInput>(DEFAULTS);
  const [showMath, setShowMath] = useState(false);
  const r = useMemo(() => simulate(input), [input]);
  const stuck = r.gap > 0.4;
  const pile = Math.min(8, Math.round(r.fiveDayBacklog / 6));

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="grid min-h-52 flex-1 gap-3 sm:grid-cols-[minmax(0,1fr)_9rem]">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-stage-2">
          <People highs={input.highs} />
          <div className="absolute inset-x-4 bottom-4 top-12">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className="flow-line absolute left-0 rounded-md bg-gold/80 px-2 py-1 font-mono text-xs text-ink"
                style={{ top: `${i * 18}%`, animationDelay: `${i * 0.35}s` }}
              >
                PR
              </span>
            ))}
            <Pile count={pile} stuck={stuck} />
          </div>
          <p className="absolute top-3 left-4 text-xs tracking-widest text-muted uppercase">
            {stuck ? "Queue growing" : "Queue clear"}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-1">
          <Stat k="Diff" v={fmt(r.highDiff + r.lowDiff)} />
          <Stat k="Capacity" v={fmt(r.supply)} />
          <Stat k={stuck ? "Gap" : "Spare"} v={fmt(Math.abs(r.gap))} hot={stuck} />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl bg-stage-2 px-3 py-2">
          <span className="font-serif text-3xl text-gold">{input.highs}</span>
          <input
            data-keys="free"
            className="w-full accent-cinnabar"
            type="range"
            min={0}
            max={TEAM}
            value={input.highs}
            onChange={(e) => setInput({ ...input, highs: Number(e.target.value) })}
            aria-label="High-leverage engineers out of 15"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <Toggle on={input.fear} label="Fear" onClick={() => setInput({ ...input, fear: !input.fear })} />
          <Toggle on={input.brief} label="Brief" onClick={() => setInput({ ...input, brief: !input.brief })} />
          <Toggle on={input.triage} label="Risk" onClick={() => setInput({ ...input, triage: !input.triage })} />
          <button type="button" className="min-h-11 px-2 text-sm text-muted" onClick={() => setShowMath((v) => !v)}>
            {showMath ? "Hide" : "Model"}
          </button>
        </div>
      </div>
      {showMath ? <MathNote /> : null}
    </div>
  );
}

function Toggle({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`min-h-11 rounded-full border px-4 text-sm ${on ? "border-gold bg-stage-2 text-gold" : "border-line text-muted"}`}
    >
      {label}
    </button>
  );
}

function Stat({ k, v, hot }: { k: string; v: string; hot?: boolean }) {
  return (
    <div className="rounded-2xl bg-stage-2 px-3 py-3">
      <p className="text-sm text-muted">{k}</p>
      <p className={`font-serif text-3xl leading-none ${hot ? "text-cinnabar" : "text-gold"}`}>{v}</p>
    </div>
  );
}

function People({ highs }: { highs: number }) {
  return (
    <div className="absolute top-3 right-4 flex max-w-[55%] flex-wrap justify-end gap-1.5" aria-hidden>
      {Array.from({ length: TEAM }, (_, i) => (
        <span key={i} className={`h-3 w-3 rounded-full ${i < highs ? "bg-gold" : "bg-line"}`} />
      ))}
    </div>
  );
}

function Pile({ count, stuck }: { count: number; stuck: boolean }) {
  return (
    <div className="absolute right-3 bottom-3 h-32 w-36">
      <div className={`absolute inset-0 rounded-xl border border-dashed ${stuck ? "border-cinnabar" : "border-line"}`} />
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="pile-card absolute right-2 left-2 h-7 rounded-md bg-paper font-mono text-xs leading-7 text-ink"
          style={{ bottom: 6 + i * 8, animationDelay: `${i * 40}ms` }}
        >
          <span className="px-2">PR {140 + i}</span>
        </div>
      ))}
      {count === 0 ? <p className="absolute inset-0 grid place-items-center text-sm text-muted">Clear</p> : null}
    </div>
  );
}

function MathNote() {
  return (
    <p className="rounded-2xl border border-line px-4 py-3 text-sm leading-relaxed text-muted">
      Workshop picture, not a published number. Tuned so a 2024 team, 80% writing and 20% review, stays in
      balance. A 5× person is five times faster and spends only 20% of the day writing. A 2× person is twice
      as fast and still spends 70% of the day typing, with messier diffs. One full day of review clears 4
      clean diffs. Fear makes every review take 1.5× as long. Brief makes messy diffs cheaper to review.
      Risk cuts the load to about 55%, because low-risk changes skip the line-by-line pass.
    </p>
  );
}
