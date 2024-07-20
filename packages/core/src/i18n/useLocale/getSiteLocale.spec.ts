import { getSiteLocale } from './getSiteLocale';

test('gets the site locale via the html[lang] attribute', () => {
  const lang = 'ar-EG';
  document.documentElement.lang = lang;

  expect(getSiteLocale()).toBe(lang);
});
