# Back to the Bird — M2 Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 2014–2016 dönemini, yazı boyutu ve köşe ölçeğini, dönem ikonlarını, avatar şeklini, Takip et ve Tweet düğmelerini, eylem durum renklerini ve modern öğeleri gizlemeyi eklemek; DOM örneği ve görsel testleri kurmak; M1 incelemesinden ertelenen küçük bulguları kapatmak.

**Architecture:** M1'in motoru ve özellik sözleşmesi aynen kullanılır. Yeni özellikler çapa işaretleyip statik CSS ile stil verir; X'in satır içi stillerini yenmek için kurallar `:is(…,#ot-…)` ile kimlik özgüllüğüne yükseltilir ve `!important` kullanır. İkonlar X'in `<svg>`'sine CSS maskesi olarak verilir; renk X'in `currentColor`'ından gelir. Dönem farkları token'larla ve `html[data-ot-era]` ile yapılır.

**Tech Stack:** WXT 0.21.5, TypeScript 5.9.3, Vitest 5.1.0, happy-dom 21.0.4, @playwright/test 1.64.1 (kurulu Chrome ile, `channel: 'chrome'`).

**Spec:** `docs/superpowers/specs/2026-11-09-back-to-the-bird-design.md`
**Veri kaynakları:** `docs/era-tokens.md` (2014–2016 ve 2017–2019 token ve bileşen değerleri), `docs/x-dom-inventory.md` §10 (M2 çapaları).
**Önceki plan:** `docs/superpowers/plans/2026-11-09-back-to-the-bird-m0-m1.md` (M1, `m0-m1-foundation` dalında).

## Global Constraints

