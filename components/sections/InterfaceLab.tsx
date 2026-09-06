"use client";

import { useEffect, useReducer, useState } from "react";
import { initialLabState, labBriefs, labReducer } from "@/lib/interface-lab";
import styles from "./InterfaceLab.module.css";

const faults = [
  { id: "slow", number: "01", title: "Slow network", description: "Let the response take its time." },
  { id: "offline", number: "02", title: "Connection lost", description: "Cut the connection. Keep the work." },
  { id: "fail", number: "03", title: "AI failure", description: "Interrupt the answer halfway through." },
] as const;

const choices = [
  { title: "Clear it and start again", detail: "Simple to implement, but useful output disappears. A fresh attempt should be an explicit choice, not the price of a connection error." },
  { title: "Keep it and offer recovery", detail: "My choice here. Preserve useful output, mark it as incomplete, and let the user resume or start again. This simulation can resume from a word checkpoint; a real API needs explicit support for that contract." },
  { title: "Retry silently forever", detail: "It hides the failure, but also hides cost and uncertainty. Real retries need a limit, backoff, and cancellation. Writes also need duplicate protection." },
];

export default function InterfaceLab() {
  const [state, dispatch] = useReducer(labReducer, initialLabState);
  const [briefIndex, setBriefIndex] = useState(0);
  const [note, setNote] = useState("");
  const [choice, setChoice] = useState<number | null>(null);
  const brief = labBriefs[briefIndex];
  const words = brief.answer.split(" ");
  const running = state.phase === "connecting" || state.phase === "streaming";
  const recoverable = state.phase === "failed" || state.phase === "stopped";
  const paused = running && state.offline;
  const progress = state.total ? Math.round((state.words / state.total) * 100) : 0;

  useEffect(() => {
    if (!running || state.offline) return;
    const delay = state.phase === "connecting"
      ? (state.slow ? 2400 : 650)
      : (state.slow ? 320 : 85);
    const timer = window.setTimeout(() => dispatch({ type: "tick" }), delay);
    return () => window.clearTimeout(timer);
  }, [running, state.phase, state.words, state.offline, state.slow, state.fail]);

  const status = paused ? "Paused · offline"
    : state.phase === "idle" ? "Ready for your experiment"
    : state.phase === "connecting" ? "Waiting for the first response"
    : state.phase === "streaming" ? "Receiving response"
    : state.phase === "failed" ? "Response interrupted"
    : state.phase === "stopped" ? "Stopped by you"
    : "Response complete";
  const explanation = paused
    ? "The connection is down. Your partial response and notes stay here. Switch Connection lost off to continue."
    : state.phase === "failed"
      ? "The simulated service stopped. The partial response stays visible. Resume from the saved position, or use your notes to continue manually."
      : state.phase === "stopped"
        ? "Nothing else is arriving. You can resume this response or start a new one when you are ready."
        : state.phase === "complete"
          ? "All output received. Try a different brief or enable a fault and run the experiment again."
          : state.phase === "connecting"
            ? "The request is in progress. You can still edit notes, change the network conditions, or stop the request."
            : state.phase === "streaming"
              ? "Useful output appears incrementally. Try cutting the connection while these words arrive."
              : "Pick a brief, start the response, then use the switches to change the conditions.";

  return (
    <section id="lab" className="section-shell section-pad">
      <div className="section-heading">
        <div>
          <p className="section-index">INTERACTIVE / RESILIENCE LAB</p>
          <h2>Go ahead.<br />Break the interface.</h2>
        </div>
        <p className="max-w-md text-base leading-relaxed text-[var(--muted)] md:pt-3">
          Slow it down. Pull the plug. Interrupt the answer.
          See what stays useful when the happy path ends.
        </p>
      </div>

      <div className={styles.lab}>
        <div className={styles.topbar}>
          <span><span className={styles.liveDot} /> INTERFACE UNDER TEST</span>
          <span>LOCAL SIMULATION · NO LIVE AI</span>
        </div>
        <div className={styles.layout}>
          <aside className={styles.controls} aria-label="Experiment controls">
            <p className={styles.eyebrow}>You control the conditions</p>
            <h3 className={styles.controlTitle}>Make it difficult.</h3>
            <div className={styles.faults}>
              {faults.map((fault) => (
                <button
                  key={fault.id}
                  type="button"
                  role="switch"
                  aria-checked={state[fault.id]}
                  aria-label={fault.title}
                  className={styles.fault}
                  data-active={state[fault.id]}
                  onClick={() => dispatch({ type: "toggle", fault: fault.id })}
                >
                  <span className={styles.faultNumber}>{fault.number}</span>
                  <span className={styles.faultCopy}>
                    <strong>{fault.title}</strong><small>{fault.description}</small>
                  </span>
                  <span className={styles.switch} aria-hidden="true"><span /></span>
                </button>
              ))}
            </div>
            <p className={styles.controlNote}>
              Switches work before and during a run. Restore the connection to
              continue a paused response.
            </p>
            <button type="button" className={styles.reset} onClick={() => dispatch({ type: "reset" })}>
              Reset experiment <span aria-hidden="true">↺</span>
            </button>
          </aside>

          <div className={styles.workspace}>
            <div className={styles.workspaceHeader}>
              <div>
                <p className={styles.eyebrow}>Product brief / preview</p>
                <h3>A small workspace.<br />Real recovery behaviour.</h3>
              </div>
              <span className={styles.connection} data-offline={state.offline}>
                {state.offline ? "OFFLINE" : state.slow ? "SLOW LINK" : "CONNECTED"}
              </span>
            </div>
            <label className={styles.briefLabel} htmlFor="lab-brief">Choose an experiment</label>
            <select
              id="lab-brief"
              className={styles.select}
              value={briefIndex}
              disabled={state.phase !== "idle" && state.phase !== "complete"}
              onChange={(event) => {
                setBriefIndex(Number(event.target.value));
                dispatch({ type: "reset" });
              }}
            >
              {labBriefs.map((item, index) => <option key={item.id} value={index}>{item.title}</option>)}
            </select>
            <p className={styles.prompt}>{brief.prompt}</p>

            <div className={styles.response} data-failed={state.phase === "failed"}>
              <div className={styles.responseMeta}>
                <span>SIMULATED RESPONSE</span>
                <span>{state.words} / {state.total || words.length} WORDS</span>
              </div>
              <p className={styles.output} aria-label="Simulated response text">
                {state.words ? words.slice(0, state.words).join(" ") : (
                  <span className={styles.placeholder}>Your response will appear here. Try breaking it while it streams.</span>
                )}
                {running && !paused && <span className={styles.caret} aria-hidden="true" />}
              </p>
              <progress className={styles.progress} value={progress} max="100" aria-label="Response progress" />
            </div>

            <div className={styles.feedback} role="status" aria-live="polite" aria-atomic="true">
              <strong>{status}</strong>
              <p>{explanation}</p>
            </div>
            <div className={styles.actions}>
              {recoverable ? (
                <button type="button" className="button-primary button-inline" onClick={() => dispatch({ type: "retry" })}>
                  Resume response <span aria-hidden="true">↗</span>
                </button>
              ) : (
                <button type="button" className="button-primary button-inline" disabled={running} onClick={() => dispatch({ type: "start", total: words.length })}>
                  {running ? "Experiment running" : state.phase === "complete" ? "Run again" : "Start response"}
                  <span aria-hidden="true">↗</span>
                </button>
              )}
              <button type="button" className="button-secondary button-inline" disabled={!running} onClick={() => dispatch({ type: "stop" })}>
                Stop
              </button>
            </div>

            <label className={styles.briefLabel} htmlFor="lab-notes">Your working notes</label>
            <textarea
              id="lab-notes"
              className={styles.notes}
              value={note}
              maxLength={1200}
              rows={2}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Type here, then cut the connection…"
            />
            <p className={styles.noteHelp}>Kept through interruptions and resets. Stays in this tab; disappears on reload. Nothing is sent.</p>
          </div>
        </div>

        <details className={styles.underHood}>
          <summary>See how recovery works <span aria-hidden="true">+</span></summary>
          <div className={styles.architecture}>
            <div><span>01 / INPUT</span><h4>Keep the draft</h4><p>Notes live independently of the response, so a failed request cannot clear the user’s work.</p></div>
            <div><span>02 / EXECUTION</span><h4>Make state explicit</h4><p>Waiting, streaming, interrupted and complete are distinct states. Offline pauses delivery; Stop cancels it.</p></div>
            <div><span>03 / RECOVERY</span><h4>Keep a checkpoint</h4><p>This demo resumes at the next word. Real services require resume support; an ordinary retry may regenerate output.</p></div>
          </div>
        </details>
      </div>

      <div className={styles.decision}>
        <div>
          <p className="section-index">YOUR CALL / ONE DESIGN DECISION</p>
          <h3>Half an answer.<br />Then silence. What now?</h3>
          <p>Choose an approach to see the trade-off. This is a design exercise, not a client case study.</p>
        </div>
        <div className={styles.decisionOptions}>
          {choices.map((item, index) => (
            <button key={item.title} type="button" aria-pressed={choice === index} onClick={() => setChoice(index)} data-selected={choice === index}>
              <span>0{index + 1}</span>{item.title}<span aria-hidden="true">↗</span>
            </button>
          ))}
          <p className={styles.reason} role="status">{choice === null ? "Every recovery path has a cost. Pick one above." : choices[choice].detail}</p>
        </div>
      </div>
    </section>
  );
}
