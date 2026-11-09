export const REMOTE_ALARM = 'ot:remote';
const DAY_MINUTES = 24 * 60;

export interface AlarmsApi {
  get(name: string): Promise<unknown>;
  create(name: string, info: { periodInMinutes: number }): Promise<void> | void;
}

/**
 * Creates the daily refresh alarm once. Re-creating it on every service-worker start would
 * restart its period each time and a busy browser might never reach the 24 hours.
 */
export async function ensureRemoteAlarm(alarms: AlarmsApi): Promise<void> {
  if (await alarms.get(REMOTE_ALARM)) return;
  await alarms.create(REMOTE_ALARM, { periodInMinutes: DAY_MINUTES });
}
