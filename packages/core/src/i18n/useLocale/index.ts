import { computed } from 'vue';
import { getConfig } from '../../config';

export function useLocale() {
  const locale = computed(() => getConfig().locale);

  return locale;
}
