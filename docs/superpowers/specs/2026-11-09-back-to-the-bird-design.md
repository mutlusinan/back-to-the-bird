# Back to the Bird — Tasarım Dokümanı

- **Tarih:** 2026-11-09
- **Durum:** Taslak, inceleme bekliyor
- **Mağaza adı:** Back to the Bird — classic Twitter design tokens for X
  (TR: X için klasik Twitter tasarım token'ları)

## 1. Amaç

x.com'u, Twitter'ın 2014–2016 ya da 2017–2019 yıllarındaki tasarım
token'ları kullanılmaya devam etseydi nasıl görüneceğine dönüştüren bir
tarayıcı eklentisi.

X'in bugünkü **yerleşimi korunur**. Değişenler: renkler, font, köşe
yarıçapları, gövde yazı boyutu, ikonlar, logo, favicon ve bazı arayüz
sözcükleri. Eski yerleşimi (üst bar, üç sütun, profil kartı) geri getirmek
**hedef değildir**. Yerleşime dokunmayan küçük dönem uyumları (avatar şekli,
Takip et düğmesi, sayfa zemini ile kart ayrımı) kapsamdadır.

## 2. Hedef kitle ve dağıtım

- Chrome Web Store ve Firefox Add-ons'ta herkese açık yayın. Chromium
  tabanlı tarayıcılar (Edge, Brave, Opera) Chrome paketini kullanır.
- Açık kaynak, MIT lisansı. Depo: `github.com/mutlusinan/back-to-the-bird`;
  en geç M4'te herkese açık olur.
- Kapsam dışı: Safari, mobil uygulamalar. Firefox Android'deki mobil x.com
  yerleşime dokunulmadığı için büyük olasılıkla çalışır; M4'te denenir,
  çalışıyorsa yayına eklenir.

## 3. Ürün davranışı

### 3.1 Dönemler

| Ayar değeri | Görünen ad | Varsayılan |
|---|---|---|
| `2017` | 2017–2019 | Evet |
| `2014` | 2014–2016 | Hayır |

### 3.2 Tema

Eklenti X'in kendi tema ayarını izler; ayrı bir tema seçimi yoktur.

- X açık temadaysa → dönemin açık token'ları (`light`).
- X karanlık temadaysa (Lights Out ya da ileride gelebilecek başka bir koyu
  tema) → dönemin gece token'ları (`night`).
- 2014–2016'da gece modu yoktu. `2014-night` takımı **renklerini**
  `2017-night`'tan alır; renk dışı token'lar (köşe, avatar, ikon) 2014
  değerlerinde kalır.

### 3.3 Özellikler ve varsayılanlar

Her özellik popup'tan ayrı ayrı açılıp kapatılabilir. Hepsi varsayılan
olarak açıktır.

| Kimlik | Ne yapar |
|---|---|
| `palette` | Token motoru: X'in renklerini dönemin renklerine çevirir (bkz. §8) |
| `font` | Chirp yerine dönemin font sırası |
| `typeScale` | Gövde yazı boyutu 15px → 14px |
| `radius` | Köşe yarıçapları dönem değerlerine (pratikte 2014'te etkili) |
| `surfaces` | Sayfa zemini gri, ana sütun ve yan kutular beyaz kart (eski "kart" hissi) |
| `branding` | X logosu yerine kuş, favicon yerine kuş favicon |
| `icons` | X'in ikonları yerine dönemin tarzında çizilmiş ikonlar |
| `avatar` | 2014'te köşesi yuvarlatılmış kare avatar (2017'de X ile aynı: yuvarlak) |
| `followButton` | Siyah dolgulu Takip et yerine mavi çerçeveli eski düğme |
| `wording` | "Post" → "Tweet", "Repost" → "Retweet" vb., arayüz diline göre (bkz. §11) |
| `hideGrok` | Grok menü öğesi ve tweet içi Grok düğmeleri gizlenir |
| `hidePremium` | Premium ve onay rozeti reklamları gizlenir |
| `hideViewCounts` | Görüntülenme sayıları gizlenir |

2014 döneminde `wording` ve `icons` beğeni için yıldız ve "Favori"
kullanır; 2017'de kalp ve "Beğeni" (Twitter Kasım 2015'te değiştirdi).

### 3.4 Kapsam dışı

- Yerleşim değişiklikleri: üst bar, üç sütunlu düzen, sol profil kartı,
  tweet detayının pencere görünümü, mesajların pencere görünümü, çoklu
  görsel ızgarası.
- "Sana özel" sekmesini gizleyip "Takip edilenler"i varsayılan yapmak.
  Sekmeyi değiştirmek programla tıklama gerektirir; bu, §5'teki 6. ilkeye
  aykırı.
- Metin kutusu yer tutucuları (`placeholder`) ve değişken içeren bildirim
  cümleleri ("X kişisi gönderini yeniden paylaştı" gibi). CSS ile
  değiştirilemezler.
- Sekme başlığındaki " / X" eki.
- X'e kendi API isteğimiz, X'in istemcisini değiştirmek, telemetri.

## 4. Başarı ölçütleri

1. Eklenti açıkken x.com'un bütün sayfaları (ana sayfa, profil, tweet
   detayı, bildirimler, mesajlar, keşfet, ayarlar, açılır pencereler) iki
   temada ve iki dönemde seçilen dönemin token'larıyla çizilmiş görünür.
2. X bir şeyi değiştirdiğinde sayfa asla bozulmaz: çapası bulunamayan
   özellik uygulanmaz, o bölümde X'in kendi görünümü kalır.
