export const embeddingVocabulary = ["machine", "learning", "model", "data", "algorithms"] as const;

export type EmbeddingWord = (typeof embeddingVocabulary)[number];

export const toyEmbeddings: Record<EmbeddingWord, readonly [number, number, number]> = {
  machine: [0.42, -0.11, 0.89],
  learning: [-0.76, 0.55, 0.23],
  model: [0.12, 0.94, -0.34],
  data: [-0.55, -0.88, 0.11],
  algorithms: [0.99, -0.22, 0.45],
};

export function getToyEmbedding(word: EmbeddingWord): readonly [number, number, number] {
  return toyEmbeddings[word];
}
