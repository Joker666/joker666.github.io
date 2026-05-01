"use client";

import { useMemo, useState } from "react";

const examples = [
  {
    sentence: ["machine", "learning", "algorithms", "use", "data"],
    center: "learning",
    context: ["machine", "algorithms"],
    prediction: {
      machine: 0.42,
      algorithms: 0.31,
      data: 0.15,
      model: 0.08,
      weather: 0.04,
    },
    embedding: [0.41, -0.22, 0.88],
  },
  {
    sentence: ["neural", "network", "model", "learns", "patterns"],
    center: "model",
    context: ["network", "learns"],
    prediction: {
      network: 0.36,
      learns: 0.29,
      data: 0.18,
      training: 0.11,
      banana: 0.06,
    },
    embedding: [0.29, 0.58, 0.51],
  },
  {
    sentence: ["training", "data", "improves", "the", "model"],
    center: "data",
    context: ["training", "improves"],
    prediction: {
      training: 0.39,
      improves: 0.27,
      model: 0.18,
      learning: 0.1,
      ocean: 0.06,
    },
    embedding: [0.08, 0.64, 0.46],
  },
];

type Step = "task" | "prediction" | "embedding";

const stepCards: Array<{ id: Step; title: string; detail: string }> = [
  {
    id: "task",
    title: "1. Create proxy task",
    detail: "Use a center word to predict nearby words.",
  },
  {
    id: "prediction",
    title: "2. Train prediction",
    detail: "Misses and hits push the weights around.",
  },
  {
    id: "embedding",
    title: "3. Keep embedding",
    detail: "The selected W1 row is the useful artifact.",
  },
];

