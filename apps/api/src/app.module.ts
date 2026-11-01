import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { DrillsModule } from './modules/drills/drills.module';
import { ProgramsModule } from './modules/programs/programs.module';
import { NutritionModule } from './modules/nutrition/nutrition.module';
import { CoachesModule } from './modules/coaches/coaches.module';

@Module({
  imports: [
    AuthModule,
    DrillsModule,
    ProgramsModule,
    NutritionModule,
    CoachesModule,
  ],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
