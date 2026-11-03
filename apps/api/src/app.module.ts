import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { PrismaService } from './database/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { DrillsModule } from './modules/drills/drills.module';
import { ProgramsModule } from './modules/programs/programs.module';
import { NutritionModule } from './modules/nutrition/nutrition.module';
import { CoachesModule } from './modules/coaches/coaches.module';
import { TacticsModule } from './modules/tactics/tactics.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds window
        limit: 120, // max 120 requests per minute per IP
      },
    ]),
    AuthModule,
    DrillsModule,
    ProgramsModule,
    NutritionModule,
    CoachesModule,
    TacticsModule,
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [PrismaService],
})
export class AppModule {}
