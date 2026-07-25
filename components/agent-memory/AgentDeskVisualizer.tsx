"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

type CardTone = "default" | "active" | "muted" | "success";

type MemoryCard = {
  id: string;
  title: string;
  detail: string;
  tone?: CardTone;
};

type DeskStep = {
  title: string;
  description: string;
  contextUsage: number;
  desk: MemoryCard[];
  cabinet: MemoryCard[];
  handbook?: MemoryCard;
};

const steps: DeskStep[] = [
  {
    title: "A customer reports a duplicate charge",
    description: "Lisa opens the case with the customer's message and plenty of room in the context window.",
    contextUsage: 18,
    desk: [
      {
        id: "case",
        title: "Current case",
        detail: "Customer sees two card charges for order #1842",
        tone: "active",
      },
    ],
    cabinet: [],
  },
  {
    title: "The case fills the desk",
    description: "Conversation, CRM lookups, and payment results accumulate while Lisa investigates.",
    contextUsage: 92,
    desk: [
      {
        id: "case",
        title: "Current case",
        detail: "Customer sees two card charges for order #1842",
      },
      {
        id: "conversation",
        title: "Customer conversation",
        detail: "Card appeared to be charged twice after checkout",
      },
      {
        id: "payment",
        title: "Payment API",
        detail: "One charge settled; one authorization is pending",
        tone: "active",
      },
      {
        id: "attempts",
        title: "Actions considered",
        detail: "Refund, reversal check, or billing escalation",
        tone: "muted",
      },
    ],
    cabinet: [],
  },
  {
    title: "Compaction clears the desk",
    description: "The investigation becomes one checkpoint, preserving the useful facts without every lookup.",
    contextUsage: 34,
    desk: [
      {
        id: "case",
        title: "Current case",
        detail: "Resolve the duplicate-charge report for order #1842",
      },
      {
        id: "checkpoint",
        title: "Progress checkpoint",
        detail: "One payment settled; one authorization pending; do not refund yet",
        tone: "active",
      },
    ],
    cabinet: [],
  },
  {
    title: "Lisa's session ends",
    description: "The next session starts empty, but the case checkpoint survives in external storage.",
    contextUsage: 0,
    desk: [],
    cabinet: [
      {
        id: "checkpoint",
        title: "Case #1842 checkpoint",
        detail: "One settled payment and one pending authorization",
        tone: "active",
      },
    ],
  },
  {
    title: "John receives a similar case",
    description: "The agent retrieves Lisa's useful checkpoint instead of replaying her entire session.",
    contextUsage: 38,
    desk: [
      {
        id: "case",
        title: "Current case",
        detail: "Investigate two card charges for order #1977",
      },
      {
        id: "retrieved",
        title: "Retrieved memory",
        detail: "Compare transaction IDs and settlement states before refunding",
        tone: "active",
      },
    ],
    cabinet: [
      {
        id: "checkpoint",
        title: "Case #1842 checkpoint",
        detail: "Retrieved for this similar billing case",
        tone: "muted",
      },
      {
        id: "delivery",
        title: "Delivery delay case",
        detail: "Unrelated support history stays filed away",
        tone: "muted",
      },
    ],
  },
  {
    title: "The resolution becomes a procedure",
    description: "The agent keeps the useful lesson, so the next support case starts with a proven check.",
    contextUsage: 22,
    desk: [
      {
        id: "resolved",
        title: "Case resolved",
        detail: "The pending authorization reversed without a second charge",
        tone: "success",
      },
    ],
    cabinet: [
      {
        id: "session",
        title: "Case #1842",
        detail: "The full support transcript is archived",
        tone: "muted",
      },
    ],
    handbook: {
      id: "procedure",
      title: "Suspected duplicate charge",
      detail: "Compare transaction IDs and settlement states before refunding",
      tone: "active",
    },
  },
];

const toneClasses: Record<CardTone, string> = {
  default: "border-fd-foreground bg-fd-card text-fd-foreground",
  active:
    "border-fd-foreground bg-fd-primary text-fd-primary-foreground shadow-[3px_3px_0px_0px_var(--color-fd-foreground)]",
  muted: "border-dashed border-fd-muted-foreground bg-fd-secondary text-fd-muted-foreground",
  success:
    "border-fd-foreground bg-fd-foreground text-fd-background shadow-[3px_3px_0px_0px_var(--color-fd-primary)]",
};

function NoteCard({ card, step }: { card: MemoryCard; step: number }) {
  const tone = card.tone ?? "default";

  return (
    <div
      key={`${step}-${card.id}`}
      className={`animate-in fade-in slide-in-from-top-1 border-2 p-3 duration-300 motion-reduce:animate-none ${toneClasses[tone]}`}
    >
      <div className="text-[11px] font-bold uppercase tracking-wider">{card.title}</div>
      <div className="mt-1 font-sans text-xs leading-5">{card.detail}</div>
    </div>
  );
}

