import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import EmbeddingVisualizer from '@/components/word-embedding/EmbeddingVisualizer';

const customMdxComponents: MDXComponents = {
  EmbeddingVisualizer,
};

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...customMdxComponents,
    ...components,
  };
}
