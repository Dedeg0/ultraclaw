import { describe, expect, it } from "vitest";
import { shortenText } from "./text-format.js";

describe("shortenText", () => {
  it("returns original text when it fits", () => {
    expect(shortenText("ultraclaw", 16)).toBe("ultraclaw");
  });

  it("truncates and appends ellipsis when over limit", () => {
    expect(shortenText("ultraclaw-status-output", 10)).toBe("ultraclaw-…");
  });

  it("counts multi-byte characters correctly", () => {
    expect(shortenText("hello🙂world", 7)).toBe("hello🙂…");
  });
});