export default function AgentDeskVisualizer() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const current = steps[step];
  const isComplete = step === steps.length - 1;

  const handleNext = () => {
    setIsPlaying(false);
    setStep((value) => Math.min(value + 1, steps.length - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStep(0);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setStep((value) => {
        if (value >= steps.length - 1) return value;
        return value + 1;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (isComplete) setIsPlaying(false);
  }, [isComplete]);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const updateHeight = () => setContentHeight(content.offsetHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(content);

    return () => observer.disconnect();
  }, [step]);

  return (
    <div className="my-8 overflow-hidden border-2 border-fd-foreground bg-fd-card p-4 font-mono text-sm text-fd-foreground shadow-[6px_6px_0px_0px_var(--color-fd-foreground)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-fd-foreground pb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-fd-primary">Support memory intuition</p>
          <h3 className="mt-1 text-xl font-semibold uppercase">The support agent's desk</h3>
        </div>

        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 cursor-pointer border-2 border-fd-foreground bg-fd-background px-3 py-1 text-sm font-semibold transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-fd-secondary hover:shadow-[3px_3px_0px_0px_var(--color-fd-foreground)] sm:flex-none"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={isComplete || isPlaying}
            className="flex-1 cursor-pointer border-2 border-fd-foreground bg-fd-primary px-3 py-1 text-sm font-semibold text-fd-primary-foreground shadow-[3px_3px_0px_0px_var(--color-fd-foreground)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-fd-secondary disabled:text-fd-muted-foreground disabled:shadow-none sm:flex-none"
          >
            Step Forward
          </button>
          <button
            type="button"
            onClick={() => setIsPlaying((value) => !value)}
            disabled={isComplete}
            className={`flex-1 cursor-pointer border-2 border-fd-foreground px-3 py-1 text-sm font-semibold transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--color-fd-foreground)] disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-fd-secondary disabled:text-fd-muted-foreground disabled:shadow-none sm:flex-none ${
              isPlaying
                ? "bg-fd-primary text-fd-primary-foreground"
                : "bg-fd-background text-fd-foreground hover:bg-fd-secondary"
            }`}
          >
            {isPlaying ? "Pause ⏸" : "Play ▶"}
          </button>
        </div>
      </div>

      <div
        className="overflow-hidden transition-[height] duration-300 ease-out motion-reduce:transition-none"
        style={{ height: contentHeight ?? undefined }}
      >
        <div ref={contentRef} className="pt-3">
          <div className="grid grid-cols-6 gap-1" aria-label={`Step ${step + 1} of ${steps.length}`}>
            {steps.map((item, index) => (
              <div
                key={item.title}
                className={`h-2 border border-fd-foreground transition-colors ${
                  index <= step ? "bg-fd-primary" : "bg-fd-secondary"
                }`}
              />
            ))}
          </div>

          <div
            className="mt-3 grid gap-2 border-2 border-fd-foreground bg-fd-background p-3 sm:grid-cols-[15rem_1fr] sm:items-center sm:gap-4"
            aria-live="polite"
          >
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-fd-primary">
                Step {step + 1} of {steps.length}
              </div>
              <h4 className="mt-1 text-sm font-semibold uppercase">{current.title}</h4>
            </div>
            <p className="m-0 font-sans text-sm leading-5 text-fd-muted-foreground">{current.description}</p>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] lg:items-start">
            <section className="border-2 border-fd-foreground bg-fd-background p-3">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h4 className="m-0 text-xs font-bold uppercase tracking-widest">Current case desk</h4>
                  <p className="mt-1 font-sans text-xs text-fd-muted-foreground">Only this case context reaches the model</p>
                </div>
                <span className="shrink-0 text-xs font-bold">{current.contextUsage}% full</span>
              </div>

              <div className="mt-2 h-2 overflow-hidden border-2 border-fd-foreground bg-fd-secondary">
                <div
                  className={`h-full transition-[width,background-color] duration-500 ${
                    current.contextUsage > 80 ? "bg-fd-foreground" : "bg-fd-primary"
                  }`}
                  style={{ width: `${current.contextUsage}%` }}
                />
              </div>

              <div className="mt-3 min-h-36 border-x-2 border-t-2 border-fd-foreground bg-fd-card p-3">
                {current.desk.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {current.desk.map((card) => (
                      <NoteCard key={`${step}-${card.id}`} card={card} step={step} />
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-24 items-center justify-center border-2 border-dashed border-fd-muted-foreground bg-fd-secondary p-4 text-center font-sans text-sm text-fd-muted-foreground">
                    New support session. The context window is empty.
                  </div>
                )}
              </div>
              <div className="h-2 border-2 border-fd-foreground bg-fd-foreground" />
            </section>

            <div className="grid gap-3 sm:grid-cols-2 lg:contents">
              <section className="border-2 border-fd-foreground bg-fd-background p-3">
                <h4 className="m-0 text-xs font-bold uppercase tracking-widest">Filing cabinet</h4>
                <p className="mt-1 font-sans text-xs text-fd-muted-foreground">External memory</p>

                <div className="mt-3 space-y-2">
                  {current.cabinet.length > 0 ? (
                    current.cabinet.map((card) => <NoteCard key={`${step}-${card.id}`} card={card} step={step} />)
                  ) : (
                    <div className="border-2 border-dashed border-fd-muted-foreground bg-fd-secondary p-3 font-sans text-xs text-fd-muted-foreground">
                      No saved notes yet
                    </div>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-1.5" aria-hidden="true">
                  <div className="h-6 border-2 border-fd-foreground bg-fd-secondary">
                    <div className="mx-auto mt-1.5 h-1 w-10 bg-fd-foreground" />
                  </div>
                  <div className="h-6 border-2 border-fd-foreground bg-fd-secondary">
                    <div className="mx-auto mt-1.5 h-1 w-10 bg-fd-foreground" />
                  </div>
                </div>
              </section>

              <section className="border-2 border-fd-foreground bg-fd-background p-3">
                <h4 className="m-0 text-xs font-bold uppercase tracking-widest">Handbook</h4>
                <p className="mt-1 font-sans text-xs text-fd-muted-foreground">Learned procedures</p>

                <div className="mt-3 border-l-4 border-fd-primary bg-fd-card p-2">
                  {current.handbook ? (
                    <NoteCard card={current.handbook} step={step} />
                  ) : (
                    <div className="font-sans text-xs leading-5 text-fd-muted-foreground">
                      No reusable lesson has been written.
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
