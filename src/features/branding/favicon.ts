const observers = new WeakMap<HTMLHeadElement, MutationObserver>();

/**
 * Adds our icon <link> at the end of <head> and keeps it last when X adds or
 * reorders its own icons (X swaps its favicon for notification badges). X's
 * links are never modified.
 */
export function ensureFavicon(head: HTMLHeadElement, href: string): void {
  let link = head.querySelector<HTMLLinkElement>('link[rel="icon"][data-ot]');
  if (!link) {
    link = head.ownerDocument.createElement('link');
    link.rel = 'icon';
    link.setAttribute('data-ot', '');
  }
  if (link.getAttribute('href') !== href) link.setAttribute('href', href);
  if (head.lastElementChild !== link) head.appendChild(link);
  if (observers.has(head)) return;
  const observer = new MutationObserver(() => {
    const ours = head.querySelector('link[rel="icon"][data-ot]');
    if (ours && head.lastElementChild !== ours) head.appendChild(ours);
  });
  observer.observe(head, { childList: true });
  observers.set(head, observer);
}

export function removeFavicon(head: HTMLHeadElement): void {
  observers.get(head)?.disconnect();
  observers.delete(head);
  head.querySelector('link[rel="icon"][data-ot]')?.remove();
}
