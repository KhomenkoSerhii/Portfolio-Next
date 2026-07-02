import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Serhii Khomenko – Software Engineer · Frontend Developer";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#090c0a",
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(97,218,251,0.12), transparent 50%), radial-gradient(circle at 20% 80%, rgba(52,211,153,0.12), transparent 50%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 6,
            color: "#34d399",
            marginBottom: 24,
          }}
        >
          LVIV, UKRAINE
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: "#eaf0ed",
            lineHeight: 1.02,
            textTransform: "uppercase",
          }}
        >
          Serhii Khomenko
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 40,
            fontWeight: 700,
            background: "linear-gradient(90deg, #61dafb, #2dd4bf, #34d399)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Software Engineer · Frontend Developer
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 28,
            color: "#a1a1aa",
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          React / TypeScript · AI-powered product features · 7+ years across
          fintech, Web3, and eCommerce
        </div>
      </div>
    ),
    { ...size }
  );
}
