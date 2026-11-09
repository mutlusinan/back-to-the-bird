# Store listing

Both stores: category **Productivity → Appearance** (Chrome: "Make Chrome Yours /
Functionality & UI"; Firefox: "Appearance"). Not affiliated with X Corp.; the
listing names Twitter only to describe the era it recreates.

## English

**Name:** Back to the Bird

**Summary (≤ 132 characters):**
Restyle x.com with classic Twitter design tokens from 2014–2016 or 2017–2019, keeping today's layout.

**Description:**

Back to the Bird answers one question: what would x.com look like if it still
used Twitter's design tokens from the years you remember?

It keeps X's current layout and changes the look:

- Colours: the grey page with white cards, the classic blues, the star or the
  heart, for both light and dark mode (it follows X's own Display setting).
- Font, text size and corner radii of the era.
- The bird logo and favicon, and line icons in the period style.
- Follow and Tweet buttons as they used to look.
- Wording: "Post" becomes "Tweet", "Repost" becomes "Retweet" — in 12
  interface languages, using Twitter's own translations from the time.
- Optional: hide Grok, Premium promotions and view counts.

Pick the era in the popup: 2014–2016 (star, square avatars) or 2017–2019
(heart, round avatars). Every part can be switched off on its own, and holding
"Show original" shows X as it is.

Privacy: no data is collected or sent. The only network request is a daily
download of a public data file that keeps the styles working when X changes.
The extension makes no requests to X.

Not affiliated with, endorsed or sponsored by X Corp. "Twitter" and "X" are
trademarks of X Corp.

## Türkçe

**Ad:** Back to the Bird

**Özet (≤ 132 karakter):**
x.com'u bugünkü yerleşimi koruyarak Twitter'ın 2014–2016 ya da 2017–2019 tasarım token'larıyla yeniden boyar.

**Açıklama:**

Back to the Bird tek bir soruya cevap verir: x.com, hatırladığınız yıllardaki
Twitter tasarım token'larını kullanmaya devam etseydi nasıl görünürdü?

X'in bugünkü yerleşimi aynen kalır, görünüm değişir:

- Renkler: gri zemin üzerinde beyaz kartlar, eski maviler, yıldız ya da kalp;
  açık ve koyu temada (X'in kendi Ekran ayarını izler).
- Dönemin fontu, yazı boyutu ve köşe yarıçapları.
- Kuş logosu ve favicon, dönem tarzında çizgi ikonlar.
- Eskisi gibi Takip et ve Tweet düğmeleri.
- Sözcükler: "Post" → "Tweet", "Repost" → "Retweet"; 12 arayüz dilinde,
  Twitter'ın o yıllardaki kendi çevirileriyle.
- İsteğe bağlı: Grok'u, Premium tanıtımlarını ve görüntülenme sayılarını gizle.

Dönemi popup'tan seçin: 2014–2016 (yıldız, köşeli avatar) ya da 2017–2019
(kalp, yuvarlak avatar). Her parça ayrı ayrı kapatılabilir; "Orijinali göster"
basılı tutulunca X olduğu gibi görünür.

Gizlilik: hiçbir veri toplanmaz ve gönderilmez. Tek ağ isteği, X değiştiğinde
stillerin çalışmaya devam etmesi için herkese açık bir veri dosyasının günlük
indirilmesidir. Eklenti X'e istek yapmaz.

X Corp. ile bağlantılı değildir, onun tarafından onaylanmamış ya da
desteklenmemiştir. "Twitter" ve "X", X Corp.'un ticari markalarıdır.

## Permission justifications (Chrome Web Store form)

| Permission | Why |
|---|---|
| `storage` | Saves the era and feature switches, the per-page style cache and the downloaded data file. |
| `scripting` | Inserts the generated stylesheet with `scripting.insertCSS`, so x.com's content security policy cannot block it. |
| `alarms` | Refreshes the public data file once a day. |
| Host `https://x.com/*` | The only site the extension restyles. |
| Remote code | None. `remote.json` is JSON data (selectors, colours, words) validated against a schema; nothing from it is executed. |

**Single purpose:** change the appearance of x.com to a classic Twitter design.
