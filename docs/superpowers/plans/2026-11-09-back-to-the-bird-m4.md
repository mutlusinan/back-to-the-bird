# Back to the Bird — M4 Yayın Hazırlığı Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eklentiyi mağazaya gönderilebilir hale getirmek: uzaktan veri (X değişince yeni sürüm beklemeden onarım), CI, mağaza metinleri, gizlilik politikası ve paketler.

**Architecture:** Arka plan günde bir `remote.json`'u çeker, doğrular ve `storage.local`'a yazar; içerik betiği açılışta yerleşik veriyle birleştirir. Doğrulama saf fonksiyonlarda (`src/remote/`). `remote.json` `src/data`'dan betikle üretilir ve testle eşitliği denetlenir.

**Tech Stack:** WXT 0.21, TypeScript 5.9, Vitest 5, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-11-09-back-to-the-bird-design.md` (§12, §13, §16, §17, §18 M4)

## Global Constraints

- Tek ağ isteği `REMOTE_URL` (`raw.githubusercontent.com/mutlusinan/back-to-the-bird/main/data/remote.json`); X'e istek yok; dosyadan kod çalışmaz.
- Şemaya uymayan, bilinmeyen alanlı, sürüm aralığı dışı ya da 256 KB'tan büyük dosya reddedilir; alınamazsa yerleşik veri.
- İzinler: `storage`, `scripting`, `alarms`; host: `https://x.com/*` (uzaktan dosya CORS ile, ek host izni yok).
- Mağazaya yükleme, geliştirici hesapları ve ücretler kullanıcıya ait; bu plan gönderime hazır paketler ve metinlerle biter.
- Commit, dal, push hiçbir yerde yasaklı adı içermez.

## Review Focus

1. **Bu tarayıcının ayrıştıramadığı seçici** (yerleşik ya da uzaktan): sadece o seçici düşer, eklentinin geri kalanı çalışır (Task 1).
2. **Kötü uzaktan dosya:** bozuk JSON, fazla alan, 256 KB üstü, sürüm aralığı dışı, kötü sözcük dizesi → yerleşik veri, sağlıkta kaynak "built-in" (Task 2).
3. **Uzaktan kapatılmış özellik:** kullanıcı açık tutsa da uygulanmaz, popup'ta "uzaktan kapatıldı" (Task 3).
4. **Ağ yok / zaman aşımı:** arka plan çökmez, eski geçerli kayıt kalır (Task 3).
5. **Önbellek anahtarı:** palet haritası değişince motor CSS önbelleği eskisini kullanmaz (sürüm 2; Task 4).

---

### Task 1: Seçici tablosunda seçici başına tolerans

**Files:** Modify `src/core/selectors.ts`; Test `tests/core/selectors.test.ts`

- [ ] Test: bilinmeyen sözdizimli seçici (`:unknown-pseudo(x)`) olan çapa kalan seçicileriyle döner; tüm seçicileri bozuk çapa boş dizi olur ve `parseSelectorTable` fırlatmaz; tablo şekli bozuksa (dizi değil, bilinmeyen çapa) yine fırlatır. FAIL gör.
- [ ] Uygula: `parseSelectorTable(json, { dropped?: string[] })` düşen seçicileri toplar; içerik betiği bunları sağlıkta `core` uyarısı olarak gösterir.
- [ ] PASS, commit `fix(core): drop selectors this browser cannot parse instead of the whole skin`.

### Task 2: Uzaktan veri şeması ve birleştirme

**Files:** Create `src/remote/schema.ts`, `src/remote/merge.ts`, `src/remote/version.ts`; Test `tests/remote/*.test.ts`; Modify `src/config.ts` (`REMOTE_URL`, `REMOTE_MAX_BYTES = 262144`)

