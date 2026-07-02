import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public readonly client: PrismaClient;

  constructor() {
    this.client = new PrismaClient({
      log:
        process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
    });
  }

  get user() {
    return this.client.user;
  }
  get pin() {
    return this.client.pin;
  }

  async onModuleInit() {
    await this.client.$connect();
  }
  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
