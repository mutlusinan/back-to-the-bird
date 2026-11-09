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
