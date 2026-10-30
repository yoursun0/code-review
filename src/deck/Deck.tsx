import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CodeFlood, SplitBars } from "@/deck/scenes";
import { AuthorStamp, Description, Monday, ReviewerMove, TwoJobs } from "@/deck/practice";
import { SimStage } from "@/deck/SimStage";
import { RiskSort } from "@/deck/Stages";

const SOURCES: { title: string; detail: string; href?: string }[] = [
  {
    title: "Anthropic — How the Claude Code team does code review",
    detail: "October 2026. Risk tiers, fresh-agent review, bot approvals never count.",
    href: "https://claude.dev/blog/solving-code-review-at-anthropic/",
  },
  {
    title: "Mark’s technical workshop",
    detail: "25 October 2026. A walkthrough of that Anthropic flow, from before the PR to rollback.",
    href: "https://youtu.be/h0ALH6qBb7k",
  },
  {
    title: "GitHub Octoverse 2026",
    detail: "Year ending 30 September 2026. Agent-started pull requests, reported 29 October 2026.",
  },
  {
    title: "Harvard working paper, as reported October 2026",
    detail: "About 300 million work events across 700+ software firms. More code, slower review, shipped work flat.",
  },
  {
    title: "Bain Global Technology Report",
    detail: "29 September 2026. About 300 senior technology leaders.",
  },
  {
    title: "Thoughtworks — The code review is dead; long live the code review",
    detail: "25 June 2026. 500 lines in five seconds, thirty minutes to review.",
    href: "https://www.thoughtworks.com/insights/blog/testing/code-review-dead-long-live-code-review",
  },
  {
    title: "OrangeLoops — Attention is the scarce resource",
    detail: "October 2026. 381 merged PRs, July 2025–October 2026. Includes the .NET harness result.",
    href: "https://orangeloops.com/blog/code-review-in-the-age-of-coding-agents/",
  },
  {
    title: "Aviator — keep quality high without adding reviewers",
    detail: "16 October 2026. Review comments split roughly 45% rules, 30% tests, 25% judgment.",
    href: "https://www.aviator.co/blog/how-to-keep-ai-generated-code-quality-high-without-adding-reviewers/",
  },
];

type Script = {
  see: string;
  say: string[];
  do?: string;
  terms?: { name: string; meaning: string }[];
  termsLabel?: string;
};

type Slide = {
  id: string;
  kicker: string;
  nav: string;
  script: Script;
  body: ReactNode;
};

