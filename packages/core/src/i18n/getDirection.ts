import { Direction } from '../types';
import { isCallable, warn } from '../utils/common';
import { getConfig } from '../config';

export function getDirection(locale: string): Direction {
  if (!getConfig().detectDirection) {
    return 'ltr';
  }

  try {
    const instance = new Intl.Locale(locale);
    if ('textInfo' in instance) {
      return ((instance.textInfo as { direction: Direction }).direction as Direction) || 'ltr';
    }

    if ('getTextInfo' in instance && isCallable(instance.getTextInfo)) {
      return (instance.getTextInfo().direction as Direction) || 'ltr';
    }

    throw new Error(`Cannot determine direction for locale ${locale}`);
  } catch {
    warn(`Cannot determine direction for locale ${locale}, defaulting to LTR`);

    return 'ltr';
  }
}
