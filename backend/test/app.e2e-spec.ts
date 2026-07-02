import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { PinsController } from '../src/pins/pins.controller';
import { PinsService } from '../src/pins/pins.service';
import { UsersController } from '../src/users/users.controller';
import { UsersService } from '../src/users/users.service';
import {
  pinFactory,
  pinsServiceMockFactory,
  requestUserFactory,
  usersServiceMockFactory,
} from '../src/test-utils';

describe('HTTP wiring smoke', () => {
  let moduleFixture: TestingModule;

  const register = jest.fn();
  const login = jest.fn();
  const usersService = usersServiceMockFactory();
  const pinsService = pinsServiceMockFactory();

  beforeEach(async () => {
    jest.clearAllMocks();

    moduleFixture = await Test.createTestingModule({
      controllers: [AuthController, UsersController, PinsController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register,
            login,
          },
        },
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: PinsService,
          useValue: pinsService,
        },
        {
          provide: JwtAuthGuard,
          useValue: { canActivate: () => true },
        },
      ],
    }).compile();
  });

  it('wires auth, users and pins controllers to their services', async () => {
    const authController = moduleFixture.get(AuthController);
    const usersController = moduleFixture.get(UsersController);
    const pinsController = moduleFixture.get(PinsController);

    register.mockResolvedValue({
      accessToken: 'register-token',
      user: { id: 'user-1', email: 'user@example.com' },
    });
    login.mockResolvedValue({
      accessToken: 'login-token',
      user: { id: 'user-1', email: 'user@example.com' },
    });
    usersService.findById.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
    });
    pinsService.create.mockResolvedValue(pinFactory());

    await expect(
      authController.register({
        email: 'user@example.com',
        password: 'secret',
      }),
    ).resolves.toEqual({
      accessToken: 'register-token',
      user: { id: 'user-1', email: 'user@example.com' },
    });

    await expect(
      authController.login({ email: 'user@example.com', password: 'secret' }),
    ).resolves.toEqual({
      accessToken: 'login-token',
      user: { id: 'user-1', email: 'user@example.com' },
    });

    await expect(
      usersController.getProfile(requestUserFactory()),
    ).resolves.toEqual({
      id: 'user-1',
      email: 'user@example.com',
    });

    await expect(
      pinsController.create(
        { category: 'TRAFFIC', lat: 1, lng: 2 },
        requestUserFactory(),
      ),
    ).resolves.toEqual(pinFactory());
  });
});
