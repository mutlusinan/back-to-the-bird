// Writes tests/fixtures/x-home-{light,night}.html: hand-built pages that follow the
// structure recorded in docs/x-dom-inventory.md (data-testid, roles, nesting, inline
// colors in X's spelling, react-native-web style atomic classes). No real X content,
// usernames or SVG paths. Run: node tools/build-fixtures.mjs
import { writeFileSync } from 'node:fs';

const THEMES = {
  light: {
    body: 'background-color: rgb(255, 255, 255); color: rgb(15, 20, 25);',
    text: '15,20,25', text2: '83,100,113', border: '239,243,244', hover: '247,249,249', card: '255,255,255',
    button: 'background-color: rgb(15, 20, 25); border-color: rgba(0, 0, 0, 0);', buttonText: '255,255,255',
  },
  night: {
    body: 'background-color: rgb(0, 0, 0); color: rgb(231, 233, 234);',
    text: '231,233,234', text2: '113,118,123', border: '47,51,54', hover: '22,24,28', card: '0,0,0',
    button: 'background-color: rgb(239, 243, 244); border-color: rgba(0, 0, 0, 0);', buttonText: '15,20,25',
  },
};

// A neutral placeholder glyph: X's real icon paths are not copied.
const ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" class="r-icon"><g><path d="M4 4h16v16H4z"></path></g></svg>';
const icon = (size) => `<div class="r-flex"><div class="r-flex">${ICON.replace('r-icon', `r-icon r-icon-${size}`)}</div></div>`;

const navLink = (testid, label) =>
  `<a href="/${label.toLowerCase()}" data-testid="${testid}" aria-label="${label}" role="link" class="r-nav r-text">${icon('nav')}<span class="r-text">${label}</span></a>`;

const avatar = () =>
  `<div data-testid="UserAvatar-Container-user" class="r-avatar"><div><div><div class="r-pill r-clip"><div role="presentation"><div class="r-pill r-clip r-avatar-img"></div></div></div></div></div></div>`;

const action = (testid, extra = '') =>
  `<div class="r-action"><button data-testid="${testid}" role="button" class="r-action-btn ${testid === 'unlike' ? 'r-like' : 'r-text2'}">${icon('action')}<span data-testid="app-text-transition-container" class="r-text2">12</span></button>${extra}</div>`;

const tweet = (liked) => `
<article data-testid="tweet" role="article" class="r-tweet r-border">
  ${avatar()}
  <div class="r-tweet-body">
    <div class="r-tweet-head">
      <div data-testid="User-Name"><span class="r-text r-bold">Display Name</span><span class="r-text2">@user</span></div>
      <a href="/user/status/1" class="r-text2"><time datetime="2017-06-01T00:00:00.000Z">Jun 1</time></a>
      <div class="r-head-actions"><div><button role="button" aria-label="Grok actions" class="r-icon-btn">${icon('action')}</button></div><div><button data-testid="caret" role="button" class="r-icon-btn">${icon('action')}</button></div></div>
    </div>
    <div data-testid="tweetText" class="r-text r-fs">A tweet in the classic style.</div>
    <div role="group" class="r-group">
      ${action('reply')}${action('retweet')}${action(liked ? 'unlike' : 'like')}${action('bookmark')}
      <div class="r-action"><a href="/user/status/1/analytics" aria-label="views" role="link" class="r-text2">${icon('action')}</a></div>
    </div>
  </div>
</article>`;

