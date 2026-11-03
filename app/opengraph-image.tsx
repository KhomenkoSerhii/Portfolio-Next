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
          background: "#f3f6ff",
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
            color: "#03092d",
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
              color: "#03092d",
              lineHeight: 0.95,
              letterSpacing: "-4px",
            }}
          >
            Interfaces for real
            <span style={{ color: "#0847f7" }}> complexity.</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 50,
              paddingTop: 22,
              borderTop: "6px solid #03092d",
              fontSize: 26,
              color: "#03092d",
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
