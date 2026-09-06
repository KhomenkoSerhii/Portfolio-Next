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
          background: "#0b0e0b",
          borderRadius: 0,
        }}
      >
        <div
          style={{
            fontSize: 84,
            fontWeight: 900,
            background: "linear-gradient(120deg, #d8ff61, #9fc91f)",
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
