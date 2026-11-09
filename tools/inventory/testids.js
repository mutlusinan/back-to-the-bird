// Paste into DevTools on x.com. Counts data-testid values; user-specific parts
// (usernames, numeric ids) are replaced so the output holds no personal data.
(() => {
  const counts = {};
  for (const el of document.querySelectorAll('[data-testid]')) {
    const id = el
      .getAttribute('data-testid')
      .replace(/^(UserAvatar-Container-).+$/, '$1<user>')
      .replace(/\d{3,}/g, '<id>');
    counts[id] = (counts[id] ?? 0) + 1;
  }
  return {
    testids: counts,
    banner: !!document.querySelector('header[role=banner]'),
    main: !!document.querySelector('main[role=main]'),
    nav: !!document.querySelector('nav[role=navigation]'),
  };
})();
