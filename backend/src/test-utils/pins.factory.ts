export function pinsServiceMockFactory() {
  return {
    create: jest.fn() as jest.MockedFunction<
      (
        dto: { category: 'TRAFFIC'; lat: number; lng: number },
        authorId: string,
      ) => Promise<{ id: string }>
    >,
    findNearby: jest.fn() as jest.MockedFunction<
      (query: { lat: number; lng: number }) => Promise<Array<{ id: string }>>
    >,
    findOne: jest.fn() as jest.MockedFunction<
      (id: string) => Promise<{ id: string }>
    >,
    confirm: jest.fn() as jest.MockedFunction<
      (id: string) => Promise<{ id: string }>
    >,
    dispute: jest.fn() as jest.MockedFunction<
      (id: string) => Promise<{ id: string }>
    >,
  };
}
