"use client";

import { useState } from 'react';

const EmbeddingVisualizer = () => {
  const [selectedIndex, setSelectedIndex] = useState(1); // Default to 'learning'

  const vocabulary = ["machine", "learning", "model", "data", "algorithm"];

  // Simulated 5x3 hidden layer weight matrix (W1)
  const weightMatrix = [
    [0.42, -0.11, 0.89],
    [-0.76, 0.55, 0.23],
    [0.12, 0.94, -0.34],
    [-0.55, -0.88, 0.11],
    [0.99, -0.22, 0.45]
  ];

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 my-8 font-mono text-sm">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">The "Lookup Table" Trick</h3>
        <p className="text-slate-600 dark:text-slate-400 font-sans">
          Click a word to see how the one-hot input isolates a specific row in the hidden layer weights ($W_1$).
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 overflow-x-auto">

        {/* 1. One-Hot Input Vector */}
        <div className="flex flex-col items-center">
          <div className="mb-2 font-semibold text-slate-700 dark:text-slate-300">1. Input Word</div>
          <div className="flex flex-col gap-1">
            {vocabulary.map((word, i) => (
              <button
                key={word}
                onClick={() => setSelectedIndex(i)}
                className={`flex items-center gap-3 px-3 py-1 rounded transition-colors ${selectedIndex === i
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 ring-1 ring-blue-400'
                    : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500'
                  }`}
              >
                <span className="w-20 text-right">{word}</span>
                <span className={`w-8 text-center rounded ${selectedIndex === i ? 'font-bold bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  {selectedIndex === i ? '1' : '0'}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-2 text-xs text-slate-500">1x5 One-Hot Vector</div>
        </div>

        <div className="text-2xl font-bold text-slate-400">×</div>

        {/* 2. Hidden Layer Weight Matrix (W1) */}
        <div className="flex flex-col items-center">
          <div className="mb-2 font-semibold text-slate-700 dark:text-slate-300">2. Hidden Layer ($W_1$)</div>
          <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-inner">
            <div className="flex flex-col gap-1">
              {weightMatrix.map((row, i) => (
                <div
                  key={i}
                  className={`flex gap-2 p-1 rounded transition-colors ${selectedIndex === i ? 'bg-green-100 dark:bg-green-900/40 ring-1 ring-green-400' : 'opacity-40'
                    }`}
                >
                  {row.map((val, j) => (
                    <span key={j} className={`w-12 text-center ${selectedIndex === i ? 'text-green-800 dark:text-green-300 font-bold' : 'text-slate-500'}`}>
                      {val.toFixed(2)}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-500">5x3 Weight Matrix</div>
        </div>

        <div className="text-2xl font-bold text-slate-400">=</div>

        {/* 3. Output Embedding */}
        <div className="flex flex-col items-center">
          <div className="mb-2 font-semibold text-slate-700 dark:text-slate-300">3. Word Embedding</div>
          <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-green-300 dark:border-green-800 shadow-md">
            <div className="flex gap-2 p-1">
              {weightMatrix[selectedIndex].map((val, j) => (
                <span key={j} className="w-12 text-center text-green-700 dark:text-green-400 font-bold">
                  {val.toFixed(2)}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-500">1x3 Dense Vector</div>
        </div>

      </div>
    </div>
  );
};

export default EmbeddingVisualizer;
