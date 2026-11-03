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
          background: "#f2401b",
          borderRadius: 0,
        }}
      >
        <div
          style={{
            fontSize: 84,
            fontWeight: 900,
            color: "#0e0e0e",
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
