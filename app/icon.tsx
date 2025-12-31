import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 256,
  height: 256,
};
export const contentType = "image/png";
export const dynamic = "force-static";

// Image generation
export default function Icon() {
  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        fontSize: 160,
        background: "#fffcf0",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#f97316",
        borderRadius: 50,
        fontWeight: 900,
      }}
    >
      R
    </div>,
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    },
  );
}
