import { classifyRoute } from '../../src/core/route';

test.each([
  ['/home', 'home'],
  ['/jack', 'profile'],
  ['/jack/media', 'profile'],
  ['/jack/status/123', 'status'],
  ['/jack/status/123/photo/1', 'status'],
  ['/notifications', 'notifications'],
  ['/notifications/mentions', 'notifications'],
  ['/messages', 'messages'],
  ['/i/chat/abc', 'messages'],
  ['/explore', 'other'],
  ['/settings/display', 'other'],
  ['/i/bookmarks', 'other'],
  ['/search', 'other'],
])('classifyRoute(%s) → %s', (path, type) => expect(classifyRoute(path)).toBe(type));
