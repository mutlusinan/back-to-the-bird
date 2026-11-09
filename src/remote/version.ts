const SEMVER = /^(\d+)\.(\d+)\.(\d+)$/;

/** Compares two `major.minor.patch` versions; anything else throws. */
export function compareVersions(a: string, b: string): -1 | 0 | 1 {
  const pa = parts(a);
  const pb = parts(b);
  for (let i = 0; i < 3; i++) {
    if (pa[i]! !== pb[i]!) return pa[i]! < pb[i]! ? -1 : 1;
  }
  return 0;
}

export function isVersion(v: unknown): v is string {
  return typeof v === 'string' && SEMVER.test(v);
}

function parts(v: string): number[] {
  const m = SEMVER.exec(v);
  if (!m) throw new Error(`not a version: ${v}`);
  return m.slice(1).map(Number);
}
