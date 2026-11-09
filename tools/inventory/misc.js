// Paste into DevTools on x.com. Theme signal, language, build id and icon fill usage.
(() => {
  const main = document.querySelector('script[src*="/main."]');
  const build = main && /main\.([a-z0-9]+)\.js/.exec(main.src);
  return {
    htmlLang: document.documentElement.lang,
    htmlDir: document.documentElement.dir,
    bodyInlineStyle: document.body.getAttribute('style'),
    bodyComputedBg: getComputedStyle(document.body).backgroundColor,
    metaThemeColor: document.querySelector('meta[name=theme-color]')?.content ?? null,
    xBuild: build ? build[1] : null,
    svgFillSample: [...document.querySelectorAll('svg')].slice(0, 20).map((svg) => ({
      attr: svg.getAttribute('fill'),
      computed: getComputedStyle(svg).fill,
      color: getComputedStyle(svg).color,
    })),
  };
})();