export default function ProxyTaskEmbeddingViz() {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [step, setStep] = useState<Step>("task");

  const example = examples[exampleIndex];

  const predictedWords = useMemo(() => Object.entries(example.prediction).sort((a, b) => b[1] - a[1]), [example]);

  const flowItems = [
    { label: "center word", value: example.center },
    { label: "predict context", value: example.context.join(" + ") },
    { label: "error updates", value: `W1[${example.center}]` },
    { label: "keep vector", value: `[${example.embedding.map((value) => value.toFixed(2)).join(", ")}]` },
  ];

  return (
    <div className="my-8 border-2 border-fd-foreground bg-fd-card p-4 font-mono text-sm text-fd-foreground shadow-[6px_6px_0px_0px_var(--color-fd-foreground)] sm:p-6">
      <div className="border-b-2 border-fd-foreground pb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-fd-primary">Word2Vec intuition</p>
        <h3 className="mt-2 text-xl font-semibold uppercase">A proxy task creates a real embedding</h3>
        <p className="mt-3 max-w-2xl font-sans text-sm leading-6 text-fd-muted-foreground">
          Word2Vec predicts nearby words during training, but the prediction is not the thing we keep. The useful
          artifact is the row learned inside the first weight matrix.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {examples.map((item, index) => (
          <button
            key={item.center}
            type="button"
            aria-pressed={exampleIndex === index}
            onClick={() => {
              setExampleIndex(index);
              setStep("task");
            }}
            className={`border-2 px-3 py-1 text-sm font-semibold transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 ${
              exampleIndex === index
                ? "border-fd-foreground bg-fd-primary text-fd-primary-foreground shadow-[3px_3px_0px_0px_var(--color-fd-foreground)]"
                : "border-fd-foreground bg-fd-background text-fd-foreground hover:bg-fd-secondary hover:shadow-[3px_3px_0px_0px_var(--color-fd-foreground)]"
            }`}
          >
            {item.center}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-0 border-2 border-fd-foreground bg-fd-background md:grid-cols-4">
        {flowItems.map((item, index) => (
          <div key={item.label} className="border-fd-foreground p-3 md:border-r md:last:border-r-0">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-fd-muted-foreground">
              {index + 1}. {item.label}
            </div>
            <div className={`mt-2 text-sm font-semibold ${index === 2 ? "text-fd-primary" : "text-fd-foreground"}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {stepCards.map((card) => (
          <button
            key={card.id}
            type="button"
            aria-pressed={step === card.id}
            onClick={() => setStep(card.id)}
            className={`border-2 p-4 text-left transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 ${
              step === card.id
                ? "border-fd-foreground bg-fd-primary text-fd-primary-foreground shadow-[4px_4px_0px_0px_var(--color-fd-foreground)]"
                : "border-fd-foreground bg-fd-card hover:bg-fd-secondary hover:shadow-[4px_4px_0px_0px_var(--color-fd-foreground)]"
            }`}
          >
            <div className="text-sm font-semibold uppercase">{card.title}</div>
            <div className={`mt-2 text-xs leading-5 ${step === card.id ? "text-fd-primary-foreground" : "text-fd-muted-foreground"}`}>
              {card.detail}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 border-2 border-fd-foreground bg-fd-background p-4 sm:p-5">
        {step === "task" && (
          <div>
            <h4 className="text-sm font-semibold uppercase">The proxy task</h4>

            <div className="mt-5 flex flex-wrap items-stretch justify-center gap-2">
              {example.sentence.map((word) => {
                const isCenter = word === example.center;
                const isContext = example.context.includes(word);

                return (
                  <div
                    key={word}
                    className={`border-2 px-4 py-3 text-center text-sm transition ${
                      isCenter
                        ? "border-fd-foreground bg-fd-primary text-fd-primary-foreground shadow-[3px_3px_0px_0px_var(--color-fd-foreground)]"
                        : isContext
                          ? "border-fd-foreground bg-fd-secondary text-fd-foreground"
                          : "border-fd-muted bg-fd-card text-fd-muted-foreground"
                    }`}
                  >
                    <div className="font-semibold">{word}</div>
                    <div className={`mt-1 text-[10px] uppercase tracking-widest ${isCenter ? "text-fd-primary-foreground" : "text-fd-muted-foreground"}`}>
                      {isCenter ? "center" : isContext ? "context" : "other"}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid gap-3 text-center md:grid-cols-[1fr_auto_1fr] md:items-center">
              <div className="border-2 border-fd-foreground bg-fd-card px-4 py-3">
                center word: <strong>{example.center}</strong>
              </div>
              <div className="font-bold text-fd-primary">-&gt;</div>
              <div className="flex flex-wrap justify-center gap-2">
                {example.context.map((word) => (
                  <div key={word} className="border-2 border-fd-foreground bg-fd-secondary px-4 py-3 text-sm">
                    predict: <strong>{word}</strong>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-6 border-l-4 border-fd-primary bg-fd-card p-4 font-sans text-sm leading-6 text-fd-muted-foreground">
              The task is a training signal. It forces the model to organize words by the company they keep.
            </p>
          </div>
        )}

        {step === "prediction" && (
          <div>
            <h4 className="text-sm font-semibold uppercase">Prediction creates useful pressure</h4>

            <div className="mt-5 grid gap-3">
              {predictedWords.map(([word, probability]) => {
                const isActualContext = example.context.includes(word);

                return (
                  <div key={word} className="grid gap-2">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className={isActualContext ? "font-semibold text-fd-foreground" : "text-fd-muted-foreground"}>
                        {word}
                        {isActualContext ? (
                          <span className="ml-2 border border-fd-primary px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-fd-primary">
                            actual context
                          </span>
                        ) : null}
                      </span>
                      <span className="font-mono text-xs text-fd-muted-foreground">{(probability * 100).toFixed(0)}%</span>
                    </div>

                    <div className="h-3 border border-fd-foreground bg-fd-secondary">
                      <div
                        className={`h-full transition-all ${isActualContext ? "bg-fd-primary" : "bg-fd-foreground"}`}
                        style={{ width: `${probability * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid gap-3 border-2 border-fd-foreground bg-fd-card p-4 text-sm leading-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <span>Prediction misses become error.</span>
              <span className="font-bold text-fd-primary">-&gt;</span>
              <span>
                Error updates <strong className="text-fd-primary">W1[{example.center}]</strong>.
              </span>
            </div>
          </div>
        )}

        {step === "embedding" && (
          <div>
            <h4 className="text-sm font-semibold uppercase">The useful result is hidden in W1</h4>

            <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
              <div className="border-2 border-fd-foreground bg-fd-card p-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-fd-muted-foreground">One-hot input</div>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {example.sentence.map((word) => {
                    const isCenter = word === example.center;

                    return (
                      <div
                        key={word}
                        className={`border-2 p-2 text-center ${
                          isCenter
                            ? "border-fd-foreground bg-fd-primary text-fd-primary-foreground"
                            : "border-fd-foreground bg-fd-secondary text-fd-muted-foreground"
                        }`}
                      >
                        <div className="text-[10px] uppercase tracking-widest">{word}</div>
                        <div className="mt-2 text-lg font-bold">{isCenter ? "1" : "0"}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="hidden font-bold text-fd-primary md:block">x</div>

              <div className="border-2 border-fd-foreground bg-fd-card p-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-fd-muted-foreground">Updated W1 row</div>
                <div className="mt-4 border-2 border-fd-primary bg-fd-background p-3 font-mono text-sm font-semibold text-fd-primary">
                  W1[{example.center}]
                </div>
                <p className="mt-3 font-sans text-xs leading-5 text-fd-muted-foreground">
                  Training changed this row while solving the prediction task.
                </p>
              </div>

              <div className="hidden font-bold text-fd-primary md:block">=</div>

              <div className="border-2 border-fd-primary bg-fd-card p-4 shadow-[4px_4px_0px_0px_var(--color-fd-primary)]">
                <div className="text-xs font-semibold uppercase tracking-widest text-fd-muted-foreground">Embedding kept</div>
                <div className="mt-4 bg-fd-secondary p-3 font-mono text-sm font-semibold text-fd-primary">
                  [{example.embedding.map((v) => v.toFixed(2)).join(", ")}]
                </div>
                <p className="mt-3 font-sans text-xs leading-5 text-fd-muted-foreground">
                  This vector is the artifact reused after training.
                </p>
              </div>
            </div>

            <div className="mt-6 border-2 border-fd-foreground bg-fd-secondary p-4 font-sans text-sm leading-6">
              The proxy task is not the final product. It is the pressure that shapes the embedding.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
