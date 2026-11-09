export default defineContentScript({
  matches: ['https://x.com/*'],
  runAt: 'document_start',
  cssInjectionMode: 'manifest',
  main() {},
});
