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
          background: "linear-gradient(225deg, #2a66ff 0%, #0847f7 40%, #0c30ad 68%, #03092d 100%)",
          borderRadius: 0,
        }}
      >
        <div
          style={{
            fontSize: 84,
            fontWeight: 900,
            color: "#ffffff",
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
