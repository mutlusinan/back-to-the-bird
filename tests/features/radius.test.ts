import { readFileSync } from 'node:fs';
import { findAll, parseSelectorTable } from '../../src/core/selectors';
import selectorsJson from '../../src/data/selectors.json';

const radiusCss = readFileSync('src/features/radius/style.css', 'utf8');

test('round exceptions outrank the engine radius rules', () => {
  expect(radiusCss).toContain('html[data-ot-f-radius] :is([data-ot~="radiusKeep"],#ot-round){border-radius:9999px !important}');
});

test('the search box and switches stay round', () => {
  document.body.innerHTML =
    '<label data-testid="SearchBox_Search_Input_label"><div id="s"></div></label><div role="switch" id="w"><div id="k"></div></div><div id="other"></div>';
  const ids = findAll(parseSelectorTable(selectorsJson), 'radiusKeep', document).map((e) => e.id || e.getAttribute('data-testid'));
  expect(ids).toEqual(expect.arrayContaining(['SearchBox_Search_Input_label', 's', 'w', 'k']));
  expect(ids).not.toContain('other');
});
