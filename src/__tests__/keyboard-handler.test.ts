import { describe, expect, it } from "vitest";

import { keyEventToData } from "../input/KeyboardHandler";

describe("keyEventToData", () => {
  it("maps control keys to terminal data", () => {
    expect(keyEventToData({ key: "Enter", ctrlKey: false, metaKey: false, altKey: false })).toBe("\r");
    expect(keyEventToData({ key: "Backspace", ctrlKey: false, metaKey: false, altKey: false })).toBe("\x7f");
    expect(keyEventToData({ key: "Tab", ctrlKey: false, metaKey: false, altKey: false })).toBe("\t");
    expect(keyEventToData({ key: "c", ctrlKey: true, metaKey: false, altKey: false })).toBe("\x03");
  });

  it("passes printable characters through", () => {
    expect(keyEventToData({ key: "a", ctrlKey: false, metaKey: false, altKey: false })).toBe("a");
  });

  it("ignores modified non-text input", () => {
    expect(keyEventToData({ key: "ArrowUp", ctrlKey: false, metaKey: false, altKey: false })).toBeNull();
    expect(keyEventToData({ key: "k", ctrlKey: false, metaKey: true, altKey: false })).toBeNull();
  });
});
