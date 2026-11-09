# Back to the Bird — M0 + M1 Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Token motorunun canlı X'te uygulanabilir olduğunu doğrulamak (M0) ve 2017 dönemini açık ve gece temasında canlı x.com'a uygulayan, Chrome ve Firefox'ta yüklenebilen ilk eklentiyi kurmak (M1).

**Architecture:** WXT ile MV3 eklentisi. ISOLATED world içerik betiği X'in okunabilir stil sayfalarını tarar, renk/font değerlerini `palette-map.json` ile token'lara eşler ve tema kapsamlı geçersiz kılma CSS'i üretir; CSS'i arka plan `scripting.insertCSS` ile ekler. Özellikler (`surfaces`, `branding`) sadece `<html>` öznitelikleri ve `data-ot` işaretleri koyar, stil statik CSS'tedir.

**Tech Stack:** WXT 0.21.5, TypeScript 5.9.3, Vitest 5.1.0, happy-dom 21.0.4, Node ≥ 22.

**Spec:** `docs/superpowers/specs/2026-11-09-back-to-the-bird-design.md`

**Kapsam:** Spec §18'deki M0 ve M1. M2 (2014, ikonlar, avatar, Takip et, gizleme, DOM örneği ve görsel testler), M3 (sözcükler) ve M4 (uzaktan veri, yayın) ayrı planlarda, M1'in gerçek verileriyle yazılır.

## Global Constraints

