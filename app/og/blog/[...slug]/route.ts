import { siteConfig } from "@/lib/site";
import { blogPosts, getPageImage } from "@/lib/source";
import { ImageResponse } from "@takumi-rs/image-response";
import { generate as DefaultImage } from "fumadocs-ui/og";

export const revalidate = false;
export const runtime = "nodejs";
export const dynamic = "force-static";

export async function GET(_req: Request, { params }: { params: { slug: string[] } }) {
  const page = blogPosts.getPage(params.slug.slice(0, -1));
  if (!page) {
    return new Response("Not Found", { status: 404 });
  }

  return new ImageResponse(
    DefaultImage({
      title: page.data.title,
      description: page.data.description,
      site: siteConfig.name,
    }),
    {
      width: 1200,
      height: 630,
      format: "webp",
    },
  );
}

export function generateStaticParams(): { slug: string[] }[] {
  return blogPosts.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }));
}
