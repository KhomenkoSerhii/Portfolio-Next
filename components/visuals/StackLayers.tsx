"use client";

import { useEffect, useRef } from "react";
import styles from "./StackLayers.module.css";

// one request/response pair per wire; x/y are positions on the layer plane (px)
const wires = [
  { x: 70, y: 300, duration: 2.8, delay: 0 },
  { x: 250, y: 120, duration: 2.2, delay: 0.6 },
  { x: 320, y: 280, duration: 3.2, delay: 1 },
] as const;

const routes = [
  { method: "GET", path: "/matches", note: "LLM rank", status: "200" },
  { method: "POST", path: "/payments", note: "Stripe", status: "201" },
  { method: "WS", path: "/events", note: "Socket.IO", status: "live" },
  { method: "POST", path: "/parse-cv", note: "OpenAI", status: "200" },
] as const;

export default function StackLayers() {
  const sceneRef = useRef<HTMLDivElement>(null);

  // tilt toward the cursor; the resting pose is the isometric view
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const nx = event.clientX / window.innerWidth - 0.5;
        const ny = event.clientY / window.innerHeight - 0.5;
        scene.style.setProperty("--rx", `${58 - ny * 10}deg`);
        scene.style.setProperty("--rz", `${-36 + nx * 14}deg`);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className={styles.stage} aria-hidden>
      <div ref={sceneRef} className={styles.scene}>
        <div className={`${styles.layer} ${styles.data}`}>
          <span className={styles.tag}>03 / Data & services</span>
          <div className={styles.tables}>
            {["users", "jobs", "payments"].map((name) => (
              <div key={name} className={styles.table}>
                <span>{name}</span>
                <i />
                <i />
                <i />
              </div>
            ))}
          </div>
          <div className={styles.services}>
            <span>MongoDB</span>
            <span>OpenAI</span>
            <span>Stripe</span>
            <span>AWS</span>
          </div>
        </div>

        <div className={`${styles.layer} ${styles.api}`}>
          <span className={styles.tag}>02 / API · Node.js</span>
          <div className={styles.routes}>
            {routes.map((route) => (
              <div key={route.path} className={styles.route}>
                <span>
                  <em>{route.method}</em> {route.path}
                </span>
                <span className={styles.note}>{route.note}</span>
                <span className={styles.status}>{route.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${styles.layer} ${styles.ui}`}>
          <span className={styles.tag}>01 / UI · React · Next.js</span>
          <div className={styles.app}>
            <div className={`${styles.card} ${styles.hot}`}>
              <span>AI match</span>
              <strong>94%</strong>
              <i style={{ width: "94%" }} />
            </div>
            <div className={styles.card}>
              <span>Live candidates</span>
              <strong>128</strong>
              <b className={styles.liveDot} />
            </div>
            <div className={styles.card}>
              <span>Checkout</span>
              <strong>Paid</strong>
            </div>
            <div className={styles.cta}>Shortlist →</div>
          </div>
        </div>

        {wires.map((wire) => (
          <div
            key={`${wire.x}-${wire.y}`}
            className={styles.wire}
            style={{ "--x": `${wire.x}px`, "--y": `${wire.y}px` } as React.CSSProperties}
          />
        ))}
        {wires.flatMap((wire) => [
          <div
            key={`req-${wire.x}`}
            className={styles.packet}
            style={
              {
                "--x": `${wire.x}px`,
                "--y": `${wire.y}px`,
                "--dur": `${wire.duration}s`,
                "--delay": `${wire.delay}s`,
              } as React.CSSProperties
            }
          />,
          <div
            key={`res-${wire.x}`}
            className={`${styles.packet} ${styles.response}`}
            style={
              {
                "--x": `${wire.x}px`,
                "--y": `${wire.y}px`,
                "--dur": `${wire.duration}s`,
                "--delay": `${wire.delay + wire.duration / 2}s`,
              } as React.CSSProperties
            }
          />,
        ])}
      </div>

      <div className={styles.legend}>
        <span className={styles.req}>request</span>
        <span className={styles.res}>response</span>
      </div>
    </div>
  );
}
