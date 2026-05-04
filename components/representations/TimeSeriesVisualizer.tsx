"use client";

import { useState } from "react";

// Simulated ECG-like sequence
const sequence = [0.1, 0.2, 0.5, 0.9, -0.6, -0.2, 0.1, 0.2, 0.3, 0.1];
const maxPositiveValue = Math.max(...sequence, 0);
const maxNegativeMagnitude = Math.max(...sequence.map((value) => Math.max(Math.abs(Math.min(value, 0)), 0)));
const positiveChartPercent = 65;
const negativeChartPercent = 35;

// A dummy function to simulate "hidden state" update
// We'll just generate some "features" based on the input and previous state to look cool.
const computeNextState = (x: number, prevState: number[]) => {
  return [
    Math.tanh(prevState[0] * 0.5 + x * 0.8),
    Math.tanh(prevState[1] * -0.4 + x * 1.2),
    Math.tanh(prevState[2] * 0.9 + x * -0.5),
  ];
};

const TimeSeriesVisualizer = () => {
  const [step, setStep] = useState(0);

  // Calculate states after processing each completed input.
  const states = [[0.0, 0.0, 0.0]]; // Initial state
  for (let i = 0; i < step; i++) {
    states.push(computeNextState(sequence[i], states[i]));
  }

  const previousState = states[step];
  const currentInput = sequence[step] !== undefined ? sequence[step] : null;
  const isComplete = step >= sequence.length;
  const currentState = currentInput !== null ? computeNextState(currentInput, previousState) : previousState;

  const handleNext = () => {
    if (step < sequence.length) {
      setStep((s) => s + 1);
    }
  };

  const handleReset = () => {
    setStep(0);
  };

  return (
    <div className="my-8 overflow-hidden border-2 border-fd-foreground bg-fd-card p-4 font-mono text-sm text-fd-foreground shadow-[6px_6px_0px_0px_var(--color-fd-foreground)] sm:p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b-2 border-fd-foreground pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-fd-primary">Sequence model intuition</p>
          <h3 className="mt-2 mb-2 text-xl font-semibold uppercase text-fd-foreground">RNN Temporal Context</h3>
          <p className="m-0 max-w-2xl font-sans text-sm leading-6 text-fd-muted-foreground">
            Step through time to see how the hidden state (memory) updates by combining the current input with the past context.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="cursor-pointer border-2 border-fd-foreground bg-fd-background px-3 py-1 text-sm font-semibold text-fd-foreground transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-fd-secondary hover:shadow-[3px_3px_0px_0px_var(--color-fd-foreground)]"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={step >= sequence.length}
            className="cursor-pointer border-2 border-fd-foreground bg-fd-primary px-3 py-1 text-sm font-semibold text-fd-primary-foreground shadow-[3px_3px_0px_0px_var(--color-fd-foreground)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-fd-secondary disabled:text-fd-muted-foreground disabled:shadow-none"
          >
            Step Forward
          </button>
        </div>
      </div>

      {/* Sequence Overview */}
      <div className="mb-8 border-2 border-fd-foreground bg-fd-background p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="text-xs font-semibold uppercase tracking-widest text-fd-muted-foreground">Input Sequence (Time Series)</div>
          <div className="shrink-0 border-2 border-fd-primary bg-fd-card px-2 py-1 text-xs font-bold text-fd-primary">
            t={Math.min(step, sequence.length - 1)}
          </div>
        </div>
        <div
          className="relative flex h-28 gap-1 overflow-hidden"
          style={{ "--zero-line": `${positiveChartPercent}%` } as React.CSSProperties}
        >
          <div className="absolute inset-x-0 top-[var(--zero-line)] border-b border-fd-border" />
          <div className="absolute inset-x-0 top-0 flex gap-1" style={{ height: `${positiveChartPercent}%` }}>
            {sequence.map((val, i) => {
              const isPast = i < step;
              const isCurrent = i === step;
              const height = val > 0 ? `${(val / maxPositiveValue) * 100}%` : "0%";

              return (
                <div key={i} className="relative h-full flex-1">
                  <div
                    className={`absolute bottom-0 w-full transition-all duration-300 ${isCurrent ? 'bg-fd-primary' : isPast ? 'bg-fd-primary/40' : 'bg-fd-muted'}`}
                    style={{ height }}
                  />
                </div>
              );
            })}
          </div>
          <div className="absolute inset-x-0 bottom-0 flex gap-1 pt-[1px]" style={{ height: `${negativeChartPercent}%` }}>
            {sequence.map((val, i) => {
              const isPast = i < step;
              const isCurrent = i === step;
              const height = val < 0 ? `${(Math.abs(val) / maxNegativeMagnitude) * 100}%` : "0%";

              return (
                <div key={i} className="relative h-full flex-1">
                  <div
                    className={`absolute top-0 w-full opacity-80 transition-all duration-300 ${isCurrent ? 'bg-fd-primary' : isPast ? 'bg-fd-primary/40' : 'bg-fd-muted'}`}
                    style={{ height }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RNN Cell Visualization */}
      <div className={`relative flex items-center justify-center overflow-hidden border-2 border-fd-foreground bg-fd-background p-6 ${isComplete ? 'h-[31rem] md:h-[17rem]' : 'h-[25rem] md:h-[13rem]'}`}>
        {!isComplete ? (
          <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:gap-8">

            <div className="flex w-full items-center justify-center gap-4 sm:gap-6 md:w-auto md:gap-8">
              {/* Previous State */}
              <div className="flex flex-col items-center gap-2 w-32">
                <div className="text-center text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">Previous State<br />$h_{`{t-1}`}$</div>
                <div className="flex w-full flex-col gap-1 border-2 border-fd-foreground bg-fd-card p-2">
                  {previousState.map((v, i) => (
                    <div key={i} className="h-4 w-full overflow-hidden border border-fd-foreground bg-fd-secondary">
                      <div
                        className="h-full bg-fd-foreground transition-all duration-500"
                        style={{ width: `${(v + 1) * 50}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Plus / Combine */}
              <div className="text-xl font-bold text-fd-muted-foreground md:mt-10">+</div>

              {/* Current Input */}
              <div className="flex flex-col items-center gap-2 w-24">
                <div className="whitespace-nowrap text-center text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">Current Input<br />$x_t$</div>
                <div className="flex h-16 w-16 items-center justify-center border-2 border-fd-primary bg-fd-card font-mono text-lg font-bold text-fd-primary shadow-[4px_4px_0px_0px_var(--color-fd-primary)]">
                  {currentInput?.toFixed(1)}
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="text-2xl font-bold text-fd-muted-foreground md:mt-10">→</div>

            {/* Next State */}
            <div className="flex flex-col items-center gap-2 w-32">
              <div className="text-center text-xs font-semibold uppercase tracking-wider text-fd-primary">New State<br />$h_t$</div>
              <div className="flex w-full flex-col gap-1 border-2 border-fd-primary bg-fd-card p-2 shadow-[4px_4px_0px_0px_var(--color-fd-primary)]">
                {currentState.map((v, i) => (
                  <div key={i} className="h-4 w-full overflow-hidden border border-fd-foreground bg-fd-secondary">
                    <div
                      className="h-full bg-fd-primary transition-all duration-500"
                      style={{ width: `${(v + 1) * 50}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-fd-muted-foreground">
            <p className="mb-2 font-semibold uppercase text-fd-foreground">Sequence Complete</p>
            <p className="max-w-sm text-center font-sans text-sm leading-6">The final hidden state now contains a compressed temporal representation of the entire waveform.</p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-4 cursor-pointer border-2 border-fd-foreground bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground shadow-[3px_3px_0px_0px_var(--color-fd-foreground)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              Restart
            </button>
          </div>
        )}
      </div>

      {!isComplete && (
        <div className="mt-4 flex h-20 items-center border-l-4 border-fd-primary bg-fd-background px-4 font-sans text-xs leading-5 text-fd-muted-foreground md:h-12">
          <span>
            Notice how $h_t$ is not just based on the current float $x_t$, but heavily influenced by the context $h_{`{t-1}`}$ carried over from previous steps.
          </span>
        </div>
      )}
    </div>
  );
};

export default TimeSeriesVisualizer;