const slides: Slide[] = [
  {
    id: "title",
    kicker: "60 minutes",
    nav: "Open",
    script: {
      see: "Code is flying in from the left. The red line is a person. Cards pile on the right because they cannot read that fast.",
      say: [
        "Some of you got about 5× with AI. Some got about 2×. The review queue got worse for everyone.",
        "The talk has two jobs. Authors must say the risk, the door, and where to look. Reviewers check that note. They do not start at line 1.",
      ],
    },
    body: (
      <div className="flex min-h-0 flex-1 flex-col">
        <CodeFlood>
          <div>
            <p className="text-sm tracking-widest text-gold uppercase">Code review, 2026</p>
            <h1 className="mt-2 font-serif text-6xl leading-none sm:text-8xl">Stuck in Review</h1>
          </div>
        </CodeFlood>
      </div>
    ),
  },
  {
    id: "split",
    kicker: "The room",
    nav: "5× and 2×",
    script: {
      see: "Three pairs of bars. In each pair the left bar is time spent writing. The right bar is time spent reviewing.",
      say: [
        "Two years ago the day was about 80% writing and 20% review. Review could keep up.",
        "People who use AI well flip that: about 20% directing the change, 80% review and testing. That is the 5×.",
        "People who use it poorly stay near 70% typing and 30% review. That is the 2×. Fewer clear pull requests. Harder diffs.",
        "Review then lands on the people who already know the system. The queue freezes.",
      ],
    },
    body: (
      <div className="flex min-h-0 flex-1 flex-col">
        <p className="text-sm tracking-widest text-gold uppercase">One team, three days</p>
        <SplitBars />
      </div>
    ),
  },
  {
    id: "sim",
    kicker: "Live model",
    nav: "The tilt",
    script: {
      see: "Gold dots are the 5× people. Grey dots are the 2× people. Pull requests flow in from the left and stack on the right. Diff is how much code arrives today. Capacity is how much this team can review today. Gap is what nobody got to. A red Gap means the pile grows.",
      say: [
        "Ask the room: of these 15, how many are really the 5× people? Drag the gold number to whatever they say.",
        "Leave Fear on. Point at the red Gap. This is the stuck queue: code is arriving faster than anyone will approve it.",
        "Turn Brief on, and say what it means. The gap should fall a little.",
        "Turn Risk on. The gap should fall again. You do not hire your way out. You stop sending every change to a human.",
      ],
      terms: [
        {
          name: "Fear",
          meaning:
            "On by default. Reviewers are afraid to press approve, so even a tiny safe change gets a full line-by-line read. In this model that makes every review take 1.5× as long. Turn it off only to show the contrast: what if we trusted the boring ones?",
        },
        {
          name: "Brief",
          meaning:
            "The author writes a short note before asking for review: the problem, what can break, how to turn it off, and where to look. Messy pull requests then take less human time, and more of them are clear enough to approve.",
        },
        {
          name: "Risk",
          meaning:
            "Stop giving every pull request the same review. Low-risk changes, such as docs, copy behind a flag, or tests only, do not need two people reading every line. In this model that cuts the human review load to about 55%.",
        },
        {
          name: "Model",
          meaning:
            "Not a real statistic from our bank or from a paper. Tap it to show the assumptions. A 2024 team that spends 80% of the day writing and 20% reviewing stays in balance. A 5× person spends only 20% of the day writing. A 2× person still spends 70% of the day typing, and their diffs are messier. One full day of review clears 4 clean diffs. Hide it again after you have said that. Tap it only if someone asks where the numbers come from.",
        },
      ],
      do: "Order: set the slider, leave Fear on, then Brief, then Risk. Tap Model only if challenged.",
    },
    body: (
      <div className="flex min-h-0 flex-1 flex-col">
        <SimStage />
      </div>
    ),
  },
  {
    id: "math",
    kicker: "The bottleneck",
    nav: "Five seconds",
    script: {
      see: "5 seconds against 30 minutes, over the same flood of code. The red line is still attention.",
      say: [
        "Thoughtworks, June 2026: an agent can write about 500 lines in five seconds. A careful human still needs about 30 minutes.",
        "Most of those 30 minutes is not reading code. It is the reviewer reconstructing what the author never wrote: where to look, and whether this can be undone.",
        "That is the rest of the hour. Two jobs. Author first.",
      ],
    },
    body: (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mb-3 grid grid-cols-2 gap-3">
          <p className="font-serif text-6xl text-gold sm:text-8xl">5s</p>
          <p className="text-right font-serif text-6xl sm:text-8xl">30m</p>
        </div>
        <CodeFlood>
          <p className="max-w-xl font-serif text-3xl leading-tight sm:text-4xl">
            The 30 minutes is the note the author never wrote.
          </p>
        </CodeFlood>
      </div>
    ),
  },
  {
    id: "jobs",
    kicker: "The point",
    nav: "Two jobs",
    script: {
      see: "Left card is the author. Right card is the reviewer. This is the whole talk. Stay here until the room can say both jobs back to you.",
      say: [
        "The author writes four lines before asking for a review: the risk, the door, where to look, and the proof.",
        "Risk is low, medium, or high. Door is two-way or one-way. Two-way means we can turn it off or revert it. One-way means revert will not undo the damage: a dropped column, money already charged, data deleted.",
        "The reviewer does not discover those facts by reading the diff. If the four lines are missing, the only review is: send it back.",
        "If it is low and two-way, approve it. If it is high or one-way, read only the place the author named.",
      ],
    },
    body: (
      <div className="flex min-h-0 flex-1 flex-col">
        <TwoJobs />
      </div>
    ),
  },
  {
    id: "desc",
    kicker: "Author",
    nav: "The description",
    script: {
      see: "A real pull request description. Bad is the empty one. Use this is the template. The four words under the card are the framework: Risk, Door, Where, Proof.",
      say: [
        "Start on Bad. This is why reviews take 30 minutes. The reviewer has to guess the risk and where to look.",
        "Switch to Use this. Read it aloud. Risk High, because it charges customers. Door Two-way, because the flag lateFeeCap turns the old formula back on. Where: fee.ts, one branch, skip the generated client. Proof: a unit test and two statement screenshots.",
        "This is the framework. Four lines, in this order, on every pull request from Monday. Not a novel. Not 'Claude did it.'",
        "The author owns the stamp. If they are unsure, they write High. The reviewer may upgrade a stamp. They should not have to invent it.",
      ],
      do: "Click Bad, then Use this. Read the good description slowly. It is the thing you want them to copy.",
      termsLabel: "THE FOUR LINES",
      terms: [
        {
          name: "Risk",
          meaning:
            "Low: no behavior change, or a kill switch. No second person. Medium: behavior changes, one person. High: money, identity, or a one-way door. Two people.",
        },
        {
          name: "Door",
          meaning:
            "Two-way: a flag, a revert, or a copy change puts it back. One-way: revert does not undo it. Dropped column, charged fee already collected, deleted rows, leaked secret.",
        },
        {
          name: "Where",
          meaning: "The file and the branch to read, plus what to skip. If this line is missing, the reviewer is being asked to search.",
        },
        {
          name: "Proof",
          meaning: "What already ran before anyone was asked: a test name, a screenshot, or the flag. Not a promise to test later.",
        },
      ],
    },
    body: (
      <div className="flex min-h-0 flex-1 flex-col">
        <Description />
      </div>
    ),
  },
  {
    id: "stamp",
    kicker: "Author",
    nav: "The stamp",
    script: {
      see: "Four changes. Click one. The card is what the author should already have written. This is not a quiz for the reviewer.",
      say: [
        "The author classifies the change. The reviewer does not.",
        "README typo: Low, two-way, one line, no proof needed. No second person.",
        "Copy behind a flag: still Low and two-way, because you can turn it off. Name the flag. Attach on and off screenshots.",
        "Late-fee formula: High, because it charges customers. Two-way only if there is a flag. Name the branch in fee.ts. Two people.",
        "Drop a column: High and one-way. Revert will not bring the data back. Say that in the description. Two people.",
      ],
      do: "Click them in that order: README, copy, late fee, drop a column. After each one ask: who writes this, the author or the reviewer? The answer is the author.",
    },
    body: (
      <div className="flex min-h-0 flex-1 flex-col">
        <AuthorStamp />
      </div>
    ),
  },
  {
    id: "risk",
    kicker: "Author",
    nav: "Low, medium, high",
    script: {
      see: "Three definitions on top. Eight changes underneath. The room taps Low, Med, or High. The line that appears is the bar, plus why.",
      say: [
        "Low means no second person, once the checks pass. A README typo. Copy behind a flag you can turn off. Tests only, no product code.",
        "Medium means one person. The behavior changes, but it is not money or identity. The caching layer. A system prompt, because the next change will copy it.",
        "High means two people. Interest or a fee. Login, session, or permissions. A migration that drops a column, because revert will not undo it.",
        "The author writes this tier on the pull request. The reviewer does not have to discover it. The reviewer may raise it. A bot never counts as one of the humans.",
      ],
      do: "Read the three definitions first. Then let them classify two or three cards out loud before you tap. If they miss, read the correction.",
      terms: [
        {
          name: "Low",
          meaning: "No behavior change, or you can turn it off. Zero extra humans.",
        },
        {
          name: "Medium",
          meaning: "Behavior changes. One human. Not money, not identity, not a one-way door.",
        },
        {
          name: "High",
          meaning: "Money, identity, or one-way. Two humans. Whoever prompted the agent still owns the pull request.",
        },
      ],
    },
    body: (
      <div className="flex min-h-0 flex-1 flex-col">
        <RiskSort />
      </div>
    ),
  },
  {
    id: "reviewer",
    kicker: "Reviewer",
    nav: "First two minutes",
    script: {
      see: "Three buttons. Each one is a finished review comment. This is the reviewer's whole job in the first two minutes.",
      say: [
        "First button. The four lines are missing. You do not open the diff to be helpful. You send it back with that comment.",
        "Second. Low and two-way, flag named, test attached. You approve. You say out loud that you did not read every line. That is allowed. That is the point.",
        "Third. High, or one-way. You read only the place they named, and the proof. You do not tour the generated client.",
        "Fear of approving is what froze the queue. A low two-way change with the four lines is safe to approve.",
      ],
      do: "Click the three buttons and read each comment as if you are posting it.",
    },
    body: (
      <div className="flex min-h-0 flex-1 flex-col">
        <ReviewerMove />
      </div>
    ),
  },
  {
    id: "monday",
    kicker: "From Monday",
    nav: "Monday",
    script: {
      see: "Two lists. Left is what authors change. Right is what reviewers change. Leave this up for the discussion.",
      say: [
        "Authors: every pull request has Risk, Door, Where, Proof. You name the risk. You say if it is one-way.",
        "Reviewers: if those lines are missing, one comment and send it back. If it is low and two-way, approve without a line read. If it is high or one-way, read only the place they named.",
        "Pick one pull request from this week. Rewrite the description in the four lines, out loud. Then the person who would review it says which of the three moves they take.",
      ],
      do: "Do not invent a new policy in the room. Leave with those six lines.",
    },
    body: (
      <div className="flex min-h-0 flex-1 flex-col">
        <Monday />
      </div>
    ),
  },
];

