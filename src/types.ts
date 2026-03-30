import type { ForwardedRef } from "react";

export interface TerminalTheme {
  background: string;
  foreground: string;
  cursor: string;
  selection: string;
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
  brightBlack: string;
  brightRed: string;
  brightGreen: string;
  brightYellow: string;
  brightBlue: string;
  brightMagenta: string;
  brightCyan: string;
  brightWhite: string;
}

export interface Position {
  line: number;
  column: number;
}

export interface TerminalProps {
  lines?: string[];
  onData?: (data: string) => void;
  cols?: number;
  rows?: number;
  font?: string;
  lineHeight?: number;
  maxScrollback?: number;
  theme?: TerminalTheme;
  className?: string;
  width: number;
  height: number;
}

export interface TerminalHandle {
  write(data: string): void;
  writeln(data: string): void;
  clear(): void;
  scrollToBottom(): void;
  scrollToTop(): void;
  getSelection(): string;
  focus(): void;
}

export interface TerminalComponentProps extends TerminalProps {
  terminalRef?: ForwardedRef<TerminalHandle>;
}

export const defaultTheme: TerminalTheme = {
  background: "#0b1220",
  foreground: "#cbd5e1",
  cursor: "#f8fafc",
  selection: "rgba(148, 163, 184, 0.28)",
  black: "#111827",
  red: "#f87171",
  green: "#4ade80",
  yellow: "#fbbf24",
  blue: "#60a5fa",
  magenta: "#e879f9",
  cyan: "#22d3ee",
  white: "#e5e7eb",
  brightBlack: "#6b7280",
  brightRed: "#fca5a5",
  brightGreen: "#86efac",
  brightYellow: "#fcd34d",
  brightBlue: "#93c5fd",
  brightMagenta: "#f5d0fe",
  brightCyan: "#67e8f9",
  brightWhite: "#ffffff"
};
