import type { ParsedLine } from "./types";

export class LineBuffer {
  private lines: ParsedLine[] = [];

  constructor(private readonly maxScrollback: number) {}

  append(line: ParsedLine) {
    this.lines.push(line);
    if (this.lines.length > this.maxScrollback) {
      this.lines.splice(0, this.lines.length - this.maxScrollback);
    }
  }

  appendMany(lines: ParsedLine[]) {
    for (const line of lines) {
      this.append(line);
    }
  }

  clear() {
    this.lines = [];
  }

  getAll() {
    return this.lines;
  }

  get(index: number) {
    return this.lines[index];
  }

  size() {
    return this.lines.length;
  }
}
