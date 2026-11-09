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

# Dönem token'ları — 2014–2016

Arşivlenmiş `twitter_core` / `twitter_more_*` paketlerinden (Ekim 2015, Kasım
2015, Şubat 2016, Mayıs 2016; Mayıs 2017 karşılaştırma). Bu dönemde web'de gece
modu yoktu; `2014-night` renklerini `2017-night`'tan alır, renk dışı token'lar
2014 değerinde kalır (spec §3.2).

**Temsil anı: Ekim 2015** (`/a/1443442549/`, snapshot 20151002053416).
Dönem içi değişiklikler: yıldız → kalp 2015-10-02 ile 2015-11-08 arasında;
`#55ACEE` → `#1DA1F2` 2016-02-01 ile 2016-02-27 arasında; metin `#292F33`
Mayıs 2016'da hâlâ vardı. Ekim 2015 yıldız, `#55ACEE` ve `#292F33`'ün bir arada
olduğu son tutarlı an.

| Token | 2014-light | Kaynak seçici |
|---|---|---|
| `bg-page` | `#F5F8FA` | `body{background-color:#f5f8fa}` (aynı dosyada `#fff`'yi ezen kural) |
| `bg-card` | `#FFFFFF` | `.stream-item`, `.module .flex-module`, `.global-nav-inner` |
| `bg-hover` | `#F5F8FA` | `.tweet:hover` |
| `text` | `#292F33` | `body`, `.fullname` |
| `text-2` | `#8899A6` | `.username`, `.time`, `.metadata` |
| `border` | `#E1E8ED` | `.tweet{border-bottom}`, `.stream-item` kenarları |
| `accent` | `#55ACEE` | `.primary-btn{background-color}` |
| `accent-hover` | `#3B88C3` | `.primary-btn` kenarlığı / `:active` zemini |
| `link` | `#0084B4` | 2015 varsayılan kullanıcı rengi (`.tweet-btn`, `#global-actions`); paket `a{color:#2b7bb9}` |
| `font` | `"Helvetica Neue", Helvetica, Arial, sans-serif` | `body`; Windows `body.ms-windows{Arial}` |
| `fs-body` | `14px` (satır 18px) | `body`, `.TweetTextSize` |
| `radius-pill` | `4px` | `.btn{border-radius:4px}` (hap değil) |
| `radius-media` | `5px` | `.AdaptiveMedia` |
| `avatar-radius` | `5px` | `.avatar` (48px); 128/96px `6px`, 32px `4px`, profil başlığı `12px` |

## Bileşenler

| Bileşen | 2014 (Ekim 2015) | 2017 (2018 paketi) |
|---|---|---|
| Takip et (takip edilmiyor) | zemin `#F5F8FA` + `linear-gradient(#fff,#f5f8fa)`, kenarlık `1px #E1E8ED`, metin `#292F33`, köşe 4px; hover `#E1E8ED` + `linear-gradient(#fff,#e1e8ed)` | `EdgeButton--secondary`: zemin `#FFF`, kenarlık `1px #1DA1F2`, metin `#1DA1F2`, köşe 100px; hover `#EAF5FD` |
| Takip ediliyor | `.primary-btn`: zemin `#55ACEE`, kenarlık `#3B88C3`, metin `#FFF` | `EdgeButton--primary`: zemin/kenarlık `#1DA1F2`, metin `#FFF`; hover `#006DBF` |
| Takipten çık (hover) | `.caution-btn`: zemin `#BE1931`, kenarlık `#A0041E`, metin `#FFF` | `EdgeButton--danger`: zemin/kenarlık `#E0245E`, metin `#FFF`; hover `#AC002B` |
| Tweet düğmesi (üst bar) | `.tweet-btn`: zemin `#0084B4`, metin `#FFF`, köşe 4px; hover koyulaştıran degrade | `EdgeButton--primary`: `#1DA1F2`, hover `#006DBF`, köşe 100px |
| Eylem ikonu (normal) | `#CCD6DD` | `#657786` |
| Yanıt hover | kullanıcı rengi (`#0084B4`) | `#1DA1F2` |
| Retweet hover / retweetlendi | `#5C913B` | `#17BF63` |
| Beğeni hover / beğenildi | yıldız `#FFAC33` | kalp `#E0245E` |
| Gezinme ikonu | `#66757F`, hover/etkin `#0084B4` + 5px alt çizgi | `#66757F`, hover/etkin `#1C94E0` + 2px alt çizgi |
| Onay rozeti | `#88C9F9` | `#1DA1F2` |

Gece temasında düğme renkleri için arşivde ayrı bir kaynak okunmadı;
`2014-night` ve `2017-night` düğmeleri gece kart rengi üzerinde aynı vurgu
mantığını kullanır (çıkarım).

## Kaynaklar (2014–2016)

- Ekim 2015: `https://web.archive.org/web/20151002053416id_/https://abs.twimg.com/a/1443442549/css/t1/twitter_core.bundle.css` (+ `twitter_more_1`, `twitter_more_2`)
- Kasım 2015 (kalp): `…/web/20151108162716id_/https://abs.twimg.com/a/1446686284/css/t1/twitter_core.bundle.css`
- Şubat 2016 (`#1DA1F2`): `…/web/20160229235943id_/https://abs.twimg.com/a/1456544917/css/t1/twitter_core.bundle.css`
- Mayıs 2016: `…/web/20160529205426id_/https://abs.twimg.com/a/1464326506/css/t1/twitter_core.bundle.css`
- Mayıs 2017 (sınır): `…/web/20170503000000id_/https://abs.twimg.com/a/1493832501/css/t1/twitter_core.bundle.css`
- 2018 bileşenleri: `…/web/20180823204119id_/https://abs.twimg.com/a/1527289941/css/t1/twitter_core.bundle.css`
