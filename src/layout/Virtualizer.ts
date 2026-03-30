export interface VisibleWindow {
  start: number;
  end: number;
}

export function getVisibleWindow(lineCount: number, rowHeight: number, scrollTop: number, viewportHeight: number, overscan = 4): VisibleWindow {
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const end = Math.min(lineCount, Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscan);
  return { start, end };
}
