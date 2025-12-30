import { blogs } from "fumadocs-mdx:collections/server";
import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";

export const blogPosts = loader({
  baseUrl: "/blog",
  source: toFumadocsSource(blogs, []),
  plugins: [lucideIconsPlugin()],
});

export function getPageImage(page: InferPageType<typeof blogPosts>) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/blog/${segments.join("/")}`,
  };
}

export async function getLLMText(page: InferPageType<typeof blogPosts>) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title}

${processed}`;
}
