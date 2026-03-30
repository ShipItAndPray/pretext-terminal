import type { ParsedLine, Selection } from "../buffer/types";
import type { Position, TerminalTheme } from "../types";
import { SelectionRenderer } from "./SelectionRenderer";

export class CanvasRenderer {
  private selectionRenderer = new SelectionRenderer();

  constructor(
    private readonly theme: TerminalTheme,
    private readonly font: string,
    private readonly charWidth: number,
    private readonly lineHeight: number
  ) {}

  render(
    ctx: CanvasRenderingContext2D,
    visibleLines: ParsedLine[],
    startIndex: number,
    width: number,
    selection: Selection | null,
    cursorPosition: Position | null
  ) {
    ctx.clearRect(0, 0, width, visibleLines.length * this.lineHeight);
    ctx.fillStyle = this.theme.background;
    ctx.fillRect(0, 0, width, visibleLines.length * this.lineHeight);
    ctx.textBaseline = "top";

    visibleLines.forEach((line, lineOffset) => {
      const y = lineOffset * this.lineHeight;
      let x = 0;
      for (const span of line.spans) {
        const textWidth = span.text.length * this.charWidth;
        if (span.bg) {
          ctx.fillStyle = span.bg;
          ctx.fillRect(x, y, textWidth, this.lineHeight);
        }
        ctx.fillStyle = span.fg;
        ctx.font = `${span.italic ? "italic " : ""}${span.bold ? "700 " : ""}${this.font}`;
        ctx.fillText(span.text, x, y);
        if (span.underline) {
          ctx.fillRect(x, y + this.lineHeight - 2, textWidth, 1);
        }
        if (span.strikethrough) {
          ctx.fillRect(x, y + this.lineHeight / 2, textWidth, 1);
        }
        x += textWidth;
      }
      this.selectionRenderer.renderRow(ctx, selection, startIndex + lineOffset, this.charWidth, this.lineHeight, y, this.theme.selection);
    });

    if (cursorPosition) {
      const cursorY = (cursorPosition.line - startIndex) * this.lineHeight;
      ctx.fillStyle = this.theme.cursor;
      ctx.fillRect(cursorPosition.column * this.charWidth, cursorY, 2, this.lineHeight);
    }
  }
}
