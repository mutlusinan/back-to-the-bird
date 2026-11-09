// Paste into DevTools on x.com. Frequency of color/font/radius values in readable
// stylesheet rules and in inline style attributes (top 25 per property).
(() => {
  const props = [
    'color', 'background-color', 'border-color',
    'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
    'fill', 'stroke', 'font-family', 'font-size', 'border-radius', 'border-top-left-radius',
  ];
  const rules = {};
  const inline = {};
  const add = (bag, prop, value) => {
    if (!value) return;
    bag[prop] ??= {};
    bag[prop][value] = (bag[prop][value] ?? 0) + 1;
  };
  const walk = (list) => {
    for (const rule of list) {
      if (rule.style) for (const p of props) add(rules, p, rule.style.getPropertyValue(p));
      if (rule.cssRules) walk(rule.cssRules);
    }
  };
  for (const sheet of document.styleSheets) {
    try {
      walk(sheet.cssRules);
    } catch {
      // unreadable (cross-origin) sheet
    }
  }
  const styled = document.querySelectorAll('[style]');
  for (const el of styled) for (const p of props) add(inline, p, el.style.getPropertyValue(p));
  const top = (bag) =>
    Object.fromEntries(
      Object.entries(bag).map(([p, values]) => [
        p,
        Object.fromEntries(Object.entries(values).sort((a, b) => b[1] - a[1]).slice(0, 25)),
      ]),
    );
  const inlineSamples = [...document.querySelectorAll('[style*="color"]')]
    .slice(0, 8)
    .map((el) => el.getAttribute('style'));
  return { rules: top(rules), inline: top(inline), styledElements: styled.length, inlineSamples };
})();
