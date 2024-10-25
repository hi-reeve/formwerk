import { render, screen } from '@testing-library/vue';
import { useLocale } from './useLocale';
import { configure } from '../config';
import { nextTick, ref } from 'vue';

test('fetches the site locale and direction initially', async () => {
  await render({
    setup: () => useLocale(),
    template: `
      <span>{{ locale }}</span>
      <span>{{ direction }}</span>
    `,
  });

  expect(screen.getByText('en-US')).toBeDefined();
  expect(screen.getByText('ltr')).toBeDefined();
});

test('updates the locale when the locale config changes', async () => {
  await render({
    setup: () => useLocale(),
    template: `
      <span>{{ locale }}</span>
      <span>{{ direction }}</span>
    `,
  });

  configure({ locale: 'ar-EG' });
  await nextTick();

  expect(screen.getByText('ar-EG')).toBeDefined();
  expect(screen.getByText('rtl')).toBeDefined();
});

test('updates locale and direction when a reactive locale config changes', async () => {
  const locale = ref('en-US');
  configure({ locale });

  await render({
    setup: () => useLocale(),
    template: `
      <span>{{ locale }}</span>
      <span>{{ direction }}</span>
    `,
  });

  expect(screen.getByText('en-US')).toBeDefined();
  expect(screen.getByText('ltr')).toBeDefined();

  locale.value = 'ar-EG';
  await nextTick();

  expect(screen.getByText('ar-EG')).toBeDefined();
  expect(screen.getByText('rtl')).toBeDefined();
});