3. Bir kırılma, uzaktan veri güncellemesiyle aynı gün düzeltilebilir.
4. X'e sıfır ek istek: DevTools Ağ sekmesinde X'in kendi istekleri dışında
   eklentiden gelen tek istek, günde bir kez çekilen uzaktan veri
   dosyasıdır.
5. Hissedilir performans maliyeti yok: motorun tur başına bütçesi 4 ms;
   kaydırma akıcı kalır.

## 5. İlkeler

Bu kurallar her aşamada geçerlidir; ihlal eden kod kabul edilmez.

1. **X'e istek yok.** Eklenti X'in sunucularına hiçbir istek atmaz.
2. **X'in DOM'u taşınmaz, silinmez, içeriği değiştirilmez.** İzin verilen
   tek yazma işlemleri:
   - `<html>`'e `data-ot-*` öznitelikleri,
   - X elemanlarına `data-ot="<çapa adı>"` işareti,
   - `<head>`'in sonuna favicon `<link>`'i,
   - stil sayfası ekleme (bkz. §7.6).
3. **MAIN world'de kod yok.** X'in global nesnelerine, `fetch`'e, `XHR`'a,
   `history`'ye dokunulmaz.
4. **X'e bağlı bilgi tek yerde:** `src/data/selectors.json` ve
   `src/data/palette-map.json`. Başka hiçbir dosya X'in seçicisini ya da
   renk değerini içermez.
5. **Kullanıcı verisi tarayıcıdan çıkmaz.** Telemetri yok. Hata raporu
   sadece kullanıcı isterse, kullanıcının kendisi tarafından paylaşılır.
6. **Programla tıklama ya da olay üretme yok.**
7. **Yönden bağımsız CSS:** `margin-left` yerine `margin-inline-start`
   gibi mantıksal özellikler. Sağdan sola diller kendiliğinden aynalanır.
8. **Marka:** Eklentinin simgesi ve mağaza adı X'in kuş logosunu ya da
   "Twitter"/"Tweet" kelimelerini ana marka olarak kullanmaz. Sayfa
   içindeki kuş ve sözcükler özellik olarak sunulur.
9. **Asgari bağımlılık:** Çalışma zamanında üçüncü taraf kütüphane yok.
   Firefox incelemesinin sorunsuz geçmesi için.

## 6. Mimari

```
src/
  entrypoints/
    content.ts            içerik betiği (ISOLATED world, document_start)
    background.ts         uzaktan veri, stil ekleme, rozet
    popup/                popup arayüzü
  core/
    selectors.ts          selectors.json + uzaktan veriyi birleştirir; find()
    anchors.ts            çapaları bulur, data-ot işaretini koyar
    scheduler.ts          tek MutationObserver, rAF ile toplu tur, sayfa geçişi
    health.ts             eksik çapalar, eşleşmeyen renkler, hatalar
    settings.ts           storage.sync; değişiklikleri yayınlar
    theme.ts              X'in temasını algılar → data-ot-theme
  engine/
    scan.ts               X'in stil sayfalarını tarar
    remap.ts              eşleşen kurallardan geçersiz kılma CSS'i üretir
    inline.ts             satır içi stil renkleri için seçiciler
    cache.ts              üretilen CSS'in önbelleği
  features/
    surfaces/  branding/  icons/  avatar/  followButton/
    wording/   hide/      (her biri: index.ts + style.css)
  theme/
    tokens.css            dört takım: 2014-light, 2014-night, 2017-light, 2017-night
  data/
    selectors.json        çapa adı → seçici listesi (öncelik sırasıyla)
    palette-map.json      X değeri → token adı
    wording/<lang>.json   dil başına sözcükler
  assets/
    icons/*.svg           kendi çizdiğimiz ikonlar
    favicon/*.png
```

### 6.1 Özellik sözleşmesi

```ts
interface Feature {
  id: FeatureId;                    // 'followButton'
  requires: AnchorName[];           // ['followButton']
  apply(ctx: FeatureContext): void; // sadece öznitelik/işaret koyar
  cleanup(ctx: FeatureContext): void;
}
```

- Özellikler `querySelector` çağırmaz; sadece `ctx.anchors(name)` ile
  adlandırılmış çapaları kullanır.
- Gerekli bir çapa yoksa özellik uygulanmaz ve `health` bunu kaydeder.
- Her özelliğin CSS'i `html[data-ot-f-<id>]` özniteliğine bağlıdır.
  Özelliği kapatmak bu özniteliği kaldırmaktır; bütün stili tek hamlede
  kaybolur.
- Dönem ve tema da öznitelikle seçilir:
  `html[data-ot-era="2017"][data-ot-theme="night"]`.
- `palette`, `font`, `typeScale` ve `radius` motor tabanlı özelliklerdir:
  `features/` altında değil `engine/`'de uygulanır, ama aynı sözleşmeyi ve
  aynı `data-ot-f-<id>` açma/kapama mekanizmasını kullanırlar.

## 7. Çalışma zamanı

### 7.1 Açılış

1. `content.ts` `document_start`'ta çalışır.
2. `storage.sync`'ten ayarlar, `storage.local`'dan önbellek okunur.
3. `<html>`'e `data-ot-era`, `data-ot-theme` (son bilinen değer) ve
   açık özelliklerin öznitelikleri yazılır.
4. Arka plana `ready` mesajı gider; arka plan önbellekteki üretilmiş CSS'i
   ve sözcük değişkenlerini ekler (§7.6).
5. Statik CSS (token takımları, özellik stilleri) manifest üzerinden
   `document_start`'ta zaten yüklüdür ve sadece öznitelikler varken etkilidir.

