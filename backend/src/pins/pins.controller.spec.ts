import { PinsController } from './pins.controller';
import {
  pinFactory,
  pinsServiceMockFactory,
  requestUserFactory,
} from '../test-utils';

describe('PinsController', () => {
  const pinsService = pinsServiceMockFactory();

  const controller = new PinsController(pinsService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a pin', async () => {
    pinsService.create.mockResolvedValue(pinFactory());

    await expect(
      controller.create(
        {
          category: 'TRAFFIC',
          lat: 1,
          lng: 2,
        },
        requestUserFactory(),
      ),
    ).resolves.toEqual(pinFactory());
  });

  it('finds nearby pins', async () => {
    pinsService.findNearby.mockResolvedValue([]);

    await expect(
      controller.findNearby({
        lat: 1,
        lng: 2,
      }),
    ).resolves.toEqual([]);
  });

  it('confirms a pin', async () => {
    pinsService.confirm.mockResolvedValue(pinFactory());

    await expect(controller.confirm('pin-1')).resolves.toEqual(pinFactory());
  });
});
