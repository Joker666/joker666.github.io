import { blogPosts } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";

export const revalidate = false;

export const { staticGET: GET } = createFromSource(blogPosts, {
  // https://zbsearch.dev/docs/zbsearch/text-analysis/stemming
  language: "english",
});