Ayarlar X'in `localStorage`'ına yazılmaz; orayı X'in kodu okuyabilir.

### 7.2 Zamanlayıcı

- Belgenin tamamını tek bir `MutationObserver` izler.
- Değişiklikler `requestAnimationFrame` ile toplanır. Her turda:
  1. yeni düğümlerde çapalar aranır ve işaretlenir,
  2. motorun yeni kural taraması yapılır (§8.2),
  3. `location.href` değiştiyse sayfa geçişi işlenir.
- Tur bütçesi 4 ms. Aşılırsa kalan iş `requestIdleCallback`'e bırakılır.
- Her adım tekrar çalıştırılmaya dayanıklıdır: React bir düğümü yeniden
  çizerse yeni düğüm bir sonraki turda tekrar işaretlenir.

### 7.3 Sayfa geçişleri

X'in `pushState`'i yamanmaz (ilke 3). Adres her turda karşılaştırılır,
ayrıca `popstate` dinlenir. Sayfa geçişinde özellikler yeniden çapa arar;
özelliklerin sayfaya özel davranışı yoktur.

### 7.4 Ayarlar

Popup `storage.sync`'e yazar. İçerik betiği `storage.onChanged` ile
öznitelikleri günceller ve gerekirse arka plandan CSS'i yeniden
ekletir. Sayfa yenilenmez.

### 7.5 Tema algılama

- X'in kendi yazdığı değere bakılır: `<body>`'nin `style` özniteliğindeki
  satır içi `background-color`. Beyaz → `light`, diğer her şey → `night`.
- Hesaplanmış renge **bakılmaz**: `surfaces` özelliği body zeminini
  değiştirdiği için hesaplanmış renk bizim rengimiz olur ve algılama
  kendi çıktısını okur.
- `<body>`'nin `style` özniteliği izlenir; kullanıcı X'te temayı
  değiştirince `data-ot-theme` anında güncellenir.
- Son değer `storage.local`'a yazılır ve bir sonraki açılışta ilk değer
  olarak kullanılır.

### 7.6 Stil ekleme yolları

- **Statik CSS:** manifest `content_scripts.css` ile.
- **Dinamik CSS** (motorun ürettiği kurallar, dile göre sözcük
  değişkenleri): arka plan `scripting.insertCSS({ css, target })` ile
  ekler, değişince `scripting.removeCSS` ile eskisini kaldırır. Bu yol
  sayfanın CSP'sinden etkilenmez.
- **Yedek:** `insertCSS` başarısız olursa içerik betiği `<head>`'e bir
  `<style data-ot>` ekler.

## 8. Token motoru

X'in tasarımı token'larla kurulu: her yerde aynı birkaç renk, font ve köşe
değeri tekrar eder. Motor bu değerleri X'in otomatik ürettiği class'ların
**değerlerine** bakarak dönemin token'larına çevirir. Class adları
değişse bile değerler nadiren değişir; değiştiğinde düzeltme tek bir veri
satırıdır.

### 8.1 Eşleme tablosu

`palette-map.json`, tema ve CSS özelliği başına X değeri → token adı:

```json
{
  "version": 1,
  "light": {
    "color":            { "rgb(15, 20, 25)": "text", "rgb(83, 100, 113)": "text-2",
                          "rgb(29, 155, 240)": "accent" },
    "background-color": { "rgb(255, 255, 255)": "bg-card", "rgb(247, 249, 249)": "bg-hover",
                          "rgb(29, 155, 240)": "accent" },
    "border-color":     { "rgb(239, 243, 244)": "border" }
  },
  "night": {
    "color":            { "rgb(231, 233, 234)": "text", "rgb(113, 118, 123)": "text-2",
                          "rgb(29, 155, 240)": "accent" },
    "background-color": { "rgb(0, 0, 0)": "bg-card", "rgb(22, 24, 28)": "bg-hover" },
    "border-color":     { "rgb(47, 51, 54)": "border" }
  },
  "font-family": { "TwitterChirp": "font" },
  "font-size":   { "15px": "fs-body" },
  "border-radius": { "9999px": "radius-pill", "16px": "radius-media" },
  "xTokens": {
    "light": { "--x-fg-primary": "text", "--x-fg-brand": "accent" },
    "night": { "--x-fg-primary": "text", "--x-fg-brand": "accent" }
  }
}
```

Buradaki X değerleri bugünkü bilinen değerlerdir; tam liste M0'da canlı
X'ten çıkarılır (`rgba` ile yazılan saydam varyantlar dahil).

- Renkler karşılaştırmadan önce normalize edilir: `rgb`/`rgba`/hex ve
  boşluk farkları aynı renk sayılır.
- `fill` ve `stroke` için ayrı tablo gerekmez; X'in ikonları
  `currentColor` kullanır ve `color` eşlemesiyle değişir. M0'da
  doğrulanır.

### 8.2 Tarama

- `document.styleSheets` içindeki okunabilir stil sayfaları taranır.
- Her stil sayfası için işlenmiş kural sayısı tutulur; sonraki turlarda
  sadece yeni eklenen kurallar işlenir. X kuralları `insertRule` ile
  eklediği için bu DOM'da değil CSSOM'da olur; bu yüzden kural sayısı
  her turda karşılaştırılır. Açılıştan sonraki ilk 10 saniyede ayrıca
  500 ms'de bir kontrol edilir.
- Okunamayan (başka kaynaktan gelen) stil sayfaları atlanır ve sağlık
  ekranına not düşülür.

