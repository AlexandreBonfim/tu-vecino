import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import {
  jwtServiceMockFactory,
  userFactory,
  type UserRecord,
} from '../test-utils';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  const findUnique = jest.fn() as jest.MockedFunction<
    (args: { where: { email: string } }) => Promise<UserRecord | null>
  >;
  const create = jest.fn() as jest.MockedFunction<
    (args: {
      data: { email: string; passwordHash: string };
    }) => Promise<UserRecord>
  >;
  const jwt = jwtServiceMockFactory();
  const prisma = {
    user: {
      findUnique,
      create,
    },
  };

  const authService = new AuthService(prisma, jwt);

  beforeEach(() => {
    jest.clearAllMocks();
    jwt.sign.mockReturnValue('token');
    jest.mocked(bcrypt.hash).mockResolvedValue('hashed-password');
    jest.mocked(bcrypt.compare).mockResolvedValue(true);
  });

  it('registers a user and returns a token payload', async () => {
    findUnique.mockResolvedValue(null);
    create.mockResolvedValue(userFactory());

    await expect(
      authService.register({
        email: 'user@example.com',
        password: 'secret',
      }),
    ).resolves.toEqual({
      accessToken: 'token',
      user: { id: 'user-1', email: 'user@example.com' },
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('secret', 12);
  });

  it('rejects duplicate registration', async () => {
    findUnique.mockResolvedValue(userFactory());

    await expect(
      authService.register({
        email: 'user@example.com',
        password: 'secret',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('logs in with valid credentials', async () => {
    findUnique.mockResolvedValue(
      userFactory({ passwordHash: 'hashed-password' }),
    );

    await expect(
      authService.login({
        email: 'user@example.com',
        password: 'secret',
      }),
    ).resolves.toEqual({
      accessToken: 'token',
      user: { id: 'user-1', email: 'user@example.com' },
    });
  });

  it('rejects invalid login credentials', async () => {
    findUnique.mockResolvedValue(null);

    await expect(
      authService.login({
        email: 'user@example.com',
        password: 'secret',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
