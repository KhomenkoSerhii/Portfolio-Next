export const labBriefs = [
  {
    id: "dashboard",
    title: "Live dashboard",
    prompt: "Design a dashboard that stays useful when updates arrive late.",
    answer: "Keep the last confirmed data visible and label when it was updated. Separate connection health from the data itself. Buffer incoming events, reconcile them after reconnecting, and give users a clear way to refresh. Preserve filters and unfinished work throughout recovery. A disconnected dashboard should explain its limits while keeping useful information on screen.",
  },
  {
    id: "assistant",
    title: "AI workspace",
    prompt: "Design an AI workspace that handles an interrupted response.",
    answer: "Render useful output as it arrives. Keep the original request and partial response separate from the connection state. If generation stops, retain the text and explain that it is incomplete. Offer a retry and a manual path forward. Resume from a checkpoint only when the service supports it; otherwise label a regenerated response clearly.",
  },
  {
    id: "payments",
    title: "Payment flow",
    prompt: "Design a payment flow when the result of a request is uncertain.",
    answer: "Distinguish a confirmed failure from an unknown payment status. Keep the transaction reference visible and check the existing operation before offering another payment attempt. Prevent duplicate submissions while verification is pending. Preserve the form, explain what is being checked, and provide a support path if the final result cannot be confirmed.",
  },
] as const;

export type LabPhase = "idle" | "connecting" | "streaming" | "failed" | "complete" | "stopped";
export type LabState = {
  phase: LabPhase;
  words: number;
  total: number;
  slow: boolean;
  offline: boolean;
  fail: boolean;
};
export const initialLabState: LabState = {
  phase: "idle", words: 0, total: 0, slow: false, offline: false, fail: false,
};
type LabAction =
  | { type: "start"; total: number }
  | { type: "tick" }
  | { type: "toggle"; fault: "slow" | "offline" | "fail" }
  | { type: "retry" }
  | { type: "stop" }
  | { type: "reset" };

export function labReducer(state: LabState, action: LabAction): LabState {
  switch (action.type) {
    case "start":
      if (state.phase === "connecting" || state.phase === "streaming") return state;
      return { ...state, phase: "connecting", words: 0, total: action.total };
    case "toggle":
      return { ...state, [action.fault]: !state[action.fault] };
    case "tick": {
      if (state.offline) return state;
      if (state.phase === "connecting") return { ...state, phase: "streaming" };
      if (state.phase !== "streaming") return state;
      if (state.fail && state.words >= Math.ceil(state.total / 2)) {
        return { ...state, phase: "failed" };
      }
      const words = Math.min(state.words + 1, state.total);
      return { ...state, words, phase: words === state.total ? "complete" : "streaming" };
    }
    case "retry":
      if (state.phase !== "failed" && state.phase !== "stopped") return state;
      return { ...state, fail: false, phase: "connecting" };
    case "stop":
      if (state.phase !== "connecting" && state.phase !== "streaming") return state;
      return { ...state, phase: "stopped" };
    case "reset":
      return { ...initialLabState };
  }
}
