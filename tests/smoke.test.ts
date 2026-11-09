import { ALL_FEATURES, IMPLEMENTED_FEATURES } from '../src/config';

test('implemented features are a subset of all features', () => {
  expect(IMPLEMENTED_FEATURES.every((f) => ALL_FEATURES.includes(f))).toBe(true);
  expect(ALL_FEATURES).toHaveLength(13);
});
