import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Serhii Khomenko - Senior Frontend Engineer";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#0b0e0b",
          backgroundImage:
            "linear-gradient(rgba(201,244,61,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,244,61,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            fontSize: 20,
            letterSpacing: 5,
            color: "#c9f43d",
          }}
        >
          <span>SERHII KHOMENKO</span>
          <span>LVIV / REMOTE</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              maxWidth: 1040,
              fontSize: 102,
              fontWeight: 900,
              color: "#eeefe8",
              lineHeight: 0.86,
              letterSpacing: "-6px",
              textTransform: "uppercase",
            }}
          >
            Interfaces for real
            <span style={{ color: "#c9f43d" }}> complexity.</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 50,
              paddingTop: 22,
              borderTop: "1px solid rgba(238,239,232,0.24)",
              fontSize: 24,
              color: "#9aa096",
            }}
          >
            <span>Senior Frontend Engineer</span>
            <span>React · Next.js · TypeScript · AI/LLM UX</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
