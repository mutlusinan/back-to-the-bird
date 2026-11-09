# X DOM ve stil envanteri

- **Tarih:** 2026-11-09
- **X sürümü:** `main.f6589d28ff595d58a.js` (giriş yapılmış istemci)
- **Tema:** Lights Out (`data-theme="dark"`). Açık tema değerleri sayfanın
  kural tablosunda mevcut; canlı açık tema kontrolü M1 Task 13'te.
- **Betikler:** `tools/inventory/*.js`. Çıktılardan kullanıcı adı, içerik ve
  kimlikler çıkarıldı.

## 1. İki istemci bir arada

| | Klasik istemci (react-native-web) | Yeni bileşenler ("x-web") |
|---|---|---|
| Nerede | Zaman akışı, profil, tweet, bildirimler, ayarlar | Giriş yapılmamış ana sayfa, bazı yeni bileşenler, büyük olasılıkla Chat |
| Stil kaynağı | `<style id="react-native-stylesheet">`, **okunabilir** | `abs.twimg.com/x-web/.../styles-*.css` (**okunamaz**) + okunabilir satır içi sayfa |
| Renk yazımı | Sabit `rgb(…)` değerleri, hiç `var()` yok | `var(--x-fg-primary)` gibi token'lar |
| Kural sayısı | 1647 (ana sayfa) → 1834 (gezindikçe artıyor) | 1986 kural, 240+ token kullanımı |

**Karar: `Decision: ENGINE`.** Klasik kurallar içerik betiğinden okunabiliyor ve
bilinen renk değerlerini içeriyor. Ek olarak X'in `--x-*` token'ları için küçük
bir ezme katmanı gerekiyor (spec §8.7); sohbet iframe'i için §8.8.

## 2. Stil sayfaları (giriş yapılmış, `/home`)

| Sahip | Kural | Okunabilir | İçerik |
|---|---|---|---|
| `#draftjs-styles_0`, `#draftjs-styles` | 2, 23 | evet | yazma kutusu |
| adsız `<style>` ×5 | 1–6 | evet | `@font-face` (TwitterChirp, Vazirmatn, Geist), placeholder |
| `#react-native-stylesheet` | 1647+ | evet | klasik atomik sınıflar `.r-*`, `.css-*` |
| adsız `<style>` | 1986 | evet | Tailwind/x-web bileşenleri, `var(--x-*)` |

Giriş yapılmış sayfada okunamayan stil sayfası yok.

## 3. Renk değerleri

### Satır içi stiller (ana sayfa, gece)

Rengi taşıyan stil özniteliği sayısı: ~460. En sık:

| Özellik | Değer × sayı |
|---|---|
| `color` | `rgb(113, 118, 123)` ×111 · `rgb(231, 233, 234)` ×70 · `rgb(239, 243, 244)` ×13 · `rgb(255, 255, 255)` ×10 · `rgb(29, 155, 240)` ×6 · `rgb(15, 20, 25)` ×5 |
| `background-color` | `rgba(0, 0, 0, 0)` ×52 · `rgb(0, 0, 0)` ×25 · `rgba(15, 20, 25, 0.75)` ×6 · `rgb(239, 243, 244)` ×5 · `rgb(29, 155, 240)` ×3 |
| `border-*-color` | `rgba(0, 0, 0, 0)` ×115 · `rgb(83, 100, 113)` ×10 · `rgb(239, 243, 244)` ×8 |

Biçim: `color: rgb(231, 233, 234);` — spec §8.4'teki varsayımla aynı
(`rgb(r, g, b)`, virgül ve boşlukla). Özellik özniteliğin başında ya da `; `
sonrasında.

### Kural tablosu (`react-native-stylesheet`)

Kural tablosu **iki temanın** renklerini de içeriyor (sınıflar kullanıldıkça
ekleniyor). Bilinen rollere karşılık gelenler:

| Rol | Açık | Gece (Lights Out) |
|---|---|---|
| `text` | `rgb(15, 20, 25)` | `rgb(231, 233, 234)` |
| `text-2` | `rgb(83, 100, 113)` | `rgb(113, 118, 123)` |
| `accent` | `rgb(29, 155, 240)` | `rgb(29, 155, 240)` |
| `bg-card` (body) | `rgb(255, 255, 255)` | `rgb(0, 0, 0)` |
| `bg-hover` | `rgb(247, 249, 249)` | `rgb(22, 24, 28)` |
| `border` | `rgb(239, 243, 244)` | `rgb(47, 51, 54)` |
| `border-strong` | `rgb(207, 217, 222)` | `rgb(83, 100, 113)` |

