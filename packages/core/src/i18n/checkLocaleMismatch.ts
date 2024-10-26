import { getConfig } from '../config';
import { getUserLocale } from './getUserLocale';

export function checkLocaleMismatch() {
  const configLocale = getConfig().locale;
  const userLocale = getUserLocale();

  return {
    matches: configLocale === userLocale,
    configLocale,
    userLocale,
  };
}
