import { ensureRemoteAlarm, REMOTE_ALARM } from '../../src/remote/schedule';

const alarms = (existing: unknown) => {
  const created: [string, unknown][] = [];
  return { created, api: { get: async () => existing as never, create: async (name: string, info: unknown) => void created.push([name, info]) } };
};

test('the daily alarm is created when it does not exist', async () => {
  const a = alarms(undefined);
  await ensureRemoteAlarm(a.api);
  expect(a.created).toEqual([[REMOTE_ALARM, { periodInMinutes: 1440 }]]);
});

test('an existing alarm is left alone, so service-worker restarts do not push it back', async () => {
  const a = alarms({ name: REMOTE_ALARM, periodInMinutes: 1440, scheduledTime: 1 });
  await ensureRemoteAlarm(a.api);
  expect(a.created).toEqual([]);
});