Gece temasında `rgb(239, 243, 244)` ve `rgb(15, 20, 25)` X'in ters renkli
düğmelerinde (beyaz zemin, koyu metin) kullanılıyor; renk eşlemesi tema başına
olduğu için bu değerler gece tablosuna girmez (M2'de `followButton` ele alır).

## 4. Font, boyut, köşe

- **Font:** `TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
  (ayrıca `TwitterChirpExtendedHeavy`, dile özel Tahoma/Vazirmatn/Meiryo
  yığınları). x-web tarafında `var(--x-font-sans)`.
- **`<html>` satır içi stil:** `font-size: 15px` (gövde boyutu).
- **Köşe değerleri:** `9999px`, `16px`, `12px`, `8px`, `4px` ve diğerleri.

## 5. Tema sinyali

- `<body style="background-color: rgb(0, 0, 0); color: rgb(231, 233, 234); …">`
  — spec §7.5'teki varsayım doğru.
- Ayrıca `<html data-theme="dark" style="…color-scheme: dark">` ve
  `<meta name="theme-color" content="#000000">`.

## 6. X'in `--x-*` token'ları

316 değişken; anlamsal olanlar (açık | gece):

| Token | Açık | Gece |
|---|---|---|
| `--x-bg-primary` | `#fff` | `#000` |
| `--x-bg-secondary` | `#f2f2f2` | `#141414` |
| `--x-bg-modal` / `--x-bg-sheets` | `#fff` | `#141414` |
| `--x-fg-primary` | `#000` | `#fff` |
| `--x-fg-secondary` | `#666` | `#999` |
| `--x-fg-tertiary` | `#b2b2b2` | `#4d4d4d` |
| `--x-fg-brand` | `#1d9bf0` | `#1d9bf0` |
| `--x-btn-brand` / `-hover` | `#1d9bf0` / `#0083eb` | `#1d9bf0` / `#43b3f6` |
| `--x-btn-primary` | `#000` | `#fff` |
| `--x-border-divider` | `#0000000f` | `#fff3` |
| `--x-border-normal` | `#00000026` | `#ffffff26` |
| `--x-hover-subtle` | `#0000000a` | `#ffffff14` |
| `--x-font-sans` | `TwitterChirp, …` | aynı |
| `--x-radius-m` | `1` (çarpan) | `1` |

## 7. Çapalar (`data-testid`, masaüstü 1366px)

| Çapa | Seçici | Durum |
|---|---|---|
| `sideNavLogo` | `header[role="banner"] h1 a[href="/home"]` | var (her sayfada) |
| `primaryColumn` | `[data-testid="primaryColumn"]` | var |
| `sidebarColumn` | `[data-testid="sidebarColumn"]` | var; mesajlarda yok, dar ekranda yok |
| `sidebarBox` | `[data-testid="sidebarColumn"] section[role="region"]`, `… aside[role="complementary"]` | var |

M2 için not edilenler: `tweet`, `like`, `retweet`, `reply`, `bookmark`,
`User-Name`, `UserAvatar-Container-*`, `*-follow`, `editProfileButton`,
`SideNav_NewTweet_Button`, `AppTabBar_*_Link`, `GrokDrawer`,
`premium-signup-tab`, `icon-verified`, `tweetText`. Dar ekranda `BottomBar`
görünüyor, `sidebarColumn` yok.

## 8. Mesajlar

`/messages` → `/i/chat`: sohbet **aynı kökenli bir iframe'de**
(`https://x.com/i/chat…`, `data-testid="xchatEmbedRoute"`). Hesapta sohbet
PIN'i kurulu olmadığı için X kurtarma ekranına yönlendirdi ve iframe boş kaldı;
içeriği incelenemedi. Sonuç: içerik betiği iframe'lerde de çalışmalı
(`allFrames: true`).

## 9. spec §19 varsayımları

| Varsayım | Sonuç |
|---|---|
| Klasik kurallar okunabilir bir stil sayfasında | **doğru** (`#react-native-stylesheet`) |
| Renkler büyük ölçüde class kurallarında, satır içi az | **yanlış** — satır içi renk çok yaygın; §8.4 kritik |
| İkonlar `currentColor` | **doğru** (hesaplanmış `fill` = `color`) |
| Tema body satır içi `background-color`'da | **doğru** |
| `scripting.insertCSS` çalışıyor | M1 Task 13'te (gerçek eklentiyle) |
| `data-testid` çapaları mevcut | **doğru** (§7) |
| Sözcük etiketleri ayrı `<span>`'lerde | M3'te |
| `html[lang]` arayüz dilini gösteriyor | **doğru** (`lang="en"`) |

## 10. M2 çapaları (2026-11-09, masaüstü 1280px, Lights Out)

### İkonlar

Bütün gezinme ve eylem ikonları tek bir `<svg>` (tek `<path>`), her zaman
`öğe > div > div > svg`; `fill` hesaplanmış olarak `currentColor`'a eşit,
satır içi stil yok. Gezinme ikonları 26.25px, eylem ikonları 18.75px.

| Çapa | Seçici | Not |
|---|---|---|
| `navHome` | `[data-testid="AppTabBar_Home_Link"]` | `a` |
| `navExplore` | `[data-testid="AppTabBar_Explore_Link"]` | `a` |
| `navNotifications` | `[data-testid="AppTabBar_Notifications_Link"]` | `a` |
| `navMessages` | `[data-testid="AppTabBar_DirectMessage_Link"]` | `a`, `/i/chat` |
| `navProfile` | `[data-testid="AppTabBar_Profile_Link"]` | `a` |
| `navMore` | `[data-testid="AppTabBar_More_Menu"]` | `button` |
| `actionReply` | `article [data-testid="reply"]` | `button` |
| `actionRetweet` | `article :is([data-testid="retweet"],[data-testid="unretweet"])` | |
| `actionLike` | `article [data-testid="like"]` | |
| `actionLiked` | `article [data-testid="unlike"]` | beğenildi; X `like`↔`unlike` değiştirir |
| `actionBookmark` | `article :is([data-testid="bookmark"],[data-testid="removeBookmark"])` | |

Paylaş düğmesinin `data-testid`'i yok (`aria-label` dile bağlı); eylem
grubunun (`[role="group"]`) son düğmesi.

Çapası olmayan yeni menü öğeleri (Kasım 2026, X'in ikonuyla kalır):
Calls (`AppTabBar_Calls_Link`, `/i/calls`), History (`a[href="/i/history"]`,
`data-testid` yok), Creator Studio (`a[href="/i/jf/creators/studio"]`,
`data-testid` yok).

### Düğmeler

| Çapa | Seçici | Gece değeri |
|---|---|---|
| `followButton` | `[data-testid$="-follow"]` | satır içi `background-color: rgb(239, 243, 244); border-color: rgba(0, 0, 0, 0)`, metin `rgb(15, 20, 25)`, köşe `9999px`, yükseklik 32px |
| `unfollowButton` | `[data-testid$="-unfollow"]` | (takip edilen durum) |
| `composeButton` | `[data-testid="SideNav_NewTweet_Button"]` | `a`, satır içi `rgb(239, 243, 244)` zemin, metin `rgb(15, 20, 25)`, yükseklik 52px |
| `composeSubmit` | `:is([data-testid="tweetButtonInline"],[data-testid="tweetButton"])` | `button`, satır içi `rgb(239, 243, 244)` |

### Avatar

`[data-testid^="UserAvatar-Container-"]` içinde iki katman `border-radius:
9999px; overflow: hidden` (kap `div > div > div > div` ve
`div[role=presentation] > div`); `clip-path` yok.

### Modern öğeler

| Çapa | Seçici | Not |
|---|---|---|
| `grokNav` | `header[role="banner"] nav a[href="/i/grok"]` | `data-testid` yok |
| `grokDrawer` | `[data-testid="GrokDrawer"]` | sağ alttaki sohbet çekmecesi |
| `grokTweetButton` | `article div:has(> div > [data-testid="caret"]) > div > button:not([data-testid])` | tweet başlığındaki "Grok actions"; `aria-label` dile bağlı olduğu için yapısal |
| `premiumNav` | `[data-testid="premium-signup-tab"]` | |
| `premiumSidebar` | `[data-testid="sidebarColumn"] aside:has(a[href="/i/premium_sign_up"]), [data-testid="primaryColumn"] div:has(> button + div > a[href="/i/premium_sign_up"])` | "Subscribe to Premium" kutusu ve kendi profilindeki yeşil "You aren't verified yet / Get verified" kartı (kapatma düğmesi + içerik). happy-dom `:has(> div > a)` biçimini fazla eşlediği için kart düğme kardeşiyle bulunur |
| `viewCount` | `article [role="group"] a[href$="/analytics"]` | sarmalayan `div` gizlenmeli |

Etkin durum renkleri (kural tablosunda): beğeni `rgb(249, 24, 128)`, retweet
`rgb(0, 186, 124)`.

Ölçüm notu: X'in düğmelerinde `transition: background-color 0.2s`, eylem
ikonlarının renginde `transition: color 0.2s` var. Stil değiştikten hemen
sonra okunan `getComputedStyle` eski değeri verir; en az 300ms bekleyin.

Durum renkleri kaynağı: `#react-native-stylesheet` kuralları — beğeni `rgb(249, 24, 128)` (hover zemini `rgba(249, 24, 128, 0.1)`), retweet `rgb(0, 186, 124)` (`rgba(0, 186, 124, 0.1)`), vurgu hover zemini `rgba(29, 155, 240, 0.1)`; iki temada aynı değerler.