### 8.3 Üretim

Eşleşen her kural için tema kapsamlı bir geçersiz kılma üretilir:

```css
html[data-ot-f-palette][data-ot-theme="light"] .r-xyz { color: var(--ot-text); }
```

- Kapsam seçicisi X'in tek class'lık kuralından daha özeldir; `!important`
  gerekmez.
- `font-family`, `font-size` ve `border-radius` eşlemeleri kendi özellik
  öznitelikleriyle (`data-ot-f-font`, `data-ot-f-typeScale`,
  `data-ot-f-radius`) kapsanır.
- Bütün kurallar tek bir CSS metninde toplanır ve §7.6'daki yolla eklenir.

### 8.4 Satır içi stiller

`style="color: rgb(…)"` gibi satır içi renkler için, derleme sırasında
`palette-map.json`'dan öznitelik seçicileri üretilir:

```css
html[data-ot-f-palette][data-ot-theme="light"] [style*="color: rgb(29, 155, 240)"] {
  color: var(--ot-accent) !important;
}
```

Satır içi stil sadece `!important` ile geçilebildiği için bu kurallarda
`!important` kullanılır.

### 8.5 Önbellek

Üretilen CSS `storage.local`'a yazılır ve bir sonraki açılışta hemen
eklenir. Böylece X'in renklerinin bir an görünüp kaybolması önlenir.
Tarama arka planda yeniden yapılır; sonuç farklıysa CSS değiştirilir.
Önbellek anahtarı `palette-map` sürümüdür; sürüm değişince önbellek
geçersiz olur.

### 8.6 Sağlık sinyalleri

- Bir eşleme girdisi, o anki temada **üç ardışık açılışta** hiçbir kurala
  uymadıysa "eşleşmedi" sayılır (X o değeri değiştirmiş olabilir).
- Hiçbir stil sayfası okunamıyorsa motor kapanır; diğer özellikler
  çalışmaya devam eder.

### 8.7 X token katmanı

M0 envanteri (`docs/x-dom-inventory.md`), X'in yeni bileşenlerinin renk ve
fontu sabit değer yerine kendi tasarım token'larından (`--x-fg-primary`,
`--x-btn-brand`, `--x-font-sans` vb., `<html>` üzerinde) aldığını gösterdi.
Bu bileşenlerin ana stil dosyası okunamaz, ama token'lar ezilebilir:

- `palette-map.json`'a `xTokens` alanı eklenir: X token adı → bizim token
  adımız, tema başına:
  `"xTokens": { "light": { "--x-fg-primary": "text", … }, "night": { … } }`.
- Motor bundan tema kapsamlı değişken atamaları üretir ve diğer kurallarla
  aynı CSS'e ekler:
  `html[data-ot-f-palette][data-ot-theme="light"]{--x-fg-primary:var(--ot-text)}`.
  Bu seçici X'in `:root`/`:root[data-theme=…]` tanımlarından daha özeldir.
