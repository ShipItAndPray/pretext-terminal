import { describe, expect, it } from "vitest";

import { TerminalCore } from "../TerminalCore";

describe("TerminalCore", () => {
  it("writes and parses multiple lines", () => {
    const core = TerminalCore.create({ cols: 10 });

    core.write("\u001b[32mok\u001b[0m\nplain");

    const lines = core.getLines();
    expect(lines).toHaveLength(2);
    expect(lines[0]?.raw).toBe("\u001b[32mok\u001b[0m");
    expect(lines[0]?.spans[0]?.text).toBe("ok");
    expect(lines[1]?.raw).toBe("plain");
  });

  it("clears scrollback", () => {
    const core = TerminalCore.create();
    core.writeln("build done");
    core.clear();
    expect(core.getLines()).toEqual([]);
  });
});
