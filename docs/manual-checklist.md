# Elle kontrol listesi

Her yayından önce Chrome ve Firefox'ta, X'e giriş yapılmış bir profille.

## Yükleme

- Chrome: `npm run build` → `chrome://extensions` → Geliştirici modu →
  "Paketlenmemiş öğe yükle" → `.output/chrome-mv3`.
- Firefox: `npm run build:firefox` → `about:debugging#/runtime/this-firefox` →
  "Geçici eklenti yükle" → `.output/firefox-mv3/manifest.json`. Firefox MV3 site
  izinlerini kendiliğinden vermez: araç çubuğundaki eklenti simgesine sağ tıkla →
  "x.com'da her zaman izin ver".

## Liste

- [ ] Açık temada (X: Ayarlar > Ekran > Arka plan: Varsayılan) ana sayfa, profil,
      tweet, bildirimler, mesajlar, ayarlar: gri `#E6ECF0` zemin, beyaz kartlar,
      metin `#14171A`, ikincil metin `#657786`, ayırıcılar `#E6ECF0`,
      font Helvetica Neue / Segoe UI.
- [ ] Lights Out'a geç: sayfa yenilenmeden gece paleti (`#141D26` zemin,
      `#1B2836` kart, beyaz metin, `#8899A6` ikincil, siyah ayırıcılar).
      Varsayılan'a geri geç.
- [ ] Sol üstte mavi kuş; sekmede kuş favicon; X bildirim aldığında favicon kuş
      kalır.
- [ ] Popup: her düğme kapatılınca o görünüm anında X'inkine döner.
- [ ] Popup: "Orijinali görmek için basılı tut" basılıyken X'in görünümü,
      bırakınca bizimki; basılıyken popup'ı kapatınca bizimki geri gelir.
- [ ] Popup sağlık listesi yeşil; "Rapor kopyala" çıktısında kullanıcı adı ya da
      URL yok.
