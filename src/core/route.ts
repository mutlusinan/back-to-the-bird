export type PageType = 'home' | 'profile' | 'status' | 'notifications' | 'messages' | 'other';

/** First path segments that are X's own pages, never a username. */
export const RESERVED_PATHS: ReadonlySet<string> = new Set([
  'i', 'home', 'explore', 'search', 'settings', 'compose', 'hashtag', 'notifications', 'messages',
  'login', 'logout', 'signup', 'tos', 'privacy', 'jobs', 'communities', 'lists', 'bookmarks', 'account',
]);
const PROFILE_TABS = new Set(['with_replies', 'media', 'likes', 'highlights', 'articles']);

/** Classifies an x.com path into a coarse page type; the path itself is never kept. */
export function classifyRoute(pathname: string): PageType {
  const segments = pathname.split('/').filter(Boolean);
  const [first, second, third] = segments;
  if (first === undefined) return 'other';
  if (first === 'home' && segments.length === 1) return 'home';
  if (first === 'notifications') return 'notifications';
  if (first === 'messages' || (first === 'i' && second === 'chat')) return 'messages';
  if (RESERVED_PATHS.has(first)) return 'other';
  if (second === 'status' && third !== undefined && /^\d+$/.test(third)) return 'status';
  if (segments.length === 1 || (segments.length === 2 && PROFILE_TABS.has(second!))) return 'profile';
  return 'other';
}
