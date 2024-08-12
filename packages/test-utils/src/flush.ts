import flushPromises from 'flush-promises';
import { SCHEMA_BATCH_MS } from '../../core/src/constants';
import { vi } from 'vitest';

export async function flush() {
  await flushPromises();
  vi.advanceTimersByTime(SCHEMA_BATCH_MS * 2);
  await flushPromises();
}
