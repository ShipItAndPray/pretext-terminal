import type { Selection } from "../buffer/types";

export class SelectionRenderer {
  renderRow(
    ctx: CanvasRenderingContext2D,
    selection: Selection | null,
    lineIndex: number,
    charWidth: number,
    lineHeight: number,
    y: number,
    color: string
  ) {
    if (!selection || lineIndex < selection.startLine || lineIndex > selection.endLine) {
      return;
    }

    const startColumn = lineIndex === selection.startLine ? selection.startColumn : 0;
    const endColumn = lineIndex === selection.endLine ? selection.endColumn : selection.endColumn + 1;
    const width = Math.max(0, endColumn - startColumn) * charWidth;
    if (!width) {
      return;
    }
    ctx.fillStyle = color;
    ctx.fillRect(startColumn * charWidth, y, width, lineHeight);
  }
}