**Interfaces:**
- `parseRemote(text: string, extensionVersion: string): RemoteData` — `schemaVersion: 1`, `dataVersion`, `minExtensionVersion`, `maxExtensionVersion | null`, `selectors` (kısmi tablo), `paletteMap | null`, `wording` (dil → tablo), `disabledFeatures: FeatureId[]`; fırlatırsa reddedilir.
- `compareVersions(a, b): -1 | 0 | 1` (semver çekirdeği).
- `mergeData(builtIn: BuiltInData, remote: RemoteData | null): MergedData` — her çapa için önce uzaktan sonra yerleşik seçiciler; `paletteMap` uzaktan gelen tam haritayla değişir; `wording` dil dil değişir; `disabledFeatures` aynen.

- [ ] Test: geçerli örnek geçer; fazla alan, `schemaVersion: 2`, `minExtensionVersion` > sürüm, `maxExtensionVersion` < sürüm, 256 KB+1 metin, bozuk JSON, kötü sözcük, bilinmeyen özellik kimliği → reddedilir; birleştirmede seçici sırası, palet ve sözcük değişimi. FAIL gör.
- [ ] Uygula. PASS. Commit `feat(remote): validate and merge remote data`.

### Task 3: Arka planda çekme ve içerik betiğinde kullanım

**Files:** Create `src/remote/fetch.ts`; Modify `src/entrypoints/background.ts`, `src/entrypoints/content/main.ts`, `src/core/messages.ts` (sağlık meta: `dataSource`, `dataVersion`), `src/entrypoints/popup/*`, `wxt.config.ts` (`alarms`), `public/_locales/*`

- [ ] Test: `refreshRemote({ fetch, store, now, version })` geçerli yanıtı `ot:remote`'a yazar; ağ hatası, zaman aşımı (5 s), 404, geçersiz yanıt eski kaydı korur; içerik betiği kayıtlı uzaktan veriyle açılınca uzaktan seçiciyi kullanır, `disabledFeatures`'taki özellik için öznitelik koymaz ve sağlık `off` + "remote" ayrıntısı verir; rapor `dataSource`/`dataVersion` içerir. FAIL gör.
- [ ] Uygula: kurulum/açılışta ve `alarms` ile 24 saatte bir.
- [ ] PASS (`npx vitest run`, `npx tsc --noEmit`, `npm run build`). Commit `feat(remote): fetch remote data daily and apply it`.

### Task 4: `remote.json` üretimi ve önbellek sürümü

**Files:** Create `tools/build-remote.mjs`, `data/remote.json`; Modify `src/data/palette-map.json` (`version: 2`), `package.json` (`remote` betiği, `vite` devDependency); Test `tests/remote/published.test.ts`

- [ ] Test: `data/remote.json` betiğin çıktısıyla bayt bayt aynı ve `parseRemote`'tan geçer; boyut < 256 KB. FAIL gör.
- [ ] Uygula. PASS. Commit `feat(remote): publish remote.json generated from the built-in data`.

### Task 5: CI

**Files:** Create `.github/workflows/ci.yml`

- [ ] Her push ve PR'da ubuntu-latest, Node 22: `npm ci`, `npm run typecheck`, `npm test`, `npm run build`, `npm run build:firefox`, `npm run zip`, `npm run zip:firefox`; zip'ler artifact olarak. Görsel testler win32 tabanlı olduğu için CI'da yok.
- [ ] Yerelde aynı komutları sırayla çalıştırıp geçtiğini doğrula. Commit `ci: typecheck, test and package on every push`.

### Task 6: Mağaza metinleri, gizlilik, sürüm 1.0.0

**Files:** Create `PRIVACY.md`, `docs/store/listing.md` (tr, en), `docs/store/submission.md`; Modify `package.json` (`version: 1.0.0`), `README.md`, `docs/manual-checklist.md`

- [ ] Gizlilik politikası (§16), mağaza açıklaması (tr/en; X ve Twitter markalarını iddia etmeyen dil), gönderim adımları (Chrome Web Store ve AMO hesabı, zip'ler, Firefox kaynak zip'i, ekran görüntüleri, izin gerekçeleri), Firefox Android denemesi elle kontrol listesinde.
- [ ] `npm run zip && npm run zip:firefox` → `.output/*.zip`; manifest izinlerini ve sürümü doğrula.
- [ ] Commit `docs: add store listing, privacy policy and submission steps for 1.0.0`; push.
