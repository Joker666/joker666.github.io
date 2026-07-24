"use client";

import { useMemo, useState } from "react";

type Stage = "compact" | "retrieve" | "learn";
type ItemTone = "default" | "selected" | "muted" | "removed";

type MemoryItem = {
  label: string;
  detail?: string;
  tone?: ItemTone;
};

type Panel = {
  title: string;
  subtitle: string;
  items: MemoryItem[];
};

type StageState = {
  description: string;
  action: string;
  metricBefore: string;
  metricAfter: string;
  before: Panel[];
  after: Panel[];
  result: string;
};

const stages: Record<Stage, StageState> = {
  compact: {
    description: "The current task has accumulated file reads, test output, and failed attempts.",
    action: "Compact context",
    metricBefore: "8,420 tokens",
    metricAfter: "2,180 tokens",
    before: [
      {
        title: "Working context",
        subtitle: "Everything is still in the prompt",
        items: [
          { label: "Original task", detail: "Fix refresh token tests" },
          { label: "12 file reads", detail: "Several are now stale" },
          { label: "8 test runs", detail: "Most repeat the same failure" },
          { label: "3 failed attempts", detail: "Useful, but verbose" },
        ],
      },
      {
        title: "External memory",
        subtitle: "Available, but not needed yet",
        items: [{ label: "Project notes", detail: "No write during this step", tone: "muted" }],
      },
      {
        title: "Learned procedures",
        subtitle: "Reusable instructions",
        items: [{ label: "No new procedure", detail: "The task is still in progress", tone: "muted" }],
      },
    ],
    after: [
      {
        title: "Working context",
        subtitle: "A checkpoint replaces the long trace",
        items: [
          { label: "Original task", detail: "Fix refresh token tests" },
          { label: "Compact checkpoint", detail: "Middleware changed; one test remains", tone: "selected" },
          { label: "Public API constraint", detail: "Do not change the response shape" },
        ],
      },
      {
        title: "External memory",
        subtitle: "Available, but not needed yet",
        items: [{ label: "Project notes", detail: "No write during this step", tone: "muted" }],
      },
      {
        title: "Learned procedures",
        subtitle: "Reusable instructions",
        items: [{ label: "No new procedure", detail: "The task is still in progress", tone: "muted" }],
      },
    ],
    result: "Old tool output is gone. The active decision and constraint survive in a smaller checkpoint.",
  },
  retrieve: {
    description: "A new session needs the current backend preference, but the memory store contains conflicting facts.",
    action: "Retrieve memory",
    metricBefore: "3 candidates",
    metricAfter: "1 selected",
    before: [
      {
        title: "Working context",
        subtitle: "The new task has no preference yet",
        items: [{ label: "New task", detail: "Choose a backend language" }],
      },
      {
        title: "External memory",
        subtitle: "Similarity finds several candidates",
        items: [
          { label: "Prefers Python", detail: "Saved 2025-03-12" },
          { label: "Prefers Go", detail: "Saved 2026-06-20" },
          { label: "Go worker pool article", detail: "Similar topic, wrong purpose" },
        ],
      },
      {
        title: "Learned procedures",
        subtitle: "Reusable instructions",
        items: [{ label: "Check timestamps", detail: "Newer preferences replace older ones" }],
      },
    ],
    after: [
      {
        title: "Working context",
        subtitle: "Only the useful fact is injected",
        items: [
          { label: "New task", detail: "Choose a backend language" },
          { label: "Retrieved memory", detail: "Rafi now prefers Go", tone: "selected" },
        ],
      },
      {
        title: "External memory",
        subtitle: "Ranking uses time and purpose",
        items: [
          { label: "Prefers Python", detail: "Outdated preference", tone: "removed" },
          { label: "Prefers Go", detail: "Current preference", tone: "selected" },
          { label: "Go worker pool article", detail: "Topically similar, not relevant", tone: "muted" },
        ],
      },
      {
        title: "Learned procedures",
        subtitle: "Reusable instructions",
        items: [{ label: "Check timestamps", detail: "Newer preferences replace older ones" }],
      },
    ],
    result: "Vector similarity supplied candidates. Recency and metadata decided which memory was useful.",
  },
  learn: {
    description: "The build finally works after several failed attempts. The agent can keep the trace or extract a lesson.",
    action: "Extract lesson",
    metricBefore: "6 failed builds",
    metricAfter: "1 procedure",
    before: [
      {
        title: "Working context",
        subtitle: "The successful fix is buried in the trace",
        items: [
          { label: "Build failed", detail: "Missing generated database types" },
          { label: "Searched configuration", detail: "Found the generation script" },
          { label: "Build passed", detail: "After running pnpm db:generate" },
        ],
      },
      {
        title: "External memory",
        subtitle: "Raw history can be stored",
        items: [{ label: "Build session", detail: "30-minute debugging trajectory" }],
      },
      {
        title: "Learned procedures",
        subtitle: "Nothing reusable has been written",
        items: [{ label: "Empty", detail: "The next session would rediscover the fix", tone: "muted" }],
      },
    ],
    after: [
      {
        title: "Working context",
        subtitle: "The current task is complete",
        items: [{ label: "Build passed", detail: "Generated types are present", tone: "selected" }],
      },
      {
        title: "External memory",
        subtitle: "The trace remains available for inspection",
        items: [{ label: "Build session", detail: "Archived as supporting history", tone: "muted" }],
      },
      {
        title: "Learned procedures",
        subtitle: "A short runbook survives the session",
        items: [
          {
            label: "Before building",
            detail: "Run pnpm db:generate",
            tone: "selected",
          },
        ],
      },
    ],
    result: "The agent keeps a procedure it can apply directly instead of retrieving the entire debugging session.",
  },
};

