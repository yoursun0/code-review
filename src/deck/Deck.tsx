import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AgentChart, BurdenChart } from "@/deck/Charts";
import { CodeFlood, HumanWords, NumberReel, Questions, SplitBars, ThenNow } from "@/deck/scenes";
import { AuthorContract, RiskSort, Stages } from "@/deck/Stages";
import { SimStage } from "@/deck/SimStage";

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
        "Today is not about which model to buy. It is about where a human’s attention goes.",
        "We do not have to read every line. We do have to decide which lines are worth a person.",
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
        "Thoughtworks, June 2026: an agent can write about 500 lines in five seconds.",
        "A careful human still needs about 30 minutes for those same lines.",
        "Reading harder is not a plan. If code arrives faster than anyone can read it, line-by-line review becomes a queue.",
      ],
    },
    body: (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mb-3 grid grid-cols-2 gap-3">
          <p className="font-serif text-6xl text-gold sm:text-8xl">5s</p>
          <p className="text-right font-serif text-6xl sm:text-8xl">30m</p>
        </div>
        <CodeFlood />
      </div>
    ),
  },
  {
    id: "world",
    kicker: "2026, measured",
    nav: "Four numbers",
    script: {
      see: "One number at a time. It changes on its own. Click the number to jump. The dots show which of the four you are on.",
      say: [
        "40%. In September 2026, 40% of GitHub pull requests were started by an agent. In March it was 17%.",
        "6×. That month was about 110 million agent pull requests, about six times March.",
        "90%. Claude writes about 90% of Claude Code. From June to September their merged pull requests doubled, and reverts fell by more than 40%. Volume can rise while reverts fall, but only with a harness.",
        "12×. Their monorepo went from 2,500 changes a day in May to more than 30,000 in September.",
      ],
      do: "Say the line that matches the number on screen. Do not read all four while one number is showing.",
    },
    body: (
      <div className="flex min-h-0 flex-1 flex-col">
        <NumberReel />
      </div>
    ),
  },
  {
    id: "shipped",
    kicker: "Output is not delivery",
    nav: "More code",
    script: {
      see: "Gold bars mean more activity. Red bars mean review got heavier. The last bar, software actually shipped, did not move.",
      say: [
        "A Harvard study across hundreds of software firms: more lines of code, more commits, more pull requests, more tasks finished.",
        "Also longer to merge, more review comments, and about 91% more time spent reviewing AI output. That last red bar is Bain, September 2026.",
        "Software leaving the building: no real increase. Pull requests sent back for changes nearly doubled. That one is not on the chart.",
      ],
    },
    body: (
      <div className="flex min-h-0 flex-1 flex-col">
        <h1 className="font-serif text-4xl sm:text-5xl">More code. Same ship.</h1>
        <BurdenChart />
      </div>
    ),
  },
  {
    id: "who",
    kicker: "Who opens the pull request",
    nav: "Agents",
    script: {
      see: "The share of pull requests opened by an agent. 17% in March. 40% in September.",
      say: [
        "The person who opens the change is often no longer a person.",
        "GitHub’s CEO, Thomas Dohmke: the first move is now directing an agent, and review is how developers shape what comes back.",
        "Agent pull requests touch more files. By September they were also merging a little faster. Teams had learned how to check them.",
      ],
    },
    body: (
      <div className="flex min-h-0 flex-1 flex-col justify-center">
        <p className="font-serif text-4xl sm:text-6xl">March 17. September 40.</p>
        <AgentChart />
      </div>
    ),
  },
  {
    id: "shift",
    kicker: "Stop reading every line",
    nav: "Old and new",
    script: {
      see: "Left: a bar scanning every line. That is review one or two years ago. Right: the same kind of comments, split into Rules, Tests, and Judgment.",
      say: [
        "We used to start at line 1 and talk about style.",
        "About 45% of repeated comments are a rule a machine can check. 30% a test can catch. 25% is real judgment. Aviator, October 2026.",
        "Still read line by line for money, login, secrets, migrations, a new design, and anyone new to the code.",
        "Large pull requests are where bugs hide. Over about 400 lines, a later bug-fix was about four times more likely.",
      ],
    },
    body: (
      <div className="flex min-h-0 flex-1 flex-col">
        <ThenNow />
      </div>
    ),
  },
  {
    id: "flow",
    kicker: "How a strong team reviews",
    nav: "Four stages",
    script: {
      see: "Four steps. They light up on their own. This is how the Claude Code team reviews, from the video.",
      say: [
        "Prove. Before the pull request exists, show that it runs: tests, a build, or a screenshot. A fresh agent reads the diff. If you cannot prove it runs, do not open it.",
        "Check. CI blocks. An AI review may comment, but only if a second agent agrees. Security can block the merge.",
        "Merge. Rerun checks against latest main. Ship behind a flag. A bot approval never counts as a person.",
        "Watch. You will have incidents. Detect them fast and roll back. Page a human, not a model.",
      ],
      do: "Click a circle to hold that step while you talk. Click another to move.",
    },
    body: (
      <div className="flex min-h-0 flex-1 flex-col">
        <Stages />
      </div>
    ),
  },
  {
    id: "risk",
    kicker: "Not every diff deserves two people",
    nav: "Risk",
    script: {
      see: "Eight real kinds of change. The room taps Low, Med, or High. The answer that appears is the Claude Code bar, not a bank policy yet.",
      say: [
        "Low means the checks passed and no extra human is required. Medium means one human. High means two.",
        "The tier follows the change, not how senior the author is.",
        "Whoever prompted the agent still owns the pull request. An approval covers one commit only. A new push means approve again.",
      ],
      do: "Let them guess out loud, then tap. If it is wrong, read the correction on the card.",
    },
    body: (
      <div className="flex min-h-0 flex-1 flex-col">
        <RiskSort />
      </div>
    ),
  },
  {
    id: "author",
    kicker: "The author’s job",
    nav: "The brief",
    script: {
      see: "A review that starts at 45 minutes. Each chip is something the author already did. Tap them and the number falls.",
      say: [
        "Opening a pull request is asking for someone’s time. ‘Fix stuff. Claude did it.’ is not a request anyone can judge.",
        "The author has to say the problem, how to turn it off, the proof, where to look, that it is small enough, and that they can explain it without the model.",
        "When those are there, this is about a 12-minute review. If they are missing, send it back. That is the job, not a favor.",
      ],
      do: "Tap the chips one at a time so the room watches 45 become 12.",
    },
    body: (
      <div className="flex min-h-0 flex-1 flex-col">
        <AuthorContract />
      </div>
    ),
  },
  {
    id: "humans",
    kicker: "What is still yours",
    nav: "Humans",
    script: {
      see: "Four words. This is the whole human job. Everything else can leave the queue.",
      say: [
        "Decide. Whether to build it, and how wide the change is allowed to be.",
        "Evidence. Read tests, screenshots, and what the fresh agent found. Not every generated line.",
        "Sign. Money, identity, data, and anything that will become the next pattern.",
        "Own. The person who merges it can be paged. The model cannot.",
        "Their target: most pull requests merge with at most one human, and that human can be the author, as long as reverts and incidents stay flat.",
      ],
    },
    body: (
      <div className="flex min-h-0 flex-1 flex-col">
        <HumanWords />
      </div>
    ),
  },
  {
    id: "hour",
    kicker: "This hour",
    nav: "Discuss",
    script: {
      see: "One discussion question at a time. It rotates. Click it to move on.",
      say: [
        "Which changes can the author plus the machines sign, with no second person reading line by line?",
        "Which three pieces of evidence are mandatory before anyone asks for a review?",
        "Someone opens 1,500 lines and no brief. What is the professional response?",
      ],
      do: "Ask the question that is on screen, then wait. Use one real pull request from this week. Leave with one change for Monday, not a new framework.",
    },
    body: (
      <div className="flex min-h-0 flex-1 flex-col">
        <Questions />
      </div>
    ),
  },
  {
    id: "close",
    kicker: "Leave with this",
    nav: "Close",
    script: {
      see: "One question. Read it, then stop.",
      say: [
        "Code review is not reading every line. It is deciding how many minutes this change deserves.",
        "Approve is a signature. Not a courtesy.",
      ],
      do: "If there is a minute left, ask each person which kind of change they will stop reviewing line by line.",
    },
    body: (
      <div className="flex min-h-0 flex-1 flex-col justify-center">
        <h1 className="max-w-4xl font-serif text-5xl leading-tight sm:text-7xl">
          How many minutes does this change deserve?
        </h1>
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
              <p className="text-xs tracking-widest text-gold">THE CONTROLS</p>
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
