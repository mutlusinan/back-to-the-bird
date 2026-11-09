# Back to the Bird — M3 Sözcükler Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** X'in arayüz etiketlerini ("Post", "Repost", "Quote", "Posts"…) X'in arayüz diline göre Twitter'ın kendi eski sözcükleriyle ("Tweet", "Retweet"…) göstermek; ilk 12 dil.

**Architecture:** Sözcük tabloları `src/data/wording/<lang>.json`; saf fonksiyonlar (`src/wording/`) tabloyu doğrular ve dile özgü CSS üretir. İçerik betiği X'in `html[lang]`'ini okur, `wording` özelliği o dil için tablo varsa etkin olur; üretilen CSS ikinci bir enjektörle eklenir. Metin değişimi sadece CSS: çapalı öğedeki metin yaprağı `font-size: 0`, ebeveyninin `::before`'u `content: "<eski>" / ""`.

**Tech Stack:** WXT 0.21, TypeScript 5.9, Vitest 5 + happy-dom 21, Playwright (chrome kanalı).

**Spec:** `docs/superpowers/specs/2026-11-09-back-to-the-bird-design.md` (§3.3, §10.6, §11, §13, §18 M3)

## Global Constraints

- Tahminle çeviri yazılmaz: her değer arşivlenmiş bir Twitter kaynağından gelir (`docs/wording-sources.md`); kaynak yoksa `null`.
- Tweet metinlerine asla dokunulmaz; sadece çapalı arayüz etiketleri.
- Ekran okuyucu X'in orijinal etiketini okur (`content: … / ""`).
- Dil tabloda yoksa `data-ot-f-wording` konmaz; sağlık `unavailable` + dil kodu.
- Dil kodu: `html[lang]` küçük harfe, birincil alt etikete indirgenir; `zh-cn`, `zh-tw` ayrı kalır.
- X'e istek yok; dosyadan kod çalışmaz; sözcükler CSS dizesi olarak kaçışlanır.
- Commit, dal, push hiçbir yerde yasaklı adı içermez (yerel kancalar engeller).

## Anahtarlar (v1, canlı X 2026-11-09)

| Anahtar | Çapa | Bugün (EN) | Eski (EN) |
|---|---|---|---|
| `composeButton` | `wordComposeButton`: `[data-testid="SideNav_NewTweet_Button"]` | Post | Tweet |
| `composeSubmit` | `wordComposeSubmit`: satır içi gönder (yanıt kutusu `inline_reply_offscreen` hariç) ve makale içermeyen pencerede `tweetButton` | Post | Tweet |
| `repostAction` | `wordRepostAction`: `[data-testid="retweetConfirm"]` | Repost | Retweet |
| `undoRepostAction` | `wordUndoRepostAction`: `[data-testid="unretweetConfirm"]` | Undo repost | Undo Retweet |
| `quoteAction` | `wordQuoteAction`: `[role="menu"] a[role="menuitem"][href="/compose/post"]` | Quote | Retweet with comment |
| `repostsLabel` | `wordRepostsLabel`: `a[role="tab"]` `…/retweets`, `…/reposts` | Reposts | Retweets |
| `quotesLabel` | `wordQuotesLabel`: `a[role="tab"][href$="/quotes"]` | Quotes | Quote Tweets |
| `likesLabel` | `wordLikesLabel`: `a[role="tab"][href$="/likes"]` | Likes | Favorites (2014) / Likes |
| `profilePostsTab` | `wordProfilePostsTab`: profildeki ilk sekme | Posts | Tweets |

Spec'teki `profilePostCount` çıkarılır: X "5,914 posts"u tek metin düğümünde yazıyor, CSS sayıya dokunmadan sözcüğü değiştiremez. Tweet ayrıntısındaki sayı etiketleri artık yok; `repostsLabel`/`quotesLabel`/`likesLabel` etkileşim ve profil sekmelerinde.

## Review Focus