- [ ] DevTools > Ağ: eklentiden kaynaklanan istek yok.
- [ ] DevTools > Performans: kaydırma akıcı.
- [ ] Eklentiyi yeniden yükle; açık x.com sekmesi bozulmaz.
- [ ] Mesajlar (sohbet PIN'i olan bir hesapla): sohbet iframe'i de dönem
      renklerinde.
- [ ] Bir tweeti beğen ve beğeniyi geri al: ikon dolu kalp/yıldıza geçip geri
      döner, renk dönemin beğeni rengi; aynısı birini takip edip bırakınca
      Takip et / Takip ediliyor düğmesi için.
- [ ] Sözcükler (X arayüzü İngilizce ve Türkçe): sol menüdeki ve satır içi
      "Post" → "Tweet", Repost menüsü → "Retweet", profil "Posts" → "Tweets";
      tweet sayfasındaki yanıt düğmesi "Reply" kalır; dar pencerede menü
      düğmesinde sözcük çıkmaz.
- [ ] Popup sürüm satırında veri kaynağı: kurulumdan sonra "yerleşik veri",
      `main`'de `data/remote.json` varsa ertesi gün "veri <sürüm>".
- [ ] Firefox Android (Nightly, eklenti koleksiyonu ya da about:debugging ile):
      x.com açılıyor, renkler ve logo değişiyor, popup açılıyor.
- [ ] 2014 döneminde Ayarlar > Ekran: tema ve renk seçimindeki yuvarlak
      radyo düğmeleri ve renk daireleri kareleşiyor mu? Kareleşiyorsa
      `selectors.json` `radiusKeep`'e eklenmeli.

## M1 canlı kontrol sonuçları (2026-11-09)

Eklenti tarayıcı paneline yüklenemediği için eklentinin motor ve DOM özellik
kodu, `tools/preview/` ile tarayıcı API'leri olmadan derlenip giriş yapılmış
x.com'da çalıştırıldı; sonuçlar hesaplanmış stillerle ölçüldü.

| Kontrol | Gece (Lights Out) | Açık |
|---|---|---|
| Eşleşen palet girdisi | 18/18 | 18/18 |
| Sayfa zemini | `#141D26` ✓ (ilk denemede `#1B2836` idi; düzeltildi) | `#E6ECF0` ✓ |
| Ana sütun / yan kutular | `#1B2836` ✓ | `#FFFFFF` ✓ |
| Tweet metni / ad | `#FFFFFF` ✓ | `#14171A` ✓ |
| Zaman / kullanıcı adı | `#8899A6` ✓ | `#657786` ✓ |
| Tweet ayırıcısı | `#000000` ✓ | `#E6ECF0` ✓ |
| Font | Helvetica Neue yığını ✓ | ✓ |
| X token'ları (`--x-fg-primary`, `--x-btn-brand`, `--x-font-sans`) | ezildi ✓ | ezildi ✓ |
| Logo | X logosu gizli, `::before` mavi kuş maskesi ✓ | ✓ |
| Profil, bildirimler | – | ✓ |

Henüz doğrulanmadı (gerçek eklenti gerekiyor): `scripting.insertCSS` yolu,
popup, rozet, favicon değişimi, Firefox, sohbet iframe'i, performans.

Bilinen eksik (M2): X'in "Post" düğmesi açık temada siyah (`rgb(15, 20, 25)`)
kalıyor; bu değer X'te başka koyu öğelerde de kullanıldığından renk eşlemesine
değil, `SideNav_NewTweet_Button` çapasına bağlı düğme stiline bırakıldı.
(M2'de düzeldi: aşağıdaki tabloda "Yazma düğmesi".)

## M2 canlı kontrol sonuçları (2026-11-09)

M1'deki gibi `tools/preview/` paketi giriş yapılmış x.com'da çalıştırıldı.
Açık tema için X'in Ekran ayarı geçici olarak "Light" yapıldı, sonra
"Lights out"a geri alındı. Değerler hesaplanmış stillerden, X'in 0.2s
geçişleri bittikten sonra okundu.

| Kontrol | 2017 gece | 2014 gece | 2017 açık | 2014 açık |
|---|---|---|---|---|
| Eşleşen palet girdisi | 28/28 | 28/28 | 28/28 | 28/28 |
| Sayfa zemini | `#141D26` ✓ | `#141D26` ✓ | `#E6ECF0` ✓ | `#F5F8FA` ✓ |
| Tweet metni | `#FFFFFF` ✓ | `#FFFFFF` ✓ | `#14171A` ✓ | `#292F33` ✓ |
| 10 ikon maskeli, renk `currentColor` | ✓ eylem `#8899A6`, menü `#FFFFFF` | ✓ | ✓ eylem `#657786`, menü `#14171A` | ✓ eylem `#8899A6`, menü `#292F33` |
| X'in ikon yolları gizli (opaklık 0) | ✓ | ✓ | ✓ | ✓ |
| Beğenildi rengi (`like-active`)¹ | `#E0245E` ✓ | `#FFAC33` ✓ | `#E0245E` ✓ | `#FFAC33` ✓ |
| Takip et: zemin / kenarlık / metin | `#1B2836` / `#1DA1F2` / `#1DA1F2` ✓ | aynı ✓ | `#FFFFFF` / `#1DA1F2` / `#1DA1F2` ✓ | `#F5F8FA`+gradyan / `#E1E8ED` / `#292F33` ✓ |
| Yazma düğmesi | `#1DA1F2` ✓ | `#1DA1F2` ✓ | `#1DA1F2` ✓ | `#0084B4` ✓ |
| Düğme köşesi | `100px` ✓ | `4px` ✓ | `100px` ✓ | `4px` ✓ |
| Avatar köşesi | `50%` ✓ | `5px` ✓ | `50%` ✓ | `5px` ✓ |
| Arama kutusu yuvarlak kalır | ✓ | `9999px` ✓ | ✓ | `9999px` ✓ |
| Grok menü/çekmece/tweet düğmesi, Premium sekmesi/kutusu, görüntülenme sayısı gizli | ✓ | ✓ | ✓ | ✓ |

¹ Zaman çizelgesinde beğenilmiş tweet yoktu ve hesapta beğeni yapılmadı:
bir beğeni düğmesine X'in kendi beğenildi rengi (`color: rgb(249, 24, 128)`)
satır içi olarak yazılıp ölçüldü, sonra eski haline getirildi.

Gece temasında sayfa sayfa "X rengi sızıntısı" taraması (görünür öğelerde X'in
ham gece renkleri: `rgb(231, 233, 234)`, `rgb(113, 118, 123)`, `rgb(0, 0, 0)`
zemin, `rgb(47, 51, 54)` kenarlık vb.; video ve görseller hariç):

| Sayfa | Sonuç |
|---|---|
| Ana sayfa | sızıntı yok (çapalar: menü, eylemler, avatar, yazma, Grok, Premium, görüntülenme) |
| Tweet ayrıntısı | sızıntı yok; yanıt "Reply" düğmesi `composeSubmit` olarak boyandı, Takip et ✓ |
| Profil | tek sızıntı: yeşil "You aren't verified yet / Get verified" kartı → `premiumSidebar` çapasına eklendi, artık gizli |
| Bildirimler | sızıntı yok |

Düzeltilenler: `selectors.json` `premiumSidebar` (profil kartı), `tokens.css`
2014 gece `accent-hover-bg` (`#55ACEE` yerine o takımın vurgusu `#1DA1F2`'nin
%10'u).

Ölçülmeyenler: gerçek beğeni/geri alma geçişi (X'in `like`↔`unlike`
değişimi ve dolu ikona geçiş yalnız birim testlerinde; canlıda yalnız renk
eşlemesi ölçüldü), 2014'te Ayarlar sayfalarındaki yuvarlak denetimler,
hover renklerinin ekranda değişimi (kurallar eşleşti, fare ile
denenmedi), "Following"/Unfollow düğmesi (hesapta görünür bir örnek yoktu;
birim ve görsel testlerle kapsandı), sohbet iframe'i, Firefox, gerçek eklenti
yolu (`scripting.insertCSS`, popup, rozet). İkinci tur (profil, tweet,
bildirimler) ikon şekilleri yerine yer tutucu maskeyle yapıldı; renk ve
sızıntı ölçümü için yeterli, şekiller ana sayfada tam CSS ile doğrulandı.

Bilinen eksikler: X'in yeni menü öğeleri (Calls, History, Creator Studio) ve
paylaş/geri/yazma ikonları X'in ikonuyla kalıyor.

## M3 canlı kontrol sonuçları (2026-11-09)

Sözcük CSS'i ve çapalar giriş yapılmış x.com'da (İngilizce arayüz) denendi;
Türkçe ve Arapça için X'in dil ayarı değiştirilmedi, sayfanın `html[lang]`'i
geçici olarak değiştirildi. Repost menüsü açılıp Escape ile kapatıldı, hiçbir
öğe seçilmedi, hiçbir şey gönderilmedi.

| Yer | en | tr | ar |
|---|---|---|---|
| Sol menü "Post" | Tweet ✓ (tek kez) | Tweetle ✓ | تغريد ✓ |
| Ana sayfa satır içi "Post" | Tweet ✓ | Tweetle ✓ | تغريد ✓ |
| Tweet sayfasındaki yanıt düğmesi | "Reply" kalır ✓ | – | – |
| Repost menüsü | Repost → Retweet ✓, Quote (o sırada `null`) kalır ✓ | – | – |
| Profil sekmeleri | Posts → Tweets, Reposts → Retweets ✓ | Tweetler, Retweet ✓ | تغريدات / التغريدات, إعادات تغريد ✓ |
| Etkileşim sekmeleri | Reposts → Retweets ✓, Quotes kalır ✓ | – | – |

Canlı kontrolde iki hata bulunup düzeltildi: `:has()` iç içe yazıldığı için
kural tarayıcıda geçersizdi (metin gizleniyor, sözcük çıkmıyordu); yaprağı
saran ara `span` yüzünden menüdeki "Tweet" iki kez çiziliyordu. İkisi için
Chrome'da çalışan Playwright testleri var.

Son incelemeden sonra ek canlı kontrol (gerçek `en` verisiyle üretilen CSS):
Repost menüsünde Quote → "Retweet with comment" (2017) çiziliyor, menü
genişliği sözcüğe göre büyüyor; takipçi sayfasında (`/<kullanıcı>/followers`)
`UserName` olmadığı için hiçbir sekme "Tweets" olmuyor. Konu oluşturucu
("Post all", ikinci metin alanı `tweetTextarea_1`) çapanın dışında. Zamanlanmış
gönderi ("Schedule") bu hesapta açılmıyor; denenmedi.

Ölçülmeyenler: zamanlanmış gönderi düğmesi, gerçek Türkçe/Arapça X arayüzü (X'in kendi çevirileriyle
yapısı aynı olmalı), dar ekranda menü düğmesi (birim testinde), Firefox.
