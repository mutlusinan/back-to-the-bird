import { RESERVED_PATHS } from './route';

const BLANK_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';

/**
 * Development-only: a self-contained copy of the page for test fixtures, with
 * personal data removed. Styles inserted through the CSSOM (react-native-web)
 * become text; scripts, frames and external stylesheets are dropped; text is
 * replaced with `x` of the same length; usernames, ids, labels and images are
 * replaced with generic values.
 */
export function takeSnapshot(doc: Document): string {
  const clone = doc.documentElement.cloneNode(true) as HTMLElement;

  const originals = [...doc.querySelectorAll('style')];
  const copies = [...clone.querySelectorAll('style')];
  originals.forEach((style, i) => {
    try {
      const rules = style.sheet ? [...style.sheet.cssRules].map((r) => r.cssText).join('\n') : style.textContent;
      copies[i]!.textContent = rules;
    } catch {
      copies[i]!.textContent = '';
    }
  });

  for (const el of clone.querySelectorAll('script, iframe, noscript, link, meta[property], meta[name^="twitter"]')) el.remove();
  const title = clone.querySelector('title');
  if (title) title.textContent = 'X';

  const body = clone.querySelector('body');
  if (body) {
    const walker = doc.createTreeWalker(body, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      node.textContent = (node.textContent ?? '').replace(/\S/g, 'x');
    }
  }

  for (const el of clone.querySelectorAll<HTMLElement>('*')) {
    if (el.hasAttribute('aria-label')) el.setAttribute('aria-label', 'label');
    el.removeAttribute('title');
    el.removeAttribute('alt');
    if (el.tagName === 'IMG') {
      el.setAttribute('src', BLANK_IMAGE);
      el.removeAttribute('srcset');
    }
    const testid = el.getAttribute('data-testid');
    if (testid) {
      el.setAttribute(
        'data-testid',
        testid.replace(/^UserAvatar-Container-.+$/, 'UserAvatar-Container-user').replace(/^\d+-(follow|unfollow)$/, '1-$1'),
      );
    }
    const href = el.getAttribute('href');
    if (href) el.setAttribute('href', genericPath(href));
    const style = el.getAttribute('style');
    if (style?.includes('url(')) el.setAttribute('style', style.replace(/url\([^)]*\)/g, 'none'));
  }

  return `<!doctype html>\n${clone.outerHTML}`;
}

function genericPath(href: string): string {
  if (!href.startsWith('/')) return '#';
  const [path] = href.split(/[?#]/);
  const segments = (path ?? '').split('/');
  if (segments[1] && !RESERVED_PATHS.has(segments[1])) segments[1] = 'user';
  return segments.join('/').replace(/\d{5,}/g, '1');
}
