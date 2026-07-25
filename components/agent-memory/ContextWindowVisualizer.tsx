"use client";

import { useState } from "react";

type ContextBlock = {
  id: string;
  name: string;
  category: "system" | "rules" | "history" | "files" | "tools" | "plan";
  tokens: number;
  tokensBloated?: number;
  description: string;
  colorClass: string;
  borderClass: string;
  badgeClass: string;
};

const BLOCKS: ContextBlock[] = [
  {
    id: "system",
    name: "System Instructions",
    category: "system",
    tokens: 2500,
    tokensBloated: 2500,
    description: "Core agent identity, capabilities, and safety boundaries defined by the platform.",
    colorClass: "bg-purple-500/15 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300",
    borderClass: "border-purple-500/40",
    badgeClass: "bg-purple-500 text-white",
  },
  {
    id: "rules",
    name: "Repository Rules",
    category: "rules",
    tokens: 4000,
    tokensBloated: 4000,
    description: "Project guidelines such as AGENTS.md, style rules, and folder structure tips.",
    colorClass: "bg-indigo-500/15 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300",
    borderClass: "border-indigo-500/40",
    badgeClass: "bg-indigo-500 text-white",
  },
  {
    id: "history",
    name: "Conversation History",
    category: "history",
    tokens: 12000,
    tokensBloated: 12000,
    description: "Multi-turn messages between user and agent recording requests and answers.",
    colorClass: "bg-blue-500/15 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300",
    borderClass: "border-blue-500/40",
    badgeClass: "bg-blue-500 text-white",
  },
  {
    id: "files",
    name: "Inspected Files",
    category: "files",
    tokens: 18000,
    tokensBloated: 18000,
    description: "Source code files, schema definitions, and markdown docs read by the agent.",
    colorClass: "bg-emerald-500/15 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
    borderClass: "border-emerald-500/40",
    badgeClass: "bg-emerald-500 text-white",
  },
  {
    id: "tools",
    name: "Tool Outputs & Logs",
    category: "tools",
    tokens: 16000,
    tokensBloated: 68000, // Bloated mode: huge 2000 line log file
    description: "Terminal command outputs, test run tracebacks, and tool execution payloads.",
    colorClass: "bg-amber-500/15 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
    borderClass: "border-amber-500/40",
    badgeClass: "bg-amber-500 text-white",
  },
  {
    id: "plan",
    name: "Active Plan & Goal",
    category: "plan",
    tokens: 1500,
    tokensBloated: 1500,
    description: "Current step-by-step target task and active execution status.",
    colorClass: "bg-rose-500/15 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300",
    borderClass: "border-rose-500/40",
    badgeClass: "bg-rose-500 text-white",
  },
];

const TOTAL_CAPACITY = 128000; // 128k Context Window

