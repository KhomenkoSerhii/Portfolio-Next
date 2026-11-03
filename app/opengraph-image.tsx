import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Serhii Khomenko - Senior Software Engineer";

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
          background: "#efefeb",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            fontSize: 28,
            fontWeight: 700,
            color: "#0e0e0e",
          }}
        >
          <span>Serhii Khomenko</span>
          <span>Lviv, remote</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              maxWidth: 1040,
              fontSize: 102,
              fontWeight: 900,
              color: "#0e0e0e",
              lineHeight: 0.95,
              letterSpacing: "-4px",
            }}
          >
            Interfaces for real
            <span style={{ color: "#f2401b" }}> complexity.</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 50,
              paddingTop: 22,
              borderTop: "6px solid #0e0e0e",
              fontSize: 26,
              color: "#0e0e0e",
            }}
          >
            <span>Senior Software Engineer</span>
            <span>React · Next.js · TypeScript · AI/LLM UX</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
