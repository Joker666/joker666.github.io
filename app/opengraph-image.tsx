import { siteConfig } from "@/lib/site";
import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#fffcf0",
        padding: "80px",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
          letterSpacing: "-1px",
          marginBottom: 24,
        }}
      >
        {siteConfig.name}
      </div>
      <div
        style={{
          fontSize: 32,
          lineHeight: 1.4,
          maxWidth: 900,
          color: "#475569",
        }}
      >
        {siteConfig.description}
      </div>
      <div
        style={{
          marginTop: "auto",
          fontSize: 24,
          color: "#f97316",
          fontWeight: 600,
        }}
      >
        {siteConfig.url.replace(/^https?:\/\//, "")}
      </div>
    </div>,
    {
      ...size,
    },
  );
}
