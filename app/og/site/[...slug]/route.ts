import { siteConfig } from "@/lib/site";
import { ImageResponse } from "@takumi-rs/image-response";
import { generate as DefaultImage } from "fumadocs-ui/og";

export const revalidate = false;
export const runtime = "nodejs";
export const dynamic = "force-static";

export async function GET(_req: Request, _ctx: { params: { slug: string[] } }) {
  return new ImageResponse(
    DefaultImage({
      title: siteConfig.name,
      description: siteConfig.description,
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
  return [
    {
      slug: ["image.webp"],
    },
  ];
}
