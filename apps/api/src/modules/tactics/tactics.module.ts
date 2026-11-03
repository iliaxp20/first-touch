import { Module } from '@nestjs/common';
import { TacticsService } from './tactics.service';
import { TacticsController } from './tactics.controller';
import { TacticsWsService } from './tactics-ws.service';

@Module({
  controllers: [TacticsController],
  providers: [TacticsService, TacticsWsService],
  exports: [TacticsService, TacticsWsService],
})
export class TacticsModule {}
