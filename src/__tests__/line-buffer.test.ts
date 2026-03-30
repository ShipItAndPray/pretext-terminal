import { describe, expect, it } from "vitest";

import { LineBuffer } from "../buffer/LineBuffer";

describe("LineBuffer", () => {
  it("keeps only the latest lines within scrollback", () => {
    const buffer = new LineBuffer(2);

    buffer.append({ raw: "one", spans: [], wrappedRows: 1 });
    buffer.append({ raw: "two", spans: [], wrappedRows: 1 });
    buffer.append({ raw: "three", spans: [], wrappedRows: 1 });

    expect(buffer.getAll().map((line) => line.raw)).toEqual(["two", "three"]);
    expect(buffer.size()).toBe(2);
  });

  it("clears the buffer", () => {
    const buffer = new LineBuffer(3);
    buffer.append({ raw: "one", spans: [], wrappedRows: 1 });
    buffer.clear();
    expect(buffer.size()).toBe(0);
  });
});