- X'e hiçbir istek atılmaz; MAIN world'de kod çalışmaz; X'in `fetch`/`XHR`/`history`'sine dokunulmaz (spec §5 ilke 1, 3).
- X'in DOM'u taşınmaz, silinmez, içeriği değiştirilmez. İzinli yazmalar: `<html>`'e `data-ot-*`, X elemanlarına `data-ot` işareti, `<head>` sonuna favicon `<link data-ot>`, stil ekleme (ilke 2).
- Programla tıklama/olay üretme yok (ilke 6).
- X'e bağlı seçici ve değerler sadece `src/data/selectors.json` ve `src/data/palette-map.json`'da (ilke 4). Testler kendi sentetik değerlerini kullanabilir.
- Çalışma zamanında üçüncü taraf kütüphane yok; sadece geliştirme bağımlılıkları (ilke 9).
- CSS'te yönden bağımsız mantıksal özellikler (`margin-inline-start` vb.) (ilke 7).
- `data-ot` işareti boşlukla ayrılmış ad listesidir; CSS'te `[data-ot~="<ad>"]` ile seçilir.
- Özellik öznitelikleri: `data-ot-f-<FeatureId>`; dönem `data-ot-era`; tema `data-ot-theme` (`light` | `night`).
- Token değişkenleri `--ot-<token>` (spec §9 listesi).
- İzinler (M1): `storage`, `scripting`; host: `https://x.com/*`. `alarms` M4'te eklenir.
- Kod ve yorumlar İngilizce; kullanıcıya görünen metinler `_locales` (tr, en).
- **Git:** Commit mesajlarına `Co-Authored-By` ya da araç/asistan imzası satırı eklenmez. Yasaklı ad listesi depo dışında tutulur ve uygulayıcıya görev özetinde verilir; her commit'ten önce staged diff, dosya adları ve mesaj, her push'tan önce dal adı ve gönderilen commit'ler bu listeye karşı kontrol edilir.
- Commit mesajları Conventional Commits (`feat:`, `chore:`, `docs:`).
- Çalışma dalı: `m0-m1-foundation` (`main`'den). Bitince superpowers:finishing-a-development-branch.

## Review Focus

1. **X'in renk yazımı:** react-native-web renkleri `rgba(239,243,244,1.00)` biçiminde yazar; eşleme tablosu `rgb(239, 243, 244)` der. İkisi aynı renk sayılmalı (Task 2'de test).
2. **Sayfa açıkken tema değişimi:** Kullanıcı X'te Lights Out'a geçince `data-ot-theme` sayfa yenilenmeden `night` olmalı ve gece eşlemeleri devreye girmeli (Task 7'de test).
3. **Eklenti güncellenince yetim kalan içerik betiği:** `browser.runtime.sendMessage` "Extension context invalidated" hatası fırlatınca sayfa bozulmamalı; CSS `<style data-ot>` yedeğine düşmeli, hata yutulmalı (Task 11'de test).
4. **Orijinali göster basılıyken popup kapanırsa:** Sayfa orijinal görünümde takılı kalmamalı; port kopunca öznitelikler geri gelmeli (Task 12'de test).
5. **Yan sütunu olmayan sayfalar (mesajlar, ayarlar):** Sağlık ekranı burada sahte uyarı göstermemeli; isteğe bağlı çapalar eksikse `warn` değil `ok` (Task 9'da test).

---

## Dosya yapısı

```
package.json  package-lock.json  wxt.config.ts  tsconfig.json  vitest.config.ts
LICENSE  README.md  .gitignore
docs/x-dom-inventory.md          M0 bulguları ve karar
docs/era-tokens.md               2017 açık/gece token değerleri ve kaynakları
tools/inventory/*.js             canlı X'te DevTools'ta çalıştırılan envanter betikleri (ürün kodu değil)
public/_locales/{en,tr}/messages.json
src/config.ts                    IMPLEMENTED_FEATURES, AVAILABLE_ERAS, ENGINE_BUDGET_MS
src/data/selectors.json  src/data/palette-map.json
src/theme/tokens.css
src/engine/color.ts  palette-map.ts  remap.ts  inline.ts  scan.ts  index.ts
src/core/messages.ts  settings.ts  attributes.ts  theme.ts  selectors.ts  anchors.ts
src/core/scheduler.ts  health.ts  route.ts  report.ts  inject.ts
src/features/types.ts  registry.ts
src/features/surfaces/{index.ts,style.css}
src/features/branding/{index.ts,style.css,favicon.ts,bird.svg}
src/entrypoints/background.ts
src/entrypoints/content/index.ts  src/entrypoints/content/main.ts
src/entrypoints/popup/{index.html,main.ts,model.ts,style.css}
tests/                           src/ ile aynı yapıda *.test.ts
```

---

## M0 — Deneme

M0 canlı X gerektirir ve insanla birlikte yapılır. Kullanıcı uygulamanın içindeki tarayıcıda (built-in browser) x.com'a **kendisi** giriş yapar; tema değişikliğini de **kendisi** yapar. Uygulayıcı sadece tarayıcı panelinin JavaScript çalıştırma aracıyla okuma yapan betikler çalıştırır; X'e istek atan, tıklayan ya da ayar değiştiren hiçbir şey yapmaz.

### Task 0.1: Canlı X envanteri ve uygulanabilirlik kararı

**Files:**
- Create: `tools/inventory/sheets.js`, `tools/inventory/palette.js`, `tools/inventory/testids.js`, `tools/inventory/misc.js`
- Create: `docs/x-dom-inventory.md`

**Interfaces:**
- Produces: `docs/x-dom-inventory.md` (Task 4, 6, 10'un veri kaynağı); karar satırı `Decision: ENGINE` ya da `Decision: PLAN_B`.

Her betik tek bir ifade olarak çalışır ve JSON döndürür; sayfayı değiştirmez.

- [ ] **Step 1: Betikleri yaz**
  - `sheets.js` → `[{ index, href, ownerId, ownerTag, readable, ruleCount, sampleSelectors: string[5] }]`. `cssRules` erişimi `try/catch` içinde; `SecurityError` → `readable: false`.
  - `palette.js` → okunabilir sayfalardaki her stil kuralı için `color`, `background-color`, `border-*-color`, `fill`, `stroke`, `font-family`, `font-size`, `border-*-radius` değerlerinin frekans tablosu: `{ [property]: { [value]: count } }`, en sık 25 değer. Ek olarak satır içi `style` özniteliklerinde aynı özelliklerin frekansı ve `style` özniteliği taşıyan eleman sayısı.
  - `testids.js` → sayfadaki bütün `data-testid` değerleri ve sayıları; ayrıca `header[role=banner]`, `main[role=main]`, `nav[role=navigation]` var mı.
  - `misc.js` → `{ htmlLang, htmlDir, bodyInlineStyle, bodyComputedBg, metaThemeColor, xBuild, svgFillSample }`. `xBuild`: `script[src*="/main."]`'in `src`'inden `/main\.([a-z0-9]+)\.js/`. `svgFillSample`: ilk 20 `svg`'nin `fill` özniteliği ve hesaplanmış `fill`'i.

- [ ] **Step 2: Kullanıcıdan giriş iste, ana sayfada açık temayla çalıştır**

Kullanıcıya: "Tarayıcı panelinde x.com'a giriş yap ve Ayarlar > Görünüm'den arka planı Varsayılan (açık) yap." Sonra `/home`'da dört betiği çalıştır, çıktıları kaydet.

- [ ] **Step 3: Diğer sayfalarda tekrarla**

Profil (`/<kendi kullanıcı adı>`), bir tweet (`/…/status/…`), `/notifications`, `/messages` (ya da X'in yönlendirdiği sohbet adresi), `/settings`. Her sayfada `testids.js` ve `misc.js`; ilk sayfada `sheets.js` ve `palette.js`.

- [ ] **Step 4: Gece temasıyla tekrarla**

Kullanıcıya: "Arka planı Lights Out yap." `/home`'da dört betik. Sonra kullanıcıya: "Arka planı tekrar açık yap" (bir sayfa açıkken `misc.js`'i değişimden önce ve sonra çalıştırıp `bodyInlineStyle`'ın değiştiğini doğrula).

- [ ] **Step 5: `docs/x-dom-inventory.md` yaz**

Başlıklar ve içerik:
1. Tarih ve `xBuild`.
2. Stil sayfaları tablosu: kaçı okunabilir, react-native-web kuralları hangisinde (`ownerId`), kural sayısı.
3. Renk değerleri (açık / gece): spec §8.1'deki rollere (`text`, `text-2`, `accent`, `bg-card`, `bg-hover`, `border` ve bulunan diğerleri) karşılık gelen X değerleri, frekanslarıyla. Saydam `rgba` varyantları ayrıca.
4. Font, font-size, border-radius değerleri.
5. Satır içi stil kullanımı: hangi özellikler, kaç eleman.
6. İkonlar `currentColor` mu kullanıyor.
7. Tema sinyali: `bodyInlineStyle` açık/gece değerleri.
8. `htmlLang` ve `htmlDir`.
9. `data-testid` listesi, sayfa başına; özellikle: sol menü logosu, `primaryColumn`, `sidebarColumn`, yan sütun kutuları.
10. spec §19 tablosundaki her varsayım için: doğru / yanlış / kısmen, kanıtıyla.
11. **Karar satırı:** react-native-web kurallarını içeren en az bir okunabilir stil sayfası varsa ve bilinen renk değerleri (`rgb(29, 155, 240)` dahil) orada geçiyorsa `Decision: ENGINE`; yoksa `Decision: PLAN_B`.

- [ ] **Step 6: Karar kapısı**

`Decision: PLAN_B` ise **dur**: bulguları kullanıcıya bildir, bu planın Task 3–5'i geçersizdir ve plan Plan B'ye (spec §8.7) göre yeniden yazılır. `ENGINE` ise devam.

- [ ] **Step 7: Commit**

```bash
git checkout -b m0-m1-foundation
git add tools/inventory docs/x-dom-inventory.md
git commit -m "docs: add live X DOM and stylesheet inventory"
```

Betik çıktılarında kullanıcının adı, takip ettiği hesaplar ya da tweet metinleri varsa dokümana **yazılmaz**; sadece seçiciler, değerler ve sayılar yazılır.

### Task 0.2: 2017 dönemi token değerleri (Wayback)

**Files:**
- Create: `docs/era-tokens.md`

**Interfaces:**
- Produces: Task 10'un `tokens.css`'i için `2017-light` ve `2017-night` değerleri.

- [ ] **Step 1: Kaynağı bul**

Wayback Machine'de 2018 yılına ait bir `twitter.com` (giriş sayfası değil, mümkünse bir profil ya da tweet sayfası) anlık görüntüsünü aç; `<link rel=stylesheet>`'lerden `abs.twimg.com/a/<build>/css/t1/twitter_core.bundle.css` ve benzerlerinin Wayback adreslerini bul. Gece modu için aynı dönemin gece modu CSS'ini (ayrı paket ya da `night`/`nightmode` sınıfıyla kapsanmış kurallar) bul. Okuma için web-fetch kullan; dosya indirip çalıştırma yok.

- [ ] **Step 2: Değerleri çıkar**

Spec §9'daki her token için (`bg-page`, `bg-card`, `bg-hover`, `text`, `text-2`, `border`, `accent`, `accent-hover`, `link`, `font`, `fs-body`, `radius-pill`, `radius-media`, `avatar-radius`) açık ve gece değerini, değerin alındığı seçiciyle birlikte bul (ör. `body` zemini, `.ProfileCard` zemini, `.tweet` kenarlığı, `.EdgeButton--primary` zemini, `.u-textUserColor`).

- [ ] **Step 3: `docs/era-tokens.md` yaz**

Tablo: `token | 2017-light | 2017-night | kaynak seçici | kaynak URL`. Spec §9'daki başlangıç değerinden farklı çıkan her değer için bir satır not. Bulunamayan değer için gerekçeli bir seçim yaz (ör. `accent-hover` = dönemin buton hover rengi; yoksa `accent`'in %10 koyusu) — tabloda boş hücre kalmaz.

- [ ] **Step 4: Commit**

```bash
git add docs/era-tokens.md
git commit -m "docs: add 2017 era design tokens from archived stylesheets"
```

---

## M1 — Temel

### Task 1: Proje iskeleti

**Files:**
- Create: `package.json`, `wxt.config.ts`, `tsconfig.json`, `vitest.config.ts`, `LICENSE`, `README.md`, `.gitignore`, `src/config.ts`, `src/entrypoints/background.ts`, `src/entrypoints/content/index.ts`, `src/entrypoints/popup/index.html`, `src/entrypoints/popup/main.ts`, `public/_locales/en/messages.json`, `public/_locales/tr/messages.json`, `public/icon/{16,32,48,128}.png`
- Test: `tests/smoke.test.ts`

**Interfaces:**
- Produces: `src/config.ts`:
  ```ts
  export type FeatureId = 'palette' | 'font' | 'typeScale' | 'radius' | 'surfaces' | 'branding'
    | 'icons' | 'avatar' | 'followButton' | 'wording' | 'hideGrok' | 'hidePremium' | 'hideViewCounts';
  export const ALL_FEATURES: readonly FeatureId[];          // yukarıdaki sırayla
  export const IMPLEMENTED_FEATURES: readonly FeatureId[];  // M1: ['palette', 'font', 'surfaces', 'branding']
  export type Era = '2014' | '2017';
  export const AVAILABLE_ERAS: readonly Era[];              // M1: ['2017']
  export const ENGINE_BUDGET_MS = 4;
  export const PALETTE_MISS_THRESHOLD = 3;
  ```
- Produces: `npm run build` (Chrome), `npm run build:firefox`, `npm test` (`vitest run`), `npm run typecheck` (`tsc --noEmit`).

- [ ] **Step 1: Bağımlılıkları kur**

```bash
npm init -y
npm i -D wxt@0.21.5 typescript@5.9.3 vitest@5.1.0 happy-dom@21.0.4
```

`package.json`: `"private": true`, `"type": "module"`, `"license": "MIT"`, `"engines": { "node": ">=22" }`, scripts yukarıdaki gibi, ayrıca `"postinstall": "wxt prepare"`.

- [ ] **Step 2: `wxt.config.ts`**

`srcDir: 'src'`; manifest: `name: '__MSG_extName__'`, `description: '__MSG_extDescription__'`, `default_locale: 'en'`, `permissions: ['storage', 'scripting']`, `host_permissions: ['https://x.com/*']`, Firefox için `browser_specific_settings.gecko.id: 'back-to-the-bird@mutlusinan'`. İçerik betiği `defineContentScript({ matches: ['https://x.com/*'], runAt: 'document_start', cssInjectionMode: 'manifest', main })`.

- [ ] **Step 3: Yer tutucu girişler ve simgeler**

`background.ts` ve `content/index.ts` boş `defineBackground`/`defineContentScript` (sonraki görevler doldurur). Popup boş sayfa. `_locales`: `extName` = "Back to the Bird", `extDescription` = en: "Classic Twitter design tokens for X", tr: "X için klasik Twitter tasarım token'ları". Simge: kuş logosuna **benzemeyen** basit bir işaret (ör. mavi zemin üzerinde geri sarma oku); 4 PNG.

`LICENSE`: MIT, "Copyright (c) 2026 Sinan Mutlu". `README.md`: tek paragraf açıklama + `npm i`, `npm run dev`, `npm test`. `.gitignore`: `node_modules/`, `.output/`, `.wxt/`.

- [ ] **Step 4: Duman testi ve vitest ayarı**

`vitest.config.ts`: `plugins: [WxtVitest()]` (`wxt/testing`), `test.environment: 'happy-dom'`.

```ts
// tests/smoke.test.ts
import { ALL_FEATURES, IMPLEMENTED_FEATURES } from '../src/config';
test('implemented features are a subset of all features', () => {
  expect(IMPLEMENTED_FEATURES.every((f) => ALL_FEATURES.includes(f))).toBe(true);
  expect(ALL_FEATURES).toHaveLength(13);
});
```

- [ ] **Step 5: Doğrula**

Run: `npm test && npm run typecheck && npm run build && npm run build:firefox`
Expected: test PASS; `.output/chrome-mv3/manifest.json` ve `.output/firefox-mv3/manifest.json` oluşur; ikisinde de `permissions` = `["storage","scripting"]`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold WXT extension"
```

### Task 2: Renk normalizasyonu ve eşleme tablosu

**Files:**
- Create: `src/engine/color.ts`, `src/engine/palette-map.ts`, `src/data/palette-map.json`
- Test: `tests/engine/color.test.ts`, `tests/engine/palette-map.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // color.ts
  export function normalizeColor(value: string): string | null;
  // palette-map.ts
  export type Theme = 'light' | 'night';
  export type ColorProperty = 'color' | 'background-color' | 'border-color';
  export interface PaletteMap {
    version: number;
    light: Partial<Record<ColorProperty, Record<string, string>>>;  // normalize edilmiş renk → token
    night: Partial<Record<ColorProperty, Record<string, string>>>;
    'font-family': Record<string, string>;   // değerin içinde aranan alt metin → token
    'font-size': Record<string, string>;
    'border-radius': Record<string, string>;
  }
  export function parsePaletteMap(json: unknown): PaletteMap;  // geçersizse PaletteMapError fırlatır
  export class PaletteMapError extends Error {}
  ```

- [ ] **Step 1: Failing testler**

```ts
test.each([
  ['rgba(239,243,244,1.00)', 'rgb(239, 243, 244)'],
  ['rgb(29, 155, 240)', 'rgb(29, 155, 240)'],
  ['#1D9BF0', 'rgb(29, 155, 240)'],
  ['#fff', 'rgb(255, 255, 255)'],
  ['#1d9bf01a', 'rgba(29, 155, 240, 0.102)'],
  ['rgba(29, 155, 240, 0.1)', 'rgba(29, 155, 240, 0.1)'],
  ['rgba(29,155,240,0.10)', 'rgba(29, 155, 240, 0.1)'],
  ['rgb(29 155 240 / 10%)', 'rgba(29, 155, 240, 0.1)'],
  ['transparent', 'rgba(0, 0, 0, 0)'],
  [' RGB(0,0,0) ', 'rgb(0, 0, 0)'],
])('normalizeColor(%s) → %s', (input, out) => expect(normalizeColor(input)).toBe(out));

test.each(['currentcolor', 'var(--x)', 'inherit', '', 'red', '#12'])('normalizeColor(%s) → null', (v) =>
  expect(normalizeColor(v)).toBeNull());
```

`parsePaletteMap`: geçerli örnek nesneyi aynen döndürür ve renk anahtarlarını normalize eder (`'rgba(29,155,240,1.00)'` anahtarı `'rgb(29, 155, 240)'` olur); bilinmeyen üst düzey alan, `version` eksikliği, string olmayan token, `light` altında bilinmeyen özellik → `PaletteMapError`.

- [ ] **Step 2: Fail ettiğini gör** — Run: `npx vitest run tests/engine` → FAIL (modül yok).

- [ ] **Step 3: Uygula**

`normalizeColor`: alfa 3 ondalığa yuvarlanır, sondaki sıfırlar atılır; alfa 1 ise `rgb(...)`. Adlandırılmış renklerden sadece `transparent` desteklenir.

`src/data/palette-map.json`: `docs/x-dom-inventory.md`'deki değerlerle doldur (`version: 1`). Saydam varyantlar için token adları `accent-a10` gibi; bunlar Task 10'da tanımlanır.

- [ ] **Step 4: Geçtiğini gör** — Run: `npx vitest run tests/engine` → PASS. Ayrıca `parsePaletteMap(require('../src/data/palette-map.json'))` hatasız çalışmalı (bu da bir test).

- [ ] **Step 5: Commit** — `git commit -m "feat(engine): add color normalization and palette map parsing"`

### Task 3: Kural eşleme ve CSS üretimi

**Files:**
- Create: `src/engine/remap.ts`, `src/engine/inline.ts`
- Test: `tests/engine/remap.test.ts`, `tests/engine/inline.test.ts`

**Interfaces:**
- Consumes: `normalizeColor`, `PaletteMap`, `Theme` (Task 2).
- Produces:
  ```ts
  // remap.ts
  export interface RuleLike { selectorText: string; style: { getPropertyValue(p: string): string }; media?: string }
  export type EngineFeature = 'palette' | 'font' | 'typeScale' | 'radius';
  export interface RemapEntry { feature: EngineFeature; theme: Theme | null; selector: string;
                                property: string; token: string; media?: string; key: string }
  export function remapRule(rule: RuleLike, map: PaletteMap): RemapEntry[];
  export function renderOverrides(entries: Iterable<RemapEntry>): string;
  // inline.ts
  export function renderInlineOverrides(map: PaletteMap): string;
  ```
  `key` sağlık için eşleşen eşleme girdisidir: `"light:color:accent"`, `"font-family:font"`.

- [ ] **Step 1: Failing testler**

```ts
const map = parsePaletteMap({ version: 1,
  light: { color: { 'rgb(29, 155, 240)': 'accent' }, 'border-color': { 'rgb(239, 243, 244)': 'border' } },
  night: { color: { 'rgb(29, 155, 240)': 'accent' } },
  'font-family': { TwitterChirp: 'font' }, 'font-size': { '15px': 'fs-body' },
  'border-radius': { '9999px': 'radius-pill' } });
const rule = (selectorText: string, props: Record<string, string>, media?: string): RuleLike =>
  ({ selectorText, media, style: { getPropertyValue: (p) => props[p] ?? '' } });

test('accent color maps for both themes', () => {
  const css = renderOverrides(remapRule(rule('.r-a', { color: 'rgba(29,155,240,1.00)' }), map));
  expect(css).toBe(
    'html[data-ot-f-palette][data-ot-theme="light"] .r-a{color:var(--ot-accent)}\n' +
    'html[data-ot-f-palette][data-ot-theme="night"] .r-a{color:var(--ot-accent)}');
});
test('border longhands map through border-color entry', () => {
  const e = remapRule(rule('.r-b', { 'border-bottom-color': 'rgba(239,243,244,1.00)' }), map);
  expect(e).toHaveLength(1);
  expect(e[0]).toMatchObject({ property: 'border-bottom-color', token: 'border', key: 'light:border-color:border' });
});
test('selector lists are scoped per part', () => {
  expect(renderOverrides(remapRule(rule('.a,.b:hover', { color: 'rgb(29, 155, 240)' }), map)).split('\n')[0])
    .toBe('html[data-ot-f-palette][data-ot-theme="light"] .a,html[data-ot-f-palette][data-ot-theme="light"] .b:hover{color:var(--ot-accent)}');
});
test('media rules are wrapped', () => {
  expect(renderOverrides(remapRule(rule('.c', { color: 'rgb(29, 155, 240)' }, '(min-width: 500px)'), map)))
    .toMatch(/^@media \(min-width: 500px\)\{html\[data-ot-f-palette\]\[data-ot-theme="light"\] \.c\{color:var\(--ot-accent\)\}\}/);
});
test('font family matches by substring, size and radius exactly', () => {
  const e = remapRule(rule('.d', { 'font-family': 'TwitterChirp, -apple-system, sans-serif',
    'font-size': '15px', 'border-top-left-radius': '9999px' }), map);
  expect(e.map((x) => [x.feature, x.property, x.token])).toEqual([
    ['font', 'font-family', 'font'], ['typeScale', 'font-size', 'fs-body'], ['radius', 'border-top-left-radius', 'radius-pill']]);
  expect(renderOverrides(e)).toContain('html[data-ot-f-font] .d{font-family:var(--ot-font)}');
});
test('unmapped values produce nothing', () =>
  expect(remapRule(rule('.e', { color: 'rgb(1, 2, 3)' }), map)).toEqual([]));

test('inline overrides do not let background-color match color', () => {
  const css = renderInlineOverrides(map);
  expect(css).toContain('html[data-ot-f-palette][data-ot-theme="light"] [style^="color: rgb(29, 155, 240)"],' +
    'html[data-ot-f-palette][data-ot-theme="light"] [style*="; color: rgb(29, 155, 240)"]{color:var(--ot-accent) !important}');
  expect(css).not.toContain('[style*="color: rgb(29, 155, 240)"]{');
});
```

- [ ] **Step 2: Fail ettiğini gör** — Run: `npx vitest run tests/engine/remap.test.ts tests/engine/inline.test.ts` → FAIL.

- [ ] **Step 3: Uygula**

`remapRule` incelenen özellikler: `color`, `background-color`, `border-color` ve dört kenar ile `border-{block,inline}-{start,end}-color` uzun halleri (hepsi `border-color` tablosunu kullanır); `font-family`, `font-size`; `border-radius` ve dört köşe uzun hali. Çıktı sırası: tema (`light`, `night`), sonra özellik sırası yukarıdaki gibi. `renderOverrides` girişleri `media` başına gruplar; aynı `selector+property+theme` için tekrar eden girişleri tekilleştirir.

`renderInlineOverrides` spec §8.4'teki "derleme sırasında" yerine çalışma zamanında, yüklü eşleme tablosundan üretilir; böylece M4'te uzaktan gelen `paletteMap` güncellemeleri satır içi kuralları da kapsar (bilinçli fark). Her tema ve renk özelliği için (uzun haller dahil), her değer `rgb(r, g, b)` / `rgba(r, g, b, a)` biçiminde yazılır (tarayıcının satır içi stil serileştirmesi; M0 envanterindeki gerçek biçimle karşılaştır, farklıysa test ve uygulamayı ona göre düzelt).

- [ ] **Step 4: Geçtiğini gör** — aynı komut → PASS.

- [ ] **Step 5: Commit** — `git commit -m "feat(engine): remap stylesheet rules to era tokens"`

### Task 4: Stil sayfası tarayıcı

**Files:**
- Create: `src/engine/scan.ts`
- Test: `tests/engine/scan.test.ts`

**Interfaces:**
- Consumes: `RuleLike` (Task 3).
- Produces:
  ```ts
  export interface ScanResult { rules: RuleLike[]; readable: number; unreadable: number }
  export class SheetScanner {
    constructor(doc: Document);
    scanNew(): ScanResult;   // sadece son çağrıdan beri eklenen kurallar
  }
  ```

- [ ] **Step 1: Failing testler** (happy-dom)
  - `<style>` içinde iki kural → ilk `scanNew()` 2 kural, `readable: 1`.
  - `sheet.insertRule('.x{color:red}', 2)` → ikinci `scanNew()` sadece `.x`.
  - Kural sayısı azalırsa (sayfa değiştirilmiş) o sayfa baştan taranır.
  - `@media (min-width: 500px){ .m{color:red} }` → dönen kuralın `media` alanı `'(min-width: 500px)'`.
  - `cssRules` getter'ı `SecurityError` fırlatan sayfa (`Object.defineProperty` ile) → `unreadable: 1`, hata dışarı sızmaz.
  - `ownerNode`'u `data-ot` özniteliği taşıyan `<style>` atlanır.

- [ ] **Step 2: Fail** — Run: `npx vitest run tests/engine/scan.test.ts` → FAIL.

- [ ] **Step 3: Uygula** — İşlenen kural sayısı `WeakMap<CSSStyleSheet, number>`; `CSSStyleRule` ve `CSSMediaRule` içindeki stil kuralları; diğer kural türleri atlanır.

- [ ] **Step 4: Pass** — aynı komut → PASS.

- [ ] **Step 5: Commit** — `git commit -m "feat(engine): add incremental stylesheet scanner"`

### Task 5: Motor: bütçe, önbellek, sağlık sinyali

**Files:**
- Create: `src/engine/index.ts`
- Test: `tests/engine/index.test.ts`

**Interfaces:**
- Consumes: `SheetScanner`, `remapRule`, `renderOverrides`, `renderInlineOverrides`, `PaletteMap`.
- Produces:
  ```ts
  export interface EngineDeps {
    map: PaletteMap;
    scan: () => ScanResult;
    applyCss: (css: string) => Promise<void>;
    cache: { get(key: string): Promise<string | undefined>; set(key: string, v: string): Promise<void> };
    now: () => number;
    budgetMs: number;
  }
  export interface Engine {
    start(): Promise<void>;          // önbellekteki CSS'i hemen uygular
    tick(): Promise<boolean>;        // true: kuyrukta iş kaldı
    matchedKeys(): ReadonlySet<string>;
    sheetStats(): { readable: number; unreadable: number };
  }
  export function createEngine(deps: EngineDeps): Engine;
  ```
  Önbellek anahtarı: `` `ot:engineCss:v${map.version}` ``. Uygulanan CSS = `renderInlineOverrides(map)` + `\n` + tüm girişlerin `renderOverrides`'ı.

- [ ] **Step 1: Failing testler** (sahte bağımlılıklarla)
  - `start()` önbellekte değer varsa `applyCss`'i o değerle bir kez çağırır; yoksa çağırmaz.
  - Bir eşleşen kural içeren `tick()` sonrası `applyCss` bir kez çağrılır, CSS `var(--ot-accent)` içerir ve önbelleğe aynı metin yazılır; `matchedKeys()` `light:color:accent` içerir.
  - Yeni kural yoksa `tick()` `applyCss`'i çağırmaz.
  - 10.000 kural, `now()` her çağrıda 1 ms ilerliyor, `budgetMs: 4`, bütçe her 100 kuralda bir kontrol ediliyor → ilk `tick()` `true` döner ve 500'den az kural işler; `tick()` `false` dönene kadar tekrarlanınca 10.000 kuralın hepsi işlenmiştir.
  - `applyCss` reddederse `tick()` hatayı yutmaz, çağırana iletir (içerik betiği yedeğe düşer; bkz. Task 11).

- [ ] **Step 2: Fail** — Run: `npx vitest run tests/engine/index.test.ts` → FAIL.
- [ ] **Step 3: Uygula** — Taranan ama işlenmemiş kurallar bir kuyrukta bekler; giriş anahtarı `theme|media|selector|property` ile tekilleştirilir.
- [ ] **Step 4: Pass** — aynı komut → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat(engine): add budgeted engine with css cache"`

### Task 6: Seçiciler ve çapalar

**Files:**
- Create: `src/data/selectors.json`, `src/core/selectors.ts`, `src/core/anchors.ts`
- Test: `tests/core/selectors.test.ts`, `tests/core/anchors.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // selectors.ts
  export type AnchorName = 'sideNavLogo' | 'primaryColumn' | 'sidebarColumn' | 'sidebarBox';
  export type SelectorTable = Record<AnchorName, string[]>;
  export function parseSelectorTable(json: unknown): SelectorTable;   // geçersiz seçici (querySelector'ın fırlattığı) → hata
  export function findAll(table: SelectorTable, name: AnchorName, root: ParentNode): Element[];
  // anchors.ts
  export function tagAnchors(table: SelectorTable, names: readonly AnchorName[], root: ParentNode): Set<AnchorName>; // bulunanlar
  ```

`selectors.json`: M0 envanterinden; her ad için öncelik sırasıyla 1–3 seçici (`data-testid` > ARIA rolü > yapısal). `sidebarBox`, yan sütundaki ayrı kutuları seçer.

- [ ] **Step 1: Failing testler**
  - `findAll` ilk seçici eşleşmezse ikinciyi dener; ilk eşleşen seçicinin bütün sonuçlarını döndürür; hiçbiri eşleşmezse `[]`.
  - `tagAnchors` bulunan elemanın `data-ot` listesine adı ekler; aynı eleman iki ada uyarsa `data-ot="primaryColumn sidebarBox"`; tekrar çağrılınca ad tekrar eklenmez; dönen küme bulunan adları içerir.
  - `parseSelectorTable`: eksik ad, boş liste ya da `'div[['` gibi geçersiz seçici → hata.

- [ ] **Step 2–4:** Run `npx vitest run tests/core/selectors.test.ts tests/core/anchors.test.ts` → FAIL, uygula, → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat(core): add anchor selectors and tagging"`

### Task 7: Ayarlar, öznitelikler, tema

**Files:**
- Create: `src/core/settings.ts`, `src/core/attributes.ts`, `src/core/theme.ts`
- Test: `tests/core/settings.test.ts`, `tests/core/attributes.test.ts`, `tests/core/theme.test.ts`

**Interfaces:**
- Consumes: `FeatureId`, `Era`, `ALL_FEATURES` (Task 1), `Theme`, `normalizeColor` (Task 2).
- Produces:
  ```ts
  // settings.ts  (anahtar: storage.sync 'ot:settings')
  export interface Settings { era: Era; features: Record<FeatureId, boolean> }
  export const DEFAULT_SETTINGS: Settings;          // era '2017', bütün özellikler true
  export function loadSettings(): Promise<Settings>;
  export function saveSettings(s: Settings): Promise<void>;
  export function watchSettings(cb: (s: Settings) => void): () => void;
  // attributes.ts
  export function applyHtmlAttributes(html: HTMLElement, s: Settings, theme: Theme,
    active: ReadonlySet<FeatureId>): void;
  export function clearHtmlAttributes(html: HTMLElement): void;  // bütün data-ot-* öznitelikleri
  // theme.ts  (son değer: storage.local 'ot:lastTheme')
  export function detectTheme(body: HTMLElement): Theme | null;
  export function watchTheme(body: HTMLElement, cb: (t: Theme) => void): () => void;
  ```

- [ ] **Step 1: Failing testler**
  - `loadSettings`: depoda yoksa `DEFAULT_SETTINGS`; depodaki `{ era: '2017', features: { branding: false, unknown: true } }` → `branding: false`, diğerleri `true`, `unknown` atılmış; `era: '1999'` → `'2017'`. (`fakeBrowser` ile.)
  - `applyHtmlAttributes`: `data-ot-era="2017"`, `data-ot-theme="night"`; `active` = `{palette, branding}` ve `branding` ayarda kapalı → sadece `data-ot-f-palette` var; ikinci çağrıda kapanan özelliğin özniteliği kaldırılır.
  - `clearHtmlAttributes`: `data-ot-*` ile başlayan her öznitelik gider, başka öznitelikler kalır.
  - `detectTheme`: `body.style.backgroundColor = '#FFFFFF'` → `'light'`; `'rgb(0, 0, 0)'` → `'night'`; `'rgb(21, 32, 43)'` → `'night'`; boş → `null`. Hesaplanmış renk değil satır içi değer okunur: body'ye `background: red !important` veren bir `<style>` eklenmişken de `'#FFFFFF'` → `'light'`.
  - **Review Focus 2:** `watchTheme` ile izlenirken `body.style.backgroundColor` beyazdan siyaha değişince `cb('night')` bir kez çağrılır; aynı değer tekrar yazılınca çağrılmaz.

- [ ] **Step 2–4:** Run `npx vitest run tests/core/settings.test.ts tests/core/attributes.test.ts tests/core/theme.test.ts` → FAIL, uygula, → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat(core): add settings, html attributes and theme detection"`

### Task 8: Zamanlayıcı

**Files:**
- Create: `src/core/scheduler.ts`
- Test: `tests/core/scheduler.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface TickInfo { added: Node[]; routeChanged: boolean }
  export function createScheduler(opts: {
    root: Node; onTick: (info: TickInfo) => Promise<boolean> | boolean;  // true: devam işi var
    earlyPollMs?: number; earlyPollDurationMs?: number;                 // varsayılan 500 / 10000
  }): { start(): void; stop(): void };
  ```

- [ ] **Step 1: Failing testler** (`vi.useFakeTimers()`, happy-dom)
  - Aynı frame'de eklenen üç düğüm → tek `onTick`, `added` üçünü içerir.
  - `history.pushState({}, '', '/x')` sonrası bir DOM değişikliği → `routeChanged: true`; sonraki turda `false`. `popstate` olayı da tur tetikler.
  - Değişiklik olmasa da ilk 10 saniyede her 500 ms'de `onTick` çağrılır, 10 saniyeden sonra çağrılmaz.
  - `onTick` `true` dönerse bir sonraki tur `requestIdleCallback` (yoksa `setTimeout(…, 0)`) ile planlanır.
  - `stop()` sonrası hiçbir tur çalışmaz.

- [ ] **Step 2–4:** Run `npx vitest run tests/core/scheduler.test.ts` → FAIL, uygula, → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat(core): add batched mutation scheduler"`

### Task 9: Sağlık, sayfa türü, rapor

**Files:**
- Create: `src/core/health.ts`, `src/core/route.ts`, `src/core/report.ts`
- Test: `tests/core/health.test.ts`, `tests/core/route.test.ts`, `tests/core/report.test.ts`

**Interfaces:**
- Consumes: `FeatureId`, `PALETTE_MISS_THRESHOLD`, `Theme`, `PaletteMap`.
- Produces:
  ```ts
  // route.ts
  export type PageType = 'home' | 'profile' | 'status' | 'notifications' | 'messages' | 'other';
  export function classifyRoute(pathname: string): PageType;
  // health.ts
  export type FeatureStatus = 'ok' | 'warn' | 'error' | 'off' | 'unavailable';
  export interface HealthSnapshot {
    features: Partial<Record<FeatureId, { status: FeatureStatus; detail?: string }>>;
    paletteMisses: string[]; sheets: { readable: number; unreadable: number };
    errors: { feature: FeatureId | 'core'; message: string }[];
  }
  export interface Health {
    setFeature(id: FeatureId, status: FeatureStatus, detail?: string): void;
    error(feature: FeatureId | 'core', err: unknown): void;
    setSheets(s: { readable: number; unreadable: number }): void;
    recordPalette(theme: Theme, matched: ReadonlySet<string>, map: PaletteMap): Promise<string[]>; // eşik aşanlar
    snapshot(): HealthSnapshot;
    level(): 'ok' | 'warn' | 'error';
  }
  export function createHealth(store: { get(k: string): Promise<unknown>; set(k: string, v: unknown): Promise<void> }): Health;
  // report.ts
  export interface ReportMeta { extensionVersion: string; paletteMapVersion: number; xBuild: string | null;
    lang: string; theme: Theme; era: Era; pageType: PageType }
  export function buildReport(h: HealthSnapshot, meta: ReportMeta): string;  // JSON.stringify(…, null, 2)
  ```

- [ ] **Step 1: Failing testler**
  - `classifyRoute`: `/home` → home; `/jack` → profile; `/jack/status/123` → status; `/jack/status/123/photo/1` → status; `/notifications/mentions` → notifications; `/messages` ve `/i/chat/abc` → messages; `/explore`, `/settings/display`, `/i/bookmarks` → other.
  - `recordPalette` (depo `ot:paletteMisses`): o anki temanın bir anahtarı üç ardışık çağrıda eşleşmezse üçüncü çağrı onu döndürür ve `snapshot().paletteMisses` içerir; arada bir kez eşleşirse sayaç sıfırlanır; diğer temanın anahtarları sayılmaz.
  - `level()`: herhangi bir `error` ya da `unreadable > 0 && readable === 0` → `'error'`; `warn` ya da palet eksiği → `'warn'`; yoksa `'ok'`.
  - **Review Focus 5:** `setFeature('surfaces', 'ok')` ile isteğe bağlı çapa eksikliği uyarı üretmez (Task 10'daki özellik bunu böyle bildirir; burada `level()` `'ok'`).
  - `buildReport`: çıktı JSON'unda `meta` alanları ve sağlık özeti var; `pathname`, `href`, `location` ya da kullanıcı adı alanı **yok** (test: üretilen metin `'/jack'` içermez, meta'da sadece `pageType: 'profile'`).

- [ ] **Step 2–4:** Run `npx vitest run tests/core/health.test.ts tests/core/route.test.ts tests/core/report.test.ts` → FAIL, uygula, → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat(core): add health tracking, route types and report"`

### Task 10: Token CSS ve M1 özellikleri (`surfaces`, `branding`)

**Files:**
- Create: `src/theme/tokens.css`, `src/features/types.ts`, `src/features/registry.ts`, `src/features/surfaces/{index.ts,style.css}`, `src/features/branding/{index.ts,style.css,favicon.ts,bird.svg}`
- Test: `tests/features/surfaces.test.ts`, `tests/features/branding.test.ts`, `tests/theme/tokens.test.ts`

**Interfaces:**
- Consumes: `AnchorName`, `tagAnchors`, `findAll`, `Health`, `FeatureId`.
- Produces:
  ```ts
  // types.ts
  export interface FeatureContext { table: SelectorTable; doc: Document; health: Health }
  export interface Feature { id: FeatureId; requires: readonly AnchorName[]; optional: readonly AnchorName[];
    apply(ctx: FeatureContext): void; cleanup(ctx: FeatureContext): void }
  // registry.ts
  export const DOM_FEATURES: readonly Feature[];   // M1: [surfaces, branding]
  export function runFeatures(ctx: FeatureContext, enabled: ReadonlySet<FeatureId>): ReadonlySet<FeatureId>; // aktif olanlar
  // branding/favicon.ts
  export function ensureFavicon(head: HTMLHeadElement, href: string): void;  // <link rel="icon" data-ot> en sonda
  export function removeFavicon(head: HTMLHeadElement): void;
  ```
  `runFeatures`: her özellik için `requires` + `optional` çapaları işaretlenir; `requires`'tan biri yoksa özellik aktif sayılmaz ve `health.setFeature(id, 'warn', '<ad> bulunamadı')`; sadece `optional` eksikse `ok`. Bir özellik hata fırlatırsa `health.error(id, e)` ve o oturum için devre dışı.

- [ ] **Step 1: `tokens.css`**

`html[data-ot-era="2017"][data-ot-theme="light"]` ve `…="night"]` blokları; `docs/era-tokens.md`'deki değerlerle spec §9'daki bütün değişkenler ve `palette-map.json`'da kullanılan saydam varyantlar (`--ot-accent-a10` vb.).

- [ ] **Step 2: Failing testler**
  - `tokens.test.ts`: `tokens.css` metninde, `palette-map.json`'daki her token adı için iki tema bloğunda da `--ot-<token>:` tanımı var (eksik token = boş renk = görünmez metin).
  - `surfaces`: `requires: []`, `optional: ['primaryColumn', 'sidebarColumn', 'sidebarBox']`. Hiçbiri yokken de aktif ve `ok`. `style.css` kuralları: `html[data-ot-f-surfaces] body{background-color:var(--ot-bg-page) !important}`, `html[data-ot-f-surfaces] [data-ot~="primaryColumn"]`, `[data-ot~="sidebarBox"]` → `background-color: var(--ot-bg-card)`, kenarlık `var(--ot-border)`. Test: CSS metni bu seçicileri içerir ve `left`/`right` içeren fiziksel yön özelliği içermez (ilke 7).
  - `branding`: `requires: ['sideNavLogo']`. Logo yoksa `warn`. `ensureFavicon` iki kez çağrılınca tek link; X yeni bir `<link rel=icon>` eklerse (MutationObserver ile) bizimki tekrar en sona alınır; `removeFavicon` linki kaldırır; X'in kendi linklerine dokunulmaz (sayısı ve `href`'leri aynı kalır). `href` = `'data:image/svg+xml,' + encodeURIComponent(birdSvg)` (web_accessible_resources gerekmez).
  - `branding/style.css`: `html[data-ot-f-branding] [data-ot~="sideNavLogo"] svg{visibility:hidden}` ve `[data-ot~="sideNavLogo"]::before` üzerinde `mask-image: url("data:image/svg+xml,…")`, `background-color: var(--ot-accent)`.

- [ ] **Step 3: Fail** — Run: `npx vitest run tests/features tests/theme` → FAIL.

- [ ] **Step 4: Uygula**

`bird.svg`: kendimiz çizdiğimiz sade bir kuş silüeti; X'in ya da Twitter'ın resmi SVG yolu kopyalanmaz. CSS dosyaları içerik betiğinden `import` edilir (WXT manifest'e ekler).

- [ ] **Step 5: Pass** — aynı komut → PASS.
- [ ] **Step 6: Commit** — `git commit -m "feat: add 2017 tokens, surfaces and branding features"`

### Task 11: Arka plan CSS ekleme ve içerik betiği

**Files:**
- Create: `src/core/messages.ts`, `src/core/inject.ts`, `src/entrypoints/content/main.ts`
- Modify: `src/entrypoints/background.ts`, `src/entrypoints/content/index.ts`
- Test: `tests/background/css-injector.test.ts`, `tests/core/inject.test.ts`, `tests/content/main.test.ts`

**Interfaces:**
- Consumes: Task 2–10'un hepsi.
- Produces:
  ```ts
  // messages.ts
  export type ToBackground = { type: 'ot:css'; css: string } | { type: 'ot:badge'; level: 'ok' | 'warn' | 'error' };
  export type ToContent = { type: 'ot:getHealth' };
  export interface HealthResponse { snapshot: HealthSnapshot; meta: ReportMeta }
  export const SHOW_ORIGINAL_PORT = 'ot:showOriginal';   // port mesajı: { hold: boolean }
  // background.ts (test edilebilir çekirdek)
  export function createCssInjector(api: {
    insertCSS(t: { tabId: number; frameId: number; css: string }): Promise<void>;
    removeCSS(t: { tabId: number; frameId: number; css: string }): Promise<void>;
  }): { handle(tabId: number, frameId: number, css: string): Promise<{ ok: boolean }>; forget(tabId: number): void };
  // inject.ts
  export function createInjector(doc: Document, send: (m: ToBackground) => Promise<{ ok: boolean } | undefined>):
    (css: string) => Promise<void>;
  // content/main.ts
  export async function main(opts: { doc: Document; win: Window }): Promise<{ stop(): void }>;
  ```

- [ ] **Step 1: Failing testler**
  - `createCssInjector`: ilk `handle` → `insertCSS` bir kez; aynı sekmede ikinci `handle` → önce eski CSS ile `removeCSS`, sonra yeni ile `insertCSS`; `insertCSS` reddederse `{ ok: false }`; `forget(tabId)` sonrası `removeCSS` çağrılmaz.
  - `createInjector`: `send` `{ ok: true }` dönerse `<style data-ot>` oluşturulmaz; `{ ok: false }` dönerse ya da **fırlatırsa** (Review Focus 3: `new Error('Extension context invalidated.')`) tek bir `<style data-ot>` oluşturulur ve sonraki çağrılarda içeriği güncellenir; hata dışarı sızmaz.
  - `main` (happy-dom + `fakeBrowser`): belge `<body style="background-color: #FFFFFF">` ve `color:rgba(29,155,240,1.00)` kuralı içeren bir `<style>` içeriyor. `main()` sonrası zamanlayıcı bir tur çalıştırılınca: `html` öğesinde `data-ot-era="2017"`, `data-ot-theme="light"`, `data-ot-f-palette`, `data-ot-f-surfaces` var; arka plana giden `ot:css` mesajının `css`'i `var(--ot-accent)` içerir. `branding` ayarda kapalıysa `data-ot-f-branding` yok. Ayar değişikliği (`saveSettings`) sonrası öznitelikler sayfa yenilenmeden güncellenir.

- [ ] **Step 2: Fail** — Run: `npx vitest run tests/background tests/core/inject.test.ts tests/content` → FAIL.

- [ ] **Step 3: Uygula**

`main` akışı (spec §7.1):
1. Paralel: `loadSettings()`, `storage.local` `ot:lastTheme`, palet ve seçici tablosu (`parsePaletteMap`, `parseSelectorTable` — hata olursa `health.error('core', …)` ve motor/özellikler kapalı, sayfaya dokunulmaz).
2. Tema: `detectTheme(body)` ?? son tema ?? `'light'`. `document_start`'ta `body` yoksa `<body>` görünene kadar son tema kullanılır, `body` gelince `watchTheme` bağlanır.
3. `applyHtmlAttributes` (aktif = `IMPLEMENTED_FEATURES` ∩ ayarda açık; DOM özellikleri `runFeatures` sonucuna göre güncellenir).
4. `engine.start()`, sonra zamanlayıcı: her turda `tagAnchors`/`runFeatures` (yeni düğümler veya sayfa geçişi varsa), `engine.tick()`, `health.setSheets`, rozet seviyesi değiştiyse `ot:badge`.
5. Açılıştan 10 s sonra `health.recordPalette(theme, engine.matchedKeys(), map)`.
6. `runtime.onMessage` `ot:getHealth` → `HealthResponse`; `runtime.onConnect` `SHOW_ORIGINAL_PORT` (Task 12).
7. `watchSettings` → öznitelikleri yeniden uygula.

Bütün `browser.*` çağrıları `try/catch` içinde; eklenti bağlamı geçersizse içerik betiği sessizce durur (`stop()`), sayfa X'in görünümünde kalır.

`background.ts`: `runtime.onMessage` `ot:css` → `createCssInjector` (gerçek `browser.scripting` ile, `origin: 'AUTHOR'`); `ot:badge` → `action.setBadgeText({ tabId, text: level === 'ok' ? '' : '!' })`; `tabs.onRemoved` → `forget`.

- [ ] **Step 4: Pass** — aynı komut → PASS; `npm test` tamamı → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat: wire content script, engine and css injection"`

### Task 12: Popup

**Files:**
- Create: `src/entrypoints/popup/model.ts`, `src/entrypoints/popup/style.css`
- Modify: `src/entrypoints/popup/index.html`, `src/entrypoints/popup/main.ts`, `public/_locales/{en,tr}/messages.json`, `src/entrypoints/content/main.ts`
- Test: `tests/popup/model.test.ts`, `tests/content/show-original.test.ts`

**Interfaces:**
- Consumes: `Settings`, `loadSettings`, `saveSettings`, `HealthResponse`, `buildReport`, `SHOW_ORIGINAL_PORT`, `IMPLEMENTED_FEATURES`, `AVAILABLE_ERAS`.
- Produces:
  ```ts
  // model.ts
  export interface ToggleRow { id: FeatureId; labelKey: string; checked: boolean }
  export function toggleRows(s: Settings): ToggleRow[];              // sadece IMPLEMENTED_FEATURES, o sırayla
  export function withFeature(s: Settings, id: FeatureId, on: boolean): Settings;
  export interface HealthRow { labelKey: string; status: FeatureStatus | 'n/a'; detail?: string }
  export function healthRows(r: HealthResponse | null): HealthRow[]; // null: sekme x.com değil
  export function showEraSelector(): boolean;                        // AVAILABLE_ERAS.length > 1
  ```

Popup içeriği (spec §14, M1 kapsamı): özellik düğmeleri, sağlık listesi, **Rapor kopyala** (`navigator.clipboard.writeText(buildReport(...))`), **Orijinali göster** (basılı tut), sürüm ve depo bağlantısı. Dönem seçici `showEraSelector()` `false` olduğu için M1'de görünmez. Etiketler `browser.i18n.getMessage`; en ve tr metinleri: `featurePalette` "Colors"/"Renkler", `featureFont` "Font"/"Yazı tipi", `featureSurfaces` "Page and cards"/"Sayfa ve kartlar", `featureBranding` "Bird logo and icon"/"Kuş logosu ve simge", `copyReport` "Copy report"/"Rapor kopyala", `showOriginal` "Hold to show original"/"Orijinali görmek için basılı tut", `notOnX` "Open x.com to see status"/"Durumu görmek için x.com'u aç".

- [ ] **Step 1: Failing testler**
  - `toggleRows(DEFAULT_SETTINGS)` → 4 satır, `palette, font, surfaces, branding` sırasıyla, hepsi `checked: true`.
  - `withFeature` yeni nesne döndürür, girdiyi değiştirmez.
  - `healthRows(null)` → tek satır `notOnX`; `error` durumundaki özellik `status: 'error'` ve `detail` taşır.
  - **Review Focus 4** (`show-original.test.ts`, `main` + `fakeBrowser`): port `{ hold: true }` → `html`'de `data-ot-*` yok; `{ hold: false }` → geri gelir; `{ hold: true }` sonrası port **kopunca** (`disconnect`) öznitelikler geri gelir.

- [ ] **Step 2: Fail** — Run: `npx vitest run tests/popup tests/content/show-original.test.ts` → FAIL.
- [ ] **Step 3: Uygula** — `main.ts` DOM'u `model.ts` çıktısından kurar; "Orijinali göster": `pointerdown` → `tabs.connect(tabId, { name: SHOW_ORIGINAL_PORT })` + `{ hold: true }`; `pointerup`/`pointerleave` → `{ hold: false }` ve `port.disconnect()`. İçerik tarafı `clearHtmlAttributes`/`applyHtmlAttributes`.
- [ ] **Step 4: Pass** — aynı komut ve `npm test` → PASS; `npm run typecheck` → hata yok.
- [ ] **Step 5: Commit** — `git commit -m "feat(popup): add toggles, health, report and show original"`

### Task 13: Canlı doğrulama (insanla)

**Files:**
- Modify: gerektiğinde `src/data/selectors.json`, `src/data/palette-map.json`, `src/theme/tokens.css`
- Create: `docs/manual-checklist.md`

- [ ] **Step 1: Kontrol listesini yaz** — `docs/manual-checklist.md`: aşağıdaki her madde bir onay kutusu.

- [ ] **Step 2: Paketle** — Run: `npm run build && npm run build:firefox` → iki çıktı klasörü.

- [ ] **Step 3: Kullanıcı yükler**

Kullanıcıya: Chrome'da `chrome://extensions` → Geliştirici modu → "Paketlenmemiş öğe yükle" → `.output/chrome-mv3`; Firefox'ta `about:debugging#/runtime/this-firefox` → "Geçici eklenti yükle" → `.output/firefox-mv3/manifest.json`. X'e kendi tarayıcısında giriş yapılı.

- [ ] **Step 4: Kontrol listesi (her iki tarayıcıda)**
  - Açık temada ana sayfa, profil, tweet, bildirimler, mesajlar, ayarlar: zemin gri, ana sütun beyaz kart, mavi `#1DA1F2` tonunda (`docs/era-tokens.md` değeri), metin renkleri dönem değerlerinde, font Helvetica Neue/Arial.
  - X'te Lights Out'a geç: sayfa yenilenmeden gece token'ları gelir; geri açık temaya geç.
  - Sol üstte kuş, sekmede kuş favicon; X bildirim aldığında favicon kuş kalır.
  - Popup: her düğme kapatılınca ilgili görünüm anında X'inkine döner; "Orijinali göster" basılıyken X'in görünümü, bırakınca bizimki.
  - Sağlık listesi `ok`; "Rapor kopyala" çıktısında kullanıcı adı ya da URL yok.
  - DevTools Ağ: eklentiden x.com'a ya da başka bir yere istek yok.
  - Kaydırma akıcı; DevTools Performans'ta motor turları 4 ms bütçeyi aşmıyor (aşan tur varsa sonraki turlar `requestIdleCallback` ile).
  - Eklentiyi `chrome://extensions`'ta yeniden yükle, açık x.com sekmesinde sayfa bozulmuyor (Review Focus 3).

- [ ] **Step 5: Bulguları düzelt** — eksik ya da yanlış renk/çapa için sadece `src/data/*.json` ve `tokens.css`; her düzeltme sonrası `npm test` → PASS.

- [ ] **Step 6: Commit ve push**

```bash
git add -A
git commit -m "chore: tune data from live verification, add manual checklist"
git push -u origin m0-m1-foundation
```

Sonra superpowers:finishing-a-development-branch ile `main`'e birleştirme kararı.
