"use client";

import { useMemo, useState } from "react";

type Mode = "static" | "inflight";

type Seat = {
  name: string;
  remaining: number;
  status?: "finishes" | "boards" | "waiting";
};

const steps = [1, 2, 3, 4, 5, 6, 7, 8];

const waitingByStep: Record<number, string[]> = {
  1: [],
  2: ["D"],
  3: ["D"],
  4: ["E"],
  5: ["E"],
  6: ["F"],
  7: ["F"],
  8: [],
};

const staticSchedule: Record<number, Seat[]> = {
  1: [
    { name: "A", remaining: 7 },
    { name: "B", remaining: 1 },
    { name: "C", remaining: 5 },
  ],
  2: [
    { name: "A", remaining: 6 },
    { name: "B", remaining: 0, status: "finishes" },
    { name: "C", remaining: 4 },
  ],
  3: [
    { name: "A", remaining: 5 },
    { name: "empty", remaining: 0 },
    { name: "C", remaining: 3 },
  ],
  4: [
    { name: "A", remaining: 4 },
    { name: "empty", remaining: 0 },
    { name: "C", remaining: 2 },
  ],
  5: [
    { name: "A", remaining: 3 },
    { name: "empty", remaining: 0 },
    { name: "C", remaining: 1 },
  ],
  6: [
    { name: "A", remaining: 2 },
    { name: "empty", remaining: 0 },
    { name: "empty", remaining: 0 },
  ],
  7: [
    { name: "A", remaining: 1 },
    { name: "empty", remaining: 0 },
    { name: "empty", remaining: 0 },
  ],
  8: [
    { name: "A", remaining: 0, status: "finishes" },
    { name: "empty", remaining: 0 },
    { name: "empty", remaining: 0 },
  ],
};

const inFlightSchedule: Record<number, Seat[]> = {
  1: [
    { name: "A", remaining: 7 },
    { name: "B", remaining: 1 },
    { name: "C", remaining: 5 },
  ],
  2: [
    { name: "A", remaining: 6 },
    { name: "B", remaining: 0, status: "finishes" },
    { name: "C", remaining: 4 },
  ],
  3: [
    { name: "A", remaining: 5 },
    { name: "D", remaining: 3, status: "boards" },
    { name: "C", remaining: 3 },
  ],
  4: [
    { name: "A", remaining: 4 },
    { name: "D", remaining: 2 },
    { name: "C", remaining: 2 },
  ],
  5: [
    { name: "A", remaining: 3 },
    { name: "D", remaining: 1 },
    { name: "C", remaining: 1 },
  ],
  6: [
    { name: "A", remaining: 2 },
    { name: "D", remaining: 0, status: "finishes" },
    { name: "E", remaining: 2, status: "boards" },
  ],
  7: [
    { name: "A", remaining: 1 },
    { name: "F", remaining: 2, status: "boards" },
    { name: "E", remaining: 1 },
  ],
  8: [
    { name: "A", remaining: 0, status: "finishes" },
    { name: "F", remaining: 1 },
    { name: "E", remaining: 0, status: "finishes" },
  ],
};

const modeCopy: Record<Mode, { title: string; detail: string; metric: string }> = {
  static: {
    title: "Static batch",
    detail: "The bus leaves with A, B, and C. When B finishes early, the seat stays empty until the longest rider is done.",
    metric: "5 wasted seat-steps",
  },
  inflight: {
    title: "In-flight batch",
    detail: "The bus is already moving, but the scheduler keeps swapping riders at token boundaries when capacity opens up.",
    metric: "0 idle seats in this toy loop",
  },
};

