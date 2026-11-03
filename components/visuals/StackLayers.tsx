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
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  // tilt toward the cursor, and split the stack into its three layers while the
  // pointer is over the visual. The hero copy sits above this element, so hover is
  // tested against the stage's fixed box: it never moves, so the split can't flicker.
  useEffect(() => {
    const stage = stageRef.current;
    const scene = sceneRef.current;
    if (!stage || !scene) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      stage.dataset.open = "true";
      return;
    }

    let frame = 0;
    let pointer: { x: number; y: number } | null = null;

    const update = () => {
      if (!pointer) {
        stage.dataset.open = "false";
        return;
      }
      const box = stage.getBoundingClientRect();
      const inside =
        pointer.x >= box.left && pointer.x <= box.right && pointer.y >= box.top && pointer.y <= box.bottom;
      stage.dataset.open = String(inside);
      scene.style.setProperty("--rx", `${58 - (pointer.y / window.innerHeight - 0.5) * 10}deg`);
      scene.style.setProperty("--rz", `${-36 + (pointer.x / window.innerWidth - 0.5) * 14}deg`);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const onMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      schedule();
    };
    const onLeave = () => {
      pointer = null;
      schedule();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("blur", onLeave);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("blur", onLeave);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={stageRef} className={styles.stage} aria-hidden>
      <div ref={sceneRef} className={styles.scene}>
        <div className={`${styles.layer} ${styles.data}`}>
          <span className={styles.tag}>Data & services</span>
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
          <span className={styles.tag}>API, Node.js</span>
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
          <span className={styles.tag}>UI, React, Next.js</span>
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
        <span className={styles.hint}>Hover to expand the stack</span>
        <span className={styles.req}>request</span>
        <span className={styles.res}>response</span>
      </div>
    </div>
  );
}
