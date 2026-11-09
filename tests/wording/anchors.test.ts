import { ANCHOR_NAMES, findAll, parseSelectorTable } from '../../src/core/selectors';
import selectorsJson from '../../src/data/selectors.json';
import { WORDING_KEYS, wordingAnchor, type WordingAnchor } from '../../src/wording/keys';

const ids = (name: WordingAnchor) => findAll(parseSelectorTable(selectorsJson), name, document).map((e) => e.id);

// Shapes copied from live X (2026-11-09, desktop, English UI).
beforeEach(() => {
  document.body.innerHTML = `
    <header role="banner"><a data-testid="SideNav_NewTweet_Button" href="/compose/post" id="compose"><div dir="ltr"><div><span><div><div><span><span>Post</span></span></div></div></span></div></div></a></header>
    <div data-testid="primaryColumn">
      <div data-testid="UserName"></div>
      <div data-testid="ScrollSnap-List" role="tablist">
        <div role="presentation"><a role="tab" href="/someone" aria-haspopup="menu" id="posts"><div><div dir="ltr"><div><span><span>Posts</span><span> </span><svg></svg></span></div></div></div></a></div>
        <div role="presentation"><a role="tab" href="/someone/with_replies" id="replies"></a></div>
        <div role="presentation"><a role="tab" href="/someone/reposts" id="profile-reposts"></a></div>
        <div role="presentation"><a role="tab" href="/someone/likes" id="likes"></a></div>
      </div>
      <button data-testid="tweetButtonInline" id="inline"><div dir="ltr"><div><span><span>Post</span></span></div></div></button>
    </div>
    <div role="dialog"><button data-testid="tweetButton" id="modal-post"></button></div>
    <div role="dialog"><article></article><button data-testid="tweetButton" id="modal-reply"></button></div>
    <div role="menu"><div role="menuitem" data-testid="retweetConfirm" id="repost"></div><a role="menuitem" href="/compose/post" id="quote"></a></div>
    <div role="menu"><div role="menuitem" data-testid="unretweetConfirm" id="undo-repost"></div></div>
    <div role="tablist"><div role="presentation"><a role="tab" href="/u/status/1/quotes" id="quotes"></a></div><div role="presentation"><a role="tab" href="/u/status/1/retweets" id="retweets"></a></div></div>`;
});

test('every wording key has an anchor in the selector table', () => {
  for (const key of WORDING_KEYS) expect(ANCHOR_NAMES).toContain(wordingAnchor(key));
});

test.each([
  ['wordComposeButton', ['compose']],
  ['wordRepostAction', ['repost']],
  ['wordUndoRepostAction', ['undo-repost']],
  ['wordQuoteAction', ['quote']],
  ['wordRepostsLabel', ['profile-reposts', 'retweets']],
  ['wordQuotesLabel', ['quotes']],
  ['wordLikesLabel', ['likes']],
  ['wordProfilePostsTab', ['posts']],
] as const)('%s finds the live control', (name, expected) => {
  expect(ids(name)).toEqual(expected);
});

test('the submit button is relabelled only where X says "Post", not in the reply dialog', () => {
  expect(ids('wordComposeSubmit')).toEqual(['inline', 'modal-post']);
});

test('on a tweet page the inline composer is a reply composer and keeps "Reply"', () => {
  document.querySelector('#inline')!.remove();
  document
    .querySelector('[data-testid="primaryColumn"]')!
    .insertAdjacentHTML('beforeend', '<div data-testid="inline_reply_offscreen"><div><button data-testid="tweetButtonInline" id="inline-reply"></button></div></div>');
  expect(ids('wordComposeSubmit')).toEqual(['modal-post']);
});

test('tabs on pages without a profile header are not the profile posts tab', () => {
  document.querySelector('[data-testid="UserName"]')!.remove();
  expect(ids('wordProfilePostsTab')).toEqual([]);
});
