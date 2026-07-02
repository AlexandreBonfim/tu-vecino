import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { type UserRecord, userFactory } from '../test-utils';

describe('UsersService', () => {
  const findUnique = jest.fn() as jest.MockedFunction<
    (args: { where: { id: string } }) => Promise<UserRecord | null>
  >;
  const update = jest.fn() as jest.MockedFunction<
    (args: {
      where: { id: string };
      data: {
        preferredLanguage: 'es' | 'en';
        homeLat: number | null;
        homeLng: number | null;
        displayName: string | null;
        onboardingCompleted: true;
      };
      select: Record<string, boolean>;
    }) => Promise<UserRecord>
  >;
  const prisma = {
    user: {
      findUnique,
      update,
    },
  };

  const usersService = new UsersService(prisma);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a user by id', async () => {
    findUnique.mockResolvedValue(userFactory());

    await expect(usersService.findById('user-1')).resolves.toEqual({
      id: 'user-1',
      email: 'user@example.com',
    });
  });

  it('throws if user does not exist', async () => {
    findUnique.mockResolvedValue(null);

    await expect(usersService.findById('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('completes onboarding after confirming the user exists', async () => {
    findUnique.mockResolvedValue(userFactory());
    update.mockResolvedValue({
      ...userFactory({ onboardingCompleted: true }),
    });

    await expect(
      usersService.completeOnboarding('user-1', {
        preferredLanguage: 'es',
        homeLat: 10,
        homeLng: 20,
        displayName: 'Ale',
      }),
    ).resolves.toEqual({
      id: 'user-1',
      email: 'user@example.com',
      onboardingCompleted: true,
    });

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user-1' },
        data: {
          preferredLanguage: 'es',
          homeLat: 10,
          homeLng: 20,
          displayName: 'Ale',
          onboardingCompleted: true,
        },
      }),
    );
  });
});
