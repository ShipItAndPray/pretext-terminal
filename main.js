import React, { useEffect, useMemo, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Terminal } from "./dist/index.js";

const e = React.createElement;

function DemoApp() {
  const terminalRef = useRef(null);
  const seedLines = useMemo(() => {
    const lines = [
      "\u001b[32mready\u001b[0m build agent started",
      "\u001b[36minfo\u001b[0m loading 128 modules",
      "\u001b[33mwarn\u001b[0m cache miss on workspace metadata",
      "\u001b[31merror\u001b[0m worker 7 restarted after timeout",
      "https://shipitandpray.github.io/pretext-terminal/"
    ];
    for (let index = 0; index < 350; index += 1) {
      lines.push(`log ${String(index).padStart(4, "0")}  compile phase  ${index % 7 === 0 ? "\u001b[32mOK\u001b[0m" : "..."}`);
    }
    return lines;
  }, []);

  useEffect(() => {
    let tick = 0;
    const timer = window.setInterval(() => {
      tick += 1;
      terminalRef.current?.writeln(
        tick % 5 === 0
          ? `\u001b[31merror\u001b[0m retry ${tick} after transient network failure`
          : `\u001b[36minfo\u001b[0m streaming build log chunk ${tick}`
      );
      if (tick >= 40) {
        window.clearInterval(timer);
      }
    }, 160);
    return () => window.clearInterval(timer);
  }, []);

  return e("main", { className: "page" }, [
    e("section", { key: "hero", className: "hero" }, [
      e("div", { key: "copy" }, [
        e("div", { key: "eyebrow", className: "eyebrow" }, "GitHub Pages demo"),
        e("h1", { key: "title" }, "@shipitandpray/pretext-terminal"),
        e("p", { key: "lede", className: "lede" }, "A canvas-rendered terminal with ANSI spans, scrollback, and virtualized viewing for log-heavy interfaces."),
        e("div", { key: "pills", className: "pill-row" }, [
          e("span", { key: "a", className: "pill" }, "ANSI spans"),
          e("span", { key: "b", className: "pill" }, "Canvas renderer"),
          e("span", { key: "c", className: "pill" }, "Virtualized scrollback")
        ])
      ]),
      e("div", { key: "terminal", className: "terminal-shell" }, e(Terminal, {
        ref: terminalRef,
        width: 980,
        height: 620,
        lines: seedLines,
        onData: (data) => {
          if (data.trim()) {
            terminalRef.current?.writeln(`\u001b[35mstdin\u001b[0m ${JSON.stringify(data)}`);
          }
        }
      }))
    ])
  ]);
}

createRoot(document.getElementById("app")).render(e(DemoApp));
