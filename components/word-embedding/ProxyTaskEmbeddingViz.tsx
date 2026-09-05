"use client";

import { useState } from "react";
import {
  EXAMPLES,
  MAP_RANGE,
  TRAINED_AT,
  UNIFORM_PROBABILITY,
  VOCAB,
  type Vec,
  type Weights,
  exampleAt,
  initialWeights,
  meanContextProbability,
  predict,
  train,
} from "./skipgram";

const VIEW_W = 240;
const VIEW_H = 160;
const RADIUS = 80;
// Slightly more than the rendered height of a 9-unit label (~11.9 units with
// ascenders and descenders), so stacked labels clear each other.
const LABEL_GAP = 13;

const project = ([x, y]: Vec): [number, number] => [
  VIEW_W / 2 + (x / MAP_RANGE) * RADIUS,
  VIEW_H / 2 - (y / MAP_RANGE) * RADIUS,
];

/**
 * Labels sit beside their dot, but training pulls words into tight clusters, so a
 * fixed offset per word always ends up colliding for some pair. Instead, stack each
 * side's labels top-to-bottom and push any that land too close to their neighbour.
 */
function layoutLabels(points: [number, number][]): number[] {
  const labelY = points.map(([, y]) => y + 3);
  const indices = points.map((_, i) => i);

  for (const side of [true, false]) {
    const column = indices
      .filter((i) => points[i][0] >= VIEW_W / 2 === side)
      .sort((a, b) => points[a][1] - points[b][1]);

    for (let k = 1; k < column.length; k++) {
      const above = labelY[column[k - 1]];
      if (labelY[column[k]] - above < LABEL_GAP) labelY[column[k]] = above + LABEL_GAP;
    }

    // If pushing down ran the stack off the bottom, slide the whole column back up.
    const last = column[column.length - 1];
    if (last !== undefined) {
      const overflow = labelY[last] - (VIEW_H - 4);
      if (overflow > 0) for (const i of column) labelY[i] -= overflow;
    }
  }

  return labelY;
}

const percent = (p: number) => `${Math.round(p * 100)}%`;

