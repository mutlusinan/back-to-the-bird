export interface TickInfo {
  added: Node[];
  /** Elements whose data-testid changed (X swaps it when state flips, e.g. like → unlike). */
  changed: Element[];
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
export function createScheduler(opts: SchedulerOptions): { start(): void; stop(): void; poke(): void } {
  const { root, onTick, earlyPollMs = 500, earlyPollDurationMs = 10_000 } = opts;
  let pending: Node[] = [];
  let changedPending = new Set<Element>();
  let lastHref = location.href;
  let scheduled = false;
  let running = false;
  let again = false;
  let stopped = false;
  let pollTimer: ReturnType<typeof setInterval> | undefined;
  let pollEnd: ReturnType<typeof setTimeout> | undefined;

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === 'attributes') changedPending.add(record.target as Element);
      else for (const node of record.addedNodes) if (node.nodeType === Node.ELEMENT_NODE) pending.push(node);
    }
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
    const changed = [...changedPending];
    changedPending = new Set();
    const href = location.href;
    const routeChanged = href !== lastHref;
    lastHref = href;
    let more = false;
    try {
      more = await onTick({ added, changed, routeChanged });
    } finally {
      running = false;
    }
    if (more) scheduleIdle();
    else if (again || pending.length > 0 || changedPending.size > 0) schedule();
    again = false;
  }

  return {
    start() {
      observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-testid'] });
      window.addEventListener('popstate', schedule);
      if (earlyPollDurationMs > 0) {
        pollTimer = setInterval(schedule, earlyPollMs);
        pollEnd = setTimeout(() => clearInterval(pollTimer), earlyPollDurationMs);
      }
    },
    /** Requests a tick even without DOM changes (e.g. at startup or after a settings change). */
    poke() {
      schedule();
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
