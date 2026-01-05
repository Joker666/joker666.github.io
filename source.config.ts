import { RehypeCodeOptions } from "fumadocs-core/mdx-plugins";
import { defineConfig, defineCollections, frontmatterSchema } from "fumadocs-mdx/config";
import { z } from "zod";

export const blogs = defineCollections({
  type: "doc",
  dir: "content/blogs",
  postprocess: {
    includeProcessedMarkdown: true,
  },
  schema: frontmatterSchema.extend({
    author: z.string(),
    date: z
      .string()
      .or(z.date())
      .transform((value, context) => {
        try {
          return new Date(value);
        } catch {
          context.addIssue("Invalid date");
          return z.NEVER;
        }
      }),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    draft: z.boolean().optional().default(false),
    series: z.string().optional(),
    seriesPart: z.number().optional(),
  }),
});

const rehypeCodeOptions: RehypeCodeOptions = {
  themes: {
    light: "github-light",
    dark: "github-dark",
  },
};

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: rehypeCodeOptions,
  },
});
