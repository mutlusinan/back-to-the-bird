import { renderInlineOverrides } from '../../src/engine/inline';
import { parsePaletteMap } from '../../src/engine/palette-map';

const map = parsePaletteMap({
  version: 1,
  light: { color: { 'rgb(29, 155, 240)': 'accent' }, 'border-color': { 'rgb(239, 243, 244)': 'border' } },
  night: { 'background-color': { 'rgba(15, 20, 25, 0.75)': 'bg-hover' } },
  'font-family': {},
  'font-size': {},
  'border-radius': {},
  xTokens: { light: {}, night: {} },
});

test('inline overrides do not let background-color match color', () => {
  const css = renderInlineOverrides(map);
  expect(css).toContain(
    'html[data-ot-f-palette][data-ot-theme="light"] [style^="color: rgb(29, 155, 240)"],' +
      'html[data-ot-f-palette][data-ot-theme="light"] [style*="; color: rgb(29, 155, 240)"]{color:var(--ot-accent) !important}',
  );
  expect(css).not.toContain('[style*="color: rgb(29, 155, 240)"]{');
});

test('border colors cover the longhands X writes inline', () => {
  const css = renderInlineOverrides(map);
  expect(css).toContain('[style*="; border-bottom-color: rgb(239, 243, 244)"]{border-bottom-color:var(--ot-border) !important}');
  expect(css).toContain('[style^="border-color: rgb(239, 243, 244)"]');
});

test('translucent values keep the rgba spelling', () => {
  expect(renderInlineOverrides(map)).toContain(
    'html[data-ot-f-palette][data-ot-theme="night"] [style^="background-color: rgba(15, 20, 25, 0.75)"]',
  );
});
