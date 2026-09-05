// A real (if tiny) skip-gram model: 8 words, 2-dimensional embeddings, plain SGD.
// Two dimensions so every embedding is a point we can actually plot. The clusters
// the reader sees emerge from training, they are not hardcoded anywhere.

export const VOCAB = ["machine", "learning", "model", "data", "coffee", "cup", "sugar", "tea"] as const;

export type Word = (typeof VOCAB)[number];

// Two topics that never share a sentence. Inside each topic one word (learning,
// cup) appears in every window, so it settles at the centre of its cluster and
// the map gets some internal structure instead of collapsing to a single dot.
export const CORPUS: Word[][] = [
  ["machine", "learning", "model"],
  ["machine", "learning", "data"],
  ["learning", "model", "data"],
  ["coffee", "cup", "sugar"],
  ["coffee", "cup", "tea"],
  ["cup", "sugar", "tea"],
];

export type Example = {
  sentence: Word[];
  center: Word;
  context: Word[];
};

// One training example per (window, centre word) pair: predict the rest of the window.
export const EXAMPLES: Example[] = CORPUS.flatMap((sentence) =>
  sentence.map((center, i) => ({
    sentence,
    center,
    context: sentence.filter((_, j) => j !== i),
  }))
);

export type Vec = [number, number];
export type Weights = {
  /** Input embeddings -- the lookup table we keep after training. */
  w1: Vec[];
  /** Output embeddings -- the half that gets thrown away. */
  w2: Vec[];
};

const SEED = 162;
const INIT_SCALE = 2;
const LR0 = 0.8;
const TAU = 40;

/** Steps after which the map has visibly settled. Gates the discard step. */
export const TRAINED_AT = 60;
/** Half-width of the plotted region, in embedding units. */
export const MAP_RANGE = 2;

// Deterministic PRNG: the initial weights must be identical on the server and the
// client, so the prerendered HTML and the first client render agree.
const mulberry32 = (a: number) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export function initialWeights(): Weights {
  const rand = mulberry32(SEED);
  const draw = (): Vec => [(rand() - 0.5) * INIT_SCALE, (rand() - 0.5) * INIT_SCALE];
  return { w1: VOCAB.map(draw), w2: VOCAB.map(draw) };
}

const indexOf = (word: Word) => VOCAB.indexOf(word);

function softmax(scores: number[]): number[] {
  const max = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

/** P(every word in the vocabulary | centre word), under the current weights. */
export function predict({ w1, w2 }: Weights, center: Word): number[] {
  const h = w1[indexOf(center)];
  return softmax(w2.map((o) => h[0] * o[0] + h[1] * o[1]));
}

/** Mean probability the model assigns to true context words -- training progress. */
export function meanContextProbability(weights: Weights): number {
  const total = EXAMPLES.reduce((acc, ex) => {
    const p = predict(weights, ex.center);
    return acc + ex.context.reduce((s, c) => s + p[indexOf(c)], 0) / ex.context.length;
  }, 0);
  return total / EXAMPLES.length;
}

/** Chance level, for comparison against meanContextProbability. */
export const UNIFORM_PROBABILITY = 1 / VOCAB.length;

const clone = (w: Weights): Weights => ({
  w1: w.w1.map((v) => [v[0], v[1]] as Vec),
  w2: w.w2.map((v) => [v[0], v[1]] as Vec),
});

/**
 * Run `count` SGD steps, continuing from `stepCount` so the decayed learning rate
 * keeps falling across separate clicks. Returns fresh weights and leaves the input untouched.
 */
export function train(weights: Weights, stepCount: number, count: number): Weights {
  const next = clone(weights);

  for (let n = 0; n < count; n++) {
    const t = stepCount + n;
    const lr = LR0 / (1 + t / TAU);
    const ex = EXAMPLES[t % EXAMPLES.length];
    const ci = indexOf(ex.center);
    const h = next.w1[ci];
    const p = predict(next, ex.center);

    // Accumulate gradients over the window's context words, then apply once.
    const dh: Vec = [0, 0];
    const dw2: Vec[] = VOCAB.map(() => [0, 0]);

    for (const ctx of ex.context) {
      const ti = indexOf(ctx);
      for (let v = 0; v < VOCAB.length; v++) {
        const g = p[v] - (v === ti ? 1 : 0);
        dw2[v][0] += g * h[0];
        dw2[v][1] += g * h[1];
        dh[0] += g * next.w2[v][0];
        dh[1] += g * next.w2[v][1];
      }
    }

    for (let v = 0; v < VOCAB.length; v++) {
      next.w2[v][0] -= lr * dw2[v][0];
      next.w2[v][1] -= lr * dw2[v][1];
    }
    next.w1[ci][0] -= lr * dh[0];
    next.w1[ci][1] -= lr * dh[1];
  }

  return next;
}

export const exampleAt = (stepCount: number) => EXAMPLES[stepCount % EXAMPLES.length];
