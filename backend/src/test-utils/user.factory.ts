import type { RequestUser } from '../auth/jwt.types';
import type { UserRecord } from './types';

export function userFactory(overrides: Partial<UserRecord> = {}): UserRecord {
  return {
    id: 'user-1',
    email: 'user@example.com',
    ...overrides,
  };
}

export function requestUserFactory(
  overrides: Partial<RequestUser> = {},
): RequestUser {
  return {
    userId: 'user-1',
    email: 'user@example.com',
    ...overrides,
  };
}
