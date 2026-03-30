export interface KeyboardLikeEvent {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
}

export function keyEventToData(event: KeyboardLikeEvent): string | null {
  if (event.key === "Enter") {
    return "\r";
  }
  if (event.key === "Backspace") {
    return "\x7f";
  }
  if (event.key === "Tab") {
    return "\t";
  }
  if (event.ctrlKey && event.key.toLowerCase() === "c") {
    return "\x03";
  }
  if (event.key.length === 1 && !event.metaKey && !event.altKey) {
    return event.key;
  }
  return null;
}
