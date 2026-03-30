# @shipitandpray/pretext-terminal

Virtualized terminal UI for React, backed by Pretext-aware monospace layout and canvas rendering.

This package is designed for log-heavy terminal views where DOM-row terminals become expensive. It keeps terminal lines in a scrollback buffer, parses ANSI styling into spans, virtualizes the visible region, and paints the current window to a canvas.

## Why this package exists

Traditional browser terminals tend to degrade when scrollback gets large because they keep too much DOM around. This package takes a different route:

- store terminal output in a buffer
- precompute monospace layout assumptions
- render only the visible window
- paint text and backgrounds to canvas

That makes it a better fit for:

- build logs
- CI output viewers
- developer tools
- internal dashboards with long-running process streams

## Features

- `Terminal` React component
- `TerminalCore` framework-agnostic write/buffer engine
- ANSI span parser for common SGR color/style sequences
- line scrollback buffer
- visible-window virtualizer
- canvas renderer for foreground, background, underline, and strike styles
- small helpers for keyboard input, link detection, clipboard, and buffer search

## Install

```bash
npm install @shipitandpray/pretext-terminal @chenglou/pretext react
```

## Demo

Live demo:

- `https://shipitandpray.github.io/pretext-terminal/`

The demo includes:

- a terminal panel with ANSI-colored sample output
- a fast synthetic log burst
- interactive input forwarding
- a scrollback view large enough to demonstrate virtualization

## Quick start

```tsx
import { useRef } from "react";
import { Terminal, type TerminalHandle } from "@shipitandpray/pretext-terminal";

export function BuildLog() {
  const terminalRef = useRef<TerminalHandle>(null);

  return (
    <Terminal
      ref={terminalRef}
      width={900}
      height={520}
      onData={(data) => {
        console.log("send to PTY", data);
      }}
      lines={[
        "\u001b[32mready\u001b[0m server booted",
        "\u001b[33mwarn\u001b[0m cache is warm",
        "\u001b[31merror\u001b[0m worker exited"
      ]}
    />
  );
}
```

## API

### `Terminal`

The main React component.

Props:

- `lines`
- `onData`
- `cols`
- `rows`
- `font`
- `lineHeight`
- `maxScrollback`
- `theme`
- `className`
- `width`
- `height`

### `TerminalHandle`

Imperative methods exposed through `ref`:

- `write(data)`
- `writeln(data)`
- `clear()`
- `scrollToBottom()`
- `scrollToTop()`
- `getSelection()`
- `focus()`

### `TerminalCore`

Framework-agnostic core that owns:

- line buffering
- ANSI parsing
- layout assumptions
- visible line access

Use this if you want the buffer and parser without the React wrapper.

### `parseAnsi(line, theme)`

Parses ANSI SGR color/style escape sequences into styled spans. The current implementation covers the most common text styling sequences:

- reset
- foreground colors
- background colors
- bold
- italic
- underline
- strikethrough

### `getVisibleWindow(lineCount, rowHeight, scrollTop, viewportHeight, overscan?)`

Returns the visible start and end line indices for a scroll position.

### `searchBuffer(lines, query)`

Finds case-insensitive matches in scrollback lines.

## Architectural notes

This package assumes a monospace font and uses that to simplify layout:

- one measured character width
- one row height
- predictable columns

Pretext still matters because it keeps text measurement grounded in a real font configuration instead of hardcoded guesses. The current implementation uses it to anchor the monospace layout setup while keeping the render loop canvas-first.

## Rendering model

The rendering path is:

1. parse incoming text into ANSI spans
2. append parsed lines to scrollback
3. compute visible range from scroll state
4. paint only visible rows to canvas

That means scrolling is mostly a viewport problem rather than a DOM problem.

## PTY / WebSocket integration

This package does not ship a PTY server. The expected integration is:

- connect your backend PTY or WebSocket stream
- call `write()` or update `lines`
- forward keyboard data through `onData`

That keeps the package browser-focused and easy to embed in existing tooling.

## Local development

```bash
npm install
npm run check
npm run build
npm test
```

## GitHub Pages deployment

The repo includes a Pages workflow that:

1. installs dependencies
2. builds the package
3. publishes a static demo using the built output

## Limitations

- ANSI support is focused on common SGR styling, not every control sequence.
- The current renderer assumes monospace text.
- Selection and mouse behavior are intentionally lightweight in this first pass.
- The demo simulates process output locally rather than connecting to a real PTY server.

## Good fits

Use this package for:

- build log viewers
- internal CI dashboards
- server console panes
- long-running process monitors

## License

MIT
