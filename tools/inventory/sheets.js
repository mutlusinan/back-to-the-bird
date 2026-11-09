// Paste into DevTools on x.com. Lists every stylesheet and whether its rules are readable.
(() =>
  [...document.styleSheets].map((sheet, index) => {
    let readable = true;
    let ruleCount = 0;
    let sampleSelectors = [];
    try {
      const rules = sheet.cssRules;
      ruleCount = rules.length;
      sampleSelectors = [...rules].slice(0, 5).map((r) => r.selectorText || r.cssText.slice(0, 60));
    } catch {
      readable = false;
    }
    const owner = sheet.ownerNode;
    return { index, href: sheet.href, ownerId: owner?.id || null, ownerTag: owner?.tagName || null, readable, ruleCount, sampleSelectors };
  }))();
