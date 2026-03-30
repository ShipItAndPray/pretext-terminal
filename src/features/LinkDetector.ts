export const URL_PATTERN = /\bhttps?:\/\/[^\s]+/g;

export function detectLinks(text: string) {
  return [...text.matchAll(URL_PATTERN)].map((match) => ({
    text: match[0],
    start: match.index ?? 0,
    end: (match.index ?? 0) + match[0].length
  }));
}
