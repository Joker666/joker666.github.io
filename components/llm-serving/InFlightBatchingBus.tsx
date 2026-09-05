"use client";

import { useEffect, useMemo, useState } from "react";
import { useMeasuredHeight } from "@/lib/use-measured-height";
import {
  type Mode,
  type Seat,
  countWastedSeatSteps,
  inFlightSchedule,
  modeCopy,
  staticSchedule,
  steps,
  waitingInFlight,
  waitingStatic,
} from "./batch-schedules";

const SeatBox = ({ seat }: { seat: Seat }) => {
  const isEmpty = seat.name === "empty";
  const [contentRef, height] = useMeasuredHeight();

  return (
    <div
      className={`overflow-hidden border-2 transition-[height] duration-200 ease-out motion-reduce:transition-none ${
        isEmpty
          ? "border-dashed border-fd-muted-foreground bg-fd-secondary text-fd-muted-foreground"
          : seat.status === "boards"
            ? "border-fd-foreground bg-fd-primary text-fd-primary-foreground shadow-[3px_3px_0px_0px_var(--color-fd-foreground)]"
            : "border-fd-foreground bg-fd-card text-fd-foreground"
      }`}
      style={{ height: height ?? undefined }}
    >
      <div ref={contentRef} className="p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest">{isEmpty ? "idle slot" : "request"}</span>
          {!isEmpty && <span className="border border-current px-2 py-0.5 text-xs font-bold">{seat.name}</span>}
        </div>
        <div className="mt-3 text-sm font-semibold">
          {isEmpty ? "No token work" : `${seat.remaining} tokens left`}
        </div>
        {seat.status && (
          <div className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-current animate-in fade-in slide-in-from-top-1 duration-200">
            {seat.status === "boards" ? "boards now" : "finishes now"}
          </div>
        )}
      </div>
    </div>
  );
};

export default function InFlightBatchingBus() {
  const [mode, setMode] = useState<Mode>("inflight");
  const [step, setStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStep((prev) => (prev === 9 ? 1 : prev + 1));
    }, 1500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const schedule = mode === "static" ? staticSchedule : inFlightSchedule;
  const queue = mode === "static" ? waitingStatic : waitingInFlight;
  const seats = schedule[step];
  const waiting = queue[step];
  const wastedSeatSteps = countWastedSeatSteps(schedule, queue, step);
  const activeCopy = modeCopy[mode];

  const slotSummary = useMemo(() => {
    const occupied = seats.filter((seat) => seat.name !== "empty").length;
    return `${occupied}/3 active seats`;
  }, [seats]);

  const activeDetail = useMemo(() => {
    if (step === 9) {
      return mode === "static"
        ? "Only 3 requests (A, B, C) completed. Requests D, E, and F remained stranded in the queue."
        : "All 6 requests (A, B, C, D, E, F) completed successfully in 9 steps.";
    }
    return activeCopy.detail;
  }, [step, mode, activeCopy.detail]);

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

      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_14rem]">
        <div className="border-2 border-fd-foreground bg-fd-background p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div aria-live="polite">
              <div className="text-xs font-semibold uppercase tracking-widest text-fd-muted-foreground">
                {activeCopy.title}
              </div>
              <div className="mt-1 font-sans text-sm leading-6 text-fd-muted-foreground">{activeDetail}</div>
            </div>
            <div className="border-2 border-fd-primary bg-fd-card px-3 py-2 text-xs font-bold text-fd-primary">
              {slotSummary}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {seats.map((seat, index) => (
              <SeatBox key={index} seat={seat} />
            ))}
          </div>

          <div className="mt-5 border-t-2 border-fd-foreground pt-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-fd-muted-foreground">
                Token iteration
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setStep((prev) => (prev === 1 ? 9 : prev - 1));
                  }}
                  className="cursor-pointer border-2 border-fd-foreground bg-fd-card px-2 py-1 text-xs font-bold transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-fd-secondary hover:shadow-[2px_2px_0px_0px_var(--color-fd-foreground)] active:translate-x-0 active:translate-y-0 active:shadow-none"
                  title="Previous Step"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlaying((prev) => !prev)}
                  className={`cursor-pointer border-2 border-fd-foreground px-2 py-1 text-xs font-bold transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--color-fd-foreground)] active:translate-x-0 active:translate-y-0 active:shadow-none ${
                    isPlaying
                      ? "bg-fd-primary text-fd-primary-foreground"
                      : "bg-fd-card hover:bg-fd-secondary"
                  }`}
                  title={isPlaying ? "Pause Simulation" : "Play Simulation"}
                >
                  {isPlaying ? (
                    <>
                      Pause <span aria-hidden="true">⏸</span>
                    </>
                  ) : (
                    <>
                      Play <span aria-hidden="true">▶</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setStep((prev) => (prev === 9 ? 1 : prev + 1));
                  }}
                  className="cursor-pointer border-2 border-fd-foreground bg-fd-card px-2 py-1 text-xs font-bold transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-fd-secondary hover:shadow-[2px_2px_0px_0px_var(--color-fd-foreground)] active:translate-x-0 active:translate-y-0 active:shadow-none"
                  title="Next Step"
                >
                  Next
                </button>
              </div>
            </div>
            <div className="grid grid-cols-9 gap-1">
              {steps.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={step === item}
                  onClick={() => {
                    setIsPlaying(false);
                    setStep(item);
                  }}
                  className={`h-10 cursor-pointer border-2 text-xs font-bold transition-colors ${
                    step === item
                      ? "border-fd-foreground bg-fd-primary text-fd-primary-foreground"
                      : "border-fd-foreground bg-fd-card hover:bg-fd-secondary"
                  }`}
                >
                  {item === 9 ? "End" : item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-2 border-fd-foreground bg-fd-background p-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-fd-muted-foreground">Bus stop queue</div>
          <div className="mt-4 min-h-12 md:min-h-28 space-y-2">
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
            {wastedSeatSteps} wasted seat-step{wastedSeatSteps === 1 ? "" : "s"}
            <span className="mt-1 block font-sans text-[11px] font-normal text-fd-muted-foreground">
              Seats left idle so far while a request waited
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
