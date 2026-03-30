import { parseAnsi } from "./buffer/AnsiParser";
import { LineBuffer } from "./buffer/LineBuffer";
import type { ParsedLine } from "./buffer/types";
import { MonospaceLayout } from "./layout/MonospaceLayout";
import { defaultTheme, type TerminalTheme } from "./types";

export class TerminalCore {
  private readonly buffer: LineBuffer;
  readonly layout: MonospaceLayout;

  constructor(
    public readonly cols: number,
    public readonly lineHeight: number,
    public readonly font: string,
    public readonly theme: TerminalTheme,
    maxScrollback: number
  ) {
    this.buffer = new LineBuffer(maxScrollback);
    this.layout = new MonospaceLayout(font, lineHeight);
  }

  static create(options?: { cols?: number; lineHeight?: number; font?: string; theme?: TerminalTheme; maxScrollback?: number }) {
    return new TerminalCore(
      options?.cols ?? 80,
      options?.lineHeight ?? 18,
      options?.font ?? '14px "JetBrains Mono"',
      options?.theme ?? defaultTheme,
      options?.maxScrollback ?? 100000
    );
  }

  write(data: string) {
    const parsed = data.replace(/\r/g, "").split("\n").map((line) => this.parseLine(line));
    this.buffer.appendMany(parsed);
  }

  writeln(data: string) {
    this.write(`${data}\n`);
  }

  clear() {
    this.buffer.clear();
  }

  getLines() {
    return this.buffer.getAll();
  }

  getVisibleLines(start: number, end: number) {
    return this.buffer.getAll().slice(start, end);
  }

  private parseLine(raw: string): ParsedLine {
    return {
      raw,
      spans: parseAnsi(raw, this.theme),
      wrappedRows: this.layout.getWrappedLineCount(raw, this.cols)
    };
  }
}