const SeatBox = ({ seat }: { seat: Seat }) => {
  const isEmpty = seat.name === "empty";

  return (
    <div
      className={`min-h-24 border-2 p-3 transition-all ${
        isEmpty
          ? "border-dashed border-fd-muted-foreground bg-fd-secondary text-fd-muted-foreground"
          : seat.status === "boards"
            ? "border-fd-foreground bg-fd-primary text-fd-primary-foreground shadow-[3px_3px_0px_0px_var(--color-fd-foreground)]"
            : "border-fd-foreground bg-fd-card text-fd-foreground"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest">{isEmpty ? "idle slot" : "request"}</span>
        {!isEmpty && <span className="border border-current px-2 py-0.5 text-xs font-bold">{seat.name}</span>}
      </div>
      <div className="mt-3 text-sm font-semibold">
        {isEmpty ? "No token work" : `${seat.remaining} tokens left`}
      </div>
      {seat.status && (
        <div className="mt-2 text-[11px] font-semibold uppercase tracking-widest">
          {seat.status === "boards" ? "boards now" : "finishes now"}
        </div>
      )}
    </div>
  );
};

export default function InFlightBatchingBus() {
  const [mode, setMode] = useState<Mode>("inflight");
  const [step, setStep] = useState(1);

  const schedule = mode === "static" ? staticSchedule : inFlightSchedule;
  const seats = schedule[step];
  const waiting = waitingByStep[step];
  const activeCopy = modeCopy[mode];

  const slotSummary = useMemo(() => {
    const occupied = seats.filter((seat) => seat.name !== "empty").length;
    return `${occupied}/3 active seats`;
  }, [seats]);

  return (
    <div className="my-8 border-2 border-fd-foreground bg-fd-card p-4 font-mono text-sm text-fd-foreground shadow-[6px_6px_0px_0px_var(--color-fd-foreground)] sm:p-6">
      <div className="border-b-2 border-fd-foreground pb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-fd-primary">LLM serving intuition</p>
        <h3 className="mt-2 text-xl font-semibold uppercase">The bus that changes passengers while moving</h3>
        <p className="mt-3 max-w-2xl font-sans text-sm leading-6 text-fd-muted-foreground">
          Each seat is a batch slot backed by GPU memory and KV cache. Each tick is one generation iteration.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {(["inflight", "static"] as Mode[]).map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={mode === item}
            onClick={() => {
              setMode(item);
              setStep(1);
            }}
            className={`cursor-pointer border-2 px-3 py-1 text-sm font-semibold transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 ${
              mode === item
                ? "border-fd-foreground bg-fd-primary text-fd-primary-foreground shadow-[3px_3px_0px_0px_var(--color-fd-foreground)]"
                : "border-fd-foreground bg-fd-background text-fd-foreground hover:bg-fd-secondary hover:shadow-[3px_3px_0px_0px_var(--color-fd-foreground)]"
            }`}
          >
            {item === "inflight" ? "In-flight" : "Static"}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_12rem]">
        <div className="border-2 border-fd-foreground bg-fd-background p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-fd-muted-foreground">
                {activeCopy.title}
              </div>
              <div className="mt-1 font-sans text-sm leading-6 text-fd-muted-foreground">{activeCopy.detail}</div>
            </div>
            <div className="border-2 border-fd-primary bg-fd-card px-3 py-2 text-xs font-bold text-fd-primary">
              {slotSummary}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {seats.map((seat, index) => (
              <SeatBox key={`${step}-${index}-${seat.name}`} seat={seat} />
            ))}
          </div>

          <div className="mt-5 border-t-2 border-fd-foreground pt-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-fd-muted-foreground">
              Token iteration
            </div>
            <div className="grid grid-cols-8 gap-1">
              {steps.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStep(item)}
                  className={`h-10 cursor-pointer border-2 text-xs font-bold transition-colors ${
                    step === item
                      ? "border-fd-foreground bg-fd-primary text-fd-primary-foreground"
                      : "border-fd-foreground bg-fd-card hover:bg-fd-secondary"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-2 border-fd-foreground bg-fd-background p-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-fd-muted-foreground">Bus stop queue</div>
          <div className="mt-4 min-h-28 space-y-2">
            {waiting.length === 0 ? (
              <div className="border-2 border-dashed border-fd-muted-foreground bg-fd-secondary p-3 text-sm text-fd-muted-foreground">
                nobody waiting
              </div>
            ) : (
              waiting.map((request) => (
                <div key={request} className="border-2 border-fd-foreground bg-fd-card p-3 font-semibold">
                  Request {request}
                </div>
              ))
            )}
          </div>
          <div className="mt-5 border-2 border-fd-primary bg-fd-card p-3 text-xs font-bold text-fd-primary">
            {activeCopy.metric}
          </div>
        </div>
      </div>
    </div>
  );
}