- `--x-font-sans` `font` özelliğine (`data-ot-f-font`) bağlıdır.
- **Sağlık:** `xTokens`'taki bir ad `<html>`'in hesaplanmış stilinde yoksa
  (X token'ı kaldırmış ya da yeniden adlandırmış) o anki tema için
  `palette: <token> bulunamadı` uyarısı verilir.
- Token adları X'e bağlı bilgidir; ilke 4 gereği sadece `palette-map.json`'da
  durur ve uzaktan güncellenebilir.

### 8.8 Iframe'ler

X'in sohbeti aynı kökenli bir iframe'de (`https://x.com/i/chat…`) açılır.
İçerik betiği `allFrames: true` ile çalışır. Alt çerçevelerde sadece motor
(renk, font, X token katmanı) çalışır; DOM özellikleri, sağlık rozeti ve popup
mesajları sadece üst çerçevededir. Böylece logosu ya da yan sütunu olmayan
iframe'ler sahte uyarı üretmez.

### 8.9 Plan B

M0, X'in renklerini okunabilir bir stil sayfasından almadığını gösterirse
motor yerine çapalara bağlı elle yazılmış CSS kullanılır: sayfa zemini,
kartlar, metin, kenarlık ve vurgu rengi için ana yüzeylere kurallar. Kapsama
alanı daha dar ve bakımı daha zor olur; mimarinin geri kalanı değişmez.

## 9. Token takımları

`theme/tokens.css` dört takımı tanımlar. Her takım aynı değişkenleri
doldurur:

- temel: `--ot-bg-page`, `--ot-bg-card`, `--ot-bg-hover`, `--ot-text`,
  `--ot-text-2`, `--ot-border`, `--ot-accent`, `--ot-accent-hover`,
  `--ot-link`, `--ot-font`, `--ot-fs-body`, `--ot-radius-pill`,
  `--ot-radius-media`, `--ot-avatar-radius`;
- durum: `--ot-like-active`, `--ot-like-hover-bg`, `--ot-retweet-active`,
  `--ot-retweet-hover-bg`, `--ot-accent-hover-bg` (X'in beğeni pembesi,
  retweet yeşili ve ikonların arkasındaki %10'luk hover daireleri bunlara
  eşlenir; `*-hover-bg` her zaman ilgili rengin %10 opaklığıdır);
- düğme: `--ot-btn-follow-{bg,image,border,text,hover-bg}`,
  `--ot-btn-following-{bg,border,text}`, `--ot-btn-unfollow-{bg,border}`,
  `--ot-btn-compose-{bg,hover-bg,text}` (§10.5).

Değerler Wayback Machine'deki twitter.com CSS paketlerinden alındı:
2017 takımları 2018 tarihli paketlerden (M1), 2014 takımları Ekim 2015
tarihli paketlerden (M2). Kaynaklar ve bileşen tabloları
`docs/era-tokens.md`'de.

| Token | 2017-light | 2014-light |
|---|---|---|
| `bg-page` | `#E6ECF0` | `#F5F8FA` |
| `bg-card` | `#FFFFFF` | `#FFFFFF` |
| `bg-hover` | `#F5F8FA` | `#F5F8FA` |
| `text` | `#14171A` | `#292F33` |
| `text-2` | `#657786` | `#8899A6` |
| `border` | `#E6ECF0` | `#E1E8ED` |
| `accent` | `#1DA1F2` | `#55ACEE` |
| `accent-hover` | `#006DBF` | `#3B88C3` |
| `link` | `#1DA1F2` | `#0084B4` |
| `font` | "Helvetica Neue", Helvetica, "Segoe UI", Arial, sans-serif | "Helvetica Neue", Helvetica, Arial, sans-serif |
| `fs-body` | `14px` | `14px` |
| `radius-pill` | `100px` | `4px` |
| `radius-media` | `5px` | `5px` |
| `avatar-radius` | `50%` | `5px` |
| `like-active` | `#E0245E` (kalp) | `#FFAC33` (yıldız) |
| `retweet-active` | `#17BF63` | `#5C913B` |

`2017-night`, 2018'in "Night" modundan alınır: `#141D26` sayfa, `#1B2836`
kart, `#182430` hover, beyaz metin, `#8899A6` ikincil metin, siyah
ayırıcılar. 2014'te gece modu yoktu; `2014-night` = `2017-night` yüzey ve
vurgu renkleri + 2014'ün renk dışı token'ları (köşe, avatar, font) ve
durum renkleri (yıldız sarısı, retweet yeşili, Unfollow kırmızısı).

2014'te `9999px` → `4px` eşlemesi, X'in yuvarlak kullandığı her şeyi
(düğmeler, ikon üzerindeki vurgu daireleri, rozet noktaları) köşeli yapar.
Yuvarlak kalması gerekenler `selectors.json`'daki `radiusKeep` çapasında:
arama kutusu ve açma/kapama anahtarları (`[role=switch]`). M2 canlı
kontrolünde ana sayfanın ekran görüntüsünde başka istisna gerektiren öğe
görülmedi; diğer sayfalar görsel olarak taranmadı.

Helvetica Neue lisanslı olduğu için eklentiyle dağıtılmaz; yüklü değilse
sıradaki font kullanılır (Windows'ta pratikte Arial, dönemde de öyleydi).

## 10. Özellikler

Her özelliğin kullandığı çapa adları `selectors.json`'da tanımlıdır;
aşağıdaki `data-testid` değerleri bugünkü bilinen değerlerdir ve M0'da
doğrulanır.

### 10.1 surfaces

- `<body>` zemini → `--ot-bg-page`. X zemini body'ye satır içi stil
  olarak yazdığı için bu kural `!important` kullanır.
- Ana sütun (`primaryColumn`) ve yan sütundaki kutular → `--ot-bg-card`,
  kenarlık `--ot-border`.
- Sonuç: gri zemin üzerinde beyaz kartlar. Yerleşim değişmez.

### 10.2 branding

- Sol menüdeki X logosu CSS ile gizlenir, yerine kuş SVG'si maske olarak
  gösterilir.
- Favicon: X'in `<link rel=icon>`'una dokunulmaz (X bildirim noktası için
  onu kendisi değiştirir). Kendi `<link>`'imiz `<head>`'in sonuna eklenir;
  X etiketleri yeniden sıralarsa bizimki tekrar sona alınır.

### 10.3 icons

Dönemin tarzında kendimiz çizdiğimiz SVG'ler (dönemin ikon fontu
kopyalanmaz), `src/features/icons/svg/` altında: ana sayfa, keşfet,
bildirimler, mesajlar, profil, daha fazla, yanıt, retweet, beğeni (2014:
yıldız, 2017: kalp), beğenildi (dolu yıldız / dolu kalp), yer işareti.
X'in `<svg>`'si yerinde kalır; içindeki yolların opaklığı 0 yapılır ve
`<svg>`'nin kendisine `mask` + `background-color: currentColor` verilir.
Böylece renk, hover ve beğenildi durumu X'in kendi renk kurallarından
(palet eşlemesi üzerinden) gelir. Beğenildi ikonu ayrı çapadır
(`actionLiked`, `data-testid="unlike"`); X `like`↔`unlike` değiştirdiğinde
zamanlayıcı öğeyi yeniden etiketler.

Henüz yapılmayanlar: paylaş, geri, yazma ikonları ve X'in yeni menü
öğeleri (Calls, History, Creator Studio); bunlar X'in ikonuyla kalır.

### 10.4 avatar

2014'te avatar kapsayıcıları (`UserAvatar-Container-*`) ve iç maskeleri
`--ot-avatar-radius` alır. 2017'de değişiklik yok.

### 10.5 followButton

Takip et düğmeleri (`*-follow`, `*-unfollow`) ve yazma düğmeleri
(`SideNav_NewTweet_Button`, `tweetButtonInline`, `tweetButton`) aynı
özellik anahtarını paylaşır. Renkler §9'daki `--ot-btn-*` token'larından
gelir; köşe her zaman `--ot-radius-pill`.

| Durum | 2017-light | 2014-light | Gece (iki dönem) |
|---|---|---|---|
| Takip et | beyaz zemin, 1px `#1DA1F2` kenarlık, `#1DA1F2` metin; hover `#EAF5FD` | `#FFF`→`#F5F8FA` gradyan, 1px `#E1E8ED` kenarlık, `#292F33` metin; hover `#E1E8ED` | kart zemini, 1px vurgu kenarlık, vurgu metin; hover `bg-hover` |
| Takip ediliyor | `#1DA1F2` zemin, beyaz metin | `#55ACEE` zemin, 1px `#3B88C3` kenarlık, beyaz metin | vurgu zemin, beyaz metin |
| Takip ediliyor + hover (Unfollow) | `#E0245E` | `#BE1931` zemin, `#A0041E` kenarlık | dönemin kırmızısı |
| Yazma | `#1DA1F2`, hover `#006DBF` | `#0084B4`, hover `#006A90` | vurgu, hover `accent-hover` |
| Köşe | `100px` | `4px` | dönemin değeri |

2014 yazma hover rengi (`#006A90`) kaynaktan değil, `#0084B4`'ten
türetilmiştir (`docs/era-tokens.md`).

### 10.6 wording

- Sadece CSS. Çapalı denetimdeki metin yaprağı (`span:not(:has(*))`)
  `font-size: 0` ile görünmez yapılır; yaprağın ebeveyninin `::before`'u
  `content: "Tweet" / ""` gösterir. Ebeveyn, `:has()` iç içe yazılamadığı
  için `:has(> span:not(:empty)):not(:has(> span > *))` ile seçilir: boş
  yaprak (dar ekrandaki ikon düğmesi) sözcük almaz, yaprağı saran ara
  `span`'ler ikinci kez sözcük çizmez. `/ ""` alternatif metni ekran
  okuyucunun X'in orijinal etiketini okumasını sağlar; ondan önce düz
  `content: "Tweet"` yazılır (alternatif metni bilmeyen tarayıcılar için).
- Kurallar içerik betiğinde, X'in `html[lang]` değerine göre dil başına bir
  kez üretilir (`src/wording/css.ts`) ve ayrı bir stil sayfası olarak
  eklenir. Değeri `null` olan anahtar ya da dönem için kural yoktur, X'in
  metni gizlenmez. Dönem farkları `[data-ot-era]` ile seçildiği için dönem
  değişince CSS yeniden üretilmez. Sözcükler CSS dizesi olarak kaçışlanır
  (tırnak, ters bölü, süslü parantez, noktalı virgül, kontrol karakterleri).
- Arayüz dili tabloda yoksa `data-ot-f-wording` hiç konmaz; X'in metni
  kalır, sağlıkta `unavailable` + dil kodu.
- Tweet metinlerine asla dokunulmaz. Yanıt düğmeleri ("Reply") ve satır içi
  yanıt kutusu çapaların dışındadır.

Anahtarlar (v1):

| Anahtar | Nerede | Bugün (EN) | Eski (EN) |
|---|---|---|---|
| `composeButton` | sol menü | Post | Tweet |
| `composeSubmit` | ana sayfa ve yeni gönderi penceresi | Post | Tweet |
| `repostAction` | Repost menüsü | Repost | Retweet |
| `undoRepostAction` | Repost menüsü | Undo repost | Undo retweet (2014) / Undo Retweet |
| `quoteAction` | Repost menüsü | Quote | Quote Tweet (2014) / Retweet with comment |
| `repostsLabel` | profil ve etkileşim sekmeleri | Reposts | Retweets |
| `quotesLabel` | etkileşim sekmesi | Quotes | — (2020'de geldi; `null`) |
| `likesLabel` | profil ve etkileşim sekmeleri | Likes | Favorites (2014) / Likes |
| `profilePostsTab` | profil | Posts | Tweets |

`profilePostCount` (profil başlığındaki "5,914 posts") çıkarıldı: X sayıyı ve
sözcüğü tek metin düğümünde yazıyor, CSS sadece sözcüğü değiştiremez. Tweet
ayrıntısındaki sayı etiketleri X'te artık yok; çapalar ve canlı yapılar
`docs/x-dom-inventory.md` §11'de.

Bir anahtarın dönemlere göre farklı değeri olabilir:
`"likesLabel": { "2014": "Favorites", "2017": "Likes" }`.

### 10.7 hide

`hideGrok`, `hidePremium`, `hideViewCounts`: ilgili çapalar
`display: none`. Hiçbir şey silinmez.

- `hideGrok`: menüdeki Grok bağlantısı, Grok çekmecesi, tweetlerdeki Grok
  düğmesi (çeviriye bağlı olmamak için etiketle değil yapıyla bulunur).
- `hidePremium`: menüdeki Premium sekmesi, yan sütundaki "Subscribe to
  Premium" kutusu ve kendi profilindeki "Get verified" kartı (ikisi de
  `premiumSidebar` çapasında).
- `hideViewCounts`: tweet eylem satırındaki görüntülenme sayısı.

## 11. Diller

- Hedef: X'in arayüzde sunduğu bütün diller (~40).
- **Kaynak:** Twitter'ın kendi eski çevirileri. Wayback Machine'deki 2015
  ve 2018 tarihli `twitter.com/?lang=xx` sayfalarından, geliştirme
  sırasında bir kez çıkarılır. Tahminle çeviri yazılmaz.
- **Geri çekilme:** Eski çevirisi doğrulanamayan dilde hiçbir sözcük
  değiştirilmez.
- **İlk dalga (M3):** en, ja, es, pt, tr, ar, fr, de, ko, id, ru, it.
- **Kaynaklar** her değer için `docs/wording-sources.md`'de (arşiv adresi ve
  okunan yer). Yan menüdeki "Tweet" düğmesinin arşivde kaynağı olmadığından
  o dönemin oluşturucu "Tweet" düğmesi sözcüğü kullanıldı ("derived").