function page(theme) {
  const t = THEMES[theme];
  return `<!doctype html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<title>Home / X (fixture)</title>
<style>
/* layout only, no colors */
*{box-sizing:border-box}body{margin:0;font:15px/20px sans-serif}
.r-app{display:flex;justify-content:center;gap:24px}
header[role=banner]{width:260px}.r-nav{display:flex;align-items:center;gap:16px;padding:12px;text-decoration:none}
.r-flex{display:flex}.r-icon{width:24px;height:24px;fill:currentColor}.r-icon-action{width:18.75px;height:18.75px}.r-icon-nav{width:26.25px;height:26.25px}
main[role=main]{display:flex;gap:24px}[data-testid=primaryColumn]{width:600px;border-inline:1px solid}
[data-testid=sidebarColumn]{width:350px}.r-tweet{display:flex;gap:12px;padding:12px 16px;border-bottom:1px solid}
.r-avatar{width:40px;height:40px}.r-avatar *{width:40px;height:40px}.r-tweet-body{flex:1}.r-tweet-head{display:flex;gap:4px;align-items:center}
.r-head-actions{display:flex;margin-inline-start:auto}.r-group{display:flex;justify-content:space-between;margin-top:12px}
.r-action-btn,.r-icon-btn{display:flex;align-items:center;gap:4px;background:none;border:0;padding:0}
.r-btn{display:inline-flex;align-items:center;justify-content:center;min-height:32px;padding:0 16px;border:1px solid;font-weight:bold}
.r-compose{min-height:52px;width:230px;margin:12px}.r-box{margin:16px 0;padding:12px 16px;border:1px solid}
a{text-decoration:none}.r-bold{font-weight:bold}.r-clip{overflow:hidden}
[data-testid=SearchBox_Search_Input_label]{display:flex;padding:10px 16px;border:1px solid}
[data-testid=GrokDrawer]{position:fixed;bottom:0;inset-inline-end:16px;padding:12px}
</style>
<style>
/* react-native-web style atomic rules, in X's spelling */
.r-text{color:rgba(${t.text},1.00)}.r-text2{color:rgba(${t.text2},1.00)}.r-border{border-bottom-color:rgba(${t.border},1.00)}
[data-testid=primaryColumn]{border-left-color:rgba(${t.border},1.00);border-right-color:rgba(${t.border},1.00)}
.r-box{border-top-color:rgba(${t.border},1.00);border-bottom-color:rgba(${t.border},1.00);background-color:rgba(${t.hover},1.00)}
.r-accent{color:rgba(29,155,240,1.00)}.r-like{color:rgba(249,24,128,1.00)}.r-rt{color:rgba(0,186,124,1.00)}
.r-nav:hover{background-color:rgba(${t.hover},1.00)}.r-action-btn:hover{background-color:rgba(29,155,240,0.10)}
.r-pill{border-top-left-radius:9999px;border-top-right-radius:9999px;border-bottom-left-radius:9999px;border-bottom-right-radius:9999px}
.r-media{border-top-left-radius:16px}.r-chirp{font-family:TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif}.r-fs{font-size:15px}
.r-btn{border-top-left-radius:9999px;border-top-right-radius:9999px;border-bottom-left-radius:9999px;border-bottom-right-radius:9999px}
</style>
</head>
<body style="${t.body}" class="r-chirp">
<div class="r-app">
  <header role="banner">
    <h1 role="heading"><a href="/home" aria-label="X" role="link" style="border-color: rgba(0, 0, 0, 0); background-color: rgba(0, 0, 0, 0);">${icon('nav')}</a></h1>
    <nav role="navigation" aria-label="Primary">
      ${navLink('AppTabBar_Home_Link', 'Home')}${navLink('AppTabBar_Explore_Link', 'Explore')}${navLink('AppTabBar_Notifications_Link', 'Notifications')}${navLink('AppTabBar_DirectMessage_Link', 'Messages')}
      <a href="/i/grok" aria-label="Grok" role="link" class="r-nav">${icon('nav')}<span class="r-text">Grok</span></a>
      <a href="/i/premium_sign_up" data-testid="premium-signup-tab" aria-label="Premium" role="link" class="r-nav">${icon('nav')}<span class="r-text">Premium</span></a>
      ${navLink('AppTabBar_Profile_Link', 'Profile')}
      <button data-testid="AppTabBar_More_Menu" aria-label="More" class="r-nav r-action-btn r-text">${icon('nav')}<span class="r-text">More</span></button>
    </nav>
    <a href="/compose/post" data-testid="SideNav_NewTweet_Button" role="link" class="r-btn r-compose" style="${t.button}"><div dir="ltr" style="color: rgb(${t.buttonText});"><div><span><div><div><span><span>Post</span></span></div></div></span></div></div></a>
  </header>
  <main role="main">
    <div data-testid="primaryColumn">
      <div class="r-tweet r-border"><div class="r-text2 r-fs" style="flex:1">What is happening?!</div><button data-testid="tweetButtonInline" role="button" class="r-btn" style="${t.button}"><span style="color: rgb(${t.buttonText});">Post</span></button></div>
      <div data-testid="cellInnerDiv">${tweet(false)}</div>
      <div data-testid="cellInnerDiv">${tweet(true)}</div>
    </div>
    <div data-testid="sidebarColumn">
      <label data-testid="SearchBox_Search_Input_label" class="r-pill"><div class="r-text2">Search</div></label>
      <aside role="complementary" aria-label="Subscribe to Premium" class="r-box"><span class="r-text r-bold">Subscribe to Premium</span><a href="/i/premium_sign_up" class="r-accent">Subscribe</a></aside>
      <section role="region" class="r-box"><span class="r-text r-bold">What's happening</span><div data-testid="trend" class="r-text2">#Trend</div></section>
      <aside role="complementary" aria-label="Who to follow" class="r-box">
        <div data-testid="UserCell">${avatar()}<button data-testid="1-follow" role="button" class="r-btn" style="${t.button}"><span style="color: rgb(${t.buttonText});">Follow</span></button></div>
        <div data-testid="UserCell">${avatar()}<button data-testid="2-unfollow" role="button" class="r-btn" style="background-color: rgba(0, 0, 0, 0); border-color: rgb(${t.border});"><span class="r-text">Following</span></button></div>
      </aside>
    </div>
  </main>
</div>
<div data-testid="GrokDrawer" class="r-box"><button data-testid="GrokDrawerHeader" aria-label="Grok" class="r-text">Grok</button></div>
</body>
</html>
`;
}

for (const theme of Object.keys(THEMES)) writeFileSync(`tests/fixtures/x-home-${theme}.html`, page(theme));
console.log('wrote tests/fixtures/x-home-{light,night}.html');
