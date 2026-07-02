import { NotFoundException } from '@nestjs/common';
import { PinsService } from './pins.service';
import { pinFactory } from '../test-utils';

describe('PinsService', () => {
  const queryRaw = jest.fn() as jest.MockedFunction<
    <T>(strings: TemplateStringsArray, ...values: unknown[]) => Promise<T>
  >;
  const findUnique = jest.fn() as jest.MockedFunction<
    (args: { where: { id: string } }) => Promise<{ id: string } | null>
  >;
  const update = jest.fn() as jest.MockedFunction<
    (args: {
      where: { id: string };
      data: {
        confirmCount?: { increment: number };
        disputeCount?: { increment: number };
        isActive?: boolean;
      };
    }) => Promise<{ id: string }>
  >;
  const updateMany = jest.fn() as jest.MockedFunction<
    (args: {
      where: { isActive: boolean; expiresAt: { lte: Date } };
      data: { isActive: boolean };
    }) => Promise<{ count: number }>
  >;
  const prisma = {
    client: {
      $queryRaw: queryRaw,
    },
    pin: {
      findUnique,
      update,
      updateMany,
    },
  };

  const pinsService = new PinsService(prisma);

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(Date, 'now')
      .mockReturnValue(new Date('2024-01-01T00:00:00Z').getTime());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('creates a pin and returns the persisted record', async () => {
    queryRaw.mockResolvedValue([{ id: 'pin-1' }]);
    const findOneSpy = jest.spyOn(pinsService, 'findOne');
    findOneSpy.mockResolvedValue(pinFactory());

    await expect(
      pinsService.create(
        {
          category: 'TRAFFIC',
          lat: 1,
          lng: 2,
          intensity: 3,
          photoUrl: 'photo.jpg',
        },
        'user-1',
      ),
    ).resolves.toEqual({ id: 'pin-1' });

    expect(queryRaw).toHaveBeenCalled();
  });

  it('returns nearby pins', async () => {
    queryRaw.mockResolvedValue([]);

    await expect(
      pinsService.findNearby({
        lat: 1,
        lng: 2,
        radiusMeters: 3000,
      }),
    ).resolves.toEqual([]);
  });

  it('throws when a pin is missing', async () => {
    findUnique.mockResolvedValue(null);

    await expect(pinsService.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('confirms a pin', async () => {
    const findOneSpy = jest.spyOn(pinsService, 'findOne');
    findOneSpy.mockResolvedValue(pinFactory());
    update.mockResolvedValue(pinFactory());

    await expect(pinsService.confirm('pin-1')).resolves.toEqual({
      id: 'pin-1',
    });
  });

  it('disputes a pin and deactivates it when the rule is met', async () => {
    const findOneSpy = jest.spyOn(pinsService, 'findOne');
    findOneSpy.mockResolvedValue(pinFactory());
    update
      .mockResolvedValueOnce({
        ...pinFactory({
          disputeCount: 3,
          confirmCount: 1,
        }),
      })
      .mockResolvedValueOnce({
        ...pinFactory({ isActive: false }),
      });

    await expect(pinsService.dispute('pin-1')).resolves.toEqual({
      id: 'pin-1',
      isActive: false,
    });
  });

  it('expires stale pins', async () => {
    updateMany.mockResolvedValue({ count: 2 });

    await expect(pinsService.expireStale()).resolves.toBe(2);
  });
});
