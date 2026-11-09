import { REMOTE_URL } from '../config';
import { parseRemote, type RemoteData } from './schema';

export const REMOTE_KEY = 'ot:remote';
const TIMEOUT_MS = 5_000;

/** What is kept in storage: the raw text, re-validated on every read (the extension may have updated). */
export interface RemoteRecord {
  text: string;
  fetchedAt: number;
}

export interface RemoteStore {
  get(k: string): Promise<unknown>;
  set(k: string, v: unknown): Promise<void>;
}

/**
 * Fetches the public data file once. A valid file replaces the stored one; any failure
 * (network, timeout, HTTP error, invalid or out-of-range data) keeps what is stored.
 */
export async function refreshRemote(deps: {
  fetch: typeof fetch;
  store: RemoteStore;
  now: () => number;
  version: string;
  timeoutMs?: number;
}): Promise<'updated' | 'kept'> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), deps.timeoutMs ?? TIMEOUT_MS);
  try {
    const response = await deps.fetch(REMOTE_URL, { credentials: 'omit', cache: 'no-cache', signal: controller.signal });
    if (!response.ok) return 'kept';
    const text = await response.text();
    parseRemote(text, deps.version);
    const record: RemoteRecord = { text, fetchedAt: deps.now() };
    await deps.store.set(REMOTE_KEY, record);
    return 'updated';
  } catch {
    return 'kept';
  } finally {
    clearTimeout(timer);
  }
}

/** The stored data if it is still valid for this extension version, else null (built-in data). */
export async function loadRemote(store: RemoteStore, version: string): Promise<RemoteData | null> {
  try {
    const record = (await store.get(REMOTE_KEY)) as RemoteRecord | undefined;
    return record && typeof record.text === 'string' ? parseRemote(record.text, version) : null;
  } catch {
    return null;
  }
}
