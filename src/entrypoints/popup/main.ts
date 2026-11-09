import { browser, type Browser } from 'wxt/browser';
import { SHOW_ORIGINAL_PORT, type HealthResponse } from '../../core/messages';
import { buildReport } from '../../core/report';
import { loadSettings, saveSettings } from '../../core/settings';
import { eraOptions, healthRows, showEraSelector, toggleRows, withEra, withFeature } from './model';

// Keys are composed at runtime (e.g. `status_${status}`), so the generated literal union does not apply.
const getMessage = browser.i18n.getMessage as (key: string) => string;
const t = (key: string) => getMessage(key) || key;
// Details are message keys (e.g. unreadableSheets), anchor names or free error text; only key-shaped ones are looked up.
const detailText = (detail: string) => (/^\w+$/.test(detail) ? t(detail) : detail);
const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

async function activeXTab(): Promise<Browser.tabs.Tab | undefined> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  return tab?.id !== undefined && tab.url?.startsWith('https://x.com/') ? tab : undefined;
}

async function fetchHealth(tab: Browser.tabs.Tab | undefined): Promise<HealthResponse | null> {
  if (!tab?.id) return null;
  try {
    return ((await browser.tabs.sendMessage(tab.id, { type: 'ot:getHealth' }, { frameId: 0 })) as HealthResponse) ?? null;
  } catch {
    return null; // content script not (yet) running in this tab
  }
}

async function renderToggles(): Promise<void> {
  const list = byId<HTMLUListElement>('toggles');
  list.replaceChildren();
  const settings = await loadSettings();
  for (const row of toggleRows(settings)) {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = row.checked;
    input.addEventListener('change', async () => saveSettings(withFeature(await loadSettings(), row.id, input.checked)));
    const label = document.createElement('label');
    label.append(input, t(row.labelKey));
    const item = document.createElement('li');
    item.append(label);
    list.append(item);
  }
}

async function renderEras(): Promise<void> {
  const section = byId<HTMLElement>('eraSection');
  section.hidden = !showEraSelector();
  const group = byId<HTMLDivElement>('eras');
  group.replaceChildren();
  for (const option of eraOptions(await loadSettings())) {
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'era';
    input.checked = option.selected;
    input.addEventListener('change', async () => input.checked && saveSettings(withEra(await loadSettings(), option.era)));
    const label = document.createElement('label');
    label.append(input, t(option.labelKey));
    group.append(label);
  }
}

function renderHealth(response: HealthResponse | null): void {
  const list = byId<HTMLUListElement>('health');
  list.replaceChildren();
  for (const row of healthRows(response)) {
    const dot = document.createElement('span');
    dot.className = `dot ${row.status}`;
    const name = document.createElement('span');
    name.textContent = t(row.labelKey);
    const item = document.createElement('li');
    item.append(dot, name);
    if (row.status !== 'n/a') {
      const detail = document.createElement('span');
      detail.className = 'detail';
      detail.textContent = row.detail ? `${t(`status_${row.status}`)}: ${detailText(row.detail)}` : t(`status_${row.status}`);
      item.append(detail);
    }
    list.append(item);
  }
}

function bindShowOriginal(tab: Browser.tabs.Tab | undefined): void {
  const button = byId<HTMLButtonElement>('showOriginal');
  let port: Browser.runtime.Port | undefined;
  const press = () => {
    if (!tab?.id || port) return;
    port = browser.tabs.connect(tab.id, { name: SHOW_ORIGINAL_PORT, frameId: 0 });
    port.postMessage({ hold: true });
  };
  const release = () => {
    if (!port) return;
    port.postMessage({ hold: false });
    port.disconnect();
    port = undefined;
  };
  button.addEventListener('pointerdown', press);
  for (const type of ['pointerup', 'pointerleave', 'pointercancel', 'blur'] as const) button.addEventListener(type, release);
  button.addEventListener('keydown', (e) => (e.key === ' ' || e.key === 'Enter') && press());
  button.addEventListener('keyup', (e) => (e.key === ' ' || e.key === 'Enter') && release());
}

/** Development builds only: saves a personal-data-free copy of the X page as a test fixture. */
function bindSnapshot(tab: Browser.tabs.Tab | undefined): void {
  const button = byId<HTMLButtonElement>('takeSnapshot');
  button.hidden = false;
  button.textContent = t('takeSnapshot');
  button.addEventListener('click', async () => {
    if (!tab?.id) return;
    const html = (await browser.tabs.sendMessage(tab.id, { type: 'ot:snapshot' }, { frameId: 0 })) as string;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    link.download = 'x-snapshot.real.html';
    link.click();
    URL.revokeObjectURL(link.href);
  });
}

async function init(): Promise<void> {
  byId('title').textContent = t('extName');
  byId('eraTitle').textContent = t('eraTitle');
  byId('featuresTitle').textContent = t('featuresTitle');
  byId('healthTitle').textContent = t('healthTitle');
  byId('showOriginal').textContent = t('showOriginal');
  byId('copyReport').textContent = t('copyReport');
  byId('version').textContent = `v${browser.runtime.getManifest().version}`;

  const tab = await activeXTab();
  const response = await fetchHealth(tab);
  await renderEras();
  await renderToggles();
  renderHealth(response);
  bindShowOriginal(tab);

  if (import.meta.env.DEV) bindSnapshot(tab);

  byId('copyReport').addEventListener('click', async () => {
    const status = byId('copyStatus');
    if (!response) {
      status.textContent = t('notOnX');
      return;
    }
    await navigator.clipboard.writeText(buildReport(response.snapshot, response.meta));
    status.textContent = t('copied');
  });
}

void init();
