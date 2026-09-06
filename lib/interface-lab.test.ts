import { describe, expect, it } from "vitest";
import { initialLabState, labReducer } from "./interface-lab";

describe("interface lab recovery", () => {
  it("resumes after an injected failure without losing or duplicating output", () => {
    let state = labReducer({ ...initialLabState, fail: true }, { type: "start", total: 10 });
    for (let i = 0; i < 7; i++) state = labReducer(state, { type: "tick" });
    expect(state.phase).toBe("failed");
    expect(state.words).toBe(5);
    state = labReducer(state, { type: "retry" });
    expect(state.words).toBe(5);
    expect(state.fail).toBe(false);
    for (let i = 0; i < 6; i++) state = labReducer(state, { type: "tick" });
    expect(state.phase).toBe("complete");
    expect(state.words).toBe(10);
    expect(labReducer(state, { type: "tick" })).toBe(state);
  });

  it("pauses offline and advances from the same checkpoint after reconnecting", () => {
    const state = { ...initialLabState, phase: "streaming" as const, total: 10, words: 3, offline: true };
    expect(labReducer(state, { type: "tick" })).toBe(state);
    const connected = labReducer(state, { type: "toggle", fault: "offline" });
    expect(labReducer(connected, { type: "tick" }).words).toBe(4);
    const stopped = labReducer(state, { type: "stop" });
    expect(labReducer(stopped, { type: "tick" })).toBe(stopped);
  });

  it("prevents duplicate starts and discards late ticks after a reset", () => {
    const running = labReducer(initialLabState, { type: "start", total: 10 });
    expect(labReducer(running, { type: "start", total: 20 })).toBe(running);
    const reset = labReducer(running, { type: "reset" });
    expect(labReducer(reset, { type: "tick" })).toEqual(initialLabState);
  });
});
