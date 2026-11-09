# Dönem token'ları — 2017–2019

Değerler arşivlenmiş twitter.com CSS paketlerinden (Wayback Machine) okundu;
tahmin edilenler işaretli. Eklentinin `2017` dönemi **açık tema** ve
**Gece A** paletini kullanır.

## Kullanılan değerler (`src/theme/tokens.css`)

| Token | 2017-light | 2017-night (Gece A) | Kaynak seçici |
|---|---|---|---|
| `bg-page` | `#E6ECF0` | `#141D26` | `body{background}` |
| `bg-card` | `#FFFFFF` | `#1B2836` | `.stream-item`, `.ProfileCard`, `.module .flex-module`, `.DashboardProfileCard` |
| `bg-hover` | `#F5F8FA` | `#182430` | `.js-navigation-active.stream-item`, `.module .list-link:hover` (gece: tweet hover `#141D26`, diğer hover'lar `#182430`) |
| `text` | `#14171A` | `#FFFFFF` | `body{color}`, `.fullname` |
| `text-2` | `#657786` | `#8899A6` | `.username`, `.time`, `.tweet .time` |
| `border` | `#E6ECF0` | `#000000` | `.tweet{border-bottom}`, `.stream-item` kenarları, modüller |
| `accent` | `#1DA1F2` | `#1DA1F2` | varsayılan kullanıcı rengi (`twitterBlue:"1da1f2"`), `a, .u-textUserColor` |
| `accent-hover` | `#006DBF` | `#006DBF` | `.EdgeButton--primary:hover` (paket değeri) |
| `link` | `#1DA1F2` | `#1DA1F2` | `#user-style-*`: `a{color}` |
| `font` | `"Helvetica Neue", Helvetica, "Segoe UI", Arial, sans-serif` | aynı | `body{font-family}`; Windows'ta `body.ms-windows{"Segoe UI", Arial, sans-serif}` |
| `fs-body` | `14px` (satır yüksekliği 20px) | aynı | `body`, `.TweetTextSize` |
| `radius-pill` | `100px` | aynı | `.EdgeButton{border-radius}` |
| `radius-media` | `5px` | aynı | `.AdaptiveMedia` (Kasım 2018'den sonra `12px`) |
| `avatar-radius` | `50%` | aynı | `.avatar`, `.ProfileAvatar` |

## Seçimler ve notlar

- **Gece paleti:** 2017–Temmuz 2018 arası "Gece A" (`#1B2836` kart,
  `#141D26` sayfa, tweet aralarında siyah çizgi); Ocak 2019'dan itibaren
  "Gece B" (`#15202B` kart, `#10171E` sayfa, `#38444D` kenarlık). Dönem adı
  2017 olduğu için Gece A seçildi. Gece B ileride ayrı bir seçenek olabilir.
- **Vurgu rengi:** CSS paketi bağlantıları `#1C94E0`, birincil düğmeyi
  `#1DA1F2` yapıyor; ama sayfa, kullanıcı rengini taşıyan bir stil bloğuyla
  bunları eziyor. Varsayılan mavi bir hesapta bağlantılar `#1DA1F2`, birincil
  düğme `#4AB3F4` (kullanıcı rengi %80 + beyaz), hover'ı `#1DA1F2`. X tek bir
  değeri hem bağlantı hem düğme için kullandığından `accent` = `#1DA1F2`
  seçildi; `accent-hover` paket değeri `#006DBF`.
- **Gece modu nasıl çalışıyordu:** ayrı paketlerle
  (`nightmode_twitter_core.bundle.css` vb.), JS stil bağlantılarını
  değiştirip `night_mode=1` çerezini koyuyordu.
- **2014–2016 sınırı:** Haziran 2017 öncesi CSS farklı bir tasarım: `body`
  beyaz, `line-height: 18px`, `.avatar{border-radius: 5px}`, degrade
  `.btn`/`.primary-btn` düğmeler. M2'de 2014 token'ları buradan alınır.
- **Diğer gece eşleşmeleri (M2 için):** `#CCD6DD` → `#3D5466` (A) /
  `#38444D` (B); vurgulu satır `#EAF5FD` → `#2E4359` / `#163043`; açılır menü
  `#FFF` → `#243447` / `#1C2938`; `#AAB8C2` → `#6B7D8C` (B).

## Kaynaklar (web.archive.org)

- Açık 2018: `https://web.archive.org/web/20180823204119id_/https://abs.twimg.com/a/1527289941/css/t1/twitter_core.bundle.css`
- Açık 2017: `https://web.archive.org/web/20171220182201id_/https://abs.twimg.com/a/1504154347/css/t1/twitter_core.bundle.css`
- Açık 2019: `https://web.archive.org/web/20191228130256id_/https://abs.twimg.com/a/1561660151/css/t1/twitter_core.bundle.css`
- Gece A 2017: `https://web.archive.org/web/20171107220255id_/https://abs.twimg.com/a/1510046381/css/t1/nightmode_twitter_core.bundle.css`
- Gece A 2018: `https://web.archive.org/web/20180530165458id_/https://abs.twimg.com/a/1527289941/css/t1/nightmode_twitter_core.bundle.css`
- Gece B 2019: `https://web.archive.org/web/20190126172525id_/https://abs.twimg.com/a/1548278062/css/t1/nightmode_twitter_core.bundle.css`
- Medya köşesi 5px → 12px: `…/20181001id_/…/a/1538144154/…` ve `…/20181115id_/…/a/1542244373/…`
- Kullanıcı rengi bloğu (varsayılan mavi): `https://web.archive.org/web/20180621040006id_/https://twitter.com/Policy`
- Renk sabitleri ve karıştırma: `https://web.archive.org/web/2018id_/https://abs.twimg.com/k/fil/0.commons.fil.90b88b9764641d881cbb.js`
