export interface TickInfo {
  added: Node[];
  routeChanged: boolean;
}

export interface SchedulerOptions {
  root: Node;
  /** Returns true when work remains; the next tick then runs when the browser is idle. */
  onTick: (info: TickInfo) => Promise<boolean> | boolean;
  earlyPollMs?: number;
  earlyPollDurationMs?: number;
}

/**
 * One MutationObserver for the whole document; changes are batched into at
 * most one tick per animation frame. Route changes are detected by comparing
 * `location.href` each tick (X's own `pushState` is never patched).
 */
export function createScheduler(opts: SchedulerOptions): { start(): void; stop(): void } {
  const { root, onTick, earlyPollMs = 500, earlyPollDurationMs = 10_000 } = opts;
  let pending: Node[] = [];
  let lastHref = location.href;
  let scheduled = false;
  let running = false;
  let again = false;
  let stopped = false;
  let pollTimer: ReturnType<typeof setInterval> | undefined;
  let pollEnd: ReturnType<typeof setTimeout> | undefined;

  const observer = new MutationObserver((records) => {
    for (const record of records) pending.push(...record.addedNodes);
    schedule();
  });

  function schedule(): void {
    if (stopped || scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => void run());
  }

  function scheduleIdle(): void {
    if (stopped || scheduled) return;
    scheduled = true;
    if (typeof requestIdleCallback === 'function') requestIdleCallback(() => void run());
    else setTimeout(() => void run(), 0);
  }

  async function run(): Promise<void> {
    scheduled = false;
    if (stopped) return;
    if (running) {
      again = true;
      return;
    }
    running = true;
    const added = pending;
    pending = [];
    const href = location.href;
    const routeChanged = href !== lastHref;
    lastHref = href;
    let more = false;
    try {
      more = await onTick({ added, routeChanged });
    } finally {
      running = false;
    }
    if (more) scheduleIdle();
    else if (again || pending.length > 0) schedule();
    again = false;
  }

  return {
    start() {
      observer.observe(root, { childList: true, subtree: true });
      window.addEventListener('popstate', schedule);
      if (earlyPollDurationMs > 0) {
        pollTimer = setInterval(schedule, earlyPollMs);
        pollEnd = setTimeout(() => clearInterval(pollTimer), earlyPollDurationMs);
      }
    },
    stop() {
      stopped = true;
      observer.disconnect();
      window.removeEventListener('popstate', schedule);
      clearInterval(pollTimer);
      clearTimeout(pollEnd);
    },
  };
}
