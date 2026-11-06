import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SplitText } from "@/components/fx/SplitText";

describe("SplitText", () => {
  it("keeps the whole sentence as the heading's name", () => {
    render(
      <h2>
        <SplitText text="Bring me the hard part." by="chars" />
      </h2>
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveAccessibleName("Bring me the hard part.");
  });

  it("starts a new paragraph at a blank line", () => {
    const { container } = render(<SplitText text={"First line.\n\nSecond line."} by="words" />);
    expect(container.querySelectorAll(".split-paragraph")).toHaveLength(2);
  });
});
