import { useState } from "react";

export function TwoJobs() {
  return (
    <div className="grid min-h-0 flex-1 gap-3 sm:grid-cols-2">
      <article className="flex flex-col rounded-3xl bg-paper p-5 text-ink sm:p-6">
        <p className="text-sm tracking-widest uppercase">Author</p>
        <h2 className="mt-2 font-serif text-4xl leading-none sm:text-5xl">Write this before you ask.</h2>
        <ul className="mt-5 space-y-2 text-lg leading-snug sm:text-xl">
          <li>Risk: low, medium, or high</li>
          <li>Door: two-way or one-way</li>
          <li>Where to look, and what to skip</li>
          <li>Proof it already ran</li>
        </ul>
      </article>
      <article className="flex flex-col rounded-3xl border border-gold p-5 sm:p-6">
        <p className="text-sm tracking-widest text-gold uppercase">Reviewer</p>
        <h2 className="mt-2 font-serif text-4xl leading-none sm:text-5xl">Check the note. Do not reconstruct it.</h2>
        <ul className="mt-5 space-y-2 text-lg leading-snug sm:text-xl">
          <li>Four lines missing: send it back.</li>
          <li>Do not start at line 1.</li>
          <li>Low and two-way: approve.</li>
          <li>High or one-way: read only the place they named.</li>
        </ul>
      </article>
    </div>
  );
}

const BAD = `fix stuff

Claude did it.`;

const GOOD = `Cap the late fee at 30 days

Risk   High. This charges customers.
Door   Two-way. Flag lateFeeCap. Off = old formula.
Where  fee.ts, the daysPastDue == 1 branch.
       Skip the generated client.
Proof  Unit test late-fee-cap.
       Statement screenshot, day 1 and day 31.`;

export function Description() {
  const [good, setGood] = useState(true);
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-serif text-3xl sm:text-4xl">Four lines. Copy this.</h2>
        <div className="flex gap-2">
          <Toggle on={!good} label="Bad" onClick={() => setGood(false)} />
          <Toggle on={good} label="Use this" onClick={() => setGood(true)} />
        </div>
      </div>
      <pre
        className={`min-h-0 flex-1 overflow-auto rounded-3xl p-5 font-mono text-sm leading-relaxed sm:text-base ${
          good ? "bg-paper text-ink" : "border border-cinnabar bg-stage-2 text-paper"
        }`}
      >
        {good ? GOOD : BAD}
      </pre>
      <div className="grid gap-2 text-sm sm:grid-cols-4">
        <Legend k="Risk" v="How many humans." />
        <Legend k="Door" v="Two-way undoes. One-way does not." />
        <Legend k="Where" v="The only place to read." />
        <Legend k="Proof" v="Test, screenshot, or flag." />
      </div>
    </div>
  );
}

const STAMPS = [
  {
    id: "readme",
    change: "README typo",
    risk: "Low",
    door: "Two-way",
    where: "README, line 12. Nothing else.",
    proof: "None. No behavior change.",
    read: "No second person.",
  },
  {
    id: "copy",
    change: "Copy behind a flag",
    risk: "Low",
    door: "Two-way",
    where: "The copy string. Skip generated files.",
    proof: "Flag name. Screenshot on and off.",
    read: "No second person.",
  },
  {
    id: "fee",
    change: "Late-fee formula",
    risk: "High",
    door: "Two-way, if flagged",
    where: "fee.ts, the daysPastDue == 1 branch.",
    proof: "Unit test. Statements for day 1 and day 31.",
    read: "Two people. It charges money.",
  },
  {
    id: "drop",
    change: "Drop a column",
    risk: "High",
    door: "One-way",
    where: "The migration. Revert will not restore the data.",
    proof: "Backup named. Expand step already shipped.",
    read: "Two people. You cannot undo it.",
  },
] as const;

export function AuthorStamp() {
  const [id, setId] = useState<(typeof STAMPS)[number]["id"]>("fee");
  const stamp = STAMPS.find((s) => s.id === id) ?? STAMPS[2];
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <h2 className="font-serif text-3xl sm:text-4xl">The author writes the stamp.</h2>
      <div className="flex flex-wrap gap-2">
        {STAMPS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setId(s.id)}
            className={`min-h-11 rounded-full border px-4 text-sm sm:text-base ${
              s.id === id ? "border-gold bg-gold text-ink" : "border-line"
            }`}
          >
            {s.change}
          </button>
        ))}
      </div>
      <div key={stamp.id} className="num-pop grid min-h-0 flex-1 content-center gap-2 rounded-3xl bg-paper p-5 text-ink sm:grid-cols-2 sm:p-6">
        <Field k="Risk" v={stamp.risk} />
        <Field k="Door" v={stamp.door} />
        <Field k="Where" v={stamp.where} />
        <Field k="Proof" v={stamp.proof} />
        <p className="font-serif text-2xl sm:col-span-2 sm:text-3xl">{stamp.read}</p>
      </div>
    </div>
  );
}

