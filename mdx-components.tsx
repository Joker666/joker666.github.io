import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import EmbeddingVisualizer from "@/components/word-embedding/EmbeddingVisualizer";
import ProxyTaskEmbeddingViz from "@/components/word-embedding/ProxyTaskEmbeddingViz";

const customMdxComponents: MDXComponents = {
  EmbeddingVisualizer,
  ProxyTaskEmbeddingViz,
};

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...customMdxComponents,
    ...components,
  };
}