1. **Dar ekranda daralmış menü:** `SideNav_NewTweet_Button` metinsiz (boş `<span>`); `::before` "Tweet" yazmamalı (`:not(:empty)` koşulu; Task 1 testi).
2. **Yanıt düğmeleri:** satır içi yanıt kutusundaki ve yanıt penceresindeki gönder düğmesi "Reply" der; "Tweet"e dönmemeli (Task 2 testi).
3. **Kötü ya da zararlı sözcük dizesi:** `"`, `\`, `}` ya da satır sonu içeren değer CSS'i bozmamalı, kural dışına taşmamalı (Task 1 testi).
4. **Dönem değişimi ve dil değişimi:** dönem popup'tan değişince yeniden üretim gerekmeden 2014/2017 sözcükleri değişir; `html[lang]` değişince CSS yeniden üretilir (Task 3 testi).
5. **Desteklenmeyen dil / tek dönemi `null` olan anahtar:** X'in metni gizlenmemeli (metin kaybolup yerine hiçbir şey gelmemesi en kötü sonuç; Task 1 ve 3 testleri).

---

### Task 1: Sözcük modeli ve CSS üretimi

**Files:**
- Create: `src/wording/keys.ts`, `src/wording/table.ts`, `src/wording/css.ts`
- Test: `tests/wording/table.test.ts`, `tests/wording/css.test.ts`

**Interfaces:**
- Produces:
  - `WORDING_KEYS: readonly WordingKey[]` (yukarıdaki 9 anahtar, sırayla); `type WordingKey`.
  - `wordingAnchor(key: WordingKey): AnchorName` → `word` + baş harfi büyük anahtar.
  - `type WordingValue = string | null | { '2014': string | null; '2017': string | null }`; `type WordingTable = Record<WordingKey, WordingValue>`.
  - `parseWordingTable(raw: unknown, label: string): WordingTable` — her anahtar zorunlu, bilinmeyen anahtar hata, dize 1–40 karakter, kontrol karakteri yok.
  - `normalizeLang(lang: string): string` — `en-GB`→`en`, `zh-CN`→`zh-cn`, `zh-TW`→`zh-tw`, `ar-x-fm`→`ar`, boş → `''`.
  - `cssString(s: string): string` — çift tırnaklı CSS dizesi; `\`, `"`, kontrol karakterleri ve satır sonu kaçışlanır.
  - `wordingCss(table: WordingTable): string` — boş olmayan her anahtar/dönem için iki kural.

- [ ] **Step 1: Testleri yaz** — `parseWordingTable`: eksik anahtar, bilinmeyen anahtar, 41 karakter, `\n` içeren değer → hata; geçerli tablo aynen döner. `normalizeLang` yukarıdaki örnekler. `cssString('a"b\\c\nd')` → `"a\"b\\c\a d"`. `wordingCss`:
  - `composeButton: "Tweet"` → `html[data-ot-f-wording] [data-ot~="wordComposeButton"] span:not(:has(*)){font-size:0 !important}` ve `html[data-ot-f-wording] [data-ot~="wordComposeButton"] :has(> span:not(:has(*)):not(:empty))::before{content:"Tweet";content:"Tweet" / ""}`;
  - `likesLabel: {"2014":"Favorites","2017":null}` → kurallar yalnız `html[data-ot-f-wording][data-ot-era="2014"]` altında; 2017 için kural yok;
  - `null` anahtar için hiç kural yok;
  - `}` içeren değer üretilen CSS'in kural sayısını değiştirmez (dize içinde kalır).
- [ ] **Step 2: Çalıştır, FAIL gör** — `npx vitest run tests/wording`.
- [ ] **Step 3: Uygula.**
- [ ] **Step 4: PASS** — `npx vitest run tests/wording`, sonra `npx vitest run`.
- [ ] **Step 5: Commit** — `feat(wording): add the wording table model and css generator`.

### Task 2: Sözcük çapaları

**Files:**
- Modify: `src/core/selectors.ts` (`AnchorName`, `ANCHOR_NAMES`), `src/data/selectors.json`, `docs/x-dom-inventory.md` (§11 sözcük çapaları)
- Test: `tests/wording/anchors.test.ts`

**Interfaces:**
- Consumes: `wordingAnchor` (Task 1).
- Produces: 9 yeni `AnchorName`; `selectors.json`'da her biri için seçici.

- [ ] **Step 1: Test** — happy-dom'da canlı X yapısını taklit eden HTML ile her çapa bulunur; `inline_reply_offscreen` içindeki `tweetButtonInline` ve makale içeren pencerede `tweetButton` `wordComposeSubmit` OLMAZ; profil sekmeleri (Posts ilk sekme) ve etkileşim sekmeleri doğru çapaya gider; `ANCHOR_NAMES` her `wordingAnchor(k)`'yı içerir.
- [ ] **Step 2: FAIL gör.**
- [ ] **Step 3: Seçicileri ekle**; happy-dom'un yanlış değerlendirdiği biçimleri (bkz. M2: `:has(> div > a)`) kullanma; `profilePostsTab` seçicisini canlı X'te doğrula.
- [ ] **Step 4: PASS** — `npx vitest run`.
- [ ] **Step 5: Commit** — `feat(wording): add anchors for the relabelled X controls`.

### Task 3: `wording` özelliği ve içerik betiği bağlantısı

**Files:**
- Create: `src/features/wording/index.ts`, `src/wording/tables.ts` (dil → tablo, `import.meta.glob` ile `src/data/wording/*.json`)
- Modify: `src/features/types.ts` (`unavailable?(ctx): string | null`), `src/features/registry.ts`, `src/config.ts` (`IMPLEMENTED_FEATURES` += `wording`), `src/entrypoints/content/main.ts`, `public/_locales/{en,tr}/messages.json` (`featureWording`)
- Test: `tests/features/wording.test.ts`, `tests/content/main.test.ts`

