import { AuthController } from './auth.controller';
import { authServiceMockFactory } from '../test-utils';

describe('AuthController', () => {
  const authService = authServiceMockFactory();

  const controller = new AuthController(authService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('delegates register', async () => {
    authService.register.mockResolvedValue({
      accessToken: 'token',
      user: { id: 'user-1', email: 'user@example.com' },
    });

    await expect(
      controller.register({
        email: 'user@example.com',
        password: 'secret',
      }),
    ).resolves.toEqual({
      accessToken: 'token',
      user: { id: 'user-1', email: 'user@example.com' },
    });
  });

  it('delegates login', async () => {
    authService.login.mockResolvedValue({
      accessToken: 'token',
      user: { id: 'user-1', email: 'user@example.com' },
    });

    await expect(
      controller.login({
        email: 'user@example.com',
        password: 'secret',
      }),
    ).resolves.toEqual({
      accessToken: 'token',
      user: { id: 'user-1', email: 'user@example.com' },
    });
  });
});