const MOVES = [
  {
    id: "back",
    title: "Four lines missing",
    move: "Send it back",
    comment:
      "Risk, door, where to look, and proof are missing. Add them and I will review the fee branch. I am not starting at line 1.",
  },
  {
    id: "low",
    title: "Low and two-way",
    move: "Approve",
    comment: "Low. Two-way. Flag named. Test attached. Approved. I did not read every line.",
  },
  {
    id: "high",
    title: "High or one-way",
    move: "Read one place",
    comment:
      "High. Money path. I read fee.ts, the daysPastDue == 1 branch, and the test. I did not read the generated client.",
  },
] as const;

export function ReviewerMove() {
  const [id, setId] = useState<(typeof MOVES)[number]["id"]>("back");
  const move = MOVES.find((m) => m.id === id) ?? MOVES[0];
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <h2 className="font-serif text-3xl sm:text-4xl">The reviewer’s first two minutes</h2>
      <div className="flex flex-wrap gap-2">
        {MOVES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setId(m.id)}
            className={`min-h-11 rounded-full border px-4 text-sm sm:text-base ${
              m.id === id ? "border-cinnabar bg-cinnabar text-paper" : "border-line"
            }`}
          >
            {m.title}
          </button>
        ))}
      </div>
      <div key={move.id} className="num-pop flex min-h-0 flex-1 flex-col justify-center rounded-3xl border border-line bg-stage-2 p-5 sm:p-8">
        <p className="text-sm tracking-widest text-gold uppercase">{move.move}</p>
        <p className="mt-3 max-w-3xl font-serif text-2xl leading-snug sm:text-4xl">{move.comment}</p>
      </div>
    </div>
  );
}

export function Monday() {
  return (
    <div className="grid min-h-0 flex-1 content-center gap-3 sm:grid-cols-2">
      <article className="rounded-3xl bg-paper p-5 text-ink sm:p-6">
        <p className="text-sm tracking-widest uppercase">Authors, from Monday</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-lg leading-snug sm:text-xl">
          <li>No PR without Risk, Door, Where, Proof.</li>
          <li>You name the risk. The reviewer does not discover it.</li>
          <li>One-way means revert will not undo it. Say so.</li>
        </ol>
      </article>
      <article className="rounded-3xl border border-gold p-5 sm:p-6">
        <p className="text-sm tracking-widest text-gold uppercase">Reviewers, from Monday</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-lg leading-snug sm:text-xl">
          <li>Missing four lines: one comment, send it back.</li>
          <li>Low and two-way: approve without a line read.</li>
          <li>High or one-way: read only the place they named.</li>
        </ol>
      </article>
    </div>
  );
}

export function ShortTerm() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div>
        <p className="text-sm tracking-widest text-gold uppercase">2026 · still two humans</p>
        <h2 className="mt-1 font-serif text-3xl leading-tight sm:text-5xl">The second click moves. The rule does not.</h2>
      </div>
      <div className="grid min-h-0 flex-1 gap-3 sm:grid-cols-2">
        <article className="rounded-3xl border border-line p-5 sm:p-6">
          <p className="text-sm tracking-widest text-muted uppercase">Does not change</p>
          <ul className="mt-3 space-y-2 text-lg leading-snug sm:text-xl">
            <li>Merge still needs two human approvals.</li>
            <li>GitHub and CI stay as they are.</li>
            <li>The task board stays as it is.</li>
            <li>Medium and High: two engineers.</li>
          </ul>
        </article>
        <article className="rounded-3xl bg-paper p-5 text-ink sm:p-6">
          <p className="text-sm tracking-widest uppercase">Low only</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-lg leading-snug sm:text-xl">
            <li>Author writes Low, using the definition we just set.</li>
            <li>One engineer reviews and approves.</li>
            <li>The IT manager is the second approval. A click, not a second line read.</li>
          </ol>
        </article>
      </div>
    </div>
  );
}

function Toggle({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-full border px-4 ${on ? "border-gold bg-gold text-ink" : "border-line"}`}
    >
      {label}
    </button>
  );
}

function Legend({ k, v }: { k: string; v: string }) {
  return (
    <p>
      <span className="text-gold">{k}. </span>
      <span className="text-muted">{v}</span>
    </p>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <p className="text-lg leading-snug sm:text-2xl">
      <span className="text-ink/50">{k} </span>
      {v}
    </p>
  );
}
