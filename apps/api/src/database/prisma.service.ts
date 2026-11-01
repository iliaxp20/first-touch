import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Connected to PostgreSQL database successfully.');
    } catch (err) {
      this.logger.warn('⚠️ Could not connect to PostgreSQL. Running in disconnected/mock mode. Set DATABASE_URL in .env once PostgreSQL is ready.');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
