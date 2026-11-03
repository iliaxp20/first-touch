import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TacticsService } from './tactics.service';
import { CreateBoardDto } from './dto/create-board.dto';

@Controller('tactics')
export class TacticsController {
  constructor(private readonly tacticsService: TacticsService) {}

  @Post('boards')
  createBoard(@Body() dto: CreateBoardDto) {
    return {
      success: true,
      board: this.tacticsService.createBoard(dto),
    };
  }

  @Get('boards/:id')
  getBoard(@Param('id') id: string) {
    return {
      success: true,
      board: this.tacticsService.getBoard(id),
    };
  }

  @Post('boards/:id/reset')
  resetBoard(@Param('id') id: string) {
    return {
      success: true,
      board: this.tacticsService.resetBoard(id),
    };
  }
}
