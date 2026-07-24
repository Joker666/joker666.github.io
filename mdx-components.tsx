import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import AgentMemoryLab from "@/components/agent-memory/AgentMemoryLab";
import EmbeddingVisualizer from "@/components/word-embedding/EmbeddingVisualizer";
import ProxyTaskEmbeddingViz from "@/components/word-embedding/ProxyTaskEmbeddingViz";
import TimeSeriesVisualizer from "@/components/representations/TimeSeriesVisualizer";
import InFlightBatchingBus from "@/components/llm-serving/InFlightBatchingBus";

const customMdxComponents: MDXComponents = {
  AgentMemoryLab,
  EmbeddingVisualizer,
  InFlightBatchingBus,
  ProxyTaskEmbeddingViz,
  TimeSeriesVisualizer,
};

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...customMdxComponents,
    ...components,
  };
}