export default function ContextWindowVisualizer() {
  const [mode, setMode] = useState<"normal" | "bloated">("normal");
  const [activeId, setActiveId] = useState<string>("tools");

  const totalUsed = BLOCKS.reduce(
    (acc, b) => acc + (mode === "bloated" && b.tokensBloated ? b.tokensBloated : b.tokens),
    0
  );

  const usagePercent = Math.min(100, Math.round((totalUsed / TOTAL_CAPACITY) * 100));
  const activeBlock = BLOCKS.find((b) => b.id === activeId) || BLOCKS[0];

  return (
    <div className="my-6 border-2 border-fd-foreground bg-fd-card p-4 shadow-[4px_4px_0px_0px_var(--color-fd-foreground)] sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b-2 border-fd-foreground pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-fd-primary">
            Agent Context Assembly
          </div>
          <h3 className="m-0 text-lg font-extrabold uppercase tracking-tight text-fd-foreground">
            The Context Window
          </h3>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 self-start border-2 border-fd-foreground bg-fd-secondary p-1 sm:self-auto">
          <button
            type="button"
            onClick={() => setMode("normal")}
            className={`cursor-pointer px-2.5 py-1 font-sans text-xs font-bold transition-all ${
              mode === "normal"
                ? "border-2 border-fd-foreground bg-fd-primary text-fd-primary-foreground shadow-[2px_2px_0px_0px_var(--color-fd-foreground)]"
                : "text-fd-muted-foreground hover:text-fd-foreground"
            }`}
          >
            Trimmed Context
          </button>
          <button
            type="button"
            onClick={() => setMode("bloated")}
            className={`cursor-pointer px-2.5 py-1 font-sans text-xs font-bold transition-all ${
              mode === "bloated"
                ? "border-2 border-fd-foreground bg-amber-500 text-black shadow-[2px_2px_0px_0px_var(--color-fd-foreground)]"
                : "text-fd-muted-foreground hover:text-fd-foreground"
            }`}
          >
            Bloated Log Output
          </button>
        </div>
      </div>

      {/* Usage Meter */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="uppercase tracking-wider text-fd-muted-foreground">
            Window Capacity (128K Tokens)
          </span>
          <span className={usagePercent > 70 ? "font-extrabold text-amber-600 dark:text-amber-400" : ""}>
            {totalUsed.toLocaleString()} / {TOTAL_CAPACITY.toLocaleString()} tokens ({usagePercent}%)
          </span>
        </div>
        <div className="mt-1.5 flex h-3.5 w-full overflow-hidden border-2 border-fd-foreground bg-fd-secondary">
          {BLOCKS.map((b) => {
            const tokens = mode === "bloated" && b.tokensBloated ? b.tokensBloated : b.tokens;
            const pct = (tokens / TOTAL_CAPACITY) * 100;
            return (
              <div
                key={b.id}
                style={{ width: `${pct}%` }}
                className={`h-full transition-all duration-300 ${b.badgeClass}`}
                title={`${b.name}: ${tokens.toLocaleString()} tokens`}
              />
            );
          })}
        </div>
      </div>

      {/* Main Grid: Stacked Blocks + Detail Panel */}
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        {/* Visual Prompt Stack */}
        <div className="border-2 border-fd-foreground bg-fd-background p-3">
          <div className="mb-2.5 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-fd-muted-foreground">
            <span>Prompt Payload Breakdown</span>
            <span>Click to inspect</span>
          </div>

          <div className="space-y-2">
            {BLOCKS.map((b) => {
              const tokens = mode === "bloated" && b.tokensBloated ? b.tokensBloated : b.tokens;
              const pctOfUsed = Math.round((tokens / totalUsed) * 100);
              const isActive = b.id === activeId;

              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setActiveId(b.id)}
                  className={`group flex w-full cursor-pointer items-center justify-between gap-3 border-2 p-2.5 text-left transition-all ${
                    b.borderClass
                  } ${b.colorClass} ${
                    isActive
                      ? "ring-2 ring-fd-foreground shadow-[3px_3px_0px_0px_var(--color-fd-foreground)] -translate-y-0.5"
                      : "opacity-85 hover:opacity-100 hover:-translate-y-0.5"
                  }`}
                >
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    <span className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${b.badgeClass}`} />
                    <span className="font-sans text-xs font-bold text-fd-foreground">
                      {b.name}
                    </span>
                    {mode === "bloated" && b.id === "tools" && (
                      <span className="shrink-0 border border-amber-600 bg-amber-500/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-700 dark:text-amber-300">
                        +2,000 line log
                      </span>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5 font-mono text-xs font-semibold text-fd-muted-foreground">
                    <span className="whitespace-nowrap">{tokens.toLocaleString()} tokens</span>
                    <span className="w-10 text-right font-bold text-fd-foreground">
                      ({pctOfUsed}%)
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Block Info Box */}
        <div className="flex flex-col justify-between border-2 border-fd-foreground bg-fd-background p-4">
          <div>
            <div className="flex items-center justify-between border-b-2 border-fd-foreground pb-2">
              <span className={`px-2 py-0.5 font-sans text-xs font-bold text-white ${activeBlock.badgeClass}`}>
                {activeBlock.name}
              </span>
              <span className="font-mono text-xs font-bold text-fd-muted-foreground">
                {(
                  mode === "bloated" && activeBlock.tokensBloated
                    ? activeBlock.tokensBloated
                    : activeBlock.tokens
                ).toLocaleString()}{" "}
                tokens
              </span>
            </div>

            <p className="mt-3 font-sans text-xs leading-relaxed text-fd-foreground">
              {activeBlock.description}
            </p>

            {mode === "bloated" && activeBlock.id === "tools" && (
              <div className="mt-3 border-2 border-dashed border-amber-500 bg-amber-500/10 p-2.5 font-sans text-xs text-amber-800 dark:text-amber-200">
                <strong className="block font-bold">⚠️ Context Competition:</strong>
                Raw terminal output from a 2,000-line build log consumes over 50% of the entire window, crowding out conversation history and file definitions.
              </div>
            )}
          </div>

          <div className="mt-4 border-t-2 border-fd-foreground pt-3 text-[11px] font-sans text-fd-muted-foreground">
            💡 <strong className="text-fd-foreground">Key Takeaway:</strong> Everything in this stack is sent to the LLM on <em>every single API call</em>.
          </div>
        </div>
      </div>
    </div>
  );
}