function ScriptPanel({ script, onClose }: { script: Script; onClose: () => void }) {
  return (
    <aside className="max-h-[46vh] overflow-y-auto border-t border-gold bg-stage-2 px-4 py-3 sm:px-8">
      <div className="mx-auto flex max-w-6xl items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-widest text-gold">ON SCREEN</p>
          <p className="mt-1 max-w-3xl text-base leading-snug">{script.see}</p>
          <p className="mt-3 text-xs tracking-widest text-gold">SAY</p>
          <ol className="mt-1 max-w-3xl list-decimal space-y-1.5 pl-5 text-base leading-snug">
            {script.say.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
          {script.terms ? (
            <dl className="mt-3 max-w-3xl space-y-2">
              <p className="text-xs tracking-widest text-gold">{script.termsLabel ?? "THE CONTROLS"}</p>
              {script.terms.map((term) => (
                <div key={term.name}>
                  <dt className="font-serif text-lg text-gold">{term.name}</dt>
                  <dd className="text-base leading-snug">{term.meaning}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {script.do ? (
            <>
              <p className="mt-3 text-xs tracking-widest text-gold">DO</p>
              <p className="mt-1 max-w-3xl text-base leading-snug">{script.do}</p>
            </>
          ) : null}
        </div>
        <button type="button" className="min-h-11 shrink-0 text-sm text-muted" onClick={onClose}>
          Hide
        </button>
      </div>
    </aside>
  );
}

function formatClock(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function Deck() {
  const [index, setIndex] = useState(0);
  const [notes, setNotes] = useState(true);
  const [grid, setGrid] = useState(false);
  const [sources, setSources] = useState(false);
  const [left, setLeft] = useState(60 * 60);
  const [running, setRunning] = useState(false);
  const startX = useRef(0);
  const slide = slides[index]!;

  const go = useCallback((next: number) => {
    setIndex(Math.min(slides.length - 1, Math.max(0, next)));
    setGrid(false);
    setSources(false);
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setLeft((n) => (n > 0 ? n - 1 : 0)), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [data-keys='free']")) return;
      if (e.key === " " && target?.closest("button, a")) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        go(index + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        go(index - 1);
      } else if (e.key === "Home") go(0);
      else if (e.key === "End") go(slides.length - 1);
      else if (e.key === " " && !target?.closest("button, a")) {
        e.preventDefault();
        go(index + 1);
      } else if (e.key === "n" || e.key === "N") setNotes((v) => !v);
      else if (e.key === "g" || e.key === "G") setGrid((v) => !v);
      else if (e.key === "Escape") {
        setGrid(false);
        setSources(false);
        setNotes(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, grid, index, sources]);

  return (
    <div className="flex h-dvh flex-col bg-stage text-paper">
      <header className="flex items-center gap-3 px-4 pt-3 sm:px-8">
        <p className="min-w-0 flex-1 truncate text-sm text-muted">Stuck in Review</p>
        <button
          type="button"
          className="min-h-11 rounded-full border border-line px-3 text-sm text-gold"
          onClick={() => setRunning((v) => !v)}
        >
          {running ? "Pause" : "Start"} {formatClock(left)}
        </button>
        <button type="button" className="min-h-11 px-2 text-sm text-muted" onClick={() => setSources(true)}>
          Sources
        </button>
        <p className="font-mono text-sm text-muted">
          {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </p>
      </header>

      <div className="px-4 pt-3 sm:px-8">
        <div className="h-1 overflow-hidden rounded-full bg-line">
          <div
            className="h-full bg-cinnabar"
            style={{ width: `${((index + 1) / slides.length) * 100}%` }}
          />
        </div>
      </div>

      <main
        className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-3 sm:px-8"
        onPointerDown={(e) => {
          startX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest("button, a, input, label")) return;
          const dx = e.clientX - startX.current;
          if (dx < -48) go(index + 1);
          if (dx > 48) go(index - 1);
        }}
      >
        <div key={slide.id} className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
          {slide.body}
        </div>
      </main>

      {notes ? <ScriptPanel script={slide.script} onClose={() => setNotes(false)} /> : null}

      <footer className="flex items-center gap-2 border-t border-line px-3 py-2 sm:px-6">
        <button
          type="button"
          className="min-h-11 min-w-11 rounded-full border border-line px-4"
          onClick={() => go(index - 1)}
          disabled={index === 0}
        >
          Back
        </button>
        <button type="button" className="min-h-11 flex-1 text-sm text-muted" onClick={() => setGrid(true)}>
          {slide.nav}
        </button>
        <button
          type="button"
          className="min-h-11 rounded-full bg-cinnabar px-4 text-paper"
          onClick={() => go(index + 1)}
          disabled={index === slides.length - 1}
        >
          Next
        </button>
        <button
          type="button"
          className={`min-h-11 rounded-full px-4 ${notes ? "border border-gold text-gold" : "bg-gold text-ink"}`}
          onClick={() => setNotes((v) => !v)}
        >
          {notes ? "Hide script" : "Script"}
        </button>
      </footer>

      {grid ? (
        <div className="absolute inset-0 z-20 overflow-y-auto bg-stage/95 px-4 py-6 sm:px-8">
          <div className="mx-auto grid max-w-5xl gap-2 sm:grid-cols-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(i)}
                className={`rounded-2xl border px-4 py-3 text-left ${
                  i === index ? "border-cinnabar bg-stage-2" : "border-line"
                }`}
              >
                <span className="text-sm text-gold">{String(i + 1).padStart(2, "0")}</span>
                <span className="mt-1 block font-serif text-2xl">{s.nav}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {sources ? (
        <div className="absolute inset-0 z-30 overflow-y-auto bg-stage px-4 py-6 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-4xl">Sources</h2>
              <button type="button" className="min-h-11 rounded-full border border-line px-4" onClick={() => setSources(false)}>
                Close
              </button>
            </div>
            <ul className="mt-6 space-y-4">
              {SOURCES.map((s) => (
                <li key={s.title} className="border-t border-line pt-4">
                  <p className="text-lg">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{s.detail}</p>
                  {s.href ? (
                    <a className="mt-1 inline-block text-sm text-gold underline-offset-4 hover:underline" href={s.href}>
                      {s.href.replace(/^https:\/\//, "")}
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted">
              The fifteen-person simulator is a workshop model, labeled on that slide. It is not a census.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
