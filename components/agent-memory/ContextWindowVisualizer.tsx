"use client";

import { useState } from "react";

type ContextBlock = {
  id: string;
  name: string;
  category: "system" | "rules" | "history" | "records" | "tools" | "plan";
  tokens: number;
  tokensBloated?: number;
  description: string;
  colorClass: string;
  borderClass: string;
  badgeClass: string;
  activeRingClass: string;
};

const BLOCKS: ContextBlock[] = [
  {
    id: "system",
    name: "Support Agent Instructions",
    category: "system",
    tokens: 2500,
    tokensBloated: 2500,
    description: "The agent's support role, available actions, and safety boundaries.",
    colorClass: "bg-purple-100/70 text-purple-900 dark:bg-purple-950/40 dark:text-purple-300",
    borderClass: "border-purple-300 dark:border-purple-500/40",
    badgeClass: "bg-purple-700 text-white dark:bg-purple-500",
    activeRingClass: "ring-purple-400/70 dark:ring-fd-foreground",
  },
  {
    id: "rules",
    name: "Support Policies",
    category: "rules",
    tokens: 4000,
    tokensBloated: 4000,
    description: "Refund eligibility, identity verification, privacy, and escalation rules.",
    colorClass: "bg-slate-100/80 text-slate-900 dark:bg-slate-900/60 dark:text-slate-300",
    borderClass: "border-slate-300 dark:border-slate-500/40",
    badgeClass: "bg-slate-700 text-white dark:bg-slate-500",
    activeRingClass: "ring-slate-400/70 dark:ring-fd-foreground",
  },
  {
    id: "history",
    name: "Current Case Conversation",
    category: "history",
    tokens: 12000,
    tokensBloated: 12000,
    description: "Messages between the customer, the human support agent, and the AI assistant.",
    colorClass: "bg-sky-100/70 text-sky-900 dark:bg-sky-950/40 dark:text-sky-300",
    borderClass: "border-sky-300 dark:border-sky-500/40",
    badgeClass: "bg-sky-700 text-white dark:bg-sky-500",
    activeRingClass: "ring-sky-400/70 dark:ring-fd-foreground",
  },
  {
    id: "records",
    name: "Customer & Order Records",
    category: "records",
    tokens: 18000,
    tokensBloated: 18000,
    description: "Customer profile, order history, billing records, and related support cases.",
    colorClass: "bg-teal-100/70 text-teal-900 dark:bg-teal-950/40 dark:text-teal-300",
    borderClass: "border-teal-300 dark:border-teal-500/40",
    badgeClass: "bg-teal-700 text-white dark:bg-teal-500",
    activeRingClass: "ring-teal-400/70 dark:ring-fd-foreground",
  },
  {
    id: "tools",
    name: "CRM & API Results",
    category: "tools",
    tokens: 16000,
    tokensBloated: 68000, // Bloated mode: huge 2,000-line CRM export
    description: "CRM searches, payment-provider responses, and knowledge-base results.",
    colorClass: "bg-amber-100/70 text-amber-950 dark:bg-amber-950/40 dark:text-amber-300",
    borderClass: "border-amber-300 dark:border-amber-500/40",
    badgeClass: "bg-amber-700 text-white dark:bg-amber-500 dark:text-black",
    activeRingClass: "ring-amber-400/70 dark:ring-fd-foreground",
  },
  {
    id: "plan",
    name: "Case Resolution Plan",
    category: "plan",
    tokens: 1500,
    tokensBloated: 1500,
    description: "The current diagnosis, next support action, and escalation status.",
    colorClass: "bg-rose-100/70 text-rose-900 dark:bg-rose-950/40 dark:text-rose-300",
    borderClass: "border-rose-300 dark:border-rose-500/40",
    badgeClass: "bg-rose-700 text-white dark:bg-rose-500",
    activeRingClass: "ring-rose-400/70 dark:ring-fd-foreground",
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
            Support Agent Context
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
            Focused Context
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
            Raw CRM Export
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
            <span>Support Case Context</span>
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
                      ? `ring-2 ${b.activeRingClass} shadow-[3px_3px_0px_0px_var(--color-fd-foreground)] -translate-y-0.5`
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
                        +2,000 line CRM export
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

            <div
              aria-hidden={mode !== "bloated" || activeBlock.id !== "tools"}
              className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${
                mode === "bloated" && activeBlock.id === "tools"
                  ? "mt-3 grid-rows-[1fr] opacity-100"
                  : "mt-0 grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="border-2 border-dashed border-amber-500 bg-amber-500/10 p-2.5 font-sans text-xs text-amber-800 dark:text-amber-200">
                  <strong className="block font-bold">⚠️ Context Competition:</strong>
                  A raw 2,000-line CRM export consumes over 50% of the entire window, crowding out the customer's conversation, support policies, and resolution plan.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t-2 border-fd-foreground pt-3 text-[11px] font-sans text-fd-muted-foreground">
            💡 <strong className="text-fd-foreground">Key Takeaway:</strong> Everything in this stack is sent to the LLM on <em>every single API call</em>.
          </div>
        </div>
      </div>
    </div>
  );
}
