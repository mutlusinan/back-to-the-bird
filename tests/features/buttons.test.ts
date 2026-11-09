import { readFileSync } from 'node:fs';
import { findAll, parseSelectorTable } from '../../src/core/selectors';
import selectorsJson from '../../src/data/selectors.json';

const css = () => readFileSync('src/features/buttons/style.css', 'utf8');

test('each button kind is lifted above X inline styles', () => {
  expect(css()).toContain('html[data-ot-f-followButton] :is([data-ot~="followButton"],#ot-btn){');
  expect(css()).toContain('html[data-ot-f-followButton] :is([data-ot~="unfollowButton"],#ot-btn){');
  expect(css()).toContain('html[data-ot-f-followButton] :is([data-ot~="composeButton"],[data-ot~="composeSubmit"],#ot-btn){');
  for (const rule of css().trim().split('\n')) expect(rule, rule).toMatch(/!important\}$/);
});

test('hovering a followed account shows the unfollow colors', () => {
  expect(css()).toContain(
    'html[data-ot-f-followButton] :is([data-ot~="unfollowButton"],#ot-btn):hover{background-color:var(--ot-btn-unfollow-bg) !important;border-color:var(--ot-btn-unfollow-border) !important}',
  );
});

test('follow and unfollow buttons map to different anchors', () => {
  document.body.innerHTML = '<button data-testid="1-follow" id="f"></button><button data-testid="2-unfollow" id="u"></button>';
  const table = parseSelectorTable(selectorsJson);
  expect(findAll(table, 'followButton', document).map((e) => e.id)).toEqual(['f']);
  expect(findAll(table, 'unfollowButton', document).map((e) => e.id)).toEqual(['u']);
});
