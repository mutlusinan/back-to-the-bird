import { defineConfig } from '@playwright/test';

// Visual tests run against the installed Chrome (no browser download).
// Baselines are platform-specific (fonts), recorded on Windows.
export default defineConfig({
  testDir: 'tests/visual',
  use: { channel: 'chrome', viewport: { width: 1280, height: 900 } },
  // Tight on purpose: an icon color change is only a few hundred pixels.
  expect: { toHaveScreenshot: { maxDiffPixels: 20 } },
  reporter: 'list',
});
