"use client";

import { useState } from "react";

// Simulated ECG-like sequence
const sequence = [0.1, 0.2, 0.5, 0.9, -0.6, -0.2, 0.1, 0.2, 0.3, 0.1];

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
  
  // Calculate states up to current step
  const states = [[0.0, 0.0, 0.0]]; // Initial state
  for (let i = 0; i < step; i++) {
    states.push(computeNextState(sequence[i], states[i]));
  }
  
  const currentState = states[step];
  const previousState = step > 0 ? states[step - 1] : [0.0, 0.0, 0.0];
  const currentInput = sequence[step] !== undefined ? sequence[step] : null;

  const handleNext = () => {
    if (step < sequence.length) {
      setStep((s) => s + 1);
    }
  };

  const handleReset = () => {
    setStep(0);
  };

  return (
    <div className="my-8 border border-fd-border bg-fd-card p-4 sm:p-6 rounded-xl shadow-md overflow-hidden">
      <div className="mb-6 flex justify-between items-start flex-wrap gap-4">
        <div>
          <h3 className="mt-0 mb-1 text-lg font-bold text-fd-foreground">RNN Temporal Context</h3>
          <p className="text-sm text-fd-muted-foreground m-0 max-w-lg">
            Step through time to see how the hidden state (memory) updates by combining the current input with the past context.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleReset}
            className="px-3 py-1.5 text-sm rounded bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-secondary/80 transition-colors"
          >
            Reset
          </button>
          <button 
            onClick={handleNext}
            disabled={step >= sequence.length}
            className="px-3 py-1.5 text-sm rounded bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Step Forward
          </button>
        </div>
      </div>

      {/* Sequence Overview */}
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-fd-muted-foreground mb-2 font-semibold">Input Sequence (Time Series)</div>
        <div className="flex items-end h-24 gap-1 border-b border-fd-border pb-1">
          {sequence.map((val, i) => {
            const isPast = i < step;
            const isCurrent = i === step;
            const height = `${Math.abs(val) * 100}%`;
            const isNegative = val < 0;
            
            return (
              <div key={i} className="flex-1 flex flex-col justify-end h-full relative group">
                <div 
                  className={`w-full transition-all duration-300 ${isCurrent ? 'bg-fd-primary' : isPast ? 'bg-fd-primary/40' : 'bg-fd-muted'} ${isNegative ? 'mb-[-100%]' : ''}`} 
                  style={{ height, opacity: isNegative ? 0.8 : 1 }}
                />
                {/* Zero line indicator */}
                {isCurrent && <div className="absolute -bottom-6 w-full text-center text-xs text-fd-primary font-bold">t={i}</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* RNN Cell Visualization */}
      <div className="bg-fd-muted/30 rounded-lg p-6 border border-fd-border/50 relative">
        {step < sequence.length ? (
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            
            {/* Previous State */}
            <div className="flex flex-col items-center gap-2 w-32">
              <div className="text-xs uppercase tracking-wider text-fd-muted-foreground font-semibold text-center">Previous State<br/>$h_{`{t-1}`}$</div>
              <div className="flex flex-col gap-1 w-full bg-fd-background border border-fd-border p-2 rounded shadow-sm">
                {previousState.map((v, i) => (
                  <div key={i} className="h-4 bg-fd-secondary w-full rounded overflow-hidden">
                    <div 
                      className="h-full bg-indigo-400 transition-all duration-500" 
                      style={{ width: `${(v + 1) * 50}%` }} 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Plus / Combine */}
            <div className="text-fd-muted-foreground font-bold text-xl">+</div>

            {/* Current Input */}
            <div className="flex flex-col items-center gap-2 w-24">
              <div className="text-xs uppercase tracking-wider text-fd-muted-foreground font-semibold text-center">Current Input<br/>$x_t$</div>
              <div className="w-16 h-16 rounded-full border-2 border-fd-primary flex items-center justify-center bg-fd-primary/10 text-fd-primary font-mono font-bold text-lg shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                {currentInput?.toFixed(1)}
              </div>
            </div>

            {/* Arrow */}
            <div className="text-fd-muted-foreground font-bold text-2xl">→</div>

            {/* Next State */}
            <div className="flex flex-col items-center gap-2 w-32">
              <div className="text-xs uppercase tracking-wider text-fd-primary font-semibold text-center">New State<br/>$h_t$</div>
              <div className="flex flex-col gap-1 w-full bg-fd-primary/5 border-2 border-fd-primary/50 p-2 rounded shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                {currentState.map((v, i) => (
                  <div key={i} className="h-4 bg-fd-secondary w-full rounded overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-500" 
                      style={{ width: `${(v + 1) * 50}%` }} 
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-fd-muted-foreground">
            <p className="font-semibold text-fd-foreground mb-2">Sequence Complete</p>
            <p className="text-sm text-center max-w-sm">The final hidden state now contains a compressed temporal representation of the entire waveform.</p>
            <button onClick={handleReset} className="mt-4 px-4 py-2 rounded bg-fd-primary text-fd-primary-foreground text-sm">Restart</button>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-fd-muted-foreground text-center">
        Notice how $h_t$ is not just based on the current float $x_t$, but heavily influenced by the context $h_{`{t-1}`}$ carried over from previous steps.
      </div>
    </div>
  );
};

export default TimeSeriesVisualizer;