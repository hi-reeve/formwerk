import { describe, it, expect, vi } from 'vitest';
import { checkLocaleMismatch } from './checkLocaleMismatch';
import { getUserLocale } from './getUserLocale';

vi.mock('./getUserLocale');

describe('checkLocaleMismatch', () => {
  it('should return no mismatch when locales match', () => {
    vi.mocked(getUserLocale).mockReturnValue('en-US');

    const result = checkLocaleMismatch();

    expect(result).toEqual({
      matches: true,
      configLocale: 'en-US',
      userLocale: 'en-US',
    });
  });

  it('should return mismatch when locales do not match', () => {
    vi.mocked(getUserLocale).mockReturnValue('fr-FR');

    const result = checkLocaleMismatch();

    expect(result).toEqual({
      matches: false,
      configLocale: 'en-US',
      userLocale: 'fr-FR',
    });
  });
});