export default function ProxyTaskEmbeddingViz() {
  const [weights, setWeights] = useState<Weights>(initialWeights);
  const [previous, setPrevious] = useState<Weights>(initialWeights);
  const [stepCount, setStepCount] = useState(0);
  const [discarded, setDiscarded] = useState(false);

  const example = exampleAt(stepCount);
  const probabilities = predict(weights, example.center);
  const progress = meanContextProbability(weights);
  const centerVector = weights.w1[VOCAB.indexOf(example.center)];
  const isTrained = stepCount >= TRAINED_AT;
  const points = weights.w1.map(project);
  const labelYs = layoutLabels(points);

  const runTraining = (count: number) => {
    setPrevious(weights);
    setWeights(train(weights, stepCount, count));
    setStepCount(stepCount + count);
  };

  const reset = () => {
    const fresh = initialWeights();
    setWeights(fresh);
    setPrevious(fresh);
    setStepCount(0);
    setDiscarded(false);
  };

  const buttonBase =
    "cursor-pointer border-2 border-fd-foreground px-3 py-1 text-sm font-semibold transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--color-fd-foreground)] active:translate-x-0 active:translate-y-0 active:shadow-none";

  return (
    <div className="my-8 border-2 border-fd-foreground bg-fd-card p-4 font-mono text-sm text-fd-foreground shadow-[6px_6px_0px_0px_var(--color-fd-foreground)] sm:p-6">
      <div className="border-b-2 border-fd-foreground pb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-fd-primary">Word2Vec intuition</p>
        <h3 className="mt-1 text-xl font-semibold uppercase">Train the fake task, keep the map</h3>
        <p className="mt-2 max-w-2xl font-sans text-sm leading-6 text-fd-muted-foreground">
          A real skip-gram model, eight words, two-dimensional embeddings, training in your browser. Nothing is
          pre-computed. Press a button and watch the prediction improve as the words rearrange.
        </p>
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => runTraining(1)} className={`${buttonBase} bg-fd-background hover:bg-fd-secondary`}>
          Train ×1
        </button>
        <button
          type="button"
          onClick={() => runTraining(20)}
          className={`${buttonBase} bg-fd-primary text-fd-primary-foreground shadow-[3px_3px_0px_0px_var(--color-fd-foreground)]`}
        >
          Train ×20
        </button>
        <button type="button" onClick={reset} className={`${buttonBase} bg-fd-background hover:bg-fd-secondary`}>
          Reset
        </button>

        <div className="ml-auto flex flex-wrap items-center gap-2 text-xs font-bold" aria-live="polite">
          <span className="border-2 border-fd-foreground bg-fd-background px-2 py-1">{stepCount} steps</span>
          <span className="border-2 border-fd-primary bg-fd-card px-2 py-1 text-fd-primary">
            avg P(context) {percent(progress)}
          </span>
          <span className="font-sans font-normal text-fd-muted-foreground">chance {percent(UNIFORM_PROBABILITY)}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* Output layer -- the half that gets thrown away */}
        <section
          className={`border-2 p-4 transition-opacity duration-500 ${
            discarded
              ? "border-dashed border-fd-muted-foreground bg-fd-secondary/40 opacity-50"
              : "border-fd-foreground bg-fd-background"
          }`}
        >
          <div className="flex items-baseline justify-between gap-2">
            <h4 className="m-0 text-xs font-bold uppercase tracking-widest">Output layer</h4>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-fd-muted-foreground">
              {discarded ? "deleted" : "P(word | " + example.center + ")"}
            </span>
          </div>

          {/* The proxy task: this window's centre word has to predict its neighbours */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="mr-1 text-[10px] font-semibold uppercase tracking-widest text-fd-muted-foreground">
              Example {(stepCount % EXAMPLES.length) + 1}/{EXAMPLES.length}
            </span>
            <span className="border-2 border-fd-foreground bg-fd-primary px-2 py-0.5 font-semibold text-fd-primary-foreground">
              {example.center}
            </span>
            <span role="img" aria-label="predicts" className="font-bold text-fd-primary">
              →
            </span>
            {example.context.map((word) => (
              <span key={word} className="border-2 border-fd-foreground bg-fd-secondary px-2 py-0.5 font-semibold">
                {word}
              </span>
            ))}
          </div>

          <div className={`mt-3 space-y-1 ${discarded ? "line-through" : ""}`}>
            {VOCAB.map((word, i) => {
              const p = probabilities[i];
              const isTarget = example.context.includes(word);
              return (
                <div key={word} className="grid grid-cols-[5.5rem_1fr_2.5rem] items-center gap-2">
                  <span
                    className={`truncate text-[11px] ${isTarget ? "font-bold text-fd-foreground" : "text-fd-muted-foreground"}`}
                  >
                    {word}
                  </span>
                  <span className="h-3 border border-fd-foreground bg-fd-secondary">
                    <span
                      className={`block h-full transition-all duration-300 ${isTarget ? "bg-fd-primary" : "bg-fd-foreground/40"}`}
                      style={{ width: `${p * 100}%` }}
                    />
                  </span>
                  <span className="text-right font-mono text-[11px] text-fd-muted-foreground">{percent(p)}</span>
                </div>
              );
            })}
          </div>

          <p className="mt-3 font-sans text-xs leading-5 text-fd-muted-foreground">
            {discarded
              ? "Gone. The prediction task existed only to generate the error signal above."
              : "Highlighted rows are the true neighbours. Every miss becomes error that pushes the input embedding."}
          </p>
        </section>

        {/* W1 -- the artifact we keep */}
        <section className="border-2 border-fd-primary bg-fd-background p-4 shadow-[4px_4px_0px_0px_var(--color-fd-primary)]">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className="m-0 text-xs font-bold uppercase tracking-widest">Word map (W1)</h4>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-fd-primary">kept</span>
          </div>

          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="mt-2 w-full"
            role="img"
            aria-label={`Two-dimensional map of ${VOCAB.length} word embeddings after ${stepCount} training steps`}
          >
            <line x1={VIEW_W / 2} y1="6" x2={VIEW_W / 2} y2={VIEW_H - 6} stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
            <line x1="6" y1={VIEW_H / 2} x2={VIEW_W - 6} y2={VIEW_H / 2} stroke="currentColor" strokeWidth="0.5" opacity="0.15" />

            {VOCAB.map((word, i) => {
              const [x, y] = points[i];
              const [px, py] = project(previous.w1[i]);
              const isCenter = word === example.center;
              const isTarget = example.context.includes(word);
              const moved = Math.hypot(x - px, y - py) > 1.5;
              // Anchor labels away from the centre so the two clusters' text splits apart.
              const outward = x >= VIEW_W / 2;
              const labelX = outward ? x + 7 : x - 7;
              const labelY = labelYs[i];

              return (
                <g key={word}>
                  {moved && (
                    <>
                      <line x1={px} y1={py} x2={x} y2={y} stroke="currentColor" strokeWidth="1" opacity="0.25" />
                      <circle cx={px} cy={py} r="2" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.3" />
                    </>
                  )}
                  {Math.abs(labelY - (y + 3)) > 4 && (
                    <line x1={x} y1={y} x2={labelX} y2={labelY - 3} stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={isCenter ? 5 : 3.5}
                    className={isCenter || isTarget ? "fill-fd-primary" : "fill-fd-foreground"}
                    opacity={isCenter || isTarget ? 1 : 0.45}
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor={outward ? "start" : "end"}
                    className={`text-[9px] ${isCenter ? "fill-fd-primary font-bold" : "fill-fd-muted-foreground"}`}
                  >
                    {word}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="mt-2 font-mono text-xs text-fd-primary">
            W1[{example.center}] = [{centerVector[0].toFixed(2)}, {centerVector[1].toFixed(2)}]
          </div>
          <p className="mt-2 font-sans text-xs leading-5 text-fd-muted-foreground">
            Rings show where each word sat before the last click. The groups form from shared neighbours alone.
          </p>
        </section>
      </div>

      {/* The trick */}
      {!discarded && isTrained && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-2 border-fd-primary bg-fd-card p-3">
          <p className="m-0 min-w-[14rem] flex-1 font-sans text-xs leading-5">
            The words are sorted. Now do what Word2Vec does with the output layer.
          </p>
          <button
            type="button"
            onClick={() => setDiscarded(true)}
            className={`${buttonBase} bg-fd-primary text-fd-primary-foreground shadow-[3px_3px_0px_0px_var(--color-fd-foreground)]`}
          >
            Throw away the output layer <span aria-hidden="true">→</span>
          </button>
        </div>
      )}

      {discarded && (
        <div className="mt-4 border-2 border-fd-foreground bg-fd-secondary p-3 font-sans text-xs leading-5">
          What survives training is the lookup table on the right. The task we optimised is deleted. The geometry it
          forced into W1 is the entire point.
        </div>
      )}

      {!isTrained && (
        <p className="mt-4 font-sans text-xs leading-5 text-fd-muted-foreground">
          Keep training until the words settle into two groups ({TRAINED_AT} steps is plenty), then the last step
          unlocks.
        </p>
      )}
    </div>
  );
}
