import { describe, expect, it } from "vitest";

import { parseAnsi } from "../buffer/AnsiParser";
import { defaultTheme } from "../types";

describe("parseAnsi", () => {
  it("splits colored spans", () => {
    const spans = parseAnsi("\u001b[31merror\u001b[0m ok", defaultTheme);
    expect(spans[0]?.text).toBe("error");
    expect(spans[0]?.fg).toBe(defaultTheme.red);
    expect(spans[1]?.text).toBe(" ok");
    expect(spans[1]?.fg).toBe(defaultTheme.foreground);
  });
});
