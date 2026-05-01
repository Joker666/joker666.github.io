"use client";

import { useState } from "react";

const EmbeddingVisualizer = () => {
  const [selectedIndex, setSelectedIndex] = useState(1);

  const vocabulary = ["machine", "learning", "model", "data", "algorithm"];

  // Simulated 5x3 hidden layer weight matrix (W1)
  const weightMatrix = [
    [0.42, -0.11, 0.89],
    [-0.76, 0.55, 0.23],
    [0.12, 0.94, -0.34],
    [-0.55, -0.88, 0.11],
    [0.99, -0.22, 0.45],
  ];

  return (
    <div className="my-8 border-2 border-fd-foreground bg-fd-card p-4 font-mono text-sm text-fd-foreground shadow-[6px_6px_0px_0px_var(--color-fd-foreground)] sm:p-6">
      <div className="mb-6 border-b-2 border-fd-foreground pb-4">
        <h3 className="mt-0 mb-2 text-lg font-semibold uppercase text-fd-foreground">The "Lookup Table" Trick</h3>
        <p className="font-sans text-sm leading-relaxed text-fd-muted-foreground">
          Click a word to see how the one-hot input isolates a specific row in the hidden layer weights ($W_1$).
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 overflow-x-auto">
        {/* 1. One-Hot Input Vector */}
        <div className="flex flex-col items-center">
          <div className="mb-2 font-semibold uppercase tracking-widest text-fd-foreground">1. Input Word</div>
          <div className="flex flex-col gap-1">
            {vocabulary.map((word, i) => (
              <button
                key={word}
                onClick={() => setSelectedIndex(i)}
                className={`flex cursor-pointer items-center gap-3 border px-3 py-1 transition-colors ${
                  selectedIndex === i
                    ? "border-fd-foreground bg-fd-primary text-fd-primary-foreground"
                    : "border-transparent text-fd-muted-foreground hover:border-fd-foreground hover:bg-fd-secondary hover:text-fd-foreground"
                }`}
              >
                <span className="w-20 text-right">{word}</span>
                <span
                  className={`w-8 border text-center ${selectedIndex === i ? "border-fd-primary-foreground bg-fd-foreground font-bold text-fd-background" : "border-fd-foreground bg-fd-secondary text-fd-foreground"}`}
                >
                  {selectedIndex === i ? "1" : "0"}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-2 text-xs uppercase tracking-widest text-fd-muted-foreground">1x5 One-Hot Vector</div>
        </div>

        <div className="text-2xl font-bold text-fd-primary">×</div>

        {/* 2. Hidden Layer Weight Matrix (W1) */}
        <div className="flex flex-col items-center">
          <div className="mb-2 font-semibold uppercase tracking-widest text-fd-foreground">2. Hidden Layer ($W_1$)</div>
          <div className="border-2 border-fd-foreground bg-fd-background p-3">
            <div className="flex flex-col gap-1">
              {weightMatrix.map((row, i) => (
                <div
                  key={i}
                  className={`flex gap-2 border p-1 transition-colors ${
                    selectedIndex === i
                      ? "border-fd-foreground bg-fd-primary text-fd-primary-foreground"
                      : "border-transparent bg-fd-secondary text-fd-muted-foreground opacity-70"
                  }`}
                >
                  {row.map((val, j) => (
                    <span key={j} className={`w-12 text-center ${selectedIndex === i ? "font-bold" : ""}`}>
                      {val.toFixed(2)}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 text-xs uppercase tracking-widest text-fd-muted-foreground">5x3 Weight Matrix</div>
        </div>

        <div className="text-2xl font-bold text-fd-primary">=</div>

        {/* 3. Output Embedding */}
        <div className="flex flex-col items-center">
          <div className="mb-2 font-semibold uppercase tracking-widest text-fd-foreground">3. Word Embedding</div>
          <div className="border-2 border-fd-primary bg-fd-background p-3 shadow-[4px_4px_0px_0px_var(--color-fd-primary)]">
            <div className="flex gap-2 p-1">
              {weightMatrix[selectedIndex].map((val, j) => (
                <span key={j} className="w-12 text-center font-bold text-fd-primary">
                  {val.toFixed(2)}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-2 text-xs uppercase tracking-widest text-fd-muted-foreground">1x3 Dense Vector</div>
        </div>
      </div>
    </div>
  );
};

export default EmbeddingVisualizer;