- **Dosya şeması:** `src/data/wording/<lang>.json` her anahtarı ya doldurur ya da
  açıkça `null` yazar; eksik anahtar testte hata verir. `null` olan
  anahtar o dilde değiştirilmez.
- **Dil kodu:** X'in `html[lang]` değeri birincil alt etikete indirgenir
  (`en-GB` → `en`); `zh-cn` ve `zh-tw` ayrı tutulur.
- **Popup ve mağaza sayfası** tarayıcının dilini izler; standart
  `_locales/<lang>/messages.json`. v1'de tr ve en.
- **Sağdan sola diller** için ilke 7 geçerlidir; M3'te Arapça arayüzle
  kontrol edilir.

## 12. Uzaktan veri

- Arka plan günde bir kez (`alarms`) deponun varsayılan dalındaki
  `data/remote.json` dosyasını `raw.githubusercontent.com` üzerinden
  çeker. Kesin adres `src/config.ts`'te sabittir.
- `raw.githubusercontent.com` CORS'a izin verdiği için ek host izni
  gerekmez (M4'te doğrulanır; gerekirse sadece bu host eklenir).
- `remote.json`, `src/data/` dosyalarından bir betikle üretilir:

```json
{
  "schemaVersion": 1,
  "dataVersion": "2026-11-09.1",
  "minExtensionVersion": "1.0.0",
  "maxExtensionVersion": null,
  "selectors": { "...": ["..."] },
  "paletteMap": { "...": "..." },
  "wording": { "tr": { "...": "..." } },
  "disabledFeatures": []
}
```

- **Doğrulama:** Şemaya uymayan, bilinmeyen alan içeren, sürüm aralığı
  dışındaki ya da 256 KB'tan büyük dosya reddedilir. Seçici metinleri
  sadece `querySelector`'a verilir; dosyadan hiçbir zaman kod çalıştırılmaz.
- **Birleştirme:** Her çapa için önce uzaktan gelen seçiciler, sonra
  yerleşikler denenir. `paletteMap` ve `wording` girdileri uzaktan
  gelenle geçersiz kılınır.
- **Uzaktan kapatma:** `disabledFeatures` listesindeki özellikler,
  kullanıcı ayarından bağımsız olarak uygulanmaz.
- Alınamazsa ya da geçersizse yerleşik veri kullanılır.

## 13. Hata yönetimi ve sağlık

| Durum | Tepki | Sağlık ekranı |
|---|---|---|
| Özelliğin çapası yok | Özellik uygulanmaz | ⚠ `logo: sideNavLogo bulunamadı` |
| Renk girdisi 3 açılış eşleşmedi | Girdi pasif | ⚠ `palette: accent eşleşmedi` |
| Stil sayfaları okunamıyor | Motor kapanır | ✗ `palette: devre dışı` |
| Özellik hata fırlattı | O oturum için kapatılır | ✗ hata mesajı |
| Uzaktan veri yok/geçersiz | Yerleşik veri | Veri kaynağı ve sürümü |
| Dil tabloda yok | Sözcükler değişmez | ℹ `wording: dil desteklenmiyor (xx)` |
| Uzaktan kapatılmış özellik | Uygulanmaz | ℹ `uzaktan kapatıldı` |

- **Rozet:** ✗ ya da ⚠ varsa eklenti simgesinde o sekme için "!" gösterilir.
- **Rapor kopyala:** panoya JSON kopyalar: eklenti sürümü, veri sürümleri,
  X'in sürüm hash'i (`main.<hash>.js` dosya adından), dil, tema, dönem,
  eksik çapalar, eşleşmeyen renkler, hatalar ve sayfa türü (`home`,
  `profile`, `status`, `notifications`, `messages`, `other`). Kullanıcı
  adı, URL ve içerik kopyalanmaz.

## 14. Popup

- Dönem seçimi: 2014–2016 / 2017–2019.
- Özellik düğmeleri (§3.3).
- **Orijinali göster:** basılı tutulduğu sürece aktif sekmedeki bütün
  `data-ot-*` öznitelikleri kaldırılır; bırakınca geri gelir.
- Sağlık listesi ve **Rapor kopyala**.
- Sürüm bilgisi ve depo bağlantısı.
- Sadece geliştirme sürümünde: **Örnek al** (§15.2).

## 15. Test

### 15.1 Birim testleri (Vitest)

- Motor: verilen CSS kurallarından doğru geçersiz kılmaları üretir.
- Renk normalizasyonu: `rgb`, `rgba`, hex ve boşluk farkları.
- Şemalar: `selectors.json`, `palette-map.json`, her `wording/<lang>.json`.
- Uzaktan veri doğrulayıcısı bozuk ve aşırı büyük veriyi reddeder.

### 15.2 DOM örneği testleri (happy-dom)

- Örnekler: ana sayfa, profil, tweet detayı, bildirimler, mesajlar; açık
  ve gece; tr, en ve ar arayüzle.
- Örnekler geliştirme sürümündeki **Örnek al** düğmesiyle kullanıcının
  tarayıcısından alınır: belgenin HTML'i ve okunabilir stil sayfalarının
  kuralları.
- Kaydetmeden önce temizlenir: metin düğümleri aynı uzunlukta yer
  tutucuyla, görsel adresleri sabit bir yer tutucuyla, kullanıcı adı
  içeren `href` ve `aria-label` değerleri genel değerlerle değiştirilir.
  Depoya başkalarının içeriği girmez.
- Kontrol: çapalar bulunur, özellikler öznitelikleri koyar, motor beklenen
  sayıda kural üretir.

### 15.3 Görsel testler (Playwright)

Aynı örnekler üzerinde motor ve özellikler çalıştırılır; 2 dönem × 2 tema
için ekran görüntüsü alınıp önceki görüntülerle karşılaştırılır. Fark
varsa elle incelenip onaylanır.

### 15.4 Canlı kontrol

Her yayından önce elle yapılan ~10 dakikalık liste: Chrome ve Firefox'ta
beş sayfa türü, iki tema, iki dönem; DevTools Ağ sekmesinde ek istek
olmadığı kontrol edilir. Canlı X'e otomatik giriş yapan test yoktur.

## 16. İzinler ve gizlilik

- `permissions`: `storage`, `alarms`, `scripting`.
- `host_permissions`: `https://x.com/*`.
- Gizlilik politikası: hiçbir veri toplanmaz ve gönderilmez; tek ağ isteği
  herkese açık `remote.json` dosyasıdır.

## 17. Derleme ve yayın

- WXT + TypeScript; tek kod tabanından Chrome (MV3) ve Firefox (MV3)
  paketleri.
- `wxt zip` mağaza zip'lerini ve Firefox incelemesi için kaynak zip'ini
  üretir.
- GitHub Actions: her push'ta tip kontrolü, testler ve paketler.
- Mağazaya yükleme ilk sürümlerde elle. Chrome Web Store geliştirici
  hesabı (tek seferlik 5 dolar) ve Firefox hesabı depo sahibi tarafından
  açılır.
- Sürüm numarası semver. Mağaza sayfası tr ve en.
- Eklenti simgesi: kuş logosuna benzemeyen kendi işaretimiz.

## 18. Aşamalar

| Aşama | İçerik | Bitiş ölçütü |
|---|---|---|
| **M0 Deneme** | §19'daki varsayımları canlı X'te doğrulamak; `docs/x-dom-inventory.md`, ilk `selectors.json` ve `palette-map.json`. Deneme kodu atılır | Motorun uygulanabilirliği ya da Plan B kararı |
| **M1 Temel** | WXT iskeleti, `core/`, motor (renk + font), 2017 açık ve gece token'ları, `surfaces`, `branding`, popup (dönem, düğmeler, sağlık, rapor, orijinali göster), birim testleri | 2017 her iki temada canlı X'te çalışıyor |
| **M2 Dönem detayları** | 2014 token'ları, `radius`, `typeScale`, `icons`, `avatar`, `followButton`, `hide`, DOM örneği ve görsel testler | İki dönem, iki tema tamam |
| **M3 Sözcükler** | `wording` özelliği, ilk 12 dilin Wayback'ten çıkarılması, Arapça ile sağdan sola kontrolü | 12 dil şema testinden geçiyor |
| **M4 Yayın** | Uzaktan veri, CI, mağaza varlıkları, gizlilik politikası, Firefox Android denemesi, mağazaya gönderim | İki mağazada yayında |

## 19. M0'da doğrulanacak varsayımlar

M0 sonuçları (2026-11-09): `docs/x-dom-inventory.md`. Karar ENGINE; ek
olarak §8.7 (X token katmanı) ve §8.8 (iframe'ler). Satır içi renkler
beklenenden çok daha yaygın, bu yüzden §8.4 kritik.

| Varsayım | Doğru değilse |
|---|---|
| X'in otomatik class kuralları içerik betiğinden okunabilen bir stil sayfasında | Plan B (§8.9) |
| Renkler büyük ölçüde class kurallarında, satır içi stil az | Satır içi kurallar genişletilir |
| İkonlar `currentColor` kullanıyor | `fill` için ayrı eşleme tablosu |
| X temayı `<body>`'nin satır içi `background-color`'ına yazıyor | `meta[name=theme-color]` ya da başka bir sinyal |
| `scripting.insertCSS` x.com'da çalışıyor | `<style data-ot>` yedeği varsayılan olur |
| `data-testid` çapaları (logo, düğmeler, avatar, Takip et, Grok, görüntülenme) mevcut | ARIA rolleri ve yapısal alt seçiciler |
| Sözcük etiketleri ayrı `<span>`'lerde | O anahtar v1'den çıkarılır |
| `html[lang]` X'in arayüz dilini gösteriyor | Dil algılama için başka sinyal |

## 20. Riskler

| Risk | Etki | Önlem |
|---|---|---|
| X token değerlerini değiştirir | Renkler kısmen eski haline döner | Sağlık sinyali + uzaktan `paletteMap` |
| X stillerini okunamayan dosyaya taşır | Motor çalışmaz | Plan B; uzaktan `disabledFeatures` |
| Kuş logosu / sözcükler nedeniyle marka şikâyeti | Mağazadan kaldırılma | İlke 8; logo ve sözcükler ayrı özellik, gerekirse kaldırılabilir |
| X DOM özniteliklerimizi fark eder | Belirsiz | MAIN world'de iz yok, istek yok; sadece CSS ve öznitelik |
| Mağaza incelemesi uzun sürer | Düzeltmeler gecikir | Düzeltmelerin çoğu uzaktan veriyle |
| Wayback'te bazı dillerin eski çevirisi yok | O dilde sözcükler değişmez | Bilinçli geri çekilme kuralı |
