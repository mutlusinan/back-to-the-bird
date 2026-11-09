import { takeSnapshot } from '../../src/core/snapshot';

beforeEach(() => {
  document.head.innerHTML = '<title>jack on X</title><style id="s"></style><script>secret()</script>';
  (document.getElementById('s') as HTMLStyleElement).sheet!.insertRule('.inserted{color:red}');
  document.body.innerHTML = `
    <article data-testid="tweet" role="article" class="r-tweet">
      <a href="/jack" aria-label="jack's avatar"><img src="https://pbs.twimg.com/profile/jack.jpg"></a>
      <div data-testid="UserAvatar-Container-jack" style="background-image: url(&quot;https://pbs.twimg.com/b.jpg&quot;);"></div>
      <div data-testid="tweetText">Merhaba dünya</div>
      <a href="/jack/status/1234567890">link</a>
      <button data-testid="12345-follow">Follow</button>
      <a href="/home">Home</a>
      <iframe src="https://x.com/i/chat"></iframe>
    </article>`;
});

test('personal data is removed', () => {
  const out = takeSnapshot(document);
  for (const leak of ['jack', 'Merhaba', 'pbs.twimg', '12345', '1234567890', 'secret()', '<iframe']) {
    expect(out, leak).not.toContain(leak);
  }
});

test('structure, roles, classes and generic ids are kept', () => {
  const out = takeSnapshot(document);
  for (const kept of ['data-testid="tweet"', 'role="article"', 'class="r-tweet"', 'UserAvatar-Container-user', 'data-testid="1-follow"', 'href="/home"', 'href="/user/status/1"']) {
    expect(out, kept).toContain(kept);
  }
});

test('rules inserted into stylesheets become text', () => {
  expect(takeSnapshot(document)).toContain('.inserted { color: red; }');
});

test('text keeps its length', () => {
  expect(takeSnapshot(document)).toContain('>xxxxxxx xxxxx<');
});
