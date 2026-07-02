import type { PinRecord } from './types';

export function pinFactory(overrides: Partial<PinRecord> = {}): PinRecord {
  return {
    id: 'pin-1',
    ...overrides,
  };
}
