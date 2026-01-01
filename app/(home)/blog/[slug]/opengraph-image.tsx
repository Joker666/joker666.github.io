import { siteConfig } from "@/lib/site";
import { blogPosts } from "@/lib/source";
import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const dynamic = "force-static";

export function generateStaticParams(): { slug: string }[] {
  return blogPosts.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}

export default function OpenGraphImage({ params }: { params: { slug: string } }) {
  const page = blogPosts.getPage([params.slug]);
  if (!page) notFound();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0f172a",
        padding: "72px",
        color: "#f8fafc",
      }}
    >
      <div
        style={{
          fontSize: 28,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#fb923c",
          fontWeight: 700,
        }}
      >
        Rafi Hasan - Blog
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          {page.data.title}
        </div>
        <div
          style={{
            fontSize: 28,
            lineHeight: 1.4,
            color: "#cbd5f5",
            maxWidth: 900,
          }}
        >
          {page.data.description}
        </div>
      </div>
      <div
        style={{
          fontSize: 24,
          color: "#e2e8f0",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>{siteConfig.url.replace(/^https?:\/\//, "")}</span>
        <span>
          {new Date(page.data.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
