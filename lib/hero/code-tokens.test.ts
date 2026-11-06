import { describe, it, expect } from "vitest";
import { CODE_COLORS, tokenizeCode } from "@/lib/hero/code-tokens";

const colorOf = (code: string, token: string) =>
  tokenizeCode(code).find((part) => part.text === token)?.color;

describe("tokenizeCode", () => {
  it("colours code like an editor", () => {
    const code = 'export const ranked = await llm.rank("frontend", 0.94) <CandidateList />';
    expect(colorOf(code, "export")).toBe(CODE_COLORS.keyword);
    expect(colorOf(code, "await")).toBe(CODE_COLORS.keyword);
    expect(colorOf(code, "llm.rank")).toBe(CODE_COLORS.fn);
    expect(colorOf(code, '"frontend"')).toBe(CODE_COLORS.string);
    expect(colorOf(code, "0.94")).toBe(CODE_COLORS.number);
    expect(colorOf(code, "<CandidateList")).toBe(CODE_COLORS.tag);
    expect(colorOf(code, "ranked")).toBe(CODE_COLORS.identifier);
  });

  it("keeps every character, so the text can be laid out exactly", () => {
    const code = 'fetch("/api/match") → 200 OK  38ms';
    expect(
      tokenizeCode(code)
        .map((part) => part.text)
        .join("")
    ).toBe(code);
  });
});
