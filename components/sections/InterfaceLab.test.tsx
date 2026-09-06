import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import InterfaceLab from "./InterfaceLab";

afterEach(() => { vi.useRealTimers(); });

describe("InterfaceLab", () => {
  it("preserves the draft during offline recovery and reset", () => {
    vi.useFakeTimers();
    render(<InterfaceLab />);
    const notes = screen.getByLabelText("Your working notes");
    fireEvent.change(notes, { target: { value: "Do not lose this work" } });
    fireEvent.click(screen.getByRole("button", { name: "Start response" }));
    act(() => { vi.advanceTimersByTime(650); });
    act(() => { vi.advanceTimersByTime(85); });
    const output = screen.getByLabelText("Simulated response text").textContent;
    fireEvent.click(screen.getByRole("switch", { name: "Connection lost" }));
    act(() => { vi.advanceTimersByTime(5000); });
    expect(screen.getByLabelText("Simulated response text").textContent).toBe(output);
    expect(screen.getByText("Paused · offline")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("switch", { name: "Connection lost" }));
    act(() => { vi.advanceTimersByTime(85); });
    expect(screen.getByLabelText("Simulated response text").textContent).not.toBe(output);
    fireEvent.click(screen.getByRole("button", { name: /Reset experiment/ }));
    expect(notes).toHaveValue("Do not lose this work");
    expect(screen.getByRole("button", { name: "Start response" })).toBeEnabled();
  });

  it("cleans up delivery on unmount", () => {
    vi.useFakeTimers();
    const { unmount } = render(<InterfaceLab />);
    fireEvent.click(screen.getByRole("button", { name: "Start response" }));
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