const stageLabels: Record<Stage, string> = {
  compact: "1. Compact",
  retrieve: "2. Retrieve",
  learn: "3. Learn",
};

function MemoryCard({ item }: { item: MemoryItem }) {
  const tone = item.tone ?? "default";
  const toneClass = {
    default: "border-fd-foreground bg-fd-card text-fd-foreground",
    selected:
      "border-fd-foreground bg-fd-primary text-fd-primary-foreground shadow-[3px_3px_0px_0px_var(--color-fd-foreground)]",
    muted: "border-dashed border-fd-muted-foreground bg-fd-secondary text-fd-muted-foreground",
    removed: "border-fd-muted-foreground bg-fd-secondary text-fd-muted-foreground line-through opacity-70",
  }[tone];

  return (
    <div className={`border-2 p-3 transition-all duration-200 motion-reduce:transition-none ${toneClass}`}>
      <div className="text-xs font-bold uppercase tracking-wider">{item.label}</div>
      {item.detail && <div className="mt-1 font-sans text-xs leading-5">{item.detail}</div>}
    </div>
  );
}

export default function AgentMemoryLab() {
  const [stage, setStage] = useState<Stage>("compact");
  const [hasRun, setHasRun] = useState(false);
  const activeStage = stages[stage];
  const panels = hasRun ? activeStage.after : activeStage.before;

  const statusText = useMemo(
    () => (hasRun ? activeStage.metricAfter : activeStage.metricBefore),
    [activeStage, hasRun],
  );

  return (
    <div className="my-8 border-2 border-fd-foreground bg-fd-card p-4 font-mono text-sm text-fd-foreground shadow-[6px_6px_0px_0px_var(--color-fd-foreground)] sm:p-6">
      <div className="border-b-2 border-fd-foreground pb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-fd-primary">Agent memory lab</p>
        <h3 className="mt-2 text-xl font-semibold uppercase">What should the next prompt remember?</h3>
        <p className="mt-3 max-w-2xl font-sans text-sm leading-6 text-fd-muted-foreground">
          Try each approach. The same agent moves information between its working context, external storage, and learned
          procedures.
        </p>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-3" role="group" aria-label="Memory approach">
        {(Object.keys(stageLabels) as Stage[]).map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={stage === item}
            onClick={() => {
              setStage(item);
              setHasRun(false);
            }}
            className={`cursor-pointer border-2 px-3 py-2 text-left text-xs font-bold uppercase tracking-wider transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 ${
              stage === item
                ? "border-fd-foreground bg-fd-primary text-fd-primary-foreground shadow-[3px_3px_0px_0px_var(--color-fd-foreground)]"
                : "border-fd-foreground bg-fd-background text-fd-foreground hover:bg-fd-secondary hover:shadow-[3px_3px_0px_0px_var(--color-fd-foreground)]"
            }`}
          >
            {stageLabels[item]}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-4 border-2 border-fd-foreground bg-fd-background p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-fd-muted-foreground">
            {hasRun ? "After" : "Before"}
          </div>
          <p className="mt-2 max-w-2xl font-sans text-sm leading-6 text-fd-muted-foreground">
            {hasRun ? activeStage.result : activeStage.description}
          </p>
        </div>
        <div
          className={`shrink-0 border-2 px-3 py-2 text-xs font-bold ${
            hasRun
              ? "border-fd-primary bg-fd-card text-fd-primary"
              : "border-fd-foreground bg-fd-secondary text-fd-foreground"
          }`}
          aria-live="polite"
        >
          {statusText}
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {panels.map((panel) => (
          <section key={panel.title} className="border-2 border-fd-foreground bg-fd-background p-3">
            <div className="min-h-16 border-b-2 border-fd-foreground pb-3">
              <h4 className="m-0 text-xs font-bold uppercase tracking-widest">{panel.title}</h4>
              <p className="mt-1 font-sans text-xs leading-5 text-fd-muted-foreground">{panel.subtitle}</p>
            </div>
            <div className="mt-3 space-y-2">
              {panel.items.map((item) => (
                <MemoryCard key={`${item.label}-${item.detail}`} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t-2 border-fd-foreground pt-4">
        <button
          type="button"
          onClick={() => setHasRun((current) => !current)}
          className="cursor-pointer border-2 border-fd-foreground bg-fd-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-fd-primary-foreground shadow-[3px_3px_0px_0px_var(--color-fd-foreground)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_var(--color-fd-foreground)] active:translate-x-0 active:translate-y-0 active:shadow-none"
        >
          {hasRun ? "Reset step" : activeStage.action}
        </button>
        <span className="font-sans text-xs leading-5 text-fd-muted-foreground">
          {hasRun ? "Reset to compare the before and after states." : "Run the step to see what enters or leaves context."}
        </span>
      </div>
    </div>
  );
}
