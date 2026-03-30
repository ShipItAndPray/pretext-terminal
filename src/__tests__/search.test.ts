import { describe, expect, it } from "vitest";

import { searchBuffer } from "../features/Search";

describe("searchBuffer", () => {
  it("finds case-insensitive matches", () => {
    const matches = searchBuffer([
      { raw: "Build started", spans: [], wrappedRows: 1 },
      { raw: "ERROR: failed", spans: [], wrappedRows: 1 }
    ], "error");

    expect(matches).toEqual([{ lineIndex: 1, start: 0, end: 5 }]);
  });
});
