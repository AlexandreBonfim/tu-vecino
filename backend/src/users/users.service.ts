import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CompleteOnboardingDto } from './dto/complete-onboarding.dto';
import type { Prisma } from '../../generated/prisma';

const USER_PUBLIC_FIELDS = {
  id: true,
  email: true,
  phoneNumber: true,
  displayName: true,
  preferredLanguage: true,
  reputationTier: true,
  reputationScore: true,
  onboardingCompleted: true,
  homeLat: true,
  homeLng: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: USER_PUBLIC_FIELDS,
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async completeOnboarding(userId: string, dto: CompleteOnboardingDto) {
    await this.findById(userId);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        preferredLanguage: dto.preferredLanguage,
        homeLat: dto.homeLat,
        homeLng: dto.homeLng,
        displayName: dto.displayName,
        onboardingCompleted: true,
      },
      select: USER_PUBLIC_FIELDS,
    });
  }
}
