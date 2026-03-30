import { describe, expect, it } from "vitest";

import { detectLinks } from "../features/LinkDetector";

describe("detectLinks", () => {
  it("finds http and https urls", () => {
    const matches = detectLinks("see https://example.com and http://localhost:3000/logs");

    expect(matches).toEqual([
      { text: "https://example.com", start: 4, end: 23 },
      { text: "http://localhost:3000/logs", start: 28, end: 54 }
    ]);
  });

  it("returns an empty array when there are no links", () => {
    expect(detectLinks("plain terminal output")).toEqual([]);
  });
});
