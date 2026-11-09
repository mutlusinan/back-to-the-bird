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

Ölçülmeyenler: hover renklerinin ekranda değişimi (kurallar eşleşti, fare ile
denenmedi), "Following"/Unfollow düğmesi (hesapta görünür bir örnek yoktu;
birim ve görsel testlerle kapsandı), sohbet iframe'i, Firefox, gerçek eklenti
yolu (`scripting.insertCSS`, popup, rozet). İkinci tur (profil, tweet,
bildirimler) ikon şekilleri yerine yer tutucu maskeyle yapıldı; renk ve
sızıntı ölçümü için yeterli, şekiller ana sayfada tam CSS ile doğrulandı.

Bilinen eksikler: X'in yeni menü öğeleri (Calls, History, Creator Studio) ve
paylaş/geri/yazma ikonları X'in ikonuyla kalıyor.
