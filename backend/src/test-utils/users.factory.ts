export function usersServiceMockFactory() {
  return {
    findById: jest.fn() as jest.MockedFunction<
      (id: string) => Promise<{ id: string; email: string }>
    >,
    completeOnboarding: jest.fn() as jest.MockedFunction<
      (
        userId: string,
        dto: {
          preferredLanguage: 'es' | 'en';
          homeLat: number;
          homeLng: number;
          displayName: string;
        },
      ) => Promise<{ id: string; onboardingCompleted: boolean }>
    >,
  };
}
