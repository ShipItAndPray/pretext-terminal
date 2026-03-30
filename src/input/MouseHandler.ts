import type { Position } from "../types";

export function pointToCell(x: number, y: number, charWidth: number, lineHeight: number): Position {
  return {
    line: Math.max(0, Math.floor(y / lineHeight)),
    column: Math.max(0, Math.floor(x / charWidth))
  };
}
