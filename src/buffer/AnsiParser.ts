import type { Span } from "./types";
import type { TerminalTheme } from "../types";

interface ParserState {
  fg: string;
  bg: string | null;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
}

const ANSI_COLORS: (keyof TerminalTheme)[] = [
  "black",
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white"
];

const BRIGHT_ANSI_COLORS: (keyof TerminalTheme)[] = [
  "brightBlack",
  "brightRed",
  "brightGreen",
  "brightYellow",
  "brightBlue",
  "brightMagenta",
  "brightCyan",
  "brightWhite"
];

function createState(theme: TerminalTheme): ParserState {
  return {
    fg: theme.foreground,
    bg: null,
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false
  };
}

function spanFromState(text: string, state: ParserState): Span {
  return {
    text,
    fg: state.fg,
    bg: state.bg,
    bold: state.bold,
    italic: state.italic,
    underline: state.underline,
    strikethrough: state.strikethrough
  };
}

function applyCode(code: number, theme: TerminalTheme, state: ParserState) {
  if (code === 0) {
    Object.assign(state, createState(theme));
    return;
  }
  if (code === 1) {
    state.bold = true;
    return;
  }
  if (code === 3) {
    state.italic = true;
    return;
  }
  if (code === 4) {
    state.underline = true;
    return;
  }
  if (code === 9) {
    state.strikethrough = true;
    return;
  }
  if (code === 22) {
    state.bold = false;
    return;
  }
  if (code === 23) {
    state.italic = false;
    return;
  }
  if (code === 24) {
    state.underline = false;
    return;
  }
  if (code === 29) {
    state.strikethrough = false;
    return;
  }
  if (code >= 30 && code <= 37) {
    state.fg = theme[ANSI_COLORS[code - 30]];
    return;
  }
  if (code >= 90 && code <= 97) {
    state.fg = theme[BRIGHT_ANSI_COLORS[code - 90]];
    return;
  }
  if (code >= 40 && code <= 47) {
    state.bg = theme[ANSI_COLORS[code - 40]];
    return;
  }
  if (code >= 100 && code <= 107) {
    state.bg = theme[BRIGHT_ANSI_COLORS[code - 100]];
    return;
  }
  if (code === 39) {
    state.fg = theme.foreground;
    return;
  }
  if (code === 49) {
    state.bg = null;
  }
}

export function parseAnsi(line: string, theme: TerminalTheme): Span[] {
  const state = createState(theme);
  const spans: Span[] = [];
  const pattern = /\x1b\[([0-9;]*)m/g;
  let cursor = 0;

  for (const match of line.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > cursor) {
      spans.push(spanFromState(line.slice(cursor, index), state));
    }
    const codes = (match[1] || "0")
      .split(";")
      .filter(Boolean)
      .map(Number);
    for (const code of codes.length ? codes : [0]) {
      applyCode(code, theme, state);
    }
    cursor = index + match[0].length;
  }

  if (cursor < line.length) {
    spans.push(spanFromState(line.slice(cursor), state));
  }

  return spans.length ? spans : [spanFromState("", state)];
}
