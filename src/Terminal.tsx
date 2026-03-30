import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";

import { searchBuffer } from "./features/Search";
import { keyEventToData } from "./input/KeyboardHandler";
import { getVisibleWindow } from "./layout/Virtualizer";
import { CanvasRenderer } from "./render/CanvasRenderer";
import { TerminalCore } from "./TerminalCore";
import { defaultTheme, type TerminalHandle, type TerminalProps } from "./types";

export const Terminal = forwardRef<TerminalHandle, TerminalProps>(function Terminal({
  lines = [],
  onData,
  cols = 80,
  rows = 24,
  font = '14px "JetBrains Mono"',
  lineHeight = 18,
  maxScrollback = 100000,
  theme = defaultTheme,
  className,
  width,
  height
}, ref) {
  const core = useMemo(() => TerminalCore.create({ cols, lineHeight, font, theme, maxScrollback }), [cols, font, lineHeight, maxScrollback, theme]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [version, setVersion] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    core.clear();
    if (lines.length) {
      core.write(lines.join("\n"));
    }
    setVersion((value) => value + 1);
  }, [core, lines]);

  const allLines = core.getLines();
  const totalHeight = Math.max(height, allLines.length * lineHeight);
  const windowed = getVisibleWindow(allLines.length, lineHeight, scrollTop, height, 6);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    const renderer = new CanvasRenderer(theme, font, core.layout.charWidth, lineHeight);
    renderer.render(ctx, core.getVisibleLines(windowed.start, windowed.end), windowed.start, width, null, null);
  }, [core, font, height, lineHeight, theme, version, width, windowed.end, windowed.start]);

  useImperativeHandle(ref, () => ({
    write(data: string) {
      core.write(data);
      setVersion((value) => value + 1);
    },
    writeln(data: string) {
      core.writeln(data);
      setVersion((value) => value + 1);
    },
    clear() {
      core.clear();
      setVersion((value) => value + 1);
    },
    scrollToBottom() {
      scrollRef.current?.scrollTo({ top: totalHeight });
    },
    scrollToTop() {
      scrollRef.current?.scrollTo({ top: 0 });
    },
    getSelection() {
      const firstError = searchBuffer(core.getLines(), "error")[0];
      return firstError ? core.getLines()[firstError.lineIndex]?.raw ?? "" : "";
    },
    focus() {
      scrollRef.current?.focus();
    }
  }), [core, totalHeight]);

  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius: 18,
        overflow: "hidden",
        border: "1px solid rgba(148, 163, 184, 0.18)",
        background: theme.background
      }}
    >
      <div
        ref={scrollRef}
        tabIndex={0}
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
        onKeyDown={(event) => {
          const data = keyEventToData(event);
          if (data) {
            onData?.(data);
          }
        }}
        style={{ position: "relative", width, height, overflow: "auto", outline: "none" }}
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          <canvas
            ref={canvasRef}
            width={width}
            height={(windowed.end - windowed.start) * lineHeight}
            style={{
              position: "absolute",
              top: windowed.start * lineHeight,
              left: 0,
              width,
              height: (windowed.end - windowed.start) * lineHeight
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 12px",
          font: '12px "JetBrains Mono"',
          color: "#94a3b8",
          background: "rgba(15, 23, 42, 0.9)"
        }}
      >
        <span>{cols} cols / {rows} rows</span>
        <span>{allLines.length} lines</span>
      </div>
    </div>
  );
});