- M1 plandaki bütün Global Constraints geçerlidir (X'e istek yok, MAIN world yok, X'in DOM'u taşınmaz/silinmez, programla tıklama yok, X'e bağlı seçiciler sadece `src/data/selectors.json`'da, renk değerleri sadece `src/data/palette-map.json` ve `src/theme/tokens.css`'te, mantıksal CSS özellikleri, Conventional Commits, yasaklı ad kontrolü).
- Çalışma dalı: `m2-era-details` (`m0-m1-foundation`'dan).
- **Dönem değerleri** `docs/era-tokens.md`'den alınır; 2014 = Ekim 2015 anı (yıldız, `#55ACEE`, `#292F33`).
- **Eylem durum renkleri dönemi izler, temayı değil** (yıldız 2014'te gece de altın sarısı).
- **Özgüllük kuralı:** X'in satır içi stilini ya da motorun kurallarını ezmesi gereken her özellik kuralı `html[data-ot-f-<id>] :is(<çapalar>,#ot-<ad>)` biçiminde yazılır ve `!important` kullanır (M1 canlı kontrolünde bulunan hata sınıfı).
- **İkonlar** bizim çizdiğimiz SVG'lerdir: `viewBox="0 0 24 24"`, tek renk (`#000`), dolgu ya da 2px kontur. X'in ya da Twitter'ın SVG yolları ve `rosettaicons` glifleri kopyalanmaz.
- Görsel testler tarayıcı indirmez; kurulu Chrome'u kullanır (`channel: 'chrome'`).

## Review Focus

1. **Beğeni/retweet durumu sayfada değişince:** X aynı düğmenin `data-testid`'ini `like` → `unlike` yapar; ikon ve renk yeni duruma uymalı (Task 3, 5'te test).
2. **Takip et → Takip ediliyor:** X düğmenin `data-testid`'ini `<id>-follow` → `<id>-unfollow` yapar; düğme "takip ediliyor" stiline geçmeli, eski `followButton` işareti kalmamalı (Task 3, 7'de test).
3. **2014'te 4px köşe:** X'in yuvarlak kalması gereken öğeleri (arama kutusu, anahtarlar, avatarlar) kareleşmemeli (Task 2, 6'da test).
4. **Dönem popup'tan değişince:** sayfa yenilenmeden 2014 ↔ 2017 geçer; ikonlar (yıldız/kalp), renkler ve köşeler birlikte değişir (Task 1'de test).
5. **Sağdan sola arayüz:** `dir="rtl"` örneğinde ikonlar, düğmeler ve gizlemeler yönden bağımsız çalışır (Task 9'da test).

---

## Dosya yapısı (yeni ve değişen)

```
src/config.ts                          AVAILABLE_ERAS, IMPLEMENTED_FEATURES genişler
src/data/selectors.json                yeni çapalar (§10 envanter)
src/data/palette-map.json              eylem durum renkleri
src/theme/tokens.css                   2014-light, 2014-night; yeni token'lar
src/core/selectors.ts                  AnchorName genişler
src/core/anchors.ts                    retagElement
src/core/scheduler.ts                  data-testid değişikliklerini bildirir
src/engine/index.ts                    sadece açık motor özellikleri
src/features/radius/{index.ts,style.css}
src/features/icons/{index.ts,style.css,svg/*.svg}
src/features/avatar/{index.ts,style.css}
src/features/buttons/{index.ts,style.css}        FeatureId 'followButton'
src/features/hide/{index.ts,style.css}           hideGrok, hidePremium, hideViewCounts
src/features/registry.ts
src/entrypoints/popup/{model.ts,main.ts,index.html}   dönem seçici, yeni düğmeler
src/entrypoints/content/main.ts        retag, tüm özellik CSS'leri
tools/build-icon-css.mjs               SVG → style.css (üretilen dosya depoda)
tests/fixtures/x-home-{light,night}.html          elle kurulmuş, X yapısına sadık örnekler
tests/fixtures/README.md
tests/dom/fixtures.test.ts             örnekler üzerinde çapa/özellik testleri
tests/visual/visual.spec.ts            Playwright ekran görüntüleri
playwright.config.ts
```

---

### Task 1: 2014 dönemi token'ları ve dönem seçici

**Files:**
- Modify: `src/config.ts`, `src/theme/tokens.css`, `src/entrypoints/popup/{model.ts,main.ts,index.html}`, `public/_locales/{en,tr}/messages.json`
- Test: `tests/theme/tokens.test.ts`, `tests/popup/model.test.ts`, `tests/core/settings.test.ts`, `tests/content/main.test.ts`

**Interfaces:**
- Produces: `AVAILABLE_ERAS = ['2014', '2017']`.
  ```ts
  // popup/model.ts
  export interface EraOption { era: Era; labelKey: string; selected: boolean }  // labelKey: 'era2014' | 'era2017'
  export function eraOptions(s: Settings): EraOption[];
  export function withEra(s: Settings, era: Era): Settings;
  ```

- [ ] **Step 1: Failing testler**
  - `tokens.test.ts`: yardımcı `block(era, theme)` ile dört blok (`2014-light`, `2014-night`, `2017-light`, `2017-night`) aranır; her blokta veride kullanılan her token tanımlı. Ek: `2014-light` bloğunda `--ot-accent:#55ACEE`, `--ot-text:#292F33`, `--ot-radius-pill:4px`, `--ot-avatar-radius:5px`; `2014-night` bloğunda `--ot-bg-card:#1B2836` ve `--ot-radius-pill:4px` (renk gece, köşe 2014).
  - `settings.test.ts`: depodaki `era: '2014'` korunur.
  - `model.test.ts`: `showEraSelector()` → `true`; `eraOptions(DEFAULT_SETTINGS)` → `[{era:'2014',labelKey:'era2014',selected:false},{era:'2017',labelKey:'era2017',selected:true}]`; `withEra` yeni nesne döndürür.
  - **Review Focus 4** (`main.test.ts`): `main` çalışırken `saveSettings({...DEFAULT_SETTINGS, era: '2014'})` → yenilemeden `data-ot-era="2014"`.

- [ ] **Step 2: Fail** — Run: `npx vitest run tests/theme tests/popup tests/core/settings.test.ts tests/content/main.test.ts` → FAIL.

- [ ] **Step 3: Uygula**
  - `tokens.css`: `2014-light` = `docs/era-tokens.md` 2014 tablosu; font `"Helvetica Neue",Helvetica,Arial,sans-serif` (2014'te Windows'ta Arial — Segoe UI yok); `fs-body:14px`; `radius-media:5px`. `2014-night` = `2017-night` renk token'ları + 2014'ün `font`, `fs-body`, `radius-*`, `avatar-radius` değerleri.
  - Popup: özellik listesinin üstünde iki seçenekli dönem seçimi (radyo grubu, `role="radiogroup"`); değişince `saveSettings(withEra(…))`. Metinler: `eraTitle` "Era"/"Dönem", `era2014` "2014–2016", `era2017` "2017–2019".

- [ ] **Step 4: Pass** — aynı komut ve `npm test` → PASS; `npm run typecheck` temiz.
- [ ] **Step 5: Commit** — `git commit -m "feat: add the 2014–2016 era and an era selector"`

### Task 2: Yazı boyutu, köşeler ve köşe istisnaları

**Files:**
- Modify: `src/config.ts`, `src/engine/index.ts`, `src/entrypoints/content/main.ts`, `src/core/selectors.ts`, `src/data/selectors.json`, `src/features/registry.ts`, `public/_locales/*`
- Create: `src/features/radius/{index.ts,style.css}`
- Test: `tests/engine/index.test.ts`, `tests/features/radius.test.ts`, `tests/popup/model.test.ts`

**Interfaces:**
- Produces: bu görev `IMPLEMENTED_FEATURES`'a `typeScale` ve `radius`'u ekler. Task 5–8 kendi özelliklerini (`icons`, `avatar`, `followButton`, `hideGrok`, `hidePremium`, `hideViewCounts`) ekler; M2 sonunda liste `wording` hariç bütün özellikleri içerir.
- `EngineDeps.features: ReadonlySet<EngineFeature>` — motor sadece bu kümede olan özelliklerin girdilerini üretir (ertelenen küçük bulgu).
- `AnchorName` += `'radiusKeep'`.
- `radius` özelliği hem motor (sınıf kuralları) hem DOM (istisna çapaları) tarafındadır: `DOM_FEATURES`'a `{ id: 'radius', requires: [], optional: ['radiusKeep'] }`.

- [ ] **Step 1: Failing testler**
  - `index.test.ts`: `features: new Set(['palette'])` iken `font-size: 15px` ve `border-top-left-radius: 9999px` içeren kural hiçbir `typeScale`/`radius` satırı üretmez; `features` bunları içerince üretir.
  - `radius.test.ts`: `style.css` → `html[data-ot-f-radius] :is([data-ot~="radiusKeep"],#ot-round){border-radius:9999px !important}`.
  - `model.test.ts`: `toggleRows` artık `typeScale` ("Text size"/"Yazı boyutu") ve `radius` ("Corners"/"Köşeler") satırlarını içerir.
  - **Review Focus 3:** `selectors.json`'da `radiusKeep` en az arama kutusunu (`[data-testid="SearchBox_Search_Input_label"]`) ve anahtarları (`[role="switch"]`) kapsar; bunu `parseSelectorTable` + `findAll` ile, ilgili öğeleri içeren küçük bir DOM'da test et.

- [ ] **Step 2: Fail** — Run: `npx vitest run tests/engine tests/features tests/popup` → FAIL.
- [ ] **Step 3: Uygula** — `main.ts` motoru `features: new Set(IMPLEMENTED_FEATURES ∩ {palette,font,typeScale,radius})` ile kurar.
- [ ] **Step 4: Pass** — aynı komut ve `npm test` → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat: enable text size and corner tokens with round exceptions"`

### Task 3: Çapalar X'in durum değişikliklerini izler

**Files:**
- Modify: `src/core/scheduler.ts`, `src/core/anchors.ts`, `src/entrypoints/content/main.ts`
- Test: `tests/core/scheduler.test.ts`, `tests/core/anchors.test.ts`, `tests/content/main.test.ts`

**Interfaces:**
- `TickInfo` += `changed: Element[]` — `data-testid` özniteliği değişen elemanlar (MutationObserver `attributeFilter: ['data-testid']`).
- `anchors.ts`: `export function retagElement(table: SelectorTable, names: readonly AnchorName[], el: Element): Set<AnchorName>` — `el`'in `data-ot` listesini, verilen adlar içinden **şu an** eşleşenlere göre yeniden kurar (eşleşmeyen adlar çıkar, verilen adlar dışındakiler korunur); eşleşenleri döndürür.

- [ ] **Step 1: Failing testler**
  - `scheduler.test.ts`: bir elemanın `data-testid`'i değişince tek tur, `changed` o elemanı içerir, `added` boş.
  - `anchors.test.ts`: `data-ot="followButton"` olan ve `data-testid`'i `1-unfollow` yapılmış düğmede `retagElement(table, ['followButton','unfollowButton'], el)` → `data-ot="unfollowButton"`; listede olmayan `primaryColumn` adı korunur.
  - **Review Focus 1–2** (`main.test.ts`): örnek DOM'da `data-testid="1-follow"` düğmesi `data-ot~="followButton"` alır; `data-testid` `1-unfollow` yapılınca bir tur sonra `data-ot~="unfollowButton"` ve `followButton` yok.

- [ ] **Step 2: Fail** — Run: `npx vitest run tests/core/scheduler.test.ts tests/core/anchors.test.ts tests/content/main.test.ts` → FAIL.
- [ ] **Step 3: Uygula** — `main.ts` tur başında `changed` elemanlarını `retagElement` ile DOM özelliklerinin bütün çapalarına göre yeniden işaretler.
- [ ] **Step 4: Pass** — aynı komut ve `npm test` → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat(core): retag anchors when X changes an element's state"`

### Task 4: Eylem durum renkleri

**Files:**
- Modify: `src/data/palette-map.json`, `src/theme/tokens.css`, `docs/x-dom-inventory.md`
- Test: `tests/theme/tokens.test.ts` (otomatik kapsar), `tests/engine/palette-map.test.ts`

**Interfaces:**
- `palette-map.json`, her iki tema:
  - `color`: `rgb(249, 24, 128)` → `like-active`, `rgb(0, 186, 124)` → `retweet-active`
  - `background-color`: `rgba(249, 24, 128, 0.1)` → `like-hover-bg`, `rgba(0, 186, 124, 0.1)` → `retweet-hover-bg`, `rgba(29, 155, 240, 0.1)` → `accent-hover-bg`
- `tokens.css` (dört blok; değerler dönemi izler, temayı değil):

| Token | 2014 | 2017 |
|---|---|---|
| `like-active` | `#FFAC33` | `#E0245E` |
| `like-hover-bg` | `rgba(255,172,51,0.1)` | `rgba(224,36,94,0.1)` |
| `retweet-active` | `#5C913B` | `#17BF63` |
| `retweet-hover-bg` | `rgba(92,145,59,0.1)` | `rgba(23,191,99,0.1)` |
| `accent-hover-bg` | `rgba(85,172,238,0.1)` | `rgba(29,161,242,0.1)` |

- [ ] **Step 1: Failing test** — `palette-map.test.ts`: paketli tabloda `light.color['rgb(249, 24, 128)'] === 'like-active'` ve `night.background-color['rgba(0, 186, 124, 0.1)'] === 'retweet-hover-bg'`. (Token tanımları `tokens.test.ts`'in "veride kullanılan her token tanımlı" kuralıyla otomatik denetlenir.)
- [ ] **Step 2: Fail** — Run: `npx vitest run tests/engine/palette-map.test.ts tests/theme` → FAIL.
- [ ] **Step 3: Uygula** — envanter belgesine §10'daki durum renklerinin kaynağını ekle.
- [ ] **Step 4: Pass** — aynı komut ve `npm test` → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat(theme): map like and retweet state colors to era tokens"`

### Task 5: Dönem ikonları

**Files:**
- Create: `src/features/icons/svg/{home,explore,notifications,messages,profile,more,reply,retweet,heart,star,bookmark}.svg`, `tools/build-icon-css.mjs`, `src/features/icons/style.css` (üretilen), `src/features/icons/index.ts`
- Modify: `src/core/selectors.ts`, `src/data/selectors.json`, `src/features/registry.ts`, `src/entrypoints/content/index.ts`, `package.json` (`"icons": "node tools/build-icon-css.mjs"`)
- Test: `tests/features/icons.test.ts`

**Interfaces:**
- `AnchorName` += `navHome`, `navExplore`, `navNotifications`, `navMessages`, `navProfile`, `navMore`, `actionReply`, `actionRetweet`, `actionLike`, `actionBookmark` (seçiciler `docs/x-dom-inventory.md` §10).
- Feature `icons`: `requires: []`, `optional`: yukarıdaki 10 çapa.
- `build-icon-css.mjs`: çapa → SVG dosyası eşlemesi (`navHome`→home, … `actionLike`→ 2014: star, 2017: heart). Çıktı satırı biçimi:
  `html[data-ot-f-icons] [data-ot~="navHome"] svg{-webkit-mask:url("data:image/svg+xml,…") center/contain no-repeat;mask:url("data:image/svg+xml,…") center/contain no-repeat;background-color:currentColor}`
  ve her çapa için `html[data-ot-f-icons] [data-ot~="<çapa>"] svg>*{opacity:0}`. `actionLike` iki satır: `html[data-ot-f-icons][data-ot-era="2014"] …` (star), `…[data-ot-era="2017"] …` (heart).
- İkon çizimi: 24×24, sade dönem tarzı; gezinme ikonları kontur (2px), eylem ikonları kontur; `heart` ve `star` kontur. Kontrol: her dosya tek renk `#000` kullanır, `viewBox="0 0 24 24"`, 2 KB'tan küçük.
- Spec §10.3'teki "paylaş", "geri" ve "yazma" ikonları bu görevde yok: paylaş düğmesinin dile bağlı olmayan çapası yok (`aria-label` dışında), geri düğmesi sayfaya göre değişen bir başlıkta, yazma düğmesi metin taşıyor ve Task 7'de dönem düğmesi olarak ele alınıyor.

- [ ] **Step 1: Failing testler**
  - `style.css` her 10 çapa için bir maske satırı ve bir `svg>*{opacity:0}` satırı içerir; maskelerin çözülmüş SVG'si ilgili dosyanın içeriğiyle aynıdır (branding testindeki eşleşme yöntemi).
  - `actionLike` için 2014 satırı `star.svg`'yi, 2017 satırı `heart.svg`'yi kullanır.
  - Her SVG dosyası: `viewBox="0 0 24 24"`, `#000` dışında renk yok, < 2048 bayt.
  - `runFeatures` çapa yokken `icons`'ı aktif ve `ok` sayar.
  - **Review Focus 1:** maske kuralı `[data-ot~="actionLike"]`'e bağlı; çapa `like` ve `unlike` için aynı (`selectors.json` `:is([data-testid="like"],[data-testid="unlike"])`) — `findAll` testi iki durumda da eşleşir.

- [ ] **Step 2: Fail** — Run: `npx vitest run tests/features/icons.test.ts` → FAIL.
- [ ] **Step 3: Uygula** — SVG'leri çiz, `npm run icons` ile `style.css`'i üret, içerik betiğinde import et.
- [ ] **Step 4: Pass** — aynı komut ve `npm test` → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat(icons): draw era icons and mask them over X's icons"`

### Task 6: Avatar şekli

**Files:**
- Create: `src/features/avatar/{index.ts,style.css}`
- Modify: `src/core/selectors.ts`, `src/data/selectors.json`, `src/features/registry.ts`, `src/entrypoints/content/index.ts`
- Test: `tests/features/avatar.test.ts`

**Interfaces:**
- `AnchorName` += `'avatar'` → `[data-testid^="UserAvatar-Container-"]`.
- Feature `avatar`: `requires: []`, `optional: ['avatar']`.
- CSS: `html[data-ot-f-avatar] :is([data-ot~="avatar"],[data-ot~="avatar"] div,#ot-avatar){border-radius:var(--ot-avatar-radius) !important}`.

- [ ] **Step 1: Failing test** — `style.css` yukarıdaki kuralı içerir; **Review Focus 3:** kural motorun `radius` kurallarından (0,2,1) daha özel — seçicide `#ot-avatar` var.
- [ ] **Step 2: Fail** — Run: `npx vitest run tests/features/avatar.test.ts` → FAIL.
- [ ] **Step 3: Uygula**.
- [ ] **Step 4: Pass** — aynı komut ve `npm test` → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat(avatar): era avatar corners"`

### Task 7: Takip et ve Tweet düğmeleri

**Files:**
- Create: `src/features/buttons/{index.ts,style.css}`
- Modify: `src/core/selectors.ts`, `src/data/selectors.json`, `src/theme/tokens.css`, `src/features/registry.ts`, `src/entrypoints/content/index.ts`, `public/_locales/*`
- Test: `tests/features/buttons.test.ts`

**Interfaces:**
- `AnchorName` += `followButton` (`[data-testid$="-follow"]`), `unfollowButton` (`[data-testid$="-unfollow"]`), `composeButton` (`[data-testid="SideNav_NewTweet_Button"]`), `composeSubmit` (`:is([data-testid="tweetButtonInline"],[data-testid="tweetButton"])`).
- Feature id `followButton` (popup: "Follow and Tweet buttons" / "Takip et ve Tweet düğmeleri"), `requires: []`, `optional`: dört çapa.
- Token'lar (dört blok):

| Token | 2014-light | 2017-light | gece (iki dönem) |
|---|---|---|---|
| `btn-follow-bg` | `#F5F8FA` | `#FFFFFF` | `var(--ot-bg-card)` |
| `btn-follow-image` | `linear-gradient(#fff,#f5f8fa)` | `none` | `none` |
| `btn-follow-border` | `#E1E8ED` | `#1DA1F2` | `var(--ot-accent)` |
| `btn-follow-text` | `#292F33` | `#1DA1F2` | `var(--ot-accent)` |
| `btn-follow-hover-bg` | `#E1E8ED` | `#EAF5FD` | `var(--ot-bg-hover)` |
| `btn-following-bg` | `#55ACEE` | `#1DA1F2` | `var(--ot-accent)` |
| `btn-following-border` | `#3B88C3` | `#1DA1F2` | `var(--ot-accent)` |
| `btn-following-text` | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` |
| `btn-unfollow-bg` | `#BE1931` | `#E0245E` | 2014: `#BE1931`, 2017: `#E0245E` |
| `btn-unfollow-border` | `#A0041E` | `#E0245E` | 2014: `#A0041E`, 2017: `#E0245E` |
| `btn-compose-bg` | `#0084B4` | `#1DA1F2` | `var(--ot-accent)` |
| `btn-compose-hover-bg` | `#006A90` | `#006DBF` | `var(--ot-accent-hover)` |
| `btn-compose-text` | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` |

(2014 compose hover `#006A90`: paket hover'ı `#0084B4` üstüne %15 siyah degrade — düz renge çevrilmiş çıkarım; `era-tokens.md`'ye not düş.)
- CSS (her çapa için `:is(…,#ot-btn)` ve `!important`): takip et → `btn-follow-*` + `background-image: var(--ot-btn-follow-image)`, `:hover` → `btn-follow-hover-bg`; takip ediliyor → `btn-following-*`, `:hover` → `btn-unfollow-*`; Tweet düğmeleri → `btn-compose-*`, `:hover` → `btn-compose-hover-bg`; hepsinde `border-radius: var(--ot-radius-pill)`, `border-style: solid`, `border-width: 1px`; düğme içindeki her öğe `color: inherit !important`.

- [ ] **Step 1: Failing testler**
  - `style.css` dört çapa seçicisini `:is(…,#ot-btn)` içinde ve `!important` ile içerir; takip edilen düğmenin `:hover` kuralı `--ot-btn-unfollow-bg`'yi kullanır.
  - `tokens.test.ts` yeni token'ların dört blokta tanımlı olmasını zaten denetler (veriden değil CSS'ten kullanılanlar için `tokens.test.ts`'e "özellik CSS'lerinde kullanılan her `--ot-*` dört blokta tanımlı" kontrolünü ekle).
  - **Review Focus 2:** `findAll` ile `1-follow` ve `1-unfollow` farklı çapalara eşlenir.
- [ ] **Step 2: Fail** — Run: `npx vitest run tests/features/buttons.test.ts tests/theme` → FAIL.
- [ ] **Step 3: Uygula**.
- [ ] **Step 4: Pass** — aynı komut ve `npm test` → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat(buttons): era Follow and Tweet buttons"`

### Task 8: Modern öğeleri gizleme

**Files:**
- Create: `src/features/hide/{index.ts,style.css}`
- Modify: `src/core/selectors.ts`, `src/data/selectors.json`, `src/features/registry.ts`, `src/entrypoints/content/index.ts`, `public/_locales/*`
- Test: `tests/features/hide.test.ts`

**Interfaces:**
- `AnchorName` += `grokNav`, `grokDrawer`, `grokTweetButton`, `premiumNav`, `premiumSidebar`, `viewCount` (seçiciler envanter §10; `grokTweetButton` yapısal seçici birinci, `button[aria-label="Grok actions"]` ikinci).
- Üç feature (hepsi `requires: []`): `hideGrok` (optional: üç grok çapası), `hidePremium` (iki premium çapası), `hideViewCounts` (`viewCount`).
- CSS: `html[data-ot-f-hideGrok] :is([data-ot~="grokNav"],[data-ot~="grokDrawer"],[data-ot~="grokTweetButton"]){display:none !important}`; `html[data-ot-f-hidePremium] :is([data-ot~="premiumNav"],[data-ot~="premiumSidebar"]){display:none !important}`; `html[data-ot-f-hideViewCounts] div:has(> [data-ot~="viewCount"]){display:none !important}`.
- Popup metinleri: `featureHideGrok` "Hide Grok"/"Grok'u gizle", `featureHidePremium` "Hide Premium ads"/"Premium reklamlarını gizle", `featureHideViewCounts` "Hide view counts"/"Görüntülenme sayılarını gizle".

- [ ] **Step 1: Failing testler** — üç kural `style.css`'te; `grokTweetButton` yapısal seçicisi, bir `caret` kardeşi olan sarmalayıcıdaki etiketsiz düğmeyi bulur ama `caret`'in kendisini bulmaz (küçük DOM); `viewCount` seçicisi `a[href$="/analytics"]`'i bulur.
- [ ] **Step 2: Fail** — Run: `npx vitest run tests/features/hide.test.ts` → FAIL.
- [ ] **Step 3: Uygula**.
- [ ] **Step 4: Pass** — aynı komut ve `npm test` → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat(hide): hide Grok, Premium upsells and view counts"`

### Task 9: DOM örnekleri ve örnek testleri

Gerçek X sayfası paneldeki eklentisiz tarayıcıdan dosyaya alınamadığı için (indirme ya da çok büyük metin gerekir), örnekler `docs/x-dom-inventory.md`'deki yapıya sadık **elle kurulmuş** HTML'dir. Gerçek sayfa örnekleri M4 öncesi "Örnek al" geliştirme düğmesiyle eklenecek (Task 10).

**Files:**
- Create: `tests/fixtures/x-home-light.html`, `tests/fixtures/x-home-night.html`, `tests/fixtures/README.md`, `tests/dom/fixtures.test.ts`

**Fixture içeriği (ikisi aynı yapı, renkler temaya göre):** `<html lang="en">`; body satır içi zemin (`#FFFFFF` / `rgb(0, 0, 0)`); `header[role=banner]` içinde logo bağlantısı (`h1 > a[href="/home"] > div > svg`), altı `AppTabBar_*` bağlantısı (`a > div > div > svg > path`), Grok bağlantısı, `premium-signup-tab`, `SideNav_NewTweet_Button` (satır içi zemin); `primaryColumn` içinde iki `article[data-testid="tweet"]`: avatar (`UserAvatar-Container-user` + iç içe iki yuvarlak `div`), `User-Name`, `time`, `tweetText`, `caret` ve kardeşi Grok düğmesi, `[role=group]` içinde `reply`, `retweet`, `like` (ikinci tweette `unlike`), `bookmark`, analitik bağlantısı; `sidebarColumn` içinde arama etiketi, Premium `aside`, takip et (`1-follow`) ve takip ediliyor (`2-unfollow`) düğmeli `aside`; `GrokDrawer`; bir `<style>` içinde react-native-web tarzı birkaç sınıf (`.r-text{color:rgba(15,20,25,1.00)}` vb.) ve satır içi renkler (X'in yazım biçimiyle).

- [ ] **Step 1: Failing testler** (`fixtures.test.ts`, happy-dom, iki örnek için):
  - Her DOM özelliği çapası en az bir kez bulunur (`tagAnchors` döndürdüğü küme = M2 çapalarının tamamı).
  - `runFeatures` bütün DOM özelliklerini (`surfaces`, `branding`, `radius`, `icons`, `avatar`, `followButton`, `hideGrok`, `hidePremium`, `hideViewCounts`) aktif sayar.
  - Motor örneğin `<style>` kurallarından beklenen anahtarları eşler (açık: `light:color:text`; gece: `night:color:text`).
  - **Review Focus 5:** `dir="rtl"` verilmiş kopyada aynı çapalar bulunur ve bütün özellik CSS dosyalarında fiziksel yön özelliği (`left`/`right`) yok.
- [ ] **Step 2: Fail** — Run: `npx vitest run tests/dom` → FAIL (örnekler yok).
- [ ] **Step 3: Uygula** — örnekleri yaz; `README.md` nasıl kurulduklarını ve gerçek örneklerin nasıl ekleneceğini anlatır.
- [ ] **Step 4: Pass** — aynı komut ve `npm test` → PASS.
- [ ] **Step 5: Commit** — `git commit -m "test: add structural X fixtures and fixture tests"`

### Task 10: Görsel testler ve "Örnek al"

**Files:**
- Create: `playwright.config.ts`, `tests/visual/visual.spec.ts`, `tests/visual/__screenshots__/*` (ilk çalıştırmada üretilen taban görüntüler), `src/core/snapshot.ts`, `tests/core/snapshot.test.ts`
- Modify: `package.json` (`@playwright/test@1.64.1` dev bağımlılık; `"test:visual": "npm run build && npx vite build -c tools/preview/vite.config.ts && playwright test"`), `vitest.config.ts` (`exclude: ['tests/visual/**']`), `tools/preview/entry.ts` (dönem parametresi), `src/core/messages.ts`, `src/entrypoints/content/main.ts`, `src/entrypoints/popup/{main.ts,index.html}`

**Interfaces:**
- `tools/preview/entry.ts`: `run(staticCss: string, opts?: { era?: Era })`.
- Playwright: `channel: 'chrome'`, görünüm 1280×900, `toHaveScreenshot` eşiği `maxDiffPixelRatio: 0.002`.
- `src/core/snapshot.ts`: `export function takeSnapshot(doc: Document): string` — belgeyi kopyalar; okunabilir stil sayfalarını `<style>` metnine yazar; `script`, `iframe`, `noscript` ve dış stil bağlantılarını atar; `body` içindeki metinleri aynı uzunlukta `x` ile değiştirir; `img[src]`'yi 1×1 `data:` görüntüyle; `UserAvatar-Container-<ad>` → `UserAvatar-Container-user`, `<sayı>-follow`/`-unfollow` → `1-follow`/`1-unfollow`; `href` ilk bölümü kullanıcı adıysa `/user`; bütün `aria-label` değerlerini `label` yapar. Dönen metin tam bir HTML belgesidir.
- `ToContent` += `{ type: 'ot:snapshot' }` → içerik betiği (sadece `import.meta.env.DEV`) `takeSnapshot(document)` döndürür. Popup'ta sadece geliştirme sürümünde "Örnek al" düğmesi bu metni alır ve `Blob` + `a[download]` ile kaydeder (`downloads` izni gerekmez; bu bizim popup sayfamızdaki bir tıklama, X'te değil).

- [ ] **Step 1: Failing testler**
  - `snapshot.test.ts`: kullanıcı adı, tweet metni, `aria-label` ve avatar adresi içeren küçük bir belgede çıktı bu değerlerin hiçbirini içermez; `data-testid="tweet"`, `role` ve sınıf adları korunur; bir `<style>`'a `insertRule` ile eklenen kural çıktıda metin olarak bulunur.
  - `visual.spec.ts`: iki örnek × iki dönem için sayfa açılır, `.output/chrome-mv3/content-scripts/content.css` ve önizleme paketi eklenir, `OTPreview.run(css, { era })` çalışır, `toHaveScreenshot('home-<tema>-<dönem>.png')`. İlk çalıştırma taban görüntü olmadığı için başarısız olur.
- [ ] **Step 2: Fail** — Run: `npx vitest run tests/core/snapshot.test.ts` → FAIL (modül yok); `npm run test:visual` → FAIL ("missing snapshot").
- [ ] **Step 3: Taban görüntüleri üret ve incele** — Run: `npx playwright test --update-snapshots`; dört görüntüyü aç ve `docs/era-tokens.md` ile karşılaştır (2014: kare köşeli düğmeler, yıldız, `#55ACEE`; 2017: hap düğmeler, kalp, `#1DA1F2`; gece: `#1B2836` kartlar). Uymayan varsa düzelt ve yeniden üret.
- [ ] **Step 4: Pass** — Run: `npm run test:visual` → 4 passed; `npm test` → PASS (görsel testler vitest'e girmez).
- [ ] **Step 5: Commit** — `git commit -m "test: add visual tests and a dev-only snapshot button"`

### Task 11: M1'den ertelenen küçük bulgular

**Files:**
- Modify: `src/entrypoints/popup/main.ts`, `src/entrypoints/content/main.ts`, `src/engine/scan.ts`, `src/core/health.ts`, `src/features/registry.ts`, `docs/manual-checklist.md`
- Test: ilgili test dosyaları

- [ ] **Step 1: Failing testler**
  - `scan.test.ts`: `@supports (display:grid){ .s{color:red} }` içindeki kural döner (gruplama kuralının türüne bakılmaksızın `cssRules` olan her kurala inilir).
  - `show-original.test.ts`: basılıyken `link[rel=icon][data-ot]` yok, bırakınca geri gelir.
  - `health.test.ts`: `recordPalette` sadece okunabilir kural sayısı 500'ün üstündeyse sayar (seyrek sayfalar ve giriş akışları sayılmaz); anahtar tema başına (`ot:paletteMisses:light`) ayrı.
  - `registry.test.ts` (yeni): kapalı bir özelliğin `cleanup`'ı art arda iki `runFeatures` çağrısında sadece bir kez çalışır.
- [ ] **Step 2: Fail** — Run: `npx vitest run tests/engine/scan.test.ts tests/content/show-original.test.ts tests/core/health.test.ts tests/features/registry.test.ts` → FAIL.
- [ ] **Step 3: Uygula**
  - Popup "Orijinali göster" `release()`'i `try/catch` içinde (`port.postMessage` kopmuş portta fırlatır).
  - `recordPalette(theme, matched, map, readableRules)` imzası; `Engine.sheetStats()` `{ readable, unreadable, rules }` döndürür (`rules`: şimdiye kadar taranan stil kuralı sayısı).
  - `manual-checklist.md`: Firefox'ta eklenti simgesi > "Bu sitede her zaman izin ver" adımı.
  - Bu görevde kapatılmayan ve ertelenmeye devam edenler: saydamlığın 3 ondalığa yuvarlanması (tarayıcı yazımıyla karşılaştırma gerçek bir yarı saydam satır içi değer bulununca), içerik betiği testlerindeki gerçek zamanlı beklemeler, `splitSelectors` iç içe parantez testi.
- [ ] **Step 4: Pass** — aynı komut ve `npm test` → PASS.
- [ ] **Step 5: Commit** — `git commit -m "fix: close deferred review findings from M1"`

### Task 12: Canlı doğrulama ve spec senkronu

**Files:**
- Modify: `src/data/selectors.json` (gerekirse `radiusKeep`), `docs/manual-checklist.md`, `docs/superpowers/specs/2026-11-09-back-to-the-bird-design.md` (§9 token listesi, §10.3–10.7 dönem farkları)

- [ ] **Step 1: Önizlemeyi derle** — Run: `npm run build && npx vite build -c tools/preview/vite.config.ts`.
- [ ] **Step 2: Canlı ölçüm (kullanıcı izniyle)** — paneldeki X'te, önizleme paketiyle her iki dönem ve temada (tema değişikliği kullanıcı onayıyla, sonunda eski haline): ana sayfa, profil, tweet, bildirimler. Ölç: ikon maskeleri görünür ve `currentColor` (hover rengi değişir), beğenilmiş tweetin rengi `like-active`, Takip et / takip ediliyor düğmeleri token renklerinde, 2014'te avatar 5px ve arama kutusu yuvarlak, Grok/Premium/görüntülenme gizli.
- [ ] **Step 3: Bulguları veriyle düzelt** — sadece `selectors.json`, `palette-map.json`, `tokens.css`; her düzeltmeden sonra `npm test` → PASS.
- [ ] **Step 4: Belgeleri senkronla** — spec §9'a yeni token'ları (`like-*`, `retweet-*`, `accent-hover-bg`, `btn-*`) ve 2014 değerlerini, §10.5'e dönem başına düğme stillerini yaz; `manual-checklist.md`'ye M2 sonuç tablosu.
- [ ] **Step 5: Commit ve push**

```bash
git add -A
git commit -m "chore: tune M2 data from live verification and sync the spec"
git push -u origin m2-era-details
```

Sonra superpowers:finishing-a-development-branch.
