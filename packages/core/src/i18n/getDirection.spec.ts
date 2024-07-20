import { getDirection } from './getDirection';

test('gets the direction of a locale', () => {
  expect(getDirection('ar-EG')).toBe('rtl');
  expect(getDirection('en-US')).toBe('ltr');
});