**Interfaces:**
- Consumes: Task 1, Task 2.
- Produces:
  - `wordingTableFor(lang: string): WordingTable | null` (`normalizeLang` sonrası).
  - `Feature.unavailable?(ctx: FeatureContext): string | null` — dize dönerse özellik uygulanmaz, `cleanup` çağrılır, sağlık `unavailable` + o dize.
  - İçerik betiği: üst çerçevede `wording` etkinken o dilin `wordingCss`'i ikinci enjektörle eklenir; `html[lang]` değişince yeniden üretilir; etkin değilken boş CSS.

- [ ] **Step 1: Testler** — `runFeatures`: `lang="xx"` → `wording` etkin değil, sağlık `{status:'unavailable', detail:'xx'}`; `lang="en"` → etkin. `main`: `lang="en"` iken `ot:css` mesajlarından biri `content:"Tweet"` içerir ve `data-ot-f-wording` konur; ayarda `wording` kapatılınca öznitelik kalkar ve sözcük CSS'i boşalır; `html.lang` `xx` yapılınca öznitelik kalkar; dönem 2014'e geçince yeni CSS gönderilmez (dönem öznitelikle seçilir).
- [ ] **Step 2: FAIL gör.**
- [ ] **Step 3: Uygula.** Geçici `src/data/wording/en.json` (Task 4 gerçek veriyle değiştirir).
- [ ] **Step 4: PASS** — `npx vitest run`, `npx tsc --noEmit`.
- [ ] **Step 5: Commit** — `feat(wording): relabel X controls with the era's words`.

### Task 4: İlk 12 dilin verisi

**Files:**
- Create: `src/data/wording/{en,ja,es,pt,tr,ar,fr,de,ko,id,ru,it}.json`, `docs/wording-sources.md`
- Test: `tests/wording/data.test.ts`

- [ ] **Step 1: Test** — klasörde tam olarak 12 dosya; her biri `parseWordingTable`'dan geçer; her dosyanın en az bir dolu değeri var; `en` için `composeButton` "Tweet", `likesLabel` 2014 "Favorites"; `docs/wording-sources.md` her dolu değer için bir kaynak satırı içerir (dil+anahtar+dönem).
- [ ] **Step 2: FAIL gör.**
- [ ] **Step 3: Araştırma sonuçlarından dosyaları yaz** — sadece kaynak URL'si olan değerler; kuşkulu olan `null`.
- [ ] **Step 4: PASS** — `npx vitest run`.
- [ ] **Step 5: Commit** — `feat(wording): add Twitter's own wording for the first 12 languages`.

### Task 5: Sağdan sola ve görsel testler

**Files:**
- Modify: `tools/build-fixtures.mjs` (menü, sekmeler, `lang`), `tests/fixtures/*`, `tools/preview/entry.ts` (sözcük CSS'i), `tests/visual/visual.spec.ts`, `tests/dom/fixtures.test.ts`
- Test: aynı dosyalar

- [ ] **Step 1: Test** — `x-home-ar.html` (`lang="ar" dir="rtl"`) örneğinde çapalar bulunur ve `ar` tablosuyla üretilen CSS kural içerir; görsel test: `en` açık 2017 "Tweet" yazan düğme ekran görüntüsü.
- [ ] **Step 2: FAIL gör.**
- [ ] **Step 3: Uygula**; taban görüntüleri `--update-snapshots=all` ile üret ve gözle incele.
- [ ] **Step 4: PASS** — `npx vitest run`, `npm run test:visual`.
- [ ] **Step 5: Commit** — `test(wording): cover RTL and add a wording screenshot`.

### Task 6: Canlı doğrulama, spec senkronu, push

- [ ] **Step 1:** Önizleme paketini derle; paneldeki X'te (`lang="en"`) sözcük CSS'iyle: Post→Tweet (menü ve satır içi), yanıt düğmesi "Reply" kalır, Repost menüsü (açıp Escape ile kapat, öğeye tıklama), profil Posts→Tweets, etkileşim sekmeleri; `html.lang` geçici olarak `tr`/`ar` yapılıp o dilin sözcükleri ölçülür (X ayarı değiştirilmez).
- [ ] **Step 2:** Bulguları veriyle düzelt (`selectors.json`, `src/data/wording/*`), her seferinde `npm test`.
- [ ] **Step 3:** Spec §10.6 (anahtar tablosu, `profilePostCount` çıkarıldı, CSS tekniği), §11 (dosya yeri, kaynak belgesi), `docs/manual-checklist.md` M3 sonuçları.
- [ ] **Step 4:** Commit `chore: tune M3 data from live verification and sync the spec`; `git push -u origin m3-wording`.
