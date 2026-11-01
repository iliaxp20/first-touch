import { Module } from '@nestjs/common';
import { DrillsController } from './drills.controller';
import { DrillsService } from './drills.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [DrillsController],
  providers: [DrillsService, PrismaService],
  exports: [DrillsService],
})
export class DrillsModule {}
