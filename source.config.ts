import { defineConfig, defineDocs, defineCollections, frontmatterSchema, metaSchema } from "fumadocs-mdx/config";
import { z } from "zod";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: frontmatterSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export const blogs = defineCollections({
  type: "doc",
  dir: "content/blogs",
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

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
