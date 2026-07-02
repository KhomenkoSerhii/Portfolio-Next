import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#090c0a",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            fontSize: 84,
            fontWeight: 900,
            background: "linear-gradient(120deg, #61dafb, #34d399)",
            backgroundClip: "text",
            color: "transparent",
            fontFamily: "sans-serif",
          }}
        >
          SK
        </div>
      </div>
    ),
    { ...size }
  );
}
