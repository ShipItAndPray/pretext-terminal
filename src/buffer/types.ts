export interface Span {
  text: string;
  fg: string;
  bg: string | null;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
}

export interface ParsedLine {
  raw: string;
  spans: Span[];
  wrappedRows: number;
}

export interface Selection {
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
}
