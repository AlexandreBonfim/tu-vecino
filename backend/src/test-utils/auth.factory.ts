import type { JwtService } from '@nestjs/jwt';

export function jwtServiceMockFactory() {
  return {
    sign: jest.fn(),
    signAsync: jest.fn(),
    verify: jest.fn(),
    verifyAsync: jest.fn(),
    decode: jest.fn(),
  } as unknown as jest.Mocked<JwtService>;
}

export function authServiceMockFactory() {
  return {
    register: jest.fn() as jest.MockedFunction<
      (dto: { email: string; password: string }) => Promise<{
        accessToken: string;
        user: { id: string; email: string };
      }>
    >,
    login: jest.fn() as jest.MockedFunction<
      (dto: { email: string; password: string }) => Promise<{
        accessToken: string;
        user: { id: string; email: string };
      }>
    >,
  };
}
