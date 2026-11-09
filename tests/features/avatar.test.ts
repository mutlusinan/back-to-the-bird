import { readFileSync } from 'node:fs';
import { findAll, parseSelectorTable } from '../../src/core/selectors';
import selectorsJson from '../../src/data/selectors.json';

const css = () => readFileSync('src/features/avatar/style.css', 'utf8');

test('avatar corners come from the era token and outrank the engine radius rules', () => {
  // #ot-avatar inside :is() lifts the rule to id specificity, above the engine's (0,2,1) radius rules.
  expect(css()).toContain(
    'html[data-ot-f-avatar] :is([data-ot~="avatar"],[data-ot~="avatar"] div,#ot-avatar){border-radius:var(--ot-avatar-radius) !important}',
  );
});

test('the avatar anchor finds X avatar containers', () => {
  document.body.innerHTML = '<div data-testid="UserAvatar-Container-user" id="a"><div><div></div></div></div>';
  expect(findAll(parseSelectorTable(selectorsJson), 'avatar', document).map((e) => e.id)).toEqual(['a']);
});
