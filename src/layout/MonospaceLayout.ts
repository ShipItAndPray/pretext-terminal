import { layout, prepare } from "@chenglou/pretext";

export class MonospaceLayout {
  readonly charWidth: number;
  readonly charHeight: number;

  constructor(public readonly font: string, public readonly lineHeight: number) {
    this.charWidth = this.measureCharWidth(font);
    this.charHeight = this.measureCharHeight(font, lineHeight);
  }

  private measureCharWidth(font: string) {
    if (typeof document === "undefined") {
      return 8;
    }
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return 8;
    }
    ctx.font = font;
    return Math.max(1, Math.ceil(ctx.measureText("M").width));
  }

  private measureCharHeight(font: string, lineHeight: number) {
    if (typeof document === "undefined") {
      return lineHeight;
    }
    const prepared = prepare("M", font);
    const measured = layout(prepared, 1000, lineHeight);
    return Math.max(lineHeight, measured.height || lineHeight);
  }

  getWrappedLineCount(text: string, cols: number) {
    const lines = text.split("\n");
    return lines.reduce((count, line) => count + Math.max(1, Math.ceil(Math.max(line.length, 1) / cols)), 0);
  }
}
