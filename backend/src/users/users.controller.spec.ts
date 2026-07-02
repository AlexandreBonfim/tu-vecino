import { UsersController } from './users.controller';
import {
  requestUserFactory,
  userFactory,
  usersServiceMockFactory,
} from '../test-utils';

describe('UsersController', () => {
  const usersService = usersServiceMockFactory();

  const controller = new UsersController(usersService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('gets the current user profile', async () => {
    usersService.findById.mockResolvedValue(userFactory());

    await expect(controller.getProfile(requestUserFactory())).resolves.toEqual(
      userFactory(),
    );
  });

  it('completes onboarding', async () => {
    usersService.completeOnboarding.mockResolvedValue(
      userFactory({ onboardingCompleted: true }),
    );

    await expect(
      controller.completeOnboarding(requestUserFactory(), {
        preferredLanguage: 'es',
        homeLat: 1,
        homeLng: 2,
        displayName: 'Ale',
      }),
    ).resolves.toEqual(userFactory({ onboardingCompleted: true }));
  });
});
