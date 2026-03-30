import type { ParsedLine } from "../buffer/types";

export interface SearchMatch {
  lineIndex: number;
  start: number;
  end: number;
}

export function searchBuffer(lines: ParsedLine[], query: string): SearchMatch[] {
  if (!query) {
    return [];
  }
  const needle = query.toLowerCase();
  const matches: SearchMatch[] = [];

  lines.forEach((line, lineIndex) => {
    const haystack = line.raw.toLowerCase();
    let start = haystack.indexOf(needle);
    while (start !== -1) {
      matches.push({ lineIndex, start, end: start + needle.length });
      start = haystack.indexOf(needle, start + needle.length);
    }
  });

  return matches;
}
