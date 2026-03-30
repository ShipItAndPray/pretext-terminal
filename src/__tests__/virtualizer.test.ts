import { describe, expect, it } from "vitest";

import { getVisibleWindow } from "../layout/Virtualizer";

describe("getVisibleWindow", () => {
  it("returns a sane visible slice", () => {
    expect(getVisibleWindow(1000, 20, 400, 200, 2)).toEqual({ start: 18, end: 32 });
  });
});
